/**
 * Utility function to concatenate class names conditionally.
 * @param classes - A list of class names to concatenate.
 * @returns A string of concatenated class names.
 */
export function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}


/**
 * Calculate the Levenshtein distance between two strings.
 * @param a - The first string.
 * @param b - The second string.
 * @returns The Levenshtein distance between the two strings.
 */
export function levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    // Initialize the matrix
    for (let i = 0; i <= a.length; i++) {
        matrix[i] = Array(b.length + 1).fill(0);
        matrix[i][0] = i; // Cost of deletions
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j; // Cost of insertions
    }

    // Populate the matrix
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]; // No operation needed
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,    // Deletion
                    matrix[i][j - 1] + 1,    // Insertion
                    matrix[i - 1][j - 1] + 1  // Substitution
                );
            }
        }
    }

    return matrix[a.length][b.length]; // Return the distance
}