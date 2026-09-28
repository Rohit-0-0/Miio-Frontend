import React from 'react';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import type { ImageAsset } from '@/types/common';

interface PaymentLogosProps {
  images?: ImageAsset[];
  className?: string;
  iconClassName?: string;
  textColorClass?: string;
  isFooter?: boolean;
}

export function PaymentLogos({
  images,
  className = '',
  iconClassName = '',
  textColorClass = 'text-[#7D7975]',
  isFooter = false
}: PaymentLogosProps) {

  if (images && images.length > 0) {
    return (
      <div className={`flex flex-wrap items-center w-full ${isFooter ? 'gap-4 md:gap-6 justify-center md:justify-start' : 'gap-2 justify-center mt-5'} ${className}`}>

        {/* Uploaded Partner Logos */}
        {images.map((img: ImageAsset, idx: number) => {
          const resolvedAssetId = img?.assetId || (img as any)?.asset?._ref || (img as any)?.asset?._id || (img as any)?._ref || (img as any)?._id || (img as any)?.url;
          if (!resolvedAssetId) return null;
          const src = buildImageUrl(resolvedAssetId);
          if (!src) return null;

          return (
            <div
              key={idx}
              className="flex items-center justify-center shrink-0"
            >
              <img
                src={src}
                alt={img.alt || `Payment Logo ${idx + 1}`}
                className={isFooter
                  ? (idx === 0 ? 'h-[27px] w-auto object-contain' : 'h-[52px] w-auto object-contain')
                  : (idx === 0 ? 'h-[15px] w-auto object-contain' : 'h-[28px] w-auto object-contain')
                }
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center w-full uppercase ${isFooter ? 'justify-center md:justify-start gap-4 md:gap-6 text-xs font-sans text-white/70' : `justify-center gap-3 text-[9px] tracking-[0.08em] ${textColorClass} mt-5`} ${className}`}>
      {isFooter ? (
        <div className="flex items-center gap-1.5 text-white mr-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold tracking-wider text-[10px]">SECURE CHECKOUT</span>
        </div>
      ) : (
        <>
          <span className="font-medium shrink-0">Secure checkout</span>
          <span className="opacity-40 shrink-0">·</span>
        </>
      )}
      <div className={isFooter ? "flex items-center h-[28px] text-[10px] font-bold text-white" : "shrink-0"}>Apple Pay</div>
      <div className={isFooter ? "flex items-center h-[28px] text-[10px] font-bold text-blue-400" : "shrink-0"}>Amex</div>
      <div className={isFooter ? "flex items-center h-[28px] text-[10px] font-bold text-red-400" : "shrink-0"}>Mastercard</div>
      <div className={isFooter ? "flex items-center h-[28px] text-[10px] font-bold italic text-white" : "shrink-0"}>Visa</div>
    </div>
  );
}
