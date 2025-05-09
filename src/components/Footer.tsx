import { GithubIcon, LinkedinIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} ML Portfolio Pro. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a 
            href="https://www.linkedin.com/in/gussampaio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <a 
            href="https://github.com/GusSampaio/" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
} 