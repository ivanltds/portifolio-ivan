import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { SiteContent } from "../types/content";
import { defaultContent } from "../data/defaultContent";

interface ContentCtx {
  content: SiteContent;
  loading: boolean;
  refetch: () => void;
}

const SiteContentContext = createContext<ContentCtx>({
  content: defaultContent,
  loading: false,
  refetch: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) return;
      const data = await res.json();
      if (data?.content) {
        // Merge com defaultContent para garantir campos novos não salvos ainda
        setContent((prev) => deepMerge(defaultContent, data.content, prev));
      }
    } catch {
      // Usa defaultContent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  return (
    <SiteContentContext.Provider value={{ content, loading, refetch: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

// Deep merge: base <- saved (prioridade), preenche campos ausentes com default
function deepMerge(defaults: any, saved: any, _prev?: any): any {
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  if (typeof defaults !== "object" || defaults === null) return saved ?? defaults;
  const result: any = { ...defaults };
  for (const key of Object.keys(defaults)) {
    result[key] = deepMerge(defaults[key], saved?.[key]);
  }
  // Inclui chaves extras salvas não presentes no default
  for (const key of Object.keys(saved ?? {})) {
    if (!(key in result)) result[key] = saved[key];
  }
  return result;
}
