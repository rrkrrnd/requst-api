import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { openDB } from 'idb';
import logo from './logo.svg';

const dbPromise = openDB('api-client-db', 4, {
  upgrade(db, oldVersion, newVersion, transaction) {
    console.log(`DB upgrade from version ${oldVersion} to ${newVersion}`);
    
    if (!db.objectStoreNames.contains('history')) {
      db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('collections')) {
      db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('globalHeaders')) {
      db.createObjectStore('globalHeaders', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('uiSettings')) {
      db.createObjectStore('uiSettings', { keyPath: 'id' });
    }
  },
});

const UNSAFE_HEADERS = [
    'Accept-Charset', 'Accept-Encoding', 'Access-Control-Request-Headers',
    'Access-Control-Request-Method', 'Connection', 'Content-Length', 'Cookie',
    'Cookie2', 'Date', 'DNT', 'Expect', 'Host', 'Keep-Alive', 'Origin', 'Referer',
    'TE', 'Trailer',
    'Transfer-Encoding', 'Upgrade', 'Via', 'User-Agent',
];

const KeyValueInput = React.memo(({ items, setItems, onUpdate }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    if (onUpdate) onUpdate(newItems);
  };

  const addItem = () => setItems([...items, { key: '', value: '', enabled: true }]);
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    if (onUpdate) onUpdate(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="input-group mb-2">
          <div className="input-group-text">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => handleItemChange(index, 'enabled', e.target.checked)}
            />
          </div>
          <input type="text" className="form-control" placeholder="Key" value={item.key} onChange={(e) => handleItemChange(index, 'key', e.target.value)} />
          <input type="text" className="form-control" placeholder="Value" value={item.value} onChange={(e) => handleItemChange(index, 'value', e.target.value)} />
          <button className="btn btn-outline-danger" onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
      <button className="btn btn-outline-primary" onClick={addItem}>Add Item</button>
    </div>
  );
});

const themes = {
  'Default Light': {
    primary: '#2196f3',
    secondary: '#6c757d',
    background: '#e0f2f7',
    text: '#2c3e50',
    border: '#a7d9ed',
    success: '#4caf50',
    warning: '#ffc107',
    danger: '#f44336',
    info: '#03a9f4',
  },
  'Dark': {
    primary: '#64ffda',
    secondary: '#8892b0',
    background: '#0a192f',
    text: '#ccd6f6',
    border: '#1d3d5d',
    success: '#64ffda',
    warning: '#ffc107',
    danger: '#f44336',
    info: '#03a9f4',
  },
  'Solarized': {
    primary: '#268bd2',
    secondary: '#586e75',
    background: '#fdf6e3',
    text: '#657b83',
    border: '#eee8d5',
    success: '#859900',
    warning: '#b58900',
    danger: '#dc322f',
    info: '#2aa198',
  },
  'Dracula': {
    primary: '#bd93f9',
    secondary: '#6272a4',
    background: '#282a36',
    text: '#f8f8f2',
    border: '#44475a',
    success: '#50fa7b',
    warning: '#f1fa8c',
    danger: '#ff5555',
    info: '#8be9fd',
  },
  'Gruvbox': {
    primary: '#fabd2f',
    secondary: '#a89984',
    background: '#282828',
    text: '#ebdbb2',
    border: '#504945',
    success: '#b8bb26',
    warning: '#fe8019',
    danger: '#cc241d',
    info: '#83a598',
  },
};

