import { useState, useCallback } from 'react';

interface TranslationState {
  translated: string;
  isLoading: boolean;
  error: string | null;
}

export function useTranslate() {
  const [state, setState] = useState<TranslationState>({
    translated: '',
    isLoading: false,
    error: null
  });

  const translate = useCallback(async (text: string, from = 'pt', to = 'en') => {
    if (!text.trim()) {
      setState({ translated: '', isLoading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, from, to }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na tradução');
      }

      setState({
        translated: data.translated || data.fallback || '',
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        translated: '',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }, []);

  return {
    ...state,
    translate
  };
} 