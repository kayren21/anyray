import './popup.css';

const Popup = () => {
  return (
    <div className="popup">
      <h1 className="popup-title">Welcome to AnyRay Extension!</h1>
      <ol className="popup-instructions">
        <li>Go to any website</li>
        <li>Activate the extension</li>
        <li>Select a word or phrase</li>
        <li>Save</li>
      </ol>
      <p className="popup-note">💡 By default, words will be saved to your default hub. You can change it in options.</p>
    </div>
  );
};

export default Popup;
