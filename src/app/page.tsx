import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { translations } from "@/lib/translations";

export default function Home() {
  const t = translations.en;

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
              I'm Gustavo, a Computer Science undergraduate at the University of São Paulo (USP), planning to pursue a master's degree after graduation. As a Research Assistant at the University of Sheffield's NLP group, I focus on personalization techniques to assess disinformation in large language models (LLMs) across multiple languages, using tools like Elastic Search, Python, VLLM, NumPy, and Pandas. At USP's NILC, I contribute to AI research, specializing in Natural Language Processing (NLP). I'm also passionate about exploring challenges in Computer Vision.
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
              <li>Computer Vision</li>
              <li>Data Analysis</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">{t.explore.title}</h2>
        <div className="flex justify-center gap-6">
          <Link href="/blog">
            <Button variant="secondary">
              {t.explore.blog} <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button>
              {t.explore.projects} <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
