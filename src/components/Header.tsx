'use client';

import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Home, BookOpen, Cog, UserRoundSearch, Phone } from "lucide-react";

export default function Header() {
  const { translations, locale } = useLanguage();

  const navLinks = [
    { href: "blog", label: translations.navigation.blog, icon: <BookOpen className="w-5 h-5" /> },
    { href: "projects", label: translations.navigation.projects, icon: <Cog className="w-5 h-5" /> },
    { href: "about", label: translations.navigation.about.title, icon: <UserRoundSearch className="w-5 h-5" /> },
    { href: "contact", label: translations.navigation.contact.title, icon: <Phone className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-secondary text-secondary-foreground py-5 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo/Home */}
        <Button asChild variant="ghost" className="text-lg px-3 py-2">
          <Link href={`/${locale}`} className="flex items-center space-x-2 font-semibold">
            <Home className="w-5 h-5" />
            <span>{translations.navigation.home}</span>
          </Link>
        </Button>

        {/* Navegação principal */}
        <nav>
          <ul className="flex items-center gap-3 sm:gap-5 text-base sm:text-lg">
            {navLinks.map(({ href, label, icon }) => (
              <li key={href}>
                <Button asChild variant="ghost" className="px-3 py-2">
                  <Link href={`/${locale}/${href}`} className="flex items-center space-x-2">
                    {icon}
                    <span>{label}</span>
                  </Link>
                </Button>
              </li>
            ))}
            <li className="pl-2">
              <LanguageSelector />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
