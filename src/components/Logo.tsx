// --core
import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// -- Image imports
import logoSmall from '@brand/logo-small-white.svg';
import logoLargeBlack from '@brand/logo-large-black.svg';
import logoLargeWhite from '@brand/logo-large-white.svg';

// -- Constants
const LOGO_VARIANTS = {
  small: {
    src: logoSmall,
    width: 40,
    height: 40,
    alt: "Admit Vault Small Logo",
  },
  medium: {
    src: logoSmall,
    width: 60,
    height: 60,
    alt: "Admit Vault Medium Logo",
  },
  largeBlack: {
    src: logoLargeBlack,
    width: 114,
    height: 32,
    alt: "Admit Vault Large Logo Black",
  },
  largeWhite: {
    src: logoLargeWhite,
    width: 160,
    height: 40,
    alt: "Admit Vault Large Logo White",
  },
} as const;

// -- Types
type LogoVariant = keyof typeof LOGO_VARIANTS;

type LogoProps = {
  /**
   * The variant of the logo to display
   */
  variant: LogoVariant;
  /**
   * The destination URL for the logo link
   */
  href: string;
  /**
   * Optional className for additional styling
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
};

const Logo = memo(function Logo({ variant, href, className, onClick }: LogoProps) {
  const logoConfig = LOGO_VARIANTS[variant];

  // Using array join for better performance than string concatenation
  const baseStyles = [
    'flex',
    'items-center',
    'justify-center',
    'transition',
    'duration-300',
    'relative',
    'hover:scale-95',
    'text-black',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={baseStyles} onClick={onClick} aria-label={logoConfig?.alt}>
      <Image
        src={logoConfig?.src}
        alt={logoConfig?.alt}
        width={logoConfig?.width}
        height={logoConfig?.height}
        priority
        quality={100}
        className="object-contain"
      />
    </Link>
  );
});

// -- Type guard for logo variants
export function isValidLogoVariant(variant: string): variant is LogoVariant {
  return variant in LOGO_VARIANTS;
}

// -- For bundle size optimization, consider exporting specific sizes
export const LOGO_SIZES = {
  small: { width: 40, height: 40 },
  large: { width: 160, height: 40 },
} as const;

// -- Export configurations for external use
export { LOGO_VARIANTS };
export type { LogoVariant, LogoProps };

// -- Add display name for better debugging in production
Logo.displayName = 'Logo';

export default Logo;
