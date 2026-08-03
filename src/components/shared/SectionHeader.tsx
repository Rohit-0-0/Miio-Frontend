interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'left',
  className = '',
  dark = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col space-y-6 ${align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'} ${className}`}
    >
      <h2
        className={`text-4xl md:text-5xl font-serif tracking-wide ${dark ? 'text-white' : 'text-[#1B1A17]'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg md:text-xl font-light max-w-2xl ${dark ? 'text-white/80' : 'text-[#1B1A17]/70'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
