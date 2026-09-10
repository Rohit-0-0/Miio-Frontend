'use client';

import React from 'react';
import Image from 'next/image';
import { StayBenefitsSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

function resolveIconSrc(iconImage: any): string | null {
  if (!iconImage) return null;
  const assetId =
    iconImage.assetId ||
    iconImage.asset?._ref ||
    iconImage.asset?._id ||
    iconImage._ref ||
    iconImage._id ||
    iconImage.url;
  return buildImageUrl(assetId);
}

/** Solid Figma badge: 40px terracotta circle with uploaded icon centered */
function BenefitIcon({
  iconImage,
  icon,
  title,
}: {
  iconImage?: any;
  icon?: string;
  title?: string;
}) {
  const src = resolveIconSrc(iconImage);

  return (
    <div
      className="w-10 h-10 rounded-full bg-[#99583D] flex items-center justify-center shrink-0 overflow-hidden"
      aria-hidden
    >
      {src ? (
        <Image
          src={src}
          alt={title || 'Benefit icon'}
          width={20}
          height={20}
          className="object-contain brightness-0 invert"
          unoptimized
        />
      ) : icon ? (
        <span
          className="flex w-5 h-5 items-center justify-center text-white [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-white [&>svg]:fill-none"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      ) : null}
    </div>
  );
}

export function StayBenefits({ benefits }: { benefits: StayBenefitsSection }) {
  if (!benefits || !benefits.items || benefits.items.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-[64px] flex flex-col justify-center items-center overflow-hidden border-b border-[#5F4E441F]">
      {benefits.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <AppImage
            image={benefits.backgroundImage as any}
            alt="Benefits Background"
            className="object-cover"
            fill
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-[188px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px]">
          {benefits.items.map((item, index) => (
            <div
              key={index}
              className="bg-[#FEF6EE] p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col items-center text-center gap-5"
            >
              {(item.iconImage || item.icon) && (
                <BenefitIcon
                  iconImage={item.iconImage}
                  icon={item.icon}
                  title={item.title}
                />
              )}

              <div className="flex flex-col gap-3">
                <h3 className="text-[17px] font-serif text-[#241D19] leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] font-normal text-[#5F4E44] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}