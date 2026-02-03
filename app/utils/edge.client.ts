/**
 * GLOBAL EDGE OPTIMIZATION ENGINE
 * Orchestrates high-performance media delivery and kinetic caching.
 */

interface OptimizationParams {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
    blur?: number;
}

/**
 * OPTIMIZE MEDIA URL
 * Transforms a raw vision URL into an edge-optimized transmission.
 */
export function optimizeMediaUrl(url: string, params: OptimizationParams = {}): string {
    if (!url || !url.includes('visions.efans.workers.dev')) return url;

    const { width, quality = 85, format = 'auto', blur } = params;
    const searchParams = new URLSearchParams();

    if (width) searchParams.append('w', width.toString());
    if (quality) searchParams.append('q', quality.toString());
    if (format) searchParams.append('f', format);
    if (blur) searchParams.append('b', blur.toString());

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
}

/**
 * KINETIC PRELOAD
 * Pre-warms the edge cache for anticipated vision consumption.
 */
export function preloadVision(url: string) {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.src = optimizeMediaUrl(url, { width: 1200, quality: 90 });
}
