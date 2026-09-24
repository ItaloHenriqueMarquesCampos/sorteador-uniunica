/**
 * Picks a responsive font-size for the drawn name based on character count,
 * so long names shrink (and wrap) instead of growing the page or overflowing
 * their container. Each tier still uses `clamp()` for viewport responsiveness.
 */
export function getResultFontSize(name: string): string {
  const length = name.trim().length

  if (length <= 10) return 'clamp(2.5rem, 9vw, 4.5rem)'
  if (length <= 16) return 'clamp(2.25rem, 7.5vw, 4rem)'
  if (length <= 24) return 'clamp(1.75rem, 6vw, 3.25rem)'
  if (length <= 34) return 'clamp(1.4rem, 5vw, 2.5rem)'
  if (length <= 46) return 'clamp(1.15rem, 4vw, 2rem)'
  return 'clamp(1rem, 3vw, 1.6rem)'
}
