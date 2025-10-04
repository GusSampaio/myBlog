import { translations } from '@/lib/translations';
import { Mail, Linkedin, Github } from 'lucide-react';

interface ContactPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const locale = (lang === 'en' || lang === 'pt') ? lang : 'pt';
  const t = translations[locale];

  const contactItems = [
    {
      icon: <Mail className="w-5 h-5 text-muted-foreground" />,
      title: 'Email',
      link: 'mailto:gustavo.sampaio_13@outlook.com',
      display: 'gustavo.sampaio_13@outlook.com',
    },
    {
      icon: <Linkedin className="w-5 h-5 text-muted-foreground" />,
      title: 'LinkedIn',
      link: 'https://www.linkedin.com/in/gussampaio/',
      display: 'linkedin.com/in/gussampaio',
    },
    {
      icon: <Github className="w-5 h-5 text-muted-foreground" />,
      title: 'GitHub',
      link: 'https://github.com/gussampaio',
      display: 'github.com/gussampaio',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-foreground">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        {t.navigation.contact.title}
      </h1>

      <p className="text-lg text-center text-muted-foreground mb-12 leading-relaxed">
        {t.navigation.contact.desc}
      </p>

      <div className="space-y-6">
        {contactItems.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-md border hover:bg-muted transition-colors"
          >
            {item.icon}
            <div>
              <p className="text-sm font-semibold text-muted-foreground">{item.title}</p>
              <p className="text-base text-primary">{item.display}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
