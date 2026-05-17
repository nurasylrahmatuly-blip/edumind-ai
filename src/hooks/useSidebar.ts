'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return { isOpen, open, close, toggle };
}
