import { useEffect, useState } from 'react';

export function useGlobalShortcuts() {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+T (Mac) or Ctrl+T (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 't') {
        event.preventDefault();
        setIsShortcutsOpen(true);
      }

      // Close on Escape
      if (event.key === 'Escape') {
        setIsShortcutsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    isShortcutsOpen,
    setIsShortcutsOpen
  };
}