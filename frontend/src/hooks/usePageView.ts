import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '../services/api';

function getSessionId(): string {
  const key = 'ch_sid';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    analyticsApi.trackPageview(location.pathname, getSessionId()).catch(() => undefined);
  }, [location.pathname]);
}
