// Google Tag Manager tracking helper for Faculty of Mathematics and Matter Sciences
// Container ID: GTM-KL6S2MPW (Linked to https://fmsm.univ-ouargla.dz)

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Tracks a virtual page view inside the SPA for Google Tag Manager & Google Analytics
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_path: pagePath,
      page_title: pageTitle || document.title,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Tracks custom user interactions (clicks, tab switches, file downloads, logins)
 */
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
      timestamp: new Date().toISOString()
    });
  }
}
