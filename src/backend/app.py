from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from langchain_mistralai import ChatMistralAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import spacy
import os
import re

# --- Configurações ---
# Carrega variáveis de ambiente de forma segura
dotenv_path = "../../.env"
load_dotenv(dotenv_path=dotenv_path)

# Chaves de API e Conexões
MONGODB_URI = os.environ["MONGODB_URI"]
MISTRAL_API_KEY = os.environ["MISTRAL_API_KEY"]
HUGGINGFACE_API_KEY = os.environ["HF_TOKEN"]

# Configurações do MongoDB
MONGODB_DATABASE = "minha_database"
MONGODB_COLLECTION = "minha_collection"
VECTOR_INDEX_PT = 'vector_index_pt'
VECTOR_INDEX_EN = 'vector_index_en'

# Modelos
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
CHAT_MODEL = "mistral-small"

# --- Inicialização dos Clientes e Modelos ---
app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:9002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cliente MongoDB
client = MongoClient(MONGODB_URI)
collection = client[MONGODB_DATABASE][MONGODB_COLLECTION]

## Instancia o gerador de embeddings usando a API de Inferência
embedding_generator = HuggingFaceEndpointEmbeddings(
    huggingfacehub_api_token=HUGGINGFACE_API_KEY,
    model=EMBEDDING_MODEL,
    task="feature-extraction",
)

# Vector Stores
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

# Modelo de Chat
chat = ChatMistralAI(model=CHAT_MODEL, api_key=MISTRAL_API_KEY)

# Carregamento dos modelos Spacy
nlp_en = spacy.load("en_core_web_sm")
nlp_pt = spacy.load("pt_core_news_sm")

# --- Funções Auxiliares ---
def clean_title(title: str) -> str:
    """Remove numeração do início dos títulos."""
    return re.sub(r'^\d+\.\s*', '', title).strip()

def clean_query(query: str, lang: str = "en") -> str:
    """Limpa e processa a query para melhorar a busca."""
    nlp = nlp_en if lang == "en" else nlp_pt
    doc = nlp(query)
    tokens = [
        token.lemma_ for token in doc
        if not token.is_stop and token.pos_ in ("NOUN", "ADJ", "VERB")
    ]
    return " ".join(tokens)

class Query(BaseModel):
    query: str
    lang: str

@app.post("/search")
async def search(q: Query):
    cleaned_query = clean_query(q.query, lang=q.lang)
    if cleaned_query == "":
        return {"answer": ""}

    results = []
    if q.lang == "pt":
        results = vector_store_pt.similarity_search_with_relevance_scores(q.query, k=5)
    else:
        results = vector_store_en.similarity_search_with_relevance_scores(q.query, k=5)

    threshold = 0.65
    filtered_results = [
        doc for doc, score in results
        if (score >= threshold) and (doc.metadata.get("lang") == q.lang)
    ]

    if not filtered_results:
        with open(f"prompts/non_related_{q.lang}.txt", "r", encoding="utf-8") as file:
            non_related_prompt = file.read()
            return {"answer": non_related_prompt}

    context = "\n\n".join(fr.page_content for fr in filtered_results)
    
    unique_sources_set = {
        (clean_title(doc.metadata.get("title", "Sem título")), doc.metadata.get("path", "#"))
        for doc in filtered_results
    }
    sources = [{"title": title, "url": url} for title, url in unique_sources_set]

    query = ""
    context_info = ""
    with open(f"prompts/response_guidelines_{q.lang}.txt", "r", encoding="utf-8") as file:
        prompt = file.read()

    if q.lang == "pt":
        query = "Pergunta"
        context_info = "Contexto presente no blog de Gustavo sobre esse assunto"
    else:
        query = "Question"
        context_info = "Existent context on Gustavo's blog related to this topic"

    completion = await chat.ainvoke([
        {"role": "system", "content": prompt},
        {"role": "user", "content": f"{query}: {q.query}\n{context_info}:{context}",},
    ])

    return {"answer": completion.content, "sources": sources}