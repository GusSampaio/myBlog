from fastapi import FastAPI, Request, Depends, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from langchain_mistralai import ChatMistralAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import time
import asyncio
from collections import defaultdict
from pathlib import Path

# --- Configurações de Ambiente ---
# Detecta a pasta onde este arquivo app.py está rodando
CURRENT_DIR = Path(__file__).parent

# Para ambiente virtual local
dotenv_path = CURRENT_DIR.parent.parent / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path=str(dotenv_path))

# Chaves de API
MONGODB_URI = os.environ.get("MONGODB_URI")
MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
HUGGINGFACE_API_KEY = os.environ.get("HF_TOKEN")

if not all([MONGODB_URI, MISTRAL_API_KEY, HUGGINGFACE_API_KEY]):
    print("AVISO: Algumas variáveis de ambiente não foram encontradas.")

# Configurações do MongoDB
MONGODB_DATABASE = "minha_database"
MONGODB_COLLECTION = "minha_collection"
VECTOR_INDEX_PT = 'vector_index_pt'
VECTOR_INDEX_EN = 'vector_index_en'

# Modelos
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
CHAT_MODEL = "mistral-small"

# --- Inicialização do FastAPI ---
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")


# Configuração CORS (Permitindo tudo para evitar bloqueios na Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Rate Limiter ---
request_tracker = defaultdict(lambda: {"count": 0, "last_request_time": 0.0})
lock = asyncio.Lock()

FREE_REQUESTS_LIMIT = 5
RESET_TIMEOUT_SECONDS = 60 * 3
MAX_WAIT_SECONDS = 30

async def rate_limiter(request: Request):
    ip = request.client.host or "unknown"
    current_time = time.monotonic()

    async with lock:
        if current_time - request_tracker[ip]["last_request_time"] > RESET_TIMEOUT_SECONDS:
            request_tracker[ip]["count"] = 0

        request_tracker[ip]["count"] += 1
        request_tracker[ip]["last_request_time"] = current_time
        request_count = request_tracker[ip]["count"]

    delay = 0
    if request_count > FREE_REQUESTS_LIMIT:
        exponent = request_count - FREE_REQUESTS_LIMIT
        delay = min(2 ** exponent, MAX_WAIT_SECONDS)

    if delay > 0:
        print(f"RATE LIMITER: IP {ip} aguardando {delay:.2f}s")
        await asyncio.sleep(delay)

# --- Conexões Globais ---
try:
    client = MongoClient(MONGODB_URI)
    collection = client[MONGODB_DATABASE][MONGODB_COLLECTION]
    
    embedding_generator = HuggingFaceEndpointEmbeddings(
        huggingfacehub_api_token=HUGGINGFACE_API_KEY,
        model=EMBEDDING_MODEL,
        task="feature-extraction",
    )

    vector_store_pt = MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=embedding_generator,
        index_name=VECTOR_INDEX_PT,
    )

    vector_store_en = MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=embedding_generator,
        index_name=VECTOR_INDEX_EN,
    )

    chat = ChatMistralAI(model=CHAT_MODEL, api_key=MISTRAL_API_KEY)
except Exception as e:
    print(f"Erro na inicialização dos clientes: {e}")

# --- Funções Auxiliares ---
def clean_title(title: str) -> str:
    return re.sub(r'^\d+\.\s*', '', title).strip()

def clean_query(query: str, lang: str = "en") -> str:
    # Remove pontuação básica
    text = re.sub(r'[^\w\s]', '', query)
    # Remove espaços duplos
    text = re.sub(r'\s+', ' ', text).strip()
    return text

class Query(BaseModel):
    query: str
    lang: str

@app.get("/")
def home():
    return {"status": "Backend running", "docs": "/api/py/docs"}

@app.post("/api/py/search", dependencies=[Depends(rate_limiter)])
async def search(q: Query):
    cleaned_query = clean_query(q.query, lang=q.lang)

    # Escolha do Vector Store
    vstore = vector_store_pt if q.lang == "pt" else vector_store_en
    
    # Busca
    results = vstore.similarity_search_with_relevance_scores(q.query, k=5)

    threshold = 0.65
    filtered_results = [
        doc for doc, score in results
        if (score >= threshold) and (doc.metadata.get("lang") == q.lang)
    ]

    # Caminho corrigido para a pasta prompts (assume que prompts está DENTRO de src)
    prompts_dir = CURRENT_DIR / "prompts"
    
    # Caso sem resultados
    if cleaned_query == "" or not filtered_results:
        try:
            prompt_file = prompts_dir / f"non_related_{q.lang}.txt"
            with open(prompt_file, "r", encoding="utf-8") as file:
                return {"answer": file.read()}
        except FileNotFoundError:
            return {"answer": "I don't have enough context to answer that based on the blog."}

    context = "\n\n".join(fr.page_content for fr in filtered_results)
    
    unique_sources_set = {
        (clean_title(doc.metadata.get("title", "Sem título")), doc.metadata.get("path", "#"))
        for doc in filtered_results
    }
    sources = [{"title": title, "url": url} for title, url in unique_sources_set]

    # Prepara prompt do chat
    query_label = "Pergunta" if q.lang == "pt" else "Question"
    context_label = "Contexto" if q.lang == "pt" else "Context"
    
    try:
        guidelines_file = prompts_dir / f"response_guidelines_{q.lang}.txt"
        with open(guidelines_file, "r", encoding="utf-8") as file:
            system_prompt = file.read()
    except FileNotFoundError:
         system_prompt = "You are a helpful assistant answering based on the provided context."

    completion = await chat.ainvoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"{query_label}: {q.query}\n{context_label}:{context}",},
    ])

    return {"answer": completion.content, "sources": sources}