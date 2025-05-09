'use client';

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale: string) => {
    const isPortuguese = pathname.startsWith('/pt');
    const newPath = locale === 'pt' 
      ? `/pt${pathname.replace(/^\/pt/, '')}` 
      : pathname.replace(/^\/pt/, '') || '/';
    
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {pathname.startsWith('/pt') 
          ? <span>Idioma</span> 
          : <span>Language</span>}
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('pt')}>
          🇧🇷 Português
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          🇺🇸 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 