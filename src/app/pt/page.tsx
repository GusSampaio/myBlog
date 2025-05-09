import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { translations } from "@/lib/translations";

export default function HomePT() {
  const t = translations.pt;

  return (
    <div className="container mx-auto py-10 relative">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {t.title}
        </h1>
        <p className="text-lg mt-4">
          {t.tagline}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>{t.aboutMe.title}</CardTitle>
            <CardDescription>
              {t.aboutMe.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Sou Gustavo, estudante de Ciência da Computação na Universidade de São Paulo (USP), planejando cursar mestrado após a graduação. Como Assistente de Pesquisa no grupo de NLP da Universidade de Sheffield, foco em técnicas de personalização para avaliar desinformação em modelos de linguagem grandes (LLMs) em múltiplos idiomas, usando ferramentas como Elastic Search, Python, VLLM, NumPy e Pandas. No NILC da USP, contribuo com pesquisas em IA, especializando-me em Processamento de Linguagem Natural (NLP). Também sou apaixonado por explorar desafios em Visão Computacional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.skills.title}</CardTitle>
            <CardDescription>
              {t.skills.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul 
            style={{
              columnCount: 3,
              columnGap: '20px',
              listStyleType: 'disc',
              listStylePosition: 'outside',
              paddingLeft: '20px',
            }}>
              <li>Python</li>
              <li>TensorFlow</li>
              <li>PyTorch</li>
              <li>NLP</li>
              <li>Visão Computacional</li>
              <li>Análise de Dados</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">{t.explore.title}</h2>
        <div className="flex justify-center gap-6">
          <Link href="/pt/blog">
            <Button variant="secondary">
              {t.explore.blog} <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/pt/projects">
            <Button>
              {t.explore.projects} <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 