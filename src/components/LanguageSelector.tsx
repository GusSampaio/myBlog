'use client';

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const isPortuguese = pathname.startsWith('/pt');
    const newPath = isPortuguese 
        ? pathname.replace(/^\/pt\b/, '') || '/'
        : `/pt${pathname}`;
    
    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="absolute top-4 right-4"
    >
      {pathname.startsWith('/pt') ? '🇺🇸 EN' : '🇧🇷 PT'}
    </Button>
  );
} 