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
  const bothVertical = Boolean(beforeRatio && beforeRatio < 0.95 && afterRatio && afterRatio < 0.95);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // If click originated from any button or slider control, prevent moving the slider
    if ((e.target as HTMLElement).closest('button, .slider-control')) {
      return;
    }
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, .slider-control')) {
      return;
    }
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    };

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

  // Sync with native fullscreen change events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else {
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const selectTab = (idx: number) => {
    setActiveTab(idx);
    setSliderPosition(50);
  };

  if (!activePair.beforeImage && !activePair.afterImage) {
    return null;
  }

  // Determine container aspect ratio based on orientation
  const containerAspectClass = isFullscreen
    ? 'h-full w-full'
    : bothVertical
    ? 'aspect-[4/5] sm:aspect-[3/4] max-w-xl mx-auto'
    : 'aspect-[4/3] md:aspect-[3/2]';

  const isContain = fitMode === 'contain';

  // Dynamic Opacity for Labels:
  // Left side shows AFTER image -> fades out when slider is dragged to the far left (< 15%)
  const afterLabelOpacity = sliderPosition < 15 ? Math.max(0, (sliderPosition - 5) / 10) : 1;
  // Right side shows BEFORE image -> fades out when slider is dragged to the far right (> 85%)
  const beforeLabelOpacity = sliderPosition > 85 ? Math.max(0, (95 - sliderPosition) / 10) : 1;

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

      {/* Before / After Slider Viewport */}
      <div
        ref={containerRef}
        className={`relative w-full ${containerAspectClass} bg-[#1F1915] overflow-hidden cursor-ew-resize select-none rounded-xl transition-all duration-300 shadow-sm`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* BOTTOM LAYER: BEFORE IMAGE (Visible on the RIGHT side of the handle) */}
        {activePair.beforeImage && (
          <>
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

        {/* TOP LAYER: AFTER IMAGE (Visible on the LEFT side of the handle, clipped from right)
            Solid background bg-[#1F1915] guarantees the Before image never bleeds through */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden bg-[#1F1915]"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {activePair.afterImage && (
            <>
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
        </div>

        {/* --- LABELS --- */}
        {/* AFTER LABEL: On TOP-LEFT (identifies the After image on the left) */}
        <div
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black font-sans px-3 py-1 text-xs tracking-widest uppercase rounded shadow-sm z-20 pointer-events-none transition-opacity duration-200"
          style={{ opacity: afterLabelOpacity }}
        >
          After
        </div>

        {/* BEFORE LABEL: On TOP-RIGHT (identifies the Before image on the right) */}
        <div
          className="absolute top-4 right-4 bg-black/75 backdrop-blur-sm text-white font-sans px-3 py-1 text-xs tracking-widest uppercase rounded shadow-sm z-20 pointer-events-none transition-opacity duration-200"
          style={{ opacity: beforeLabelOpacity }}
        >
          Before
        </div>

        {/* FLOATING ACTION CONTROLS: Fit/Fill Toggle & Fullscreen Expand Button */}
        <div className="slider-control absolute bottom-4 right-4 z-30 flex items-center gap-2">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'));
            }}
            title={isContain ? 'Fill container frame' : 'Fit full uncropped image'}
            className="bg-black/70 hover:bg-black/90 text-white/95 hover:text-white px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md border border-white/15 cursor-pointer focus:outline-none"
          >
            {isContain ? (
              <>
                <Shrink className="w-3.5 h-3.5" />
                <span>Fill Frame</span>
              </>
            ) : (
              <>
                <Expand className="w-3.5 h-3.5" />
                <span>Fit Image</span>
              </>
            )}
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            title={isFullscreen ? 'Exit fullscreen' : 'View full screen'}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white/95 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md border border-white/15 cursor-pointer focus:outline-none"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* SLIDER DIVIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl border border-black/10 pointer-events-auto">
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
    </div>
  );
}
