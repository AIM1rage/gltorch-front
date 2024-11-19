import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges classnames similarly to clsx, but also resolves conflicting Tailwind CSS classes.
 *
 * @example
 * cn('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')
 * Returns: 'p-3 bg-[#B91C1C] hover:bg-dark-red' (px-2, py-1, and bg-red will be overwritten).
 *
 * @remarks
 * Unlike the classNames function from the classNames package, this function handles conflicting Tailwind CSS classes.
 *
 * @param {...ClassValue[]} inputs - The classnames to merge.
 * @returns {string} The merged classnames.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
