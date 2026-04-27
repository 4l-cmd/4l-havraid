"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { MembreEquipe } from "@/lib/types";
import { Plus, Edit2, Trash2, Image, X, Check, GripVertical } from "lucide-react";

const EMPTY: Omit<MembreEquipe, 'id'> = {
  order: 99, name: '', role: '', bio: '', details: '', photo_url: undefined, phone: '', email: '', instagram: '',
};

export default function AdminEquipe() {
  const [members, setMembers] = useState<MembreEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MembreEquipe | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<MembreEquipe, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("equipe").select("*").order("order")
      .then(({ data }) => { setMembers(data ?? []); setLoading(false); });
  }, []);

  function openCreate() { setForm({ ...EMPTY, order: members.length + 1 }); setEditing(null); setCreating(true); }
  function openEdit(m: MembreEquipe) {
    setForm({ order: m.order, name: m.name, role: m.role, bio: m.bio, details: m.details, photo_url: m.photo_url, phone: m.phone, email: m.email, instagram: m.instagram });
    setEditing(m); setCreating(true);
  }
  function closeForm() { setCreating(false); setEditing(null); }

  async function uploadPhoto(file: File): Promise<string | undefined> {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `equipe/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: true });
    if (error) { setUploading(false); return undefined; }
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
    setUploading(false);
    return publicUrl;
  }

  async function save() {
    if (!form.name || !form.role) return;
    setSaving(true);
    if (editing) {
      const { data } = await supabase.from("equipe").update(form).eq("id", editing.id).select().single();
      if (data) setMembers(prev => prev.map(m => m.id === editing.id ? data : m).sort((a, b) => a.order - b.order));
    } else {
      const { data } = await supabase.from("equipe").insert(form).select().single();
      if (data) setMembers(prev => [...prev, data].sort((a, b) => a.order - b.order));
    }
    setSaving(false);
    closeForm();
  }

  async function deleteMember(m: MembreEquipe) {
    if (!confirm(`Supprimer ${m.name} de l'équipe ?`)) return;
    await supabase.from("equipe").delete().eq("id", m.id);
    setMembers(prev => prev.filter(x => x.id !== m.id));
  }

  if (loading) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          ÉQUIPE
        </h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      {/* Form modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-xl rounded-2xl p-6 space-y-4" style={{ background: 'var(--night2)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--sand)' }}>
                {editing ? `Modifier — ${editing.name}` : 'Nouveau membre'}
              </h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Photo */}
            <div className="flex items-center gap-4">
              {form.photo_url ? (
                <div className="relative">
                  <img src={form.photo_url} alt="" className="rounded-full" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  <button onClick={() => setForm(f => ({ ...f, photo_url: undefined }))}
                    className="absolute -top-1 -right-1 rounded-full p-0.5"
                    style={{ background: '#f85149', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center rounded-full cursor-pointer"
                  style={{ width: 80, height: 80, border: '1px dashed rgba(255,255,255,.15)', color: 'var(--muted)' }}>
                  {uploading ? <span className="text-xs">...</span> : <Image size={20} />}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) { const url = await uploadPhoto(file); if (url) setForm(f => ({ ...f, photo_url: url })); }
                    }} />
                </label>
              )}
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Photo de profil<br />Format carré recommandé</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Nom *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Rôle *</label>
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Co-pilote, Mécanicien..." required />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Détails (études, etc.)</label>
              <input value={form.details || ''} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} placeholder="Master 2 Ingénierie à l'INSA..." />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3} placeholder="Présentation courte..."
                style={{ width: '100%', background: 'var(--night)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical' }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Email</label>
                <input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Instagram</label>
                <input value={form.instagram || ''} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@username" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Ordre d&apos;affichage</label>
              <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 1 }))} style={{ width: 80 }} />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={closeForm} className="btn-ghost flex-1">Annuler</button>
              <button onClick={save} disabled={saving || !form.name || !form.role} className="btn-primary flex-1 justify-center">
                <Check size={16} /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members list */}
      {members.length === 0 ? (
        <div className="card rounded-xl p-8 text-center" style={{ color: 'var(--muted)' }}>
          Aucun membre dans l&apos;équipe. Ajoutez Gabin et Jules !
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="card rounded-xl p-5 flex items-start gap-4">
              <GripVertical size={16} style={{ color: 'var(--muted)', opacity: 0.4, flexShrink: 0, marginTop: 4 }} />
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="rounded-full flex-shrink-0" style={{ width: 60, height: 60, objectFit: 'cover' }} />
              ) : (
                <div className="rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ width: 60, height: 60, background: 'rgba(240,165,0,.12)', color: 'var(--accent)', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem' }}>
                  {m.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold" style={{ color: 'var(--text)' }}>{m.name}</div>
                <div className="text-xs" style={{ color: 'var(--accent)' }}>{m.role}</div>
                {m.details && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{m.details}</div>}
                {m.bio && <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--muted)' }}>{m.bio}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => openEdit(m)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => deleteMember(m)} style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
