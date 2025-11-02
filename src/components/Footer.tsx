import { GithubIcon, LinkedinIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full shadow-inner bg-secondary py-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4">
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