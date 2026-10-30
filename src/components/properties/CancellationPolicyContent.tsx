import { PortableTextBody } from '@/components/legal/PortableTextBody';
import type { CancellationPolicy } from '@/types/property';

export const CANCELLATION_SECTIONS = {
  timeline: 'refund-timeline',
  details: 'additional-terms',
};

export function CancellationPolicyContent({ policy }: { policy?: CancellationPolicy | null }) {
  if (!policy) return null;
  const tiers = policy.tiers || [];

  return (
    <div className="flex flex-col gap-12">
      {(policy.summary || policy.intro) && (
        <div className="flex flex-col gap-4">
          {policy.summary && (
            <p className="font-sans text-[16px] md:text-[18px] text-[#1B1A17] leading-[1.5]">{policy.summary}</p>
          )}
          {policy.intro && (
            <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] font-light leading-[1.7]">{policy.intro}</p>
          )}
        </div>
      )}

      {tiers.length > 0 && (
        <section id={CANCELLATION_SECTIONS.timeline} className="scroll-mt-32">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1B1A17] leading-tight tracking-tight mb-6">
            Refund timeline
          </h2>
          <ol className="relative border-l border-[#1B1A17]/15 ml-[7px]">
            {tiers.map((tier, index) => (
              <li key={`${tier.title}-${index}`} className="relative pl-8 pb-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[8px] top-[5px] w-[15px] h-[15px] rounded-full border border-[#1B1A17]/30 bg-[#FEF6EE]"
                />
                {tier.timeframe && (
                  <div className="text-[13px] font-medium uppercase tracking-widest text-[#7D7975] mb-2">
                    {tier.timeframe}
                  </div>
                )}
                <div className="font-sans text-[16px] md:text-[18px] text-[#1B1A17] leading-snug">{tier.title}</div>
                {tier.details && (
                  <p className="mt-2 font-sans text-[14px] md:text-[15px] text-[#5F4E44] font-light leading-relaxed">
                    {tier.details}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {policy.details && policy.details.length > 0 && (
        <section id={CANCELLATION_SECTIONS.details} className="scroll-mt-32">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1B1A17] leading-tight tracking-tight mb-6">
            Additional terms
          </h2>
          <PortableTextBody value={policy.details} />
        </section>
      )}
    </div>
  );
}
