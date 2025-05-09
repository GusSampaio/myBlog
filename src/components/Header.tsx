
import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";

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
              <Link href="/blog" className="hover:text-accent">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-accent">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent">
                Contact
              </Link>
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
