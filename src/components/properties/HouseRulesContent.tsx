import {
  Camera,
  CigaretteOff,
  Clock,
  Info,
  KeyRound,
  Lock,
  PartyPopper,
  PawPrint,
  Trash2,
  Users,
  VolumeX,
  type LucideIcon,
} from 'lucide-react';
import type { HouseRule, HouseRuleCategory } from '@/types/property';

export const HOUSE_RULE_CATEGORIES: { value: HouseRuleCategory; label: string }[] = [
  { value: 'checkInOut', label: 'Checking in and out' },
  { value: 'duringStay', label: 'During your stay' },
  { value: 'beforeYouLeave', label: 'Before you leave' },
  { value: 'safety', label: 'Safety and property' },
  { value: 'additional', label: 'Additional rules' },
];

const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  key: KeyRound,
  users: Users,
  pets: PawPrint,
  smoking: CigaretteOff,
  party: PartyPopper,
  quiet: VolumeX,
  camera: Camera,
  trash: Trash2,
  lock: Lock,
  info: Info,
};

export function houseRuleCategoryId(category: HouseRuleCategory): string {
  return `house-rules-${category}`;
}

export function groupHouseRules(rules: HouseRule[] = []) {
  return HOUSE_RULE_CATEGORIES.map((category) => ({
    ...category,
    rules: rules.filter((rule) => (rule.category || 'additional') === category.value),
  })).filter((group) => group.rules.length > 0);
}

interface HouseRulesContentProps {
  rules?: HouseRule[];
  intro?: string;
}

export function HouseRulesContent({ rules, intro }: HouseRulesContentProps) {
  const groups = groupHouseRules(rules);
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-12">
      {intro && (
        <div className="flex flex-col gap-3">
          {intro.split(/\n\n+/).map((para, i) => (
            <p key={i} className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] font-light leading-[1.7] whitespace-pre-line">
              {para.trim()}
            </p>
          ))}
        </div>
      )}

      {groups.map((group) => (
        <section key={group.value} id={houseRuleCategoryId(group.value)} className="scroll-mt-32">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1B1A17] leading-tight tracking-tight mb-4">
            {group.label}
          </h2>
          <ul className="border-t border-[#1B1A17]/15">
            {group.rules.map((rule, index) => {
              const Icon = ICONS[rule.icon || ''] || Info;
              return (
                <li key={`${group.value}-${index}`} className="flex gap-4 py-5 border-b border-[#1B1A17]/15">
                  <span className="shrink-0 w-9 h-9 rounded-full border border-[#1B1A17]/20 flex items-center justify-center text-[#1B1A17]">
                    <Icon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1 pt-[6px]">
                    <span className="font-sans text-[15px] md:text-[16px] text-[#1B1A17] leading-snug">{rule.rule}</span>
                    {rule.details && (
                      <span className="font-sans text-[14px] md:text-[15px] text-[#5F4E44] font-light leading-relaxed">
                        {rule.details}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
