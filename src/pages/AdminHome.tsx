import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Image as ImageIcon, Film, Layers, Plus, Trash2, Save, LogOut } from 'lucide-react';
import { HomeBackground } from '../components/HomeBackground';
import { PlayerSponsor } from '../components/PlayerSponsor';
import { FALLBACK_CONFIG, fetchHomepageConfig } from '../hooks/useHomepageConfig';
import {
  CDN_BASE,
  DEFAULT_SPONSOR,
  detectMediaType,
  HomeSponsor,
  HomeBgMode,
  HomeMediaItem,
  HomeMediaType,
  HomepageConfig,
} from '../types/homepage';

const PW_KEY = 'ra_admin_pw';

const newId = () => Math.random().toString(36).slice(2, 10);

function cleanUrl(raw: string) {
  // Bunny accetta spazi codificati: li sistemiamo noi se si incolla un link "grezzo"
  return raw.trim().replace(/ /g, '%20');
}

function readPw() {
  try {
    return sessionStorage.getItem(PW_KEY) || '';
  } catch {
    return '';
  }
}

async function callApi(password: string, body: unknown) {
  const res = await fetch('/api/homepage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Errore ${res.status}`);
  return data;
}

/* ---------- Login ---------- */

function Login({ onOk }: { onOk: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await callApi(pw, { check: true });
      try {
        sessionStorage.setItem(PW_KEY, pw);
      } catch {
        /* ok anche senza */
      }
      onOk(pw);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0a0a0a] p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="font-space text-white text-xl font-bold tracking-widest">RADIOAMBLÈ · ADMIN</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-lg bg-white/5 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/40"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          disabled={busy || !pw}
          className="w-full rounded-lg bg-white text-black font-bold py-3 disabled:opacity-40"
        >
          {busy ? 'Verifico…' : 'Entra'}
        </button>
      </form>
    </div>
  );
}

/* ---------- Campi riutilizzabili ---------- */

const inputCls =
  'w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:border-white/40 placeholder:text-white/30';

function Thumb({ item }: { item: HomeMediaItem }) {
  if (!item.url) return <div className="w-16 h-24 rounded bg-white/5 shrink-0" />;
  return item.type === 'video' ? (
    <video src={item.url} poster={item.poster} muted playsInline preload="metadata" className="w-16 h-24 object-cover rounded shrink-0 bg-white/5" />
  ) : (
    <img src={item.url} alt="" className="w-16 h-24 object-cover rounded shrink-0 bg-white/5" />
  );
}

