'use client';

import { useRouter, usePathname } from 'next/navigation';
import { translations } from '@/lib/translations';
import { useMemo } from 'react';

export function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Detecta o idioma atual baseado na URL
  const currentLocale: Locale = useMemo(() => {
    // Com a estrutura [lang], a URL será /pt/... ou /en/...
    if (pathname.startsWith('/pt/')) return 'pt';
    if (pathname.startsWith('/en/')) return 'en';
    if (pathname === '/pt') return 'pt';
    if (pathname === '/en') return 'en';
    return 'pt'; // idioma padrão
  }, [pathname]);
  
  const translationsForLocale = useMemo(() => translations[currentLocale], [currentLocale]);
  
  const changeLanguage = (locale: Locale) => {
    // Se já estamos no idioma desejado, não fazer nada
    if (locale === currentLocale) return;
    
    // Remove o prefixo de idioma atual se existir
    let newPath = pathname;
    
    if (pathname.startsWith('/pt/')) {
      newPath = pathname.replace(/^\/pt/, '');
    } else if (pathname.startsWith('/en/')) {
      newPath = pathname.replace(/^\/en/, '');
    } else if (pathname === '/pt') {
      newPath = '';
    } else if (pathname === '/en') {
      newPath = '';
    }
    
    // Adiciona o novo prefixo de idioma
    if (locale === 'pt') {
      newPath = `/pt${newPath}`;
    } else if (locale === 'en') {
      newPath = `/en${newPath}`;
    }
    
    // Se newPath ficou vazio, adiciona pelo menos o idioma
    if (newPath === '') {
      newPath = `/${locale}`;
    }
    
    router.push(newPath);
  };
  
  return {
    locale: currentLocale,
    translations: translationsForLocale,
    changeLanguage,
  };
} 