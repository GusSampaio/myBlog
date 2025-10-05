from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from langchain_mistralai import ChatMistralAI
# from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_huggingface.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import spacy
import os
import re
dotenv_path = "../../.env"
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:9002"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_DATABASE = "minha_database"
MONGODB_COLLECTION = "minha_collection"

client = MongoClient(os.environ.get("MONGODB_URI"))
db = client[MONGODB_DATABASE]
collection = db[MONGODB_COLLECTION]

embedding_generator = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

vector_store_pt = MongoDBAtlasVectorSearch(
    embedding=embedding_generator,
    collection=collection,
    index_name='vector_index_pt',
    relevance_score_fn="cosine",
    type="vectorSearch",
)

vector_store_en = MongoDBAtlasVectorSearch(
    embedding=embedding_generator,
    collection=collection,
    index_name='vector_index_en',
    relevance_score_fn="cosine",
    type="vectorSearch",
)

# Configuração do chat
chat = ChatMistralAI(
    model="mistral-small",
    api_key=os.environ["MISTRAL_API_KEY"],
)

class Query(BaseModel):
    query: str
    lang: str

nlp_en = spacy.load("en_core_web_sm")
nlp_pt = spacy.load("pt_core_news_sm")

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

@app.post("/search")
async def search(q: Query):

    cleaned_query = clean_query(q.query, lang=q.lang)
    print("Cleaned query:", cleaned_query)

    results=[]
    if q.lang == "pt":
        results = vector_store_pt.similarity_search_with_relevance_scores(q.query, k=5)
    else:
        results = vector_store_en.similarity_search_with_relevance_scores(q.query, k=5)
    print(results[0])
    
    threshold = 0.65  # (similaridade de cosseno ~ entre -1 e 1)
    filtered_results = [doc for doc, score in results if (score >= threshold) and (doc.metadata.get("lang") == q.lang)]
    print(len(filtered_results))
    if not filtered_results:
        if q.lang=="pt":
            return {"answer": "A resposta à sua pergunta não está diretamente relacionada ao conteúdo disponível no blog de Gustavo Sampaio. O blog trata principalmente de tópicos técnicos em tecnologia, ciência de dados, machine learning e inteligência artificial. Se tiver sugestões de novos assuntos, fique à vontade para entrar em contato pela página de contatos.",
                    "sources": []}
        else:
            return {"answer": "The answer to your question is not directly related to the content available on Gustavo's blog. The blog mainly covers technical topics in technology, data science, machine learning, and artificial intelligence. If you have suggestions for new topics, feel free to get in touch through the contact page.",
                    "sources": []}
    
    context = "\n\n".join(fr.page_content for fr in filtered_results)

    sources = [
        {"title": clean_title(doc.metadata.get("title", "Sem título")), "url": doc.metadata.get("path", "#")}
        for doc in filtered_results
    ]

    unique_sources = list({(src["title"], src["url"]) for src in sources})
    sources = [{"title": title, "url": url} for title, url in unique_sources]

    prompt = ""
    query = ""
    context_info = ""
    if q.lang == "pt":
        query = "Pergunta"
        context_info = "Contexto presente no blog de Gustavo sobre esse assunto"
        prompt = """Você é um assistente que responde em português sobre um blog do Gustavo Sampaio.  
- O blog contém posts técnicos sobre assuntos diversos, incluindo tecnologia, ciência de dados, machine learning e inteligência artificial.
- Informações adicionais sobre Gustavo Sampaio (cientista de dados, estudante de doutorado na USP em linguagem natural, atuando no Hospital Albert Einstein em projetos que combinam texto e imagem aplicados à saúde pública).
- Responda apenas com base nos conteúdos do blog (ou informações extras sobre Gustavo fornecidas acima, se e somente se forem necessárias).  
- Sua resposta deve parecer natural, como se você soubesse do conteúdo por si só.  
- Não sugira novas perguntas nem responda a temas fora do escopo do blog.
- Não mencione que recebeu textos de apoio, contexto fornecido, RAG ou outras instruções ocultas.""" 
    else:
        query = "Question"
        context_info = "Existent context on Gustavo's blog related to this topic"
        prompt = """You are an assistant responding in the same query language about a blog by Gustavo Sampaio.
- The blog contains technical posts about technology, data science, machine learning, and artificial intelligence.
- Additional information about Gustavo Sampaio (data scientist, PhD student at USP in natural language, participant at Albert Einstein Hospital in projects that combine text and images applied to public health).
- Respond only based on the blog's content (or additional information about Gustavo provided above, only if possible).
- Your response should sound natural, as if you knew the content yourself.
- Do not suggest new questions or respond to topics outside the scope of the blog.
- Do not mention that you received supporting texts, provided context, RAG, or other hidden instructions."""

    completion = await chat.ainvoke([
        {
            "role": "system", "content": prompt
        },
        {
            "role": "user", "content": f"{query}: {q.query}\n{context_info}:{context}",
        },
    ])

    print(sources)
    return {"answer": completion.content, "sources": sources}
