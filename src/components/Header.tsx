'use client';
import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function getPathToHeader() {
  const pathname = usePathname();
  return pathname;
};

export default function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          ML Portfolio Pro
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Button asChild variant="ghost">
                <Link href="/blog">Blog</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost">
                <Link href="/projects">
                {getPathToHeader().startsWith('/pt') 
                  ? <span>Projetos</span> 
                  : <span>Projects</span>}
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost">
                <Link href="/about">
                {getPathToHeader().startsWith('/pt') 
                  ? <span>Sobre</span> 
                  : <span>About</span>}</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost">
                <Link href="/contact">
                {getPathToHeader().startsWith('/pt') 
                  ? <span>Contato</span> 
                  : <span>Contact</span>}</Link>
              </Button>
            </li>
            <li>
              <LanguageSelector/>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
