import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteContent = (section: string) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();

    // Real-time updates
    const channel = supabase
      .channel(`site-content-${section}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
          filter: `section=eq.${section}`
        },
        () => {
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [section]);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("section", section)
      .single();

    if (!error && data) {
      setContent(data.content);
    }
    setLoading(false);
  };

  return { content, loading };
};