import styles from './Settings.module.css';

/**
 * Settings Page Component
 * User preferences and configuration
 */
const Settings = () => {
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsContent}>
        <h1 className={styles.settingsTitle}>Settings</h1>
        <p className={styles.settingsDescription}>Configure your Contexta experience</p>

        <div className={styles.settingsSection}>
          <h2>🔊 Audio Settings</h2>
          <div className={styles.settingItem}>
            <label>Microphone Sensitivity</label>
            <input type="range" min="0" max="100" defaultValue="50" />
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Enable noise reduction
            </label>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h2>🤖 AI Settings</h2>
          <div className={styles.settingItem}>
            <label>AI Voice Style</label>
            <select>
              <option>Professional</option>
              <option>Casual</option>
              <option>Technical</option>
            </select>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Enable auto-summarization
            </label>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h2>🔒 Privacy Settings</h2>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Save conversation history locally only
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" />
              Share anonymous usage data for improvements
            </label>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h2>🌐 Language</h2>
          <div className={styles.settingItem}>
            <label>Transcription Language</label>
            <select>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>
        </div>

        <button className={styles.saveButton}>Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
