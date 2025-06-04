/**
 * Detects the user's browser information
 * @returns An object containing browser name, version, and OS
 */
export function detectBrowser() {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+\.?\d*)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    browserName = 'Samsung Browser';
    browserVersion = userAgent.match(/SamsungBrowser\/(\d+\.?\d*)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/(?:Opera|OPR)[\s\/](\d+\.?\d*)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/Trident\/\d.\d \(.*rv:(\d+\.?\d*)\)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Microsoft Edge';
    browserVersion = userAgent.match(/Edge\/(\d+\.?\d*)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+\.?\d*)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+\.?\d*)/)?.[1] || 'Unknown';
  }

  // Detect OS
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
    if (userAgent.indexOf('Windows NT 10.0') > -1) os = 'Windows 10/11';
    else if (userAgent.indexOf('Windows NT 6.3') > -1) os = 'Windows 8.1';
    else if (userAgent.indexOf('Windows NT 6.2') > -1) os = 'Windows 8';
    else if (userAgent.indexOf('Windows NT 6.1') > -1) os = 'Windows 7';
    else if (userAgent.indexOf('Windows NT 6.0') > -1) os = 'Windows Vista';
    else if (userAgent.indexOf('Windows NT 5.1') > -1) os = 'Windows XP';
    else if (userAgent.indexOf('Windows NT 5.0') > -1) os = 'Windows 2000';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) {
      const version = match[1].replace('_', '.');
      os = `macOS ${version}`;
    }
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
    if (userAgent.indexOf('Ubuntu') > -1) os = 'Ubuntu';
    else if (userAgent.indexOf('Fedora') > -1) os = 'Fedora';
    else if (userAgent.indexOf('Android') > -1) {
      os = 'Android';
      const match = userAgent.match(/Android (\d+\.?\d*)/);
      if (match) os = `Android ${match[1]}`;
    }
  } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1 || userAgent.indexOf('iPod') > -1) {
    os = 'iOS';
    const match = userAgent.match(/OS (\d+_\d+(?:_\d+)?)/);
    if (match) {
      const version = match[1].replace(/_/g, '.');
      os = `iOS ${version}`;
    }
  }

  return {
    browser: browserName,
    version: browserVersion,
    os,
    userAgent: userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isOnline: navigator.onLine,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1' || window.doNotTrack === '1',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    localStorage: typeof window.localStorage !== 'undefined',
    sessionStorage: typeof window.sessionStorage !== 'undefined',
    indexedDB: 'indexedDB' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webWorker: 'Worker' in window,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    })(),
  };
}

/**
 * Gets the current URL information
 * @returns An object containing URL components
 */
export function getCurrentURLInfo() {
  const { href, origin, pathname, search, hash, host, hostname, port, protocol } = window.location;
  
  return {
    href,
    origin,
    pathname,
    search,
    hash,
    host,
    hostname,
    port,
    protocol,
    searchParams: Object.fromEntries(new URLSearchParams(search)),
  };
}

/**
 * Checks if the current device is a mobile device
 * @returns boolean indicating if the device is mobile
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Checks if the current device is a tablet
 * @returns boolean indicating if the device is a tablet
 */
export function isTablet() {
  return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
    navigator.userAgent.toLowerCase()
  );
}

/**
 * Checks if the current device is a desktop
 * @returns boolean indicating if the device is a desktop
 */
export function isDesktop() {
  return !isMobileDevice() && !isTablet();
}

/**
 * Gets the device type (mobile, tablet, or desktop)
 * @returns The device type
 */
export function getDeviceType() {
  if (isMobileDevice()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}

/**
 * Gets the connection information if available
 * @returns Connection information or null if not supported
 */
export function getConnectionInfo() {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
        type: conn.type,
      };
    }
  }
  return null;
}

/**
 * Gets the device memory if available
 * @returns Device memory in GB or null if not supported
 */
export function getDeviceMemory() {
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory;
  }
  return null;
}

/**
 * Gets the number of CPU cores
 * @returns Number of CPU cores
 */
export function getHardwareConcurrency() {
  return navigator.hardwareConcurrency || 1;
}

/**
 * Gets the maximum touch points supported by the device
 * @returns Maximum number of touch points
 */
export function getMaxTouchPoints() {
  return navigator.maxTouchPoints || 0;
}

/**
 * Gets the browser's geolocation if available and permission is granted
 * @returns A promise that resolves to the geolocation or null if not available/denied
 */
export async function getGeolocation(): Promise<GeolocationPosition | null> {
  if (!('geolocation' in navigator)) {
    return null;
  }

  try {
    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  } catch (error) {
    console.error('Error getting geolocation:', error);
    return null;
  }
}

/**
 * Gets the battery status if available
 * @returns A promise that resolves to the battery status or null if not supported
 */
export async function getBatteryStatus(): Promise<BatteryManager | null> {
  if ('getBattery' in navigator) {
    try {
      return await (navigator as any).getBattery();
    } catch (error) {
      console.error('Error getting battery status:', error);
      return null;
    }
  }
  return null;
}

/**
 * Gets the preferred color scheme (light/dark)
 * @returns 'light', 'dark', or 'no-preference'
 */
export function getPreferredColorScheme(): 'light' | 'dark' | 'no-preference' {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'no-preference';
}

/**
 * Gets the preferred reduced motion setting
 * @returns boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets the network status
 * @returns 'online', 'offline', or 'unknown'
 */
export function getNetworkStatus(): 'online' | 'offline' | 'unknown' {
  if ('onLine' in navigator) {
    return navigator.onLine ? 'online' : 'offline';
  }
  return 'unknown';
}

/**
 * Adds a listener for network status changes
 * @param callback - Function to call when network status changes
 * @returns A function to remove the event listener
 */
export function onNetworkStatusChange(
  callback: (status: 'online' | 'offline') => void
): () => void {
  const onlineHandler = () => callback('online');
  const offlineHandler = () => callback('offline');
  
  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);
  
  return () => {
    window.removeEventListener('online', onlineHandler);
    window.removeEventListener('offline', offlineHandler);
  };
}
