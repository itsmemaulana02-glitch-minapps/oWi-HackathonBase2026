import { cn } from '@/lib/utils'

interface OWiLogoProps {
  className?: string
}

export function OWiLogo({ className }: OWiLogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-primary', className)}
    >
      {/* Outer ring - representing protection/shield */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
      
      {/* Inner gold circle - representing savings */}
      <circle
        cx="20"
        cy="20"
        r="12"
        fill="currentColor"
        opacity="0.2"
      />
      
      {/* Central owl eye - representing AI wisdom */}
      <circle
        cx="20"
        cy="20"
        r="6"
        fill="currentColor"
      />
      
      {/* AI circuit lines */}
      <path
        d="M20 8 L20 14 M20 26 L20 32 M8 20 L14 20 M26 20 L32 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      
      {/* Corner accents */}
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="30" cy="10" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="10" cy="30" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
