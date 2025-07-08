import React, { useCallback } from 'react';
import { dbPromise } from '../utils/db';
import { themes, ThemeColors, Themes } from '../utils/themes';

interface SettingsModalProps {
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  setUiColors: (colors: ThemeColors) => void;
  applyUiColors: (colors: ThemeColors) => void;
}

function SettingsModal({ showSettingsModal, setShowSettingsModal, currentTheme, setCurrentTheme, setUiColors, applyUiColors }: SettingsModalProps) {

  const saveTheme = useCallback(async (themeName: string) => {
    const db = await dbPromise;
    await db.put('uiSettings', { id: 'theme', name: themeName });
    console.log("Theme saved to DB:", themeName);
  }, []);

  const handleThemeChange = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      const newColors = themes[themeName];
      setUiColors(newColors);
      applyUiColors(newColors);
      saveTheme(themeName);
    }
  };

  const exportData = async () => {
    try {
      const db = await dbPromise;
      const historyData = await db.getAll('history');
      const collectionsData = await db.getAll('collections');
      const globalHeadersData = await db.getAll('globalHeaders');
      const themeName = await db.get('uiSettings', 'theme');

      const exportObject = {
        version: 1,
        timestamp: new Date().toISOString(),
        theme: themeName?.name || 'Default Light',
        history: historyData,
        collections: collectionsData,
        globalHeaders: globalHeadersData,
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `requst_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Data exported successfully.");
    } catch (error: any) {
      console.error("Failed to export data:", error);
      alert("Error exporting data. See console for details.");
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Are you sure you want to import data? This will overwrite all current data.")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.version || !data.history || !data.collections || !data.globalHeaders) {
          throw new Error("Invalid or corrupted backup file.");
        }

        const db = await dbPromise;
        const tx = db.transaction(['history', 'collections', 'globalHeaders', 'uiSettings'], 'readwrite');
        
        await Promise.all([
          tx.objectStore('history').clear(),
          tx.objectStore('collections').clear(),
          tx.objectStore('globalHeaders').clear(),
          tx.objectStore('uiSettings').clear(),
        ]);

        const historyPuts = data.history.map((item: any) => tx.objectStore('history').put(item));
        const collectionsPuts = data.collections.map((item: any) => tx.objectStore('collections').put(item));
        const globalHeadersPuts = data.globalHeaders.map((item: any) => tx.objectStore('globalHeaders').put(item));
        const themePut = tx.objectStore('uiSettings').put({ id: 'theme', name: data.theme });

        await Promise.all([...historyPuts, ...collectionsPuts, ...globalHeadersPuts, themePut]);

        await tx.done;
        console.log("Data imported successfully.");
        alert("Data imported successfully! The application will now reload.");
        window.location.reload(); // Reload to apply all changes
      } catch (error: any) {
        console.error("Failed to import data:", error);
        alert(`Error importing data: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {showSettingsModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document"> 
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">UI Settings</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowSettingsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="theme-select" className="form-label">Select Theme</label>
                  <select id="theme-select" className="form-select" value={currentTheme} onChange={(e) => handleThemeChange(e.target.value)}>
                    {Object.keys(themes).map((themeName: string) => (
                      <option key={themeName} value={themeName}>{themeName}</option>
                    ))}
                  </select>
                </div>
                <hr />
                <div className="mt-4">
                  <h5>Data Management</h5>
                  <p className="text-muted small">Export or import all your data, including history, collections, and settings.</p>
                  <div className="d-flex justify-content-start gap-2">
                    <button className="btn btn-secondary" onClick={exportData}>Export Data</button>
                    <label className="btn btn-secondary">
                      Import Data
                      <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSettingsModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsModal;