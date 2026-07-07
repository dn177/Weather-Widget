import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * Provides isOpen state and open/close functions
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
  };
};

export default useModal;