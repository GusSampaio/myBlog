import ClientHomePage from "./ClientHomePage";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // validação do idioma
  const locale = lang === "en" || lang === "pt" ? lang : "pt";

  // passa pro Client Component
  return <ClientHomePage locale={locale} />;
}
