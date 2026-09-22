import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Smile, 
  LogOut, 
  Heart, 
  Music, 
  Mic, 
  Disc3, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { DJSET_ITEMS, MOCK_SONGS, getDjSetSongs } from '../data/djsets';
import { MUSIC_PLAYLISTS, PODCAST_ITEMS } from '../data/podcasts';
import { usePlayer } from '../contexts/PlayerContext';

// Beautiful selection of music avatars for quick signups and guest accounts
const PRESET_AVATARS = [
  { name: 'Flamingo Studio', url: 'https://radioamble-cdn.b-cdn.net/avatars/flamingo_studio.png' },
  { name: 'Flamingo Jazz', url: 'https://radioamble-cdn.b-cdn.net/avatars/flamingo_jazz.png' },
  { name: 'Flamingo Reggae', url: 'https://radioamble-cdn.b-cdn.net/avatars/flamingo_reggae.png' },
  { name: 'Flamingo Disco', url: 'https://radioamble-cdn.b-cdn.net/avatars/flamingo_disco.png' },
  { name: 'Flamingo Rock', url: 'https://radioamble-cdn.b-cdn.net/avatars/flamingo_rovk.png' },
  { name: 'Flamingo Street', url: 'https://radioamble-cdn.b-cdn.net/avatars/flamingo_street.png' }
];

