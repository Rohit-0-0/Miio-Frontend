'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, Minimize2, Expand, Shrink } from 'lucide-react';

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
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
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

  const handleImageLoad = (src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setAspectRatios((prev) => ({ ...prev, [src]: ratio }));
    }
  };

  const beforeRatio = activePair.beforeImage ? aspectRatios[activePair.beforeImage] : undefined;
  const afterRatio = activePair.afterImage ? aspectRatios[activePair.afterImage] : undefined;
  const hasVerticalImage = (beforeRatio && beforeRatio < 0.95) || (afterRatio && afterRatio < 0.95);
  const bothVertical = Boolean(beforeRatio && beforeRatio < 0.95 && afterRatio && afterRatio < 0.95);

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

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const selectTab = (idx: number) => {
    setActiveTab(idx);
    setSliderPosition(50);
  };

  if (!activePair.beforeImage && !activePair.afterImage) {
    return null;
  }

  // Determine container aspect ratio based on orientation
  const containerAspectClass = bothVertical
    ? 'aspect-[4/5] sm:aspect-[3/4] max-w-xl mx-auto'
    : hasVerticalImage && fitMode === 'contain'
    ? 'aspect-[4/3] md:aspect-[16/10]'
    : 'aspect-[4/3] md:aspect-[3/2]';

  const isContain = fitMode === 'contain';

  const sliderBody = (
    <div
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-[85vh] w-[92vw] max-w-7xl' : containerAspectClass} bg-[#1F1915] overflow-hidden cursor-ew-resize select-none rounded-xl transition-[max-width,aspect-ratio] duration-300 shadow-sm`}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* BEFORE IMAGE (Bottom Layer) */}
      {activePair.beforeImage && (
        <>
          {/* Ambient Blurred Backdrop when fitMode is contain */}
          {isContain && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 filter blur-2xl scale-110">
              <Image
                src={activePair.beforeImage}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                aria-hidden="true"
              />
            </div>
          )}
          <Image
            src={activePair.beforeImage}
            alt={activePair.label ? `${activePair.label} - Before` : 'Before'}
            fill
            className={isContain ? 'object-contain' : 'object-cover'}
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1400px"
            priority
            onLoad={(e) => handleImageLoad(activePair.beforeImage, e)}
          />
        </>
      )}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 text-xs tracking-widest uppercase rounded shadow-sm z-10 pointer-events-none">
        Before
      </div>

      {/* AFTER IMAGE (Top Layer - Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {activePair.afterImage && (
          <>
            {/* Ambient Blurred Backdrop when fitMode is contain */}
            {isContain && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 filter blur-2xl scale-110">
                <Image
                  src={activePair.afterImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  aria-hidden="true"
                />
              </div>
            )}
            <Image
              src={activePair.afterImage}
              alt={activePair.label ? `${activePair.label} - After` : 'After'}
              fill
              className={isContain ? 'object-contain' : 'object-cover'}
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1400px"
              priority
              onLoad={(e) => handleImageLoad(activePair.afterImage, e)}
            />
          </>
        )}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-black px-3 py-1 text-xs tracking-widest uppercase rounded shadow-sm z-10 pointer-events-none">
          After
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS: Fit / Cover Toggle & Fullscreen */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'));
          }}
          title={isContain ? 'Fill container frame' : 'Fit full uncropped image'}
          className="bg-black/60 hover:bg-black/85 text-white/90 hover:text-white px-3 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md border border-white/10"
        >
          {isContain ? (
            <>
              <Shrink className="w-3.5 h-3.5" />
              <span>Fill Frame</span>
            </>
          ) : (
            <>
              <Expand className="w-3.5 h-3.5" />
              <span>Fit Full Image</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen((prev) => !prev);
          }}
          title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md border border-white/10"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* SLIDER HANDLE */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl border border-black/10">
          <svg
            className="w-4 h-4 text-[#241D19]"
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
  );

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

      {/* Standard Slider Viewport */}
      {sliderBody}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="w-full max-w-7xl flex items-center justify-between mb-4 text-[#FEF6EE]">
            <p className="text-sm uppercase tracking-widest opacity-80">
              {activePair.label || 'Project Comparison'} — Drag slider to compare
            </p>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-widest"
            >
              Close ✕
            </button>
          </div>
          <div onClick={(e) => e.stopPropagation()}>{sliderBody}</div>
        </div>
      )}
    </div>
  );
}
