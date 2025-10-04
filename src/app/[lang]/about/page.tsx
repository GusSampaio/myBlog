import Image from 'next/image';
import { translations } from '@/lib/translations';

interface ContactPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const locale = lang === 'en' || lang === 'pt' ? lang : 'pt';
  const t = translations[locale];

  return (
    <section className="bg-background text-secondary-foreground flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">

        {/* Texto */}
        <div>
          <h1 className="text-4xl font-bold mb-6">{t.navigation.about.title}</h1>
          {t.navigation.about.desc.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-2 text-xl">{paragraph.trim()}</p>
          ))}
        </div>

        {/* Imagem Circular */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-2 border-secondary">
            <Image
              src="/linked_eu.png"
              alt="Foto de Gustavo Sampaio"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
