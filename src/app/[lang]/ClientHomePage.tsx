'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { translations } from "@/lib/translations";
import * as React from "react";


export default function ClientHomePage({ locale }: { locale: string }) {
    const t = translations[locale];

    const [query, setQuery] = React.useState("");
    const [answer, setAnswer] = React.useState("");
    const [sources, setSources] = React.useState<{ title: string; url: string }[]>([]);

    async function handleSearch() {
        //const res = await fetch("https://meu-backend.onrender.com/search", {
        const res = await fetch("http://localhost:8000/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, lang: locale }),
        });
        const data = await res.json();
        setAnswer(data.answer);
        setSources(data.sources || []);
    }

    return (
        <div className="container mx-auto px-4 py-16">

            {/* Seção de título principal */}
            <section className="text-center mb-20">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
                    {t.title}
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t.tagline}
                </p>
            </section>

            {/* Seção de exploração */}
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

            {/* Query input */}
            <section className="mt-12 flex justify-center">
                <div className="flex w-full sm:w-[500px] bg-background border border-input rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-ring transition">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={locale === "pt" ? "Pergunte sobre o blog..." : "Ask about the blog..."}
                        className="flex-grow px-5 py-3 h-12 bg-transparent text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none"
                    />
                    <Button
                        onClick={handleSearch}
                        className="h-12 rounded-none rounded-r-full px-6"
                    >
                        {locale === "pt" ? "Pesquisar" : "Search"}
                    </Button>
                </div>
            </section>

            {answer && (
                <section className="mt-10 max-w-3xl mx-auto">
                    {/* Resposta */}
                    <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-3 text-foreground">
                            {locale === "pt" ? "Resposta:" : "Answer:"}
                        </h3>
                        <p className="text-muted-foreground text-justify leading-relaxed">
                            {answer}
                        </p>
                    </div>

                    {/* Referências */}
                    {sources && sources.length > 0 && (
                        <div className="mt-8">
                            <h4 className="font-semibold text-base mb-4 text-foreground">
                                {locale === "pt" ? "Referências:" : "Sources:"}
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
