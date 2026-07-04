import { useId, type CSSProperties } from 'react';

export interface LogoProps {
  /** Pixel size of the icon (square). Defaults to 32. */
  size?: number;
  /** Render the "up2daite" wordmark next to the icon. */
  withWordmark?: boolean;
  /** Optional className applied to the outer wrapper. */
  className?: string;
}

/**
 * up2daite "Clean Signal" mark.
 *
 * A flat, noisy baseline resolves into one sharp, clean spike (an
 * ECG/waveform peak) capped with a small cyan dot — a literal reading of
 * the tagline "AI signal. No noise." The stroke carries the brand's
 * signature indigo -> violet gradient (135deg equivalent, #6366f1 -> #8b5cf6).
 * Geometry is authored on a 32x32 grid with a bold 3px stroke and rounded
 * caps/joins so it stays crisp and legible down to favicon sizes (16-20px).
 */
export default function Logo({ size = 32, withWordmark = false, className }: LogoProps) {
  const id = useId();
  const gradientId = `grad-${id}`;

  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="up2daite logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="2" y1="30" x2="30" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* flat noise baseline resolving into a single clean spike */}
      <path
        d="M3 18 L8 18 L9.5 15.5 L11 20.5 L12.5 18 L15.5 18 L18 18 L20 6 L22.5 27 L25 18 L29 18"
        stroke={`url(#${gradientId})`}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* signal tip */}
      <circle cx={20} cy={6} r={2} fill="#06b6d4" />
    </svg>
  );

  if (!withWordmark) {
    return (
      <span className={className} style={{ display: 'inline-flex', lineHeight: 0 }}>
        {icon}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}
    >
      {icon}
      <Wordmark fontSize={size * 0.72} />
    </span>
  );
}

/**
 * The "up2daite" wordmark: Space Grotesk, indigo->violet gradient, with the
 * embedded "ai" (up-d[ai]-te) called out in a cyan outline box — tying the
 * name to the product's AI focus and the brand's cyan signal accent.
 */
export function Wordmark({ fontSize = 22 }: { fontSize?: number }) {
  const gradientText: CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };
  return (
    <span
      style={{
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontSize,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={gradientText}>up2d</span>
      <span
        style={{
          color: '#06b6d4',
          WebkitTextFillColor: '#06b6d4',
          border: '0.07em solid #06b6d4',
          borderRadius: '0.18em',
          padding: '0 0.1em',
          margin: '0 0.03em',
        }}
      >
        ai
      </span>
      <span style={gradientText}>te</span>
    </span>
  );
}
