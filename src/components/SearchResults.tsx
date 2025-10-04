import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResult {
  answer: string;
  sources: Source[];
}

interface SearchResultsProps {
  results: SearchResult | null;
  language: 'en' | 'pt';
  isLoading: boolean;
}

export function SearchResults({ results, language, isLoading }: SearchResultsProps) {
  const { translations } = useLanguage();

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-4 p-4">
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <p className="text-lg mb-6">{results.answer}</p>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              {translations.common.sources}
            </h3>
            <div className="space-y-4">
              {results.sources.map((source, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <Link 
                    href={source.url}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {source.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 