"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { NewsItem } from "@/lib/types";
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, X, Check } from "lucide-react";

const TYPES = [
  { value: 'actualite', label: 'Actualité', color: 'var(--accent)' },
  { value: 'sponsor', label: 'Sponsor', color: '#cd7f32' },
  { value: 'etape', label: 'Étape', color: 'var(--green-light)' },
  { value: 'info', label: 'Info', color: '#58a6ff' },
] as const;

const EMPTY: Omit<NewsItem, 'id' | 'created_at'> = {
  title: '', content: '', type: 'actualite', published: true, author: 'L\'équipe 4L Havraid', image_url: undefined,
};

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("news").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setNews(data ?? []); setLoading(false); });
  }, []);

  function openCreate() { setForm(EMPTY); setEditing(null); setCreating(true); }
  function openEdit(n: NewsItem) { setForm({ title: n.title, content: n.content, type: n.type, published: n.published, author: n.author, image_url: n.image_url }); setEditing(n); setCreating(true); }
  function closeForm() { setCreating(false); setEditing(null); }

  async function uploadImage(file: File): Promise<string | undefined> {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `news/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) { setUploading(false); return undefined; }
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
    setUploading(false);
    return publicUrl;
  }

  async function save() {
    setSaving(true);
    if (editing) {
      const { data } = await supabase.from("news").update(form).eq("id", editing.id).select().single();
      if (data) setNews(prev => prev.map(n => n.id === editing.id ? data : n));
    } else {
      const { data } = await supabase.from("news").insert(form).select().single();
      if (data) setNews(prev => [data, ...prev]);
    }
    setSaving(false);
    closeForm();
  }

  async function togglePublished(n: NewsItem) {
    const { data } = await supabase.from("news").update({ published: !n.published }).eq("id", n.id).select().single();
    if (data) setNews(prev => prev.map(x => x.id === n.id ? data : x));
  }

  async function deleteNews(n: NewsItem) {
    if (!confirm(`Supprimer "${n.title}" ?`)) return;
    await supabase.from("news").delete().eq("id", n.id);
    setNews(prev => prev.filter(x => x.id !== n.id));
  }

  if (loading) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          ACTUALITÉS
        </h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouvelle actu
        </button>
      </div>

      {/* Form modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4" style={{ background: 'var(--night2)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--sand)' }}>
                {editing ? 'Modifier l\'article' : 'Nouvel article'}
              </h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Type</label>
              <div className="flex gap-2 flex-wrap">
                {TYPES.map(t => (
                  <button key={t.value} onClick={() => setForm(f => ({ ...f, type: t.value }))}
                    className="text-xs px-3 py-1.5 rounded cursor-pointer"
                    style={{
                      background: form.type === t.value ? t.color : 'rgba(255,255,255,.06)',
                      color: form.type === t.value ? 'var(--night)' : 'var(--muted)',
                      border: 'none', fontWeight: form.type === t.value ? 700 : 400,
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Titre</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre de l'article" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Contenu</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={5} placeholder="Contenu de l'article..."
                style={{ width: '100%', background: 'var(--night)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical' }} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Auteur</label>
              <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Image (optionnelle)</label>
              {form.image_url ? (
                <div className="flex items-center gap-3">
                  <img src={form.image_url} alt="" className="rounded-lg" style={{ height: 80, width: 'auto', objectFit: 'cover' }} />
                  <button onClick={() => setForm(f => ({ ...f, image_url: undefined }))}
                    style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer text-sm"
                  style={{ border: '1px dashed rgba(255,255,255,.1)', color: 'var(--muted)', display: 'inline-flex' }}>
                  <Image size={16} />
                  {uploading ? 'Upload...' : 'Ajouter une image'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) { const url = await uploadImage(file); if (url) setForm(f => ({ ...f, image_url: url })); }
                    }} />
                </label>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--muted)' }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  style={{ accentColor: 'var(--accent)' }} />
                Publier immédiatement
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={closeForm} className="btn-ghost flex-1">Annuler</button>
              <button onClick={save} disabled={saving || !form.title || !form.content} className="btn-primary flex-1 justify-center">
                <Check size={16} /> {saving ? 'Sauvegarde...' : editing ? 'Mettre à jour' : 'Publier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {news.length === 0 ? (
        <div className="card rounded-xl p-8 text-center" style={{ color: 'var(--muted)' }}>
          Aucune actualité. Créez le premier article !
        </div>
      ) : (
        <div className="space-y-3">
          {news.map(n => {
            const tc = TYPES.find(t => t.value === n.type);
            return (
              <div key={n.id} className="card rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{ background: `${tc?.color}20`, color: tc?.color }}>{tc?.label}</span>
                    {!n.published && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--muted)' }}>
                        Brouillon
                      </span>
                    )}
                  </div>
                  <div className="font-medium" style={{ color: 'var(--text)' }}>{n.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {n.author} · {new Date(n.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublished(n)} title={n.published ? 'Dépublier' : 'Publier'}
                    style={{ background: 'none', border: 'none', color: n.published ? 'var(--green-light)' : 'var(--muted)', cursor: 'pointer' }}>
                    {n.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => openEdit(n)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteNews(n)} style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
