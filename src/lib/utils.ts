/**
 * Utility function to concatenate class names conditionally.
 * @param classes - A list of class names to concatenate.
 * @returns A string of concatenated class names.
 */
export function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}