function ItemFields({
  item,
  onChange,
  fixedType,
  showDuration,
}: {
  item: HomeMediaItem;
  onChange: (next: HomeMediaItem) => void;
  fixedType?: HomeMediaType;
  showDuration?: boolean;
}) {
  const set = (patch: Partial<HomeMediaItem>) => onChange({ ...item, ...patch });
  const wrongBase = item.url && !item.url.startsWith(CDN_BASE + '/');

  return (
    <div className="flex gap-3 items-start">
      <Thumb item={item} />
      <div className="flex-1 space-y-2 min-w-0">
        <input
          className={inputCls}
          value={item.url}
          placeholder={`${CDN_BASE}/cartella/file.${item.type === 'video' ? 'mp4' : 'jpg'}`}
          onChange={(e) => {
            const url = cleanUrl(e.target.value);
            set(fixedType ? { url } : { url, type: url ? detectMediaType(url) : item.type });
          }}
        />
        {wrongBase && <p className="text-amber-400 text-xs">Il link deve essere di Bunny ({CDN_BASE}/…)</p>}

        <div className="flex flex-wrap gap-2 items-center">
          {!fixedType && (
            <select
              className="rounded-md bg-white/5 border border-white/15 px-2 py-1.5 text-xs text-white"
              value={item.type}
              onChange={(e) => set({ type: e.target.value as HomeMediaType })}
            >
              <option value="image">Immagine</option>
              <option value="video">Video</option>
            </select>
          )}
          {showDuration && (
            <label className="flex items-center gap-1 text-xs text-white/60">
              Secondi
              <input
                type="number"
                min={2}
                max={600}
                className="w-16 rounded-md bg-white/5 border border-white/15 px-2 py-1.5 text-xs text-white"
                value={item.duration ?? ''}
                placeholder={item.type === 'video' ? 'fine' : 'auto'}
                onChange={(e) => set({ duration: e.target.value ? Number(e.target.value) : undefined })}
              />
            </label>
          )}
        </div>

        {item.type === 'video' && (
          <input
            className={inputCls}
            value={item.poster ?? ''}
            placeholder="Poster (immagine Bunny) — consigliato per mobile"
            onChange={(e) => set({ poster: cleanUrl(e.target.value) || undefined })}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Sponsor del player ---------- */

function SponsorFields({ sponsor, onChange }: { sponsor: HomeSponsor; onChange: (s: HomeSponsor) => void }) {
  const set = (patch: Partial<HomeSponsor>) => onChange({ ...sponsor, ...patch });
  const wrongLogo = sponsor.logoUrl && !sponsor.logoUrl.startsWith(CDN_BASE + '/');
  const wrongLink = sponsor.link && !/^https:\/\//.test(sponsor.link);

  return (
    <div className="space-y-3 rounded-lg border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-white/50">Sponsor nel player</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sponsor.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
          {sponsor.enabled ? 'Visibile' : 'Nascosto'}
        </label>
      </div>

      {sponsor.enabled && (
        <>
          <div className="flex gap-3 items-start">
            <div className="w-24 h-16 rounded bg-[#0c0c0e] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {sponsor.logoUrl && <img src={sponsor.logoUrl} alt="" className="max-w-full max-h-full object-contain" />}
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <input
                className={inputCls}
                value={sponsor.logoUrl}
                placeholder={`${CDN_BASE}/sponsor/logo.png`}
                onChange={(e) => set({ logoUrl: cleanUrl(e.target.value) })}
              />
              {wrongLogo && <p className="text-amber-400 text-xs">Il logo deve essere un link Bunny ({CDN_BASE}/…)</p>}
              <p className="text-xs text-white/40">Meglio PNG o SVG con sfondo trasparente e logo chiaro: il player è scuro.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            <input
              className={inputCls}
              value={sponsor.name}
              placeholder="Nome sponsor"
              maxLength={60}
              onChange={(e) => set({ name: e.target.value })}
            />
            <input
              className={inputCls}
              value={sponsor.label}
              placeholder="Testo sopra il logo (es. sponsored by)"
              maxLength={40}
              onChange={(e) => set({ label: e.target.value })}
            />
          </div>

          <input
            className={inputCls}
            value={sponsor.link ?? ''}
            placeholder="https://sito-dello-sponsor.com (facoltativo)"
            onChange={(e) => set({ link: e.target.value.trim() || undefined })}
          />
          {wrongLink && <p className="text-amber-400 text-xs">Il link deve iniziare con https://</p>}

          <label className="block text-xs text-white/60">
            Dimensione logo · {Math.round(sponsor.scale * 100)}%
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={sponsor.scale}
              onChange={(e) => set({ scale: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </label>
        </>
      )}
    </div>
  );
}

/* ---------- Pagina ---------- */

const MODES: { id: HomeBgMode; label: string; Icon: typeof Film }[] = [
  { id: 'video', label: 'Video', Icon: Film },
  { id: 'image', label: 'Immagine', Icon: ImageIcon },
  { id: 'slideshow', label: 'Slideshow', Icon: Layers },
];

function Editor({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [draft, setDraft] = useState<HomepageConfig | null>(null);
  const [bulk, setBulk] = useState('');
  const [status, setStatus] = useState<{ kind: 'ok' | 'warn' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomepageConfig().then((c) => setDraft(c ?? FALLBACK_CONFIG));
  }, []);

  if (!draft) return <div className="h-[100dvh] overflow-y-auto bg-[#0a0a0a] text-white/60 p-8">Carico la configurazione…</div>;

  const update = (patch: Partial<HomepageConfig>) => {
    setDraft({ ...draft, ...patch });
    setStatus(null);
  };

  const slides = draft.slides;
  const setSlide = (i: number, item: HomeMediaItem) => update({ slides: slides.map((s, j) => (j === i ? item : s)) });
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const copy = [...slides];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    update({ slides: copy });
  };
  const remove = (i: number) => update({ slides: slides.filter((_, j) => j !== i) });

  const addBulk = () => {
    const links = bulk
      .split(/\r?\n/)
      .map(cleanUrl)
      .filter(Boolean);
    if (!links.length) return;
    update({
      slides: [...slides, ...links.map((url) => ({ id: newId(), type: detectMediaType(url), url }))],
    });
    setBulk('');
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await callApi(password, draft);
      setDraft(res.config);
      setStatus(
        res.purged
          ? { kind: 'ok', text: 'Salvato. La homepage è aggiornata.' }
          : { kind: 'warn', text: 'Salvato, ma la cache Bunny non è stata svuotata: il cambio può richiedere qualche minuto.' },
      );
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'Password errata') onLogout();
      setStatus({ kind: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // Anteprima: per i video singoli serve almeno il link
  const previewReady =
    (draft.mode === 'image' && draft.image?.url) ||
    (draft.mode === 'video' && draft.video?.url) ||
    (draft.mode === 'slideshow' && slides.some((s) => s.url));

  return (
    <div className="h-[100dvh] overflow-y-auto overscroll-contain bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
        <h1 className="font-space font-bold tracking-widest text-sm">RADIOAMBLÈ · HOMEPAGE</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-white text-black text-sm font-bold px-4 py-2 disabled:opacity-40"
          >
            <Save size={16} /> {saving ? 'Salvo…' : 'Salva e pubblica'}
          </button>
          <button onClick={onLogout} className="p-2 text-white/50 hover:text-white" aria-label="Esci">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {status && (
        <div
          className={`mx-5 mt-4 rounded-md px-4 py-3 text-sm ${
            status.kind === 'ok' ? 'bg-emerald-500/15 text-emerald-300' : status.kind === 'warn' ? 'bg-amber-500/15 text-amber-300' : 'bg-red-500/15 text-red-300'
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_320px] gap-8 p-5">
        <section className="space-y-6 min-w-0">
          {/* Modalità */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/50 mb-2">Sfondo attivo</h2>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => update({ mode: id })}
                  className={`flex flex-col items-center gap-1 rounded-lg border py-3 text-sm ${
                    draft.mode === id ? 'border-white bg-white/10' : 'border-white/15 text-white/60 hover:border-white/40'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-2">
              Le tre impostazioni restano salvate: puoi preparare lo slideshow e attivarlo quando vuoi.
            </p>
          </div>

          {draft.mode === 'video' && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-white/50">Video in loop</h2>
              <ItemFields
                fixedType="video"
                item={draft.video ?? { id: newId(), type: 'video', url: '' }}
                onChange={(video) => update({ video: video.url ? video : undefined })}
              />
            </div>
          )}

          {draft.mode === 'image' && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-white/50">Immagine fissa</h2>
              <ItemFields
                fixedType="image"
                item={draft.image ?? { id: newId(), type: 'image', url: '' }}
                onChange={(image) => update({ image: image.url ? image : undefined })}
              />
            </div>
          )}

          {draft.mode === 'slideshow' && (
            <div className="space-y-4">
              <div className="flex items-end gap-4 flex-wrap">
                <label className="text-xs text-white/60">
                  Secondi per immagine
                  <input
                    type="number"
                    min={3}
                    max={120}
                    value={draft.imageDuration}
                    onChange={(e) => update({ imageDuration: Number(e.target.value) || 10 })}
                    className="block mt-1 w-24 rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white"
                  />
                </label>
                <p className="text-xs text-white/40 flex-1 min-w-[200px]">
                  I video passano alla slide successiva quando finiscono, oppure dopo i secondi che imposti.
                  Solo immagini = transizione "liquida" attuale; con video = dissolvenza.
                </p>
              </div>

              <ol className="space-y-3">
                {slides.map((s, i) => (
                  <li key={s.id} className="rounded-lg border border-white/10 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/40">#{i + 1}</span>
                      <div className="flex gap-1">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-white/60 disabled:opacity-20" aria-label="Su">
                          <ArrowUp size={16} />
                        </button>
                        <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="p-1.5 text-white/60 disabled:opacity-20" aria-label="Giù">
                          <ArrowDown size={16} />
                        </button>
                        <button onClick={() => remove(i)} className="p-1.5 text-red-400/80" aria-label="Elimina">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <ItemFields item={s} onChange={(next) => setSlide(i, next)} showDuration />
                  </li>
                ))}
              </ol>

              <div className="space-y-2">
                <textarea
                  value={bulk}
                  onChange={(e) => setBulk(e.target.value)}
                  rows={3}
                  placeholder="Incolla uno o più link Bunny (uno per riga): immagini e video, il tipo si riconosce da solo"
                  className={inputCls}
                />
                <button
                  onClick={addBulk}
                  disabled={!bulk.trim()}
                  className="flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm disabled:opacity-30"
                >
                  <Plus size={16} /> Aggiungi allo slideshow
                </button>
              </div>
            </div>
          )}

          {/* Scurimento */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/50 mb-2">
              Scurimento sfondo · {Math.round(draft.overlay * 100)}%
            </h2>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={draft.overlay}
              onChange={(e) => update({ overlay: Number(e.target.value) })}
              className="w-full"
            />
            <p className="text-xs text-white/40 mt-1">Alza se testi e player si leggono male sopra lo sfondo.</p>
          </div>

          <SponsorFields
            sponsor={draft.sponsor ?? DEFAULT_SPONSOR}
            onChange={(sponsor) => update({ sponsor })}
          />

          {draft.updatedAt && (
            <p className="text-xs text-white/30">Ultimo salvataggio: {new Date(draft.updatedAt).toLocaleString('it-IT')}</p>
          )}
        </section>

        {/* Anteprima telefono */}
        <aside className="md:sticky md:top-20 self-start">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-2">Anteprima (non ancora pubblicata)</h2>
          <div className="relative w-full max-w-[300px] aspect-[9/19] rounded-[28px] overflow-hidden border border-white/15 bg-black">
            {previewReady ? (
              <HomeBackground config={draft} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white/30 p-6 text-center">
                Inserisci un link per vedere l'anteprima
              </div>
            )}
            {/* Player semplificato, per vedere il logo sponsor sopra lo sfondo */}
            <div className="absolute inset-x-3 bottom-8 rounded-xl bg-[#0c0c0e]/45 backdrop-blur-md border border-white/15 px-3 py-3 flex flex-col items-center text-center">
              <PlayerSponsor sponsor={draft.sponsor ?? DEFAULT_SPONSOR} />
              <p className="font-sans text-[8px] tracking-[0.15em] text-white/70 uppercase mt-1">radio amblè live</p>
              <div className="mt-2 w-9 h-9 rounded-full bg-white" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function AdminHome() {
  const [password, setPassword] = useState(readPw);

  const logout = () => {
    try {
      sessionStorage.removeItem(PW_KEY);
    } catch {
      /* niente */
    }
    setPassword('');
  };

  return password ? <Editor password={password} onLogout={logout} /> : <Login onOk={setPassword} />;
}
