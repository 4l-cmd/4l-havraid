"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { KmAdoption } from "@/lib/types";
import { CheckCircle, XCircle, Image, Euro, Mail, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_COLORS = {
  paid: { bg: 'rgba(82,183,136,.12)', color: 'var(--green-light)', label: 'Payé' },
  unpaid: { bg: 'rgba(255,255,255,.04)', color: 'var(--muted)', label: 'En attente' },
};

export default function AdminKm() {
  const [adoptions, setAdoptions] = useState<KmAdoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("km_adoptions").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setAdoptions(data ?? []); setLoading(false); });
  }, []);

  async function togglePaid(a: KmAdoption) {
    const newPaid = !a.paid;
    const { data } = await supabase.from("km_adoptions").update({ paid: newPaid }).eq("id", a.id).select().single();
    if (data) setAdoptions(prev => prev.map(x => x.id === a.id ? data : x));
  }

  async function uploadPhoto(adoption: KmAdoption, file: File) {
    setUploading(adoption.id);
    const ext = file.name.split('.').pop();
    const path = `km/${adoption.id}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
      const { data } = await supabase.from("km_adoptions")
        .update({ photo_url: publicUrl, photo_uploaded: true }).eq("id", adoption.id).select().single();
      if (data) setAdoptions(prev => prev.map(x => x.id === adoption.id ? data : x));
    }
    setUploading(null);
  }

  const paid = adoptions.filter(a => a.paid).length;
  const totalRevenu = adoptions.filter(a => a.paid).reduce((s, a) => s + a.amount, 0);

  if (loading) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          KM ADOPTÉS
        </h2>
        <div className="flex gap-3">
          <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(82,183,136,.15)', color: 'var(--green-light)' }}>
            {paid} payés
          </span>
          <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(240,165,0,.15)', color: 'var(--accent)' }}>
            {totalRevenu}€
          </span>
        </div>
      </div>

      {adoptions.length === 0 ? (
        <div className="card rounded-xl p-8 text-center" style={{ color: 'var(--muted)' }}>
          Aucune adoption de km pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {adoptions.map(a => {
            const s = a.paid ? STATUS_COLORS.paid : STATUS_COLORS.unpaid;
            const isOpen = expanded === a.id;
            return (
              <div key={a.id} className="card rounded-xl overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : a.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>
                        Km #{a.km_number} — {a.user_name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                      {a.photo_uploaded && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(88,166,255,.12)', color: '#58a6ff' }}>
                          📸 Photo envoyée
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      {a.user_email} · {a.amount}€ · {new Date(a.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); togglePaid(a); }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded cursor-pointer transition-all"
                      style={{ background: a.paid ? 'rgba(82,183,136,.15)' : 'rgba(255,255,255,.06)', border: 'none', color: a.paid ? 'var(--green-light)' : 'var(--muted)' }}>
                      {a.paid ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {a.paid ? 'Payé' : 'Marquer payé'}
                    </button>
                    {isOpen ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                          <Mail size={14} /> {a.user_email}
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                          <Euro size={14} /> {a.amount}€ — Km #{a.km_number}
                        </div>
                        {a.message && (
                          <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                            <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{a.message}</span>
                          </div>
                        )}
                        {a.message_public && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--muted)' }}>
                            Message public sur le site
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
                          Photo de soutien (envoyée à {a.user_name})
                        </p>
                        {a.photo_url ? (
                          <div className="space-y-3">
                            <img src={a.photo_url} alt="photo" className="rounded-lg w-full max-w-xs" style={{ maxHeight: 160, objectFit: 'cover' }} />
                            <label className="flex items-center gap-2 text-xs cursor-pointer px-3 py-2 rounded"
                              style={{ background: 'rgba(255,255,255,.06)', color: 'var(--muted)', display: 'inline-flex', border: 'none' }}>
                              <Image size={12} /> Remplacer
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => e.target.files?.[0] && uploadPhoto(a, e.target.files[0])} />
                            </label>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 p-6 rounded-xl cursor-pointer text-center"
                            style={{ border: '1px dashed rgba(255,255,255,.1)', color: 'var(--muted)' }}>
                            {uploading === a.id ? (
                              <span className="text-sm">Upload en cours...</span>
                            ) : (
                              <>
                                <Image size={24} />
                                <span className="text-sm">Uploader une photo de soutien</span>
                                <span className="text-xs">JPG, PNG — envoyée visuellement à l&apos;adoptant</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => e.target.files?.[0] && uploadPhoto(a, e.target.files[0])} />
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
