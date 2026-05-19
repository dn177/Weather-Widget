import React, { useRef } from 'react';
import AccessibleModal from './AccessibleModal';
import useModal from '../hooks/useModal';

/**
 * Example usage of the AccessibleModal component
 * Shows different use cases and patterns
 */

// Example 1: Basic Modal with text content
export const BasicModalExample = () => {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open} className="btn primary">
        Open Basic Modal
      </button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={close}
        title="Welcome to My Portfolio"
      >
        <p>
          This is a fully accessible modal component with keyboard navigation,
          focus management, and screen reader support.
        </p>
        <p>
          You can close this modal by:
          <ul>
            <li>Clicking the X button</li>
            <li>Pressing the Escape key</li>
            <li>Clicking outside the modal</li>
          </ul>
        </p>
      </AccessibleModal>
    </>
  );
};

// Example 2: Modal with form and custom initial focus
export const FormModalExample = () => {
  const { isOpen, open, close } = useModal();
  const nameInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
    close();
  };

  return (
    <>
      <button onClick={open} className="btn primary">
        Open Contact Form
      </button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={close}
        title="Contact Me"
        initialFocusRef={nameInputRef}
        ariaDescribedBy="contact-form-description"
      >
        <p id="contact-form-description">
          Please fill out this form to get in touch.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              name="name"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              className="form-control"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary">
              Send Message
            </button>
            <button type="button" onClick={close} className="btn light">
              Cancel
            </button>
          </div>
        </form>
      </AccessibleModal>
    </>
  );
};

// Example 3: Image Gallery Modal
export const ImageModalExample = ({ imageSrc, imageAlt, caption }) => {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open} className="image-thumbnail-button">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="thumbnail"
        />
      </button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={close}
        title={imageAlt}
        className="image-modal"
      >
        <figure>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="modal-image"
            style={{ width: '100%', height: 'auto' }}
          />
          {caption && (
            <figcaption className="image-caption">
              {caption}
            </figcaption>
          )}
        </figure>
      </AccessibleModal>
    </>
  );
};

// Example 4: Confirmation Modal
export const ConfirmationModalExample = ({ onConfirm, message }) => {
  const { isOpen, open, close } = useModal();
  const cancelButtonRef = useRef(null);

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <>
      <button onClick={open} className="btn danger">
        Delete Item
      </button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={close}
        title="Confirm Action"
        closeOnClickOutside={false} // Require explicit action
        initialFocusRef={cancelButtonRef}
      >
        <p>{message || 'Are you sure you want to proceed with this action?'}</p>
        <div className="modal-actions">
          <button
            onClick={handleConfirm}
            className="btn danger"
          >
            Yes, Delete
          </button>
          <button
            ref={cancelButtonRef}
            onClick={close}
            className="btn light"
          >
            Cancel
          </button>
        </div>
      </AccessibleModal>
    </>
  );
};

// Example 5: Project Details Modal (for your portfolio)
export const ProjectModalExample = ({ project }) => {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <div 
        className="project-card" 
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${project.title}`}
      >
        <img src={project.thumbnail} alt={project.title} />
        <h3>{project.title}</h3>
      </div>

      <AccessibleModal
        isOpen={isOpen}
        onClose={close}
        title={project.title}
        className="project-modal"
      >
        <div className="project-details">
          <img
            src={project.image}
            alt={project.title}
            className="project-image"
          />
          <div className="project-content">
            <p className="project-description">
              {project.description}
            </p>
            <div className="project-technologies">
              <h3>Technologies Used:</h3>
              <ul>
                {project.technologies.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
            <div className="project-links">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary"
                >
                  View Code
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn light"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </AccessibleModal>
    </>
  );
};

export default {
  BasicModalExample,
  FormModalExample,
  ImageModalExample,
  ConfirmationModalExample,
  ProjectModalExample,
};