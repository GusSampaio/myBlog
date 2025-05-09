
import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";

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
                <Link href="/projects">Projects</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost">
                <Link href="/about">About</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost">
                <Link href="/contact">Contact</Link>
              </Button>
            </li>
            <li>
              <LanguageSelector />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
