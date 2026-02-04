interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
  textClassName?: string;
  ring?: boolean;
  ringClassName?: string;
  presence?: boolean;
  presenceStatus?: 'active' | 'busy' | 'blocked' | 'idle';
  presenceClassName?: string;
}

const isImageSrc = (src?: string) => {
  if (!src) return false;
  if (src.startsWith('data:image')) return true;
  if (src.startsWith('http')) return true;
  if (src.startsWith('/avatars/')) return true;
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(src);
};

export default function Avatar({
  src,
  alt,
  className = 'w-8 h-8 rounded-md',
  fallback = 'A',
  textClassName = 'text-sm',
  ring = false,
  ringClassName = 'bg-gradient-to-br from-brand/40 to-brand/10',
  presence = false,
  presenceStatus = 'active',
  presenceClassName,
}: AvatarProps) {
  const presenceStyles: Record<string, string> = {
    active: 'bg-success shadow-[0_0_0_4px_rgba(47,125,75,0.18)]',
    busy: 'bg-primary-400 shadow-[0_0_0_4px_rgba(74,127,224,0.18)]',
    blocked: 'bg-error shadow-[0_0_0_4px_rgba(193,70,63,0.18)]',
    idle: 'bg-primary-300 shadow-[0_0_0_4px_rgba(154,152,146,0.18)]',
  };
  const presenceColor = presenceStyles[presenceStatus] || presenceStyles.active;

  const presenceClasses =
    presenceClassName ||
    `absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-bg-elevated ${presenceColor}`;

  const wrapperClasses = `relative inline-flex shrink-0 ${className}`;

  if (isImageSrc(src)) {
    return (
      <span className={wrapperClasses}>
        {ring && (
          <span className={`absolute -inset-[2px] rounded-full ${ringClassName}`} />
        )}
        <span className="relative z-10 inline-flex w-full h-full overflow-hidden rounded-[inherit] border border-border bg-bg-tertiary">
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
          />
        </span>
        {presence && <span className={presenceClasses} />}
      </span>
    );
  }

  return (
    <span className={wrapperClasses}>
      {ring && (
        <span className={`absolute -inset-[2px] rounded-full ${ringClassName}`} />
      )}
      <span
        className={`relative z-10 inline-flex w-full h-full items-center justify-center overflow-hidden rounded-[inherit] border border-border bg-bg-tertiary font-medium text-text-secondary ${textClassName}`}
      >
        {fallback}
      </span>
      {presence && <span className={presenceClasses} />}
    </span>
  );
}
