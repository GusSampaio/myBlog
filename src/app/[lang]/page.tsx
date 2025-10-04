import ClientHomePage from "./ClientHomePage";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  // `params` agora é uma Promise no Next.js 15, por isso precisa de await
  const { lang } = await params;

  // validação do idioma
  const locale = lang === "en" || lang === "pt" ? lang : "pt";

  // passa pro Client Component
  return <ClientHomePage locale={locale} />;
}
