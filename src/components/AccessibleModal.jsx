import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "./accessibleModal.css";

/**
 * Fully accessible modal component with:
 * - Focus management and trap
 * - Keyboard support (Escape, Tab)
 * - ARIA attributes
 * - Screen reader announcements
 * - Smooth animations
 * - Body scroll lock
 * - Click outside to close
 * - Portal rendering
 */

const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnClickOutside = true,
  closeOnEscape = true,
  className = "",
  showCloseButton = true,
  ariaDescribedBy,
  initialFocusRef,
  headerKicker,
}) => {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  // Per-instance id so multiple mounted modals (e.g. several case-study
  // cards, each owning an AccessibleModal) never collide on "modal-title".
  const titleId = `modal-title-${useId()}`;

  // Handle closing animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match CSS transition duration
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previouslyFocusedElement.current = document.activeElement;

    // Focus management
    const focusTarget = initialFocusRef?.current || closeButtonRef.current;
    // Small delay to ensure modal is rendered
    const focusTimeout = setTimeout(() => {
      focusTarget?.focus();
    }, 50);

    // Handle escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEscape) {
        handleClose();
        return;
      }

      // Tab trap
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Return focus to previously focused element
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, closeOnEscape, handleClose, initialFocusRef]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`modal-backdrop ${isClosing ? "modal-closing" : ""} ${(className.includes("pixelperfect") || className.includes("image")) && !className.includes("portfolio") ? "modal-backdrop-dark" : ""}`}
      onMouseDown={(e) => {
        // Only close if the mousedown was directly on the backdrop
        if (closeOnClickOutside && e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-dialog ${className} ${isClosing ? "modal-dialog-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" data-kicker={headerKicker || undefined}>
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>
          {showCloseButton && (
            <button
              ref={closeButtonRef}
              className="modal-close"
              onClick={handleClose}
              aria-label={t("a11y.closeModal")}
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  // Render in portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};

export default AccessibleModal;