function App() {
  const [name, setName] = useState('');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '', enabled: true }]);
  const [queryParams, setQueryParams] = useState([{ key: '', value: '', enabled: true }]);
  const [globalHeaders, setGlobalHeaders] = useState([]);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseStatusText, setResponseStatusText] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [responseBody, setResponseBody] = useState(null);
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bearerToken, setBearerToken] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('Default Light');
  const [uiColors, setUiColors] = useState(themes['Default Light']);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [editingCollectionName, setEditingCollectionName] = useState('');

  // Function to apply UI colors as CSS variables
  const applyUiColors = useCallback((colors) => {
    const derivedColors = {
      '--bg-color': colors.background,
      '--text-color': colors.text,
      '--border-color': colors.border,
      '--nav-link-color': colors.secondary,
      '--nav-link-active-color': colors.primary,
      '--nav-link-active-bg': colors.background,
      '--nav-link-active-border': colors.primary,
      '--tab-content-bg': colors.background,
      '--tab-content-border': colors.border,
      '--list-group-item-bg': colors.background,
      '--list-group-item-border': colors.border,
      '--list-group-item-hover-bg': colors.border,
      '--form-control-bg': '#ffffff',
      '--form-control-color': colors.text,
      '--form-control-border': colors.border,
      '--form-control-focus-border': colors.primary,
      '--btn-primary-bg': colors.primary,
      '--btn-primary-border': colors.primary,
      '--btn-primary-hover-bg': colors.primary, // Simplification, can be improved with color manipulation library
      '--btn-primary-hover-border': colors.primary,
      '--btn-outline-danger-color': colors.danger,
      '--btn-outline-danger-border': colors.danger,
      '--btn-outline-danger-hover-bg': colors.danger,
      '--btn-outline-danger-hover-color': '#ffffff',
      '--btn-outline-primary-color': colors.primary,
      '--btn-outline-primary-border': colors.primary,
      '--btn-outline-primary-hover-bg': colors.primary,
      '--btn-outline-primary-hover-color': '#ffffff',
      '--input-group-text-bg': colors.background,
      '--input-group-text-border': colors.border,
      '--input-group-text-color': colors.text,
      '--response-bg': '#ffffff',
      '--response-text-color': colors.text,
      '--badge-success-bg': colors.success,
      '--badge-warning-bg': colors.warning,
      '--badge-warning-color': colors.text,
      '--badge-info-bg': colors.info,
      '--badge-danger-bg': colors.danger,
    };

    for (const [key, value] of Object.entries(derivedColors)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, []);

  const loadData = useCallback(async () => {
    const db = await dbPromise;
    const historyData = await db.getAll('history');
    const collectionsData = await db.getAll('collections');
    const globalHeadersData = await db.getAll('globalHeaders');
    const savedThemeName = await db.get('uiSettings', 'theme');

    console.log("Loading data...");
    console.log("History data from DB:", historyData);
    console.log("Collections data from DB:", collectionsData);
    console.log("Global Headers data from DB:", globalHeadersData);
    console.log("Saved theme name:", savedThemeName);

    historyData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setHistory(historyData);
    setCollections(collectionsData);
    setGlobalHeaders(globalHeadersData.map(h => ({ ...h, enabled: h.enabled !== false })));
    
    if (savedThemeName && themes[savedThemeName]) {
      setCurrentTheme(savedThemeName);
      setUiColors(themes[savedThemeName]);
      applyUiColors(themes[savedThemeName]);
    } else {
      applyUiColors(uiColors); // Apply default theme if none is saved
    }
  }, [applyUiColors, uiColors]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveTheme = useCallback(async (themeName) => {
    const db = await dbPromise;
    await db.put('uiSettings', { id: 'theme', name: themeName });
    console.log("Theme saved to DB:", themeName);
  }, []);

  const handleThemeChange = (themeName) => {
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
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Error exporting data. See console for details.");
    }
  };

  const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!window.confirm("Are you sure you want to import data? This will overwrite all current data.")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
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

        const historyPuts = data.history.map(item => tx.objectStore('history').put(item));
        const collectionsPuts = data.collections.map(item => tx.objectStore('collections').put(item));
        const globalHeadersPuts = data.globalHeaders.map(item => tx.objectStore('globalHeaders').put(item));
        const themePut = tx.objectStore('uiSettings').put({ id: 'theme', name: data.theme });

        await Promise.all([...historyPuts, ...collectionsPuts, ...globalHeadersPuts, themePut]);

        await tx.done;
        console.log("Data imported successfully.");
        alert("Data imported successfully! The application will now reload.");
        window.location.reload(); // Reload to apply all changes
      } catch (error) {
        console.error("Failed to import data:", error);
        alert(`Error importing data: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  const startEditingCollectionName = (item) => {
    setEditingCollectionId(item.id);
    setEditingCollectionName(item.name);
  };

  const cancelEditingCollectionName = () => {
    setEditingCollectionId(null);
    setEditingCollectionName('');
  };

  const saveCollectionName = async (id) => {
    if (!editingCollectionName.trim()) return;
    const db = await dbPromise;
    const item = await db.get('collections', id);
    if (item) {
      await db.put('collections', { ...item, name: editingCollectionName });
      console.log("Collection name updated:", id);
      cancelEditingCollectionName();
      loadData();
    }
  };

  const updateGlobalHeadersInDb = useCallback(async (updatedHeaders) => {
    const db = await dbPromise;
    const tx = db.transaction('globalHeaders', 'readwrite');
    await tx.store.clear();
    for (const header of updatedHeaders) {
        const { id, ...headerToSave } = header;
        await tx.store.add(headerToSave);
    }
    await tx.done;
    setGlobalHeaders(updatedHeaders.map(h => ({ ...h, enabled: h.enabled !== false })));
  }, []);

  const sendRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseStatusText(null);
    setResponseHeaders(null);
    setResponseBody(null);
    setResponseTime(null);

    const startTime = performance.now();

    const combinedHeaders = {}
    globalHeaders.forEach(h => { if (h.enabled && h.key) combinedHeaders[h.key] = h.value; });
    headers.forEach(h => { if (h.enabled && h.key) combinedHeaders[h.key] = h.value; });

    if (bearerToken) {
      combinedHeaders['Authorization'] = `Bearer ${bearerToken}`;
    }

    const finalHeaders = Object.keys(combinedHeaders)
      .filter(key => !UNSAFE_HEADERS.some(unsafeHeader => unsafeHeader.toLowerCase() === key.toLowerCase()))
      .reduce((acc, key) => { acc[key] = combinedHeaders[key]; return acc; }, {});

    let requestUrl = url;
    const activeQueryParams = queryParams.filter(p => p.enabled && p.key);
    if (activeQueryParams.length > 0) {
      const queryString = activeQueryParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
      requestUrl = `${url}?${queryString}`;
    }

    try {
      const config = {
        method,
        url: requestUrl,
        headers: finalHeaders,
        withCredentials: true,
      };

      console.log("Current body state before sending:", body); // Debugging
      console.log("Current method before sending:", method); // Debugging

      if (body && (method === 'POST' || method === 'PUT')) {
        try {
          config.data = JSON.parse(body);
          console.log("Parsed config.data for POST/PUT:", config.data); // Debugging
        } catch (e) {
          console.error("Error parsing JSON body:", e); // More specific error log
          setResponseStatus('Error');
          setResponseStatusText('Invalid JSON in body');
          setResponseBody({ error: e.message });
          setIsLoading(false);
          return;
        }
      } else if (body && !(method === 'POST' || method === 'PUT')) {
          console.warn("Body is present but method is not POST or PUT. Body might be ignored by server.");
      }
      
      const result = await axios(config);
      const endTime = performance.now();
      setResponseTime(endTime - startTime);

      console.log("Request successful. Axios result:", result);
      setResponseStatus(result.status);
      setResponseStatusText(result.statusText);
      setResponseHeaders(result.headers);
      setResponseBody(result.data);

      const newHistoryItem = { name: name || url, method, url, body, headers, queryParams, bearerToken, timestamp: new Date() };

      const db = await dbPromise;
      const allHistory = await db.getAll('history');

      const existingHistoryItem = allHistory.find(item => 
        item.url === newHistoryItem.url &&
        item.method === newHistoryItem.method &&
        JSON.stringify(item.body) === JSON.stringify(newHistoryItem.body) &&
        JSON.stringify(item.headers) === JSON.stringify(newHistoryItem.headers) &&
        JSON.stringify(item.queryParams) === JSON.stringify(newHistoryItem.queryParams) &&
        item.name === newHistoryItem.name &&
        item.bearerToken === newHistoryItem.bearerToken
      );

      if (existingHistoryItem) {
        await db.put('history', { ...existingHistoryItem, timestamp: newHistoryItem.timestamp });
        console.log("History item timestamp updated in DB:", existingHistoryItem.id);
      } else {
        await db.add('history', newHistoryItem);
        console.log("New history item added to DB:", newHistoryItem);
      }

      loadData();
    } catch (error) {
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      console.error("Request failed. Axios error:", error);
      setResponseStatus(error.response?.status || 'Error');
      setResponseStatusText(error.response?.statusText || error.message);
      setResponseHeaders(error.response?.headers || null);
      setResponseBody(error.response?.data || { error: error.message });
    } finally {
      setIsLoading(false);
      console.log("Loading set to false.");
    }
  };

  const saveToCollection = async (request) => {
    const db = await dbPromise;
    const allCollections = await db.getAll('collections');
    
    // Prioritize the name from the main input field, otherwise use the history item's name.
    let baseName = name.trim() || request.name || request.url;
    let newName = baseName;
    let counter = 1;

    // If the name already exists, find a new name by appending a number.
    while (allCollections.some(item => item.name === newName)) {
        newName = `${baseName} (${counter})`;
        counter++;
    }

    // Create a new object for the collection, ensuring the old 'id' from history is not carried over.
    const { id, ...requestData } = request; 
    const newCollectionItem = { ...requestData, name: newName };

    await db.add('collections', newCollectionItem);
    console.log("Collection item added to DB:", newCollectionItem);
    
    // Clear the name field after saving to avoid accidentally reusing it.
    setName(''); 
    
    loadData();
  };

  const loadRequest = (request) => {
    setName(request.name || '');
    setMethod(request.method);
    setUrl(request.url);
    setBody(request.body || '');
    setHeaders(Array.isArray(request.headers) && request.headers.length > 0 
      ? request.headers.map(h => ({ ...h, enabled: h.enabled !== false }))
      : [{ key: '', value: '', enabled: true }]);
    setQueryParams(Array.isArray(request.queryParams) && request.queryParams.length > 0 
      ? request.queryParams.map(p => ({ ...p, enabled: p.enabled !== false }))
      : [{ key: '', value: '', enabled: true }]);
    setResponseStatus(null);
    setResponseStatusText(null);
    setResponseHeaders(null);
    setResponseBody(null);
  };

  const deleteHistoryItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this history item?')) {
      const db = await dbPromise;
      await db.delete('history', id);
      console.log("History item deleted from DB:", id);
      loadData();
    }
  };

  const deleteCollectionItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection item?')) {
      const db = await dbPromise;
      await db.delete('collections', id);
      console.log("Collection item deleted from DB:", id);
      loadData();
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-3">
      <header className="row-auto d-flex justify-content-center align-items-center position-relative">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Requst Logo" style={{ height: '60px', marginRight: '15px' }} />
          <h1 className="my-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Requst</h1>
        </div>
        <button className="btn btn-link text-decoration-none position-absolute" style={{ right: '20px' }} onClick={() => setShowSettingsModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.17.31a1.464 1.464 0 0 1-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.31-.17a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.17-.31a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.31.17a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
          </svg>
        </button>
      </header>

      <div className="row flex-grow-1" style={{ minHeight: 0 }}>
        {/* History/Collections Panel - 20% */}
        <div className="col-2 border-end d-flex flex-column">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab">History</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" data-bs-toggle="tab" data-bs-target="#collections" type="button" role="tab">Collections</button>
            </li>
          </ul>
          <div className="tab-content overflow-auto flex-grow-1">
            <div className="tab-pane fade show active h-100" id="history" role="tabpanel">
              <ul className="list-group list-group-flush">
                {history.map((item) => (
                  <li key={item.id} className="list-group-item list-group-item-action" style={{cursor: 'pointer'}}>
                     <div className="d-flex w-100 justify-content-between align-items-center">
                        <div className="flex-grow-1" onClick={() => loadRequest(item)}>
                            <div>
                                <span className={`badge bg-${getMethodColor(item.method)} me-2`}>{item.method}</span>
                                <span className="text-truncate" style={{maxWidth: '100px'}}>{item.name || item.url}</span>
                            </div>
                            <div className="text-muted small mt-1">{formatTimestamp(item.timestamp)}</div>
                        </div>
                        <div>
                            <button className="btn btn-sm btn-outline-primary py-0 px-1 me-1" title="Save to Collections" onClick={(e) => { e.stopPropagation(); saveToCollection(item); }}>Save</button>
                            <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}>X</button>
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tab-pane fade h-100" id="collections" role="tabpanel">
              <ul className="list-group list-group-flush">
                {collections.map((item) => (
                  <li key={item.id} className="list-group-item list-group-item-action" style={{cursor: 'pointer'}}>
                    {editingCollectionId === item.id ? (
                      <div className="d-flex align-items-center">
                        <input 
                          type="text" 
                          className="form-control form-control-sm me-2" 
                          value={editingCollectionName} 
                          onChange={(e) => setEditingCollectionName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveCollectionName(item.id)}
                          autoFocus
                        />
                        <button className="btn btn-sm btn-success py-0 px-1 me-1" onClick={() => saveCollectionName(item.id)}>Save</button>
                        <button className="btn btn-sm btn-secondary py-0 px-1" onClick={cancelEditingCollectionName}>Cancel</button>
                      </div>
                    ) : (
                      <div className="d-flex w-100 justify-content-between align-items-center">
                          <div className="flex-grow-1 d-flex align-items-center" onClick={() => loadRequest(item)}>
                              <span className={`badge bg-${getMethodColor(item.method)} me-2`}>{item.method}</span>
                              <span>{item.name}</span>
                              <button className="btn btn-link btn-sm p-0 ms-2" onClick={(e) => { e.stopPropagation(); startEditingCollectionName(item); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                              </button>
                          </div>
                          <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={(e) => { e.stopPropagation(); deleteCollectionItem(item.id); }}>X</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Request/Response Panels - 80% */}
        <div className="col-10 d-flex flex-column">
          <div className="input-group mb-3">
            <select className="form-select flex-grow-0" style={{width: '100px'}} value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>GET</option> <option>POST</option> <option>PUT</option> <option>DELETE</option>
            </select>
            <input type="text" className="form-control" placeholder="https://api.example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button className="btn btn-primary" onClick={sendRequest} disabled={isLoading}>Send</button>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">Name</span>
            <input type="text" className="form-control" placeholder="My API Request" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="row flex-grow-1 request-panels" style={{ minHeight: 0 }}>
            {/* Request Panel - 50% of this col */}
            <div className="col-5 d-flex flex-column">
              <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                      <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#body-content" type="button" role="tab">Body</button>
                  </li>
                  <li className="nav-item" role="presentation">
                      <button className="nav-link" data-bs-toggle="tab" data-bs-target="#headers-content" type="button" role="tab">Headers</button>
                  </li>
                  <li className="nav-item" role="presentation">
                      <button className="nav-link" data-bs-toggle="tab" data-bs-target="#auth-content" type="button" role="tab">Auth</button>
                  </li>
                  <li className="nav-item" role="presentation">
                      <button className="nav-link" data-bs-toggle="tab" data-bs-target="#query-content" type="button" role="tab">Query</button>
                  </li>
                  <li className="nav-item" role="presentation">
                      <button className="nav-link" data-bs-toggle="tab" data-bs-target="#global-headers-content" type="button" role="tab">Global Headers</button>
                  </li>
              </ul>
              <div className="tab-content flex-grow-1 overflow-auto p-2 border-top-0 border h-100">
                  <div className="tab-pane fade show active h-100" id="body-content" role="tabpanel">
                      <textarea className="form-control h-100" placeholder='{ "key": "value" }' value={body} onChange={(e) => setBody(e.target.value)} style={{minHeight: '150px'}}></textarea>
                  </div>
                  <div className="tab-pane fade h-100" id="headers-content" role="tabpanel">
                      <KeyValueInput items={headers} setItems={setHeaders} />
                  </div>
                  <div className="tab-pane fade h-100" id="auth-content" role="tabpanel">
                    <div className="mb-3">
                      <label htmlFor="bearerToken" className="form-label">Bearer Token</label>
                      <input type="text" className="form-control" id="bearerToken" placeholder="Enter Bearer Token" value={bearerToken} onChange={(e) => setBearerToken(e.target.value)} />
                    </div>
                  </div>
                  <div className="tab-pane fade h-100" id="query-content" role="tabpanel">
                      <KeyValueInput items={queryParams} setItems={setQueryParams} />
                  </div>
                  <div className="tab-pane fade h-100" id="global-headers-content" role="tabpanel">
                      <KeyValueInput items={globalHeaders} setItems={setGlobalHeaders} onUpdate={updateGlobalHeadersInDb} />
                  </div>
              </div>
            </div>
            {/* Response Panel - 50% of this col */}
            <div className="col-7 d-flex flex-column">
              <h4 className="mt-2 mt-md-0">Response</h4>
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center flex-grow-1 bg-light border rounded">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : responseStatus ? (
                <div className="d-flex flex-column flex-grow-1"> 
                  <div>
                    <strong>Status:</strong> {responseStatus} {responseStatusText}
                    {responseTime !== null && <span className="ms-3"><strong>Time:</strong> {responseTime.toFixed(2)} ms</span>}
                  </div>
                  <ul className="nav nav-tabs mt-2" role="tablist"> 
                      <li className="nav-item" role="presentation">
                          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#response-body" type="button" role="tab">Body</button>
                      </li>
                      <li className="nav-item" role="presentation">
                          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#response-headers" type="button" role="tab">Headers</button>
                      </li>
                  </ul>
                  <div className="tab-content flex-grow-1 overflow-auto p-2 border-top-0 border h-100"> 
                      <div className="tab-pane fade show active h-100" id="response-body" role="tabpanel">
                          <pre className="bg-light p-2 border rounded overflow-auto flex-grow-1 mt-2 h-100"> 
                              {typeof responseBody === 'object' && responseBody !== null
                                ? JSON.stringify(responseBody, null, 2)
                                : String(responseBody || '')}
                          </pre>
                      </div>
                      <div className="tab-pane fade h-100" id="response-headers" role="tabpanel">
                          <pre className="bg-light p-2 border rounded overflow-auto flex-grow-1 mt-2 h-100"> 
                              {responseHeaders ? JSON.stringify(responseHeaders, null, 2) : ''}
                          </pre>
                      </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center flex-grow-1 bg-light border rounded">
                  <span className="text-muted">Send a request to see the response</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                    {Object.keys(themes).map(themeName => (
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
    </div>
  );
}

const getMethodColor = (method) => {
  switch (method?.toUpperCase()) {
    case 'GET': return 'success';
    case 'POST': return 'warning';
    case 'PUT': return 'info';
    case 'DELETE': return 'danger';
    default: return 'secondary';
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export default App;
