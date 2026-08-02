import React from 'react';
import { motion } from 'motion/react';

export interface PlayerTickerProps {
  text?: string;
  duration?: number;
  href?: string;
  ctaText?: string;
}

export const PlayerTicker: React.FC<PlayerTickerProps> = ({ 
  text, 
  duration = 45, 
  href = "https://disclaimerofficial.com/", 
  ctaText = "WWW.DISCLAIMEROFFICIAL.COM"
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-full h-[36px] glass-panel overflow-hidden flex items-center shrink-0 mb-[11px] mt-auto border-y border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition-all hover:bg-white/10 group/ticker"
    title={`Visita ${href.replace("https://", "").replace("www.", "")}`}
  >
    <motion.div
      className="whitespace-nowrap inline-block text-[13px] sm:text-[15px] font-space font-black text-white tracking-wider uppercase pl-[100%] group-hover/ticker:text-cyan-400 transition-colors"
      initial={{ x: "0%" }}
      animate={{ x: "-100%" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
    >
      {text ? (
        <>
          {text} &nbsp;&bull;&nbsp; VISITA IL SITO UFFICIALE: {ctaText} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp; VISITA IL SITO UFFICIALE: {ctaText}
        </>
      ) : (
        <>
          Creatività urbana, stile senza compromessi. Esprimi la tua identità con DISCLAIMER &nbsp;&bull;&nbsp; VISITA IL SITO: {ctaText} &nbsp;&bull;&nbsp; "Non chiedere il permesso di essere te stesso." &nbsp;&bull;&nbsp; Chi si veste DISCLAIMER non ha niente da spiegare. &nbsp;&bull;&nbsp; VISITA IL SITO: {ctaText}
        </>
      )}
    </motion.div>
  </a>
);

export default PlayerTicker;
