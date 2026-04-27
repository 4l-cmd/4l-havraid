"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { NewsItem } from "@/lib/types";
import { Newspaper, Users, MapPin, Info } from "lucide-react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  actualite: <Newspaper size={16} />,
  sponsor: <Users size={16} />,
  etape: <MapPin size={16} />,
  info: <Info size={16} />,
};
const TYPE_COLORS: Record<string, string> = {
  actualite: 'var(--terra)',
  sponsor: 'var(--accent)',
  etape: 'var(--green-light)',
  info: '#58a6ff',
};

export default function Actualites() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => { setNews(data ?? []); setLoading(false); });
  }, []);

  return (
    <section id="actualites" className="py-24 px-8 max-w-6xl mx-auto">
      <div className="section-tag">Fil d&apos;actualité</div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 8 }}>
        Actualités
      </h2>
      <p className="mb-12 text-sm" style={{ color: 'var(--muted)' }}>
        Sponsors, étapes, préparation et moments forts de l&apos;aventure.
      </p>

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--muted)' }}>Chargement...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-16 rounded-xl card">
          <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
          <p style={{ color: 'var(--muted)' }}>Les premières actualités arrivent bientôt !</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => (
            <article key={item.id} className="card rounded-xl overflow-hidden flex flex-col">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                    style={{ color: TYPE_COLORS[item.type], background: `${TYPE_COLORS[item.type]}22` }}>
                    {TYPE_ICONS[item.type]}
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
                    {new Date(item.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--sand)' }}>{item.title}</h3>
                <p className="text-sm flex-1" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{item.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