export function ProfilePage({ userLikes: propUserLikes, toggleLike: propToggleLike }: { userLikes?: string[], toggleLike?: (id: string) => void }) {
  const player = usePlayer();
  const userLikes = propUserLikes ?? player.userLikes;
  const toggleLike = propToggleLike ?? player.toggleLike;
  const { user, signIn, signInWithEmail, signUpWithEmail, logOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);

  // Status and errors
  const [errorMsg, setErrorMsg] = useState<React.ReactNode>('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Inserisci sia l\'email che la password.');
      return;
    }
    resetMessages();
    setLoading(true);
    try {
      await signInWithEmail(loginEmail, loginPassword);
      setSuccessMsg('Accesso effettuato con successo!');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('auth/operation-not-allowed')) {
        setErrorMsg(
          <div className="text-left flex flex-col gap-2 leading-relaxed">
            <p className="font-bold text-red-400">⚠️ Accesso con Email/Password non abilitato!</p>
            <p>
              I provider classici (Email/Password) sono disattivati su questo progetto Firebase. 
              Per abilitarli sul tuo backend:
            </p>
            <ol className="list-decimal list-inside space-y-1 bg-black/30 p-2.5 rounded text-[11px] font-mono text-gray-300">
              <li>Apri la <a href="https://console.firebase.google.com/project/gen-lang-client-0578122726/authentication/providers" target="_blank" rel="noopener noreferrer" className="underline hover:text-white text-blue-400 font-bold">Console Firebase (Sign-In Providers)</a></li>
              <li>Vai a <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
              <li>Clicca su <strong>Aggiungi nuovo provider</strong> &gt; <strong>E-mail/Password</strong> e salvalo abilitato.</li>
            </ol>
            <p className="mt-1 text-[11px] text-gray-400">
              Nel frattempo, puoi accedere o registrarti istantaneamente cliccando su <strong>ACCEDI / REGISTRATI CON GOOGLE</strong> in alto!
            </p>
          </div>
        );
      } else {
        setErrorMsg(err.message.includes('auth/invalid-credential') 
          ? 'Credenziali non valide. Controlla email e password.' 
          : 'Errore durante l\'accesso: ' + err.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMsg('Tutti i campi sono obbligatori.');
      return;
    }
    resetMessages();
    setLoading(true);
    try {
      await signUpWithEmail(registerEmail, registerPassword, registerName, selectedAvatar);
      setSuccessMsg('Registrazione completata! Ti abbiamo inviato anche un\'email di conferma e verifica all\'indirizzo indicato.');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('auth/operation-not-allowed')) {
        setErrorMsg(
          <div className="text-left flex flex-col gap-2 leading-relaxed">
            <p className="font-bold text-red-400">⚠️ Registrazione con Email/Password non abilitata!</p>
            <p>
              I provider classici (Email/Password) sono disattivati su questo progetto Firebase. 
              Per abilitarli sul tuo backend:
            </p>
            <ol className="list-decimal list-inside space-y-1 bg-black/30 p-2.5 rounded text-[11px] font-mono text-gray-300">
              <li>Apri la <a href="https://console.firebase.google.com/project/gen-lang-client-0578122726/authentication/providers" target="_blank" rel="noopener noreferrer" className="underline hover:text-white text-blue-400 font-bold">Console Firebase (Sign-In Providers)</a></li>
              <li>Vai a <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
              <li>Clicca su <strong>Aggiungi nuovo provider</strong> &gt; <strong>E-mail/Password</strong> e salvalo abilitato.</li>
            </ol>
            <p className="mt-1 text-[11px] text-gray-400">
              Nel frattempo, puoi ordinare l'accesso istantaneo cliccando su <strong>ACCEDI / REGISTRATI CON GOOGLE</strong> in alto!
            </p>
          </div>
        );
      } else {
        setErrorMsg(err.message.includes('auth/email-already-in-use') 
          ? 'Questa email è già registrata.' 
          : 'Errore durante la registrazione: ' + err.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetMessages();
    setLoading(true);
    try {
      await signIn();
      setSuccessMsg('Accesso completato!');
    } catch (err: any) {
      setErrorMsg('Errore: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Maps a liked itemId (e.g. 'playlist_song:1:3') back to an elegant card object
  const getLikedItemDetails = (itemId: string) => {
    if (itemId === 'radio-amble-live') {
      return {
        title: 'Radio Amblè - Diretta Live',
        under: 'Streaming radio in diretta 24/7',
        icon: <Sparkles size={16} className="text-[#ff4646]" />,
        path: '/',
        typeLabel: 'DIRETTA'
      };
    }

    const parts = itemId.split(':');
    if (parts.length < 3) return null;
    const type = parts[0];
    const parentId = Number(parts[1]);
    const songIndex = Number(parts[2]);

    if (type === 'playlist_song') {
      const playlist = MUSIC_PLAYLISTS.find(p => p.id === parentId);
      const song = MOCK_SONGS[songIndex];
      if (!playlist || !song) return null;
      return {
        title: song.title,
        under: `${playlist.title} • ${playlist.author}`,
        icon: <Music size={16} className="text-yellow-400" />,
        path: `/playlist/${parentId}/song/${songIndex}`,
        typeLabel: 'PLAYLIST'
      };
    }

    if (type === 'podcast_episode') {
      const podcast = PODCAST_ITEMS.find(p => p.id === parentId);
      const song = MOCK_SONGS[songIndex];
      if (!podcast || !song) return null;
      return {
        title: song.title,
        under: `${podcast.title} • ${podcast.author}`,
        icon: <Mic size={16} className="text-emerald-400" />,
        path: `/podcast/${parentId}/song/${songIndex}`,
        typeLabel: 'PODCAST'
      };
    }

    if (type === 'djset_track') {
      const djset = DJSET_ITEMS.find(p => p.id === parentId);
      const songs = getDjSetSongs(parentId);
      const song = songs[songIndex];
      if (!djset || !song) return null;
      return {
        title: song.title,
        under: `${djset.title} • ${djset.author}`,
        icon: <Disc3 size={16} className="text-pink-400" />,
        path: `/djset/${parentId}/song/${songIndex}`,
        typeLabel: 'DJ SET'
      };
    }

    return null;
  };

  return (
    <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full min-h-full bg-[#0a0a0a] flex flex-col p-4 sm:p-10 page-top-spacing md:pl-[104px]">
      <div className="w-full max-w-[640px] mx-auto pb-24 md:pb-10 flex flex-col gap-6">
        
        {/* LOGGED IN VIEW */}
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Header profile details */}
            <div className="glass-panel p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Ascoltatore'} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <UserIcon size={36} className="text-white/60" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" title="Attivo" />
              </div>

              <div className="flex-1 flex flex-col">
                <h2 className="font-space font-medium text-2xl text-white tracking-wider">
                  {user.displayName || 'Ascoltatore Amblè'}
                </h2>
                <p className="font-sans text-sm text-white/50 lowercase">
                  {user.email || 'account.anonimo@radioamble.it'}
                </p>
                <div className="mt-2.5 flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 font-space text-white/80 shrink-0 uppercase">
                    Membro Amblè
                  </span>
                </div>
              </div>

              <button 
                onClick={() => logOut()}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-white hover:text-[#ff4646] transition-all flex items-center gap-2 text-xs font-space tracking-widest uppercase mt-4 sm:mt-0"
              >
                <LogOut size={14} />
                ESCI
              </button>
            </div>

            {/* User Likes container */}
            <div className="flex flex-col gap-3">
              <h3 className="font-space text-xs tracking-[0.2em] text-white/50 uppercase pl-1 mt-2">
                I TUOI BRANI PREFERITI ({userLikes.length})
              </h3>
              
              {userLikes.length === 0 ? (
                <div className="glass-panel p-8 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Heart size={20} strokeWidth={1} className="text-white/40" />
                  </div>
                  <p className="font-sans text-white/60 text-sm max-w-sm">
                    Nessun brano salvato nei preferiti. Sfiora l'icona del cuore mentre ascolti musica per ritrovarlo qui!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {userLikes.map((itemId) => {
                    const details = getLikedItemDetails(itemId);
                    if (!details) return null;
                    return (
                      <div 
                        key={itemId}
                        className="glass-panel hover:bg-white/5 p-4 flex items-center gap-4 transition-all group"
                      >
                        {/* Audio Type Icon */}
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          {details.icon}
                        </div>

                        {/* Title and details */}
                        <div 
                          onClick={() => navigate(details.path)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <h4 className="font-sans font-medium text-sm text-white truncate group-hover:text-[#ff462b] transition-colors">
                            {details.title}
                          </h4>
                          <p className="font-sans text-xs text-white/50 truncate">
                            {details.under}
                          </p>
                        </div>

                        {/* Play arrow */}
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-space tracking-wider text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full uppercase">
                            {details.typeLabel}
                          </span>
                          <button 
                            onClick={() => toggleLike(itemId)}
                            className="p-1.5 hover:scale-115 transition-transform text-[#ff4646] hover:text-white/40"
                            title="Rimuovi dai preferiti"
                          >
                            <Heart size={16} strokeWidth={2.5} className="fill-[#ff4646]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* NOT LOGGED IN / REGISTER WIZARD */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel p-6 sm:p-8 flex flex-col"
          >
            <div className="text-center mb-8">
              <h2 className="font-space font-bold text-2xl sm:text-3xl tracking-[0.1em] text-white uppercase">
                Profilo Radio Amblè
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/60 mt-2 max-w-md mx-auto">
                Accedi per salvare i brani, ascoltare i dj set e ricreare la tua atmosfera preferita.
              </p>
            </div>

            {/* Error and Success screens */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 text-xs text-center font-sans">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs text-center font-sans">
                {successMsg}
              </div>
            )}

            {/* Google Authentication (Primary Highlight) */}
            <div className="flex flex-col gap-4 mb-6">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-3 sm:px-4 bg-white hover:bg-white/95 text-[#1a1a1a] font-space tracking-wider text-[11px] sm:text-xs uppercase font-semibold rounded-lg transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2 sm:gap-3 shadow-xl whitespace-nowrap"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                {loading ? 'CONNETTENDO...' : 'ACCEDI / REGISTRATI CON GOOGLE'}
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative px-3 bg-[#0a0a0a] text-[9px] tracking-widest font-space text-white/40 uppercase">
                  oppure usa i dati di accesso
                </span>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-white/10 mb-6 bg-white/5 rounded-lg p-1">
              <button 
                onClick={() => { setActiveTab('login'); resetMessages(); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-space tracking-wider font-light rounded transition-colors uppercase ${activeTab === 'login' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white'}`}
              >
                Accedi
              </button>
              <button 
                onClick={() => { setActiveTab('register'); resetMessages(); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-space tracking-wider font-light rounded transition-colors uppercase ${activeTab === 'register' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white'}`}
              >
                Registrati
              </button>
            </div>

            {/* TAB CONTENT: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] text-white/50 tracking-wider font-light uppercase pl-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-white/40" />
                    <input 
                      type="email" 
                      placeholder="la-tua-email@esempio.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] text-white/50 tracking-wider font-light uppercase pl-1">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-white/40" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-4 bg-white/15 hover:bg-white/20 hover:text-white border border-white/10 text-white font-space tracking-widest text-xs uppercase font-medium rounded-lg transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? 'ACCESSO IN CORSO...' : 'ACCEDI'}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* TAB CONTENT: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] text-white/50 tracking-wider font-light uppercase pl-1">Nome Completo / Nickname</label>
                  <div className="relative">
                    <Smile size={16} className="absolute left-3 top-3.5 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="Il tuo nome sullo schermo"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] text-white/50 tracking-wider font-light uppercase pl-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-white/40" />
                    <input 
                      type="email" 
                      placeholder="la-tua-email@esempio.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] text-white/50 tracking-wider font-light uppercase pl-1">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-white/40" />
                    <input 
                      type="password" 
                      placeholder="Inserisci almeno 6 caratteri"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Avatar Selection Grid */}
                <div className="flex flex-col gap-2 mt-1">
                  <label className="font-space text-[9px] text-white/50 tracking-wider font-light uppercase pl-1">
                    Scegli il tuo Avatar musicale
                  </label>
                  <div className="grid grid-cols-6 gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        key={av.name}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`relative rounded-md overflow-hidden aspect-square border transition-all ${selectedAvatar === av.url ? 'border-white scale-105 shadow-md' : 'border-transparent hover:border-white/30'}`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-4 bg-white/15 hover:bg-white/20 hover:text-white border border-white/10 text-white font-space tracking-widest text-xs uppercase font-medium rounded-lg transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? 'CREAZIONE ACCOUNT...' : 'REGISTRATI'}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

          </motion.div>
        )}

      </div>
    </div>
  );
}
