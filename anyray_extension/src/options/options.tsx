import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './options.css'; 

const Options = () => {
  const [hubId, setHubId] = useState('');

  useEffect(() => {
    // При открытии страницы подгружаем сохранённый hubId
    chrome.storage.local.get(['hubId'], (result) => {
      if (result.hubId) {
        setHubId(result.hubId);
      }
    });
  }, []);

  const saveHubId = () => {
    chrome.storage.local.set({ hubId }, () => {
      alert('Hub ID saved!');
    });
  };

  return (
    <div className="options-container">
      <h1>Settings</h1>
      <input
        type="text"
        placeholder="Enter your Hub ID"
        value={hubId}
        onChange={(e) => setHubId(e.target.value)}
        className="hub-input"
      />
      <button onClick={saveHubId} className="save-button">
        Save Here
      </button>
    </div>
  );
};

const container = document.getElementById('options-root');
const root = createRoot(container!);
root.render(<Options />);

