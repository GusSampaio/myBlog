'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { translations } from "@/lib/translations";
import * as React from "react";

// --- NOVO ---
// Adicionando as novas traduções para as perguntas padrão e a mensagem de loading.
// Você deve mover isso para seu arquivo `lib/translations.js` para manter a organização.
const extendedTranslations = {
    ...translations,
    pt: {
        ...translations.pt,
        search: {
            placeholder: "Pergunte sobre o blog...",
            button: "Pesquisar",
            loading: "Analisando os bits e bytes...",
            answer: "Resposta:",
            sources: "Referências:",
            standardQuestions: [
                "Qual a formação do Gustavo?",
                "Me fale sobre a stack de MLOps",
                "Como usar o Docker para projetos de IA?",
            ]
        }
    },
    en: {
        ...translations.en,
        search: {
            placeholder: "Ask about the blog...",
            button: "Search",
            loading: "Analyzing the bits and bytes...",
            answer: "Answer:",
            sources: "Sources:",
            standardQuestions: [
                "What is Gustavo's background?",
                "Tell me about the MLOps stack",
                "How to use Docker for AI projects?",
            ]
        }
    }
};


export default function ClientHomePage({ locale }: { locale: string }) {
    // Usando as traduções estendidas
    const t = extendedTranslations[locale as keyof typeof extendedTranslations];

    const [query, setQuery] = React.useState("");
    const [answer, setAnswer] = React.useState("");
    const [sources, setSources] = React.useState<{ title: string; url: string }[]>([]);
    
    // --- NOVO ESTADO ---
    // Estado para controlar a animação de carregamento
    const [isLoading, setIsLoading] = React.useState(false);

    // --- FUNÇÃO DE BUSCA MODIFICADA ---
    async function handleSearch(searchQuery = query) {
        if (!searchQuery.trim()) return; // Evita buscas vazias

        setIsLoading(true);
        setAnswer(""); // Limpa a resposta anterior para dar espaço à animação
        setSources([]);

        try {
            //const res = await fetch("https://meu-backend.onrender.com/search", {
            const res = await fetch("http://localhost:8000/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery, lang: locale }),
            });
            const data = await res.json();
            setAnswer(data.answer);
            setSources(data.sources || []);
        } catch (error) {
            console.error("Fetch failed:", error);
            setAnswer(locale === "pt" ? "Ocorreu um erro ao buscar a resposta. Por favor, tente novamente." : "An error occurred while fetching the answer. Please try again.");
        } finally {
            setIsLoading(false); // Garante que o loading termine, mesmo com erro
        }
    }

    // --- NOVA FUNÇÃO ---
    // Lida com o clique nas perguntas padrão
    const handleStandardQuestionClick = (question: string) => {
        setQuery(question);
        handleSearch(question);
    };

    // --- NOVO COMPONENTE ---
    // Animação de carregamento engraçadinha
    const LoadingAnimation = () => (
        <section className="mt-10 flex flex-col items-center justify-center text-center">
            <div className="text-4xl animate-bounce">
                🤖
            </div>
            <p className="mt-4 text-muted-foreground">
                {t.search.loading}
            </p>
        </section>
    );

    return (
        <div className="container mx-auto px-4 py-16">

            {/* Seção de título principal (sem alterações) */}
            <section className="text-center mb-20">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
                    {t.title}
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t.tagline}
                </p>
            </section>

            {/* Seção de exploração (sem alterações) */}
            <section className="text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-foreground">
                    {t.explore.title}
                </h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                    <Link href={`/${locale}/blog`} className="w-full sm:w-auto">
                        <Button variant="secondary" className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg">
                            {t.explore.blog}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href={`/${locale}/projects`} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg">
                            {t.explore.projects}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* --- SEÇÃO DE BUSCA MODIFICADA --- */}
            <section className="mt-12 flex flex-col items-center gap-4">
                {/* Input e Botão */}
                <div className="flex w-full sm:w-[500px] bg-background border border-input rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-ring transition">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={t.search.placeholder}
                        className="flex-grow px-5 py-3 h-12 bg-transparent text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={() => handleSearch()}
                        className="h-12 rounded-none rounded-r-full px-6"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-background/80 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            t.search.button
                        )}
                    </Button>
                </div>

                {/* Perguntas Padrão */}
                <div className="flex flex-wrap justify-center gap-2 px-4">
                    {t.search.standardQuestions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => handleStandardQuestionClick(q)}
                            className="px-3 py-1.5 text-xs sm:text-sm text-muted-foreground bg-muted rounded-full border border-transparent hover:border-border hover:bg-background transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            "{q}"
                        </button>
                    ))}
                </div>
            </section>

            {/* --- SEÇÃO DE RESULTADOS MODIFICADA --- */}
            {/* Mostra a animação OU a resposta */}
            {isLoading ? (
                <LoadingAnimation />
            ) : answer && (
                <section className="mt-10 max-w-3xl mx-auto">
                    {/* Resposta */}
                    <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-3 text-foreground">
                            {t.search.answer}
                        </h3>
                        <p className="text-muted-foreground text-justify leading-relaxed">
                            {answer}
                        </p>
                    </div>

                    {/* Referências */}
                    {sources && sources.length > 0 && (
                        <div className="mt-8">
                            <h4 className="font-semibold text-base mb-4 text-foreground">
                                {t.search.sources}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {sources.map((src, i) => (
                                    <a
                                        key={i}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-sm font-medium text-primary bg-muted rounded-lg border border-border hover:bg-primary hover:text-primary-foreground transition"
                                    >
                                        {src.title.replace(/^\d+\.\s*/, "")} <sup>{i + 1}</sup>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}