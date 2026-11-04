'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export interface ComparisonItem {
  label?: string;
  beforeImage: string;
  afterImage: string;
}

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  comparisons?: ComparisonItem[];
}

export function BeforeAfterSlider({ beforeImage, afterImage, comparisons }: BeforeAfterSliderProps) {
  const validComparisons: ComparisonItem[] = (comparisons || []).filter(
    (c) => Boolean(c?.beforeImage) && Boolean(c?.afterImage)
  );

  const hasMultiple = validComparisons.length > 1;

  const [activeTab, setActiveTab] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Active comparison pair
  const activePair: ComparisonItem = validComparisons.length > 0
    ? validComparisons[activeTab] || validComparisons[0]
    : {
        beforeImage: beforeImage || '',
        afterImage: afterImage || '',
        label: undefined,
      };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!isDragging) return;
    handleMove((e as MouseEvent).clientX);
  };

  const handleTouchMove = (e: TouchEvent | React.TouchEvent) => {
    if (!isDragging) return;
    handleMove((e as TouchEvent).touches[0].clientX);
  };

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  const selectTab = (idx: number) => {
    setActiveTab(idx);
    setSliderPosition(50);
  };

  if (!activePair.beforeImage && !activePair.afterImage) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4 font-[family-name:var(--font-instrument-sans)]">
      {/* Space / Room Switcher Tabs when multiple comparisons exist */}
      {hasMultiple && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {validComparisons.map((item, idx) => {
            const isActive = activeTab === idx;
            const labelText = item.label || `Space ${idx + 1}`;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectTab(idx)}
                className={`font-sans text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'bg-[#241D19] text-[#FEF6EE] border-[#241D19]'
                    : 'bg-transparent text-[#241D19]/70 border-[#241D19]/25 hover:border-[#241D19] hover:text-[#241D19]'
                }`}
              >
                {labelText}
              </button>
            );
          })}
        </div>
      )}

      {/* Before / After Slider Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video md:aspect-[21/9] bg-[#E8E1DA] overflow-hidden cursor-ew-resize select-none rounded-xl"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* BEFORE IMAGE (Bottom) */}
        {activePair.beforeImage && (
          <Image
            src={activePair.beforeImage}
            alt={activePair.label ? `${activePair.label} - Before` : 'Before'}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 text-xs tracking-widest uppercase rounded">
          Before
        </div>

        {/* AFTER IMAGE (Top - Clipped) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {activePair.afterImage && (
            <Image
              src={activePair.afterImage}
              alt={activePair.label ? `${activePair.label} - After` : 'After'}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 text-xs tracking-widest uppercase rounded">
            After
          </div>
        </div>

        {/* SLIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.4)]"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-black/10">
            <svg
              className="w-4 h-4 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                transform="rotate(90 12 12)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
