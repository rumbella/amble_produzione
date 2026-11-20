import React from 'react';
import { DEFAULT_SPONSOR, HomeSponsor } from '../types/homepage';

/**
 * Blocco "sponsored by + logo" del player in homepage.
 * La dimensione si regola dalla dashboard (scale); l'altezza segue la larghezza dello schermo.
 */
export function PlayerSponsor({ sponsor }: { sponsor?: HomeSponsor }) {
  const s = sponsor ?? DEFAULT_SPONSOR;
  if (!s.enabled || !s.logoUrl) return null;

  const scale = Math.min(Math.max(s.scale || 1, 0.5), 2);

  const logo = (
    <img
      src={s.logoUrl}
      alt={s.name || 'Sponsor'}
      className="w-auto max-w-[260px] object-contain select-none pointer-events-none"
      style={{ height: `calc(${scale} * clamp(48px, 11vw, 80px))` }}
      referrerPolicy="no-referrer"
    />
  );

  return (
    <div className="flex flex-col items-center">
      {s.label && <span className="text-[9px] tracking-wider text-white/40 font-sans mt-1 mb-1">{s.label}</span>}
      {s.link ? (
        <a
          href={s.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
          title={`Visita ${s.name || s.link.replace(/^https?:\/\/(www\.)?/, '')}`}
        >
          {logo}
        </a>
      ) : (
        <div className="flex items-center justify-center">{logo}</div>
      )}
    </div>
  );
}
