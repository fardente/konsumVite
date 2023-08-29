import React, { useState } from 'react';

export default function useModal() {
  const [showModal, setShowModal] = useState(false);

  function toggleModal() {
    setShowModal(showing => !showing);
  }

  function checkKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == 'Escape') {
      event.preventDefault();
      setShowModal(false);
    }
  }

  function RenderModal({ children }: { children: React.ReactNode }) {
    return (
      <div className={`modal ${showModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={toggleModal}></div>
        <div className="modal-content">
          <div className="container m-3">
            <div className="box" onKeyDown={checkKey}>
              {children}
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          onClick={toggleModal}
          aria-label="close"
        ></button>
      </div>
    );
  }

  return { toggleModal, RenderModal };
}
