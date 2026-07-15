/**
 * Performance monitoring utilities
 * Use these to track and log performance metrics in development
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean;

  constructor() {
    this.enabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG === 'true';
  }

  /**
   * Start measuring a performance metric
   */
  start(metricName: string): void {
    if (!this.enabled) return;

    this.metrics.set(metricName, {
      name: metricName,
      startTime: performance.now(),
    });

    if (performance.mark) {
      performance.mark(`${metricName}-start`);
    }
  }

  /**
   * End measuring a performance metric and log the result
   */
  end(metricName: string): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(metricName);
    if (!metric) {
      console.warn(`[Performance] No start mark found for: ${metricName}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    if (performance.mark && performance.measure) {
      performance.mark(`${metricName}-end`);
      performance.measure(metricName, `${metricName}-start`, `${metricName}-end`);
    }

    console.log(`[Performance] ${metricName}: ${duration.toFixed(2)}ms`);

    return duration;
  }

  /**
   * Log a single point in time
   */
  log(metricName: string, value?: number): void {
    if (!this.enabled) return;

    const time = value ?? performance.now();
    console.log(`[Performance] ${metricName}: ${time.toFixed(2)}ms`);
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  }

  /**
   * Log a summary of all metrics
   */
  logSummary(): void {
    if (!this.enabled) return;

    const metrics = this.getMetrics().filter((m) => m.duration !== undefined);

    if (metrics.length === 0) {
      console.log('[Performance] No metrics recorded');
      return;
    }

    console.group('[Performance Summary]');
    metrics.forEach((metric) => {
      console.log(`${metric.name}: ${metric.duration!.toFixed(2)}ms`);
    });
    console.groupEnd();
  }
}

// Export singleton instance
export const perfMonitor = new PerformanceMonitor();

/**
 * Decorator/wrapper for measuring function execution time
 */
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name?: string
): T {
  const metricName = name || fn.name || 'anonymous';

  return ((...args: Parameters<T>): ReturnType<T> => {
    perfMonitor.start(metricName);
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          perfMonitor.end(metricName);
        }) as ReturnType<T>;
      }

      perfMonitor.end(metricName);
      return result as ReturnType<T>;
    } catch (error) {
      perfMonitor.end(metricName);
      throw error;
    }
  }) as T;
}

/**
 * React hook for measuring component render performance
 */
export function usePerformanceMonitor(componentName: string) {
  if (import.meta.env.DEV) {
    perfMonitor.start(`${componentName}-render`);

    return () => {
      perfMonitor.end(`${componentName}-render`);
    };
  }

  return () => {};
}

// Log performance metrics on page load
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        console.group('[Page Load Performance]');
        console.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
        console.log(`Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
        console.log(`Total Time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
        console.groupEnd();
      }
    }, 0);
  });
}
