import React from 'react';
import { motion } from 'motion/react';
import { ContentGrid, MOCK_GRID_ITEMS, MOCK_FEATURED_SLOTS } from './ContentGrid';

export function ExploreView() {
  const handleActionClick = (item: any, actionType: string) => {
    console.log(`Action triggered on item ${item.id}: ${actionType}`);
    // Show a gentle non-blocking alert or log
  };

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 pb-44 md:pb-32 md:pl-[104px]">
        
        {/* Page Header */}
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Scopri
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Esplora le ultime novità visive, promozioni esclusive, DJ set e podcast di RadioAmblé in un unico flusso continuo.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Content Grid Masonry Component */}
        <ContentGrid 
          items={MOCK_GRID_ITEMS}
          featuredSlots={MOCK_FEATURED_SLOTS}
          itemsPerSlot={5}
          onActionClick={handleActionClick}
        />
      </div>
    </motion.main>
  );
}
