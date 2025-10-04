import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SearchResults } from './SearchResults';
import { useLanguage } from '@/hooks/useLanguage';

interface SearchBarProps {
  language: 'en' | 'pt';
}

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResult {
  answer: string;
  sources: Source[];
}

export function SearchBar({ language }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const { translations } = useLanguage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder={translations.pages.home.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? translations.common.searching : translations.common.search}
          </Button>
        </form>
      </Card>
      
      <SearchResults 
        results={results}
        language={language}
        isLoading={isLoading}
      />
    </div>
  );
} 