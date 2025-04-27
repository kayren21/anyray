import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

const Popup = () => {
  return (
    <div className="popup">
      <img src="icon.png" alt="AnyRay" className="popup-logo" />
      <h1 className="popup-title">Welcome to AnyRay</h1>
      <ul className="popup-instructions">
        <li>Go to any website</li>
        <li className="popup-arrow">⬇</li>
        <li>Activate the extension</li>
        <li className="popup-arrow">⬇</li>
        <li>Select a word or phrase</li>
        <li className="popup-arrow">⬇</li>
        <li>Save it</li>
      </ul>
      <p className="popup-note">
        By default, words will be saved to your default hub. 💡 You can change it in options.
      </p>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Popup />);
