/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format number as compact (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(num: number): string {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(num: number, decimals: number = 1): string {
    return `${num.toFixed(decimals)}%`;
}

/**
 * Format growth rate with sign
 */
export function formatGrowthRate(rate: number): string {
    const sign = rate > 0 ? '+' : '';
    return `${sign}${formatPercentage(rate)}`;
}
