import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import './App.scss';

import SettingsModal from './components/SettingsModal';
import HistoryPanel from './components/HistoryPanel';
import CollectionsPanel from './components/CollectionsPanel';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';

import useRequestData from './hooks/useRequestData';

import { getMethodColor, formatTimestamp } from './utils/helpers';
import { openDB } from 'idb';
import { themes, ThemeColors } from './utils/themes';



function App() {
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<string>('Default Light');
  const [uiColors, setUiColors] = useState<ThemeColors>(themes['Default Light']);

  const applyUiColors = useCallback((colors: ThemeColors) => {
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
      '--form-control-bg': colors.background,
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
      '--response-bg': colors.background,
      '--response-text-color': colors.text,
      '--badge-success-bg': colors.success,
      '--badge-warning-bg': colors.warning,
      '--badge-warning-color': colors.text,
      '--badge-info-bg': colors.info,
      '--badge-danger-bg': colors.danger,
      '--text-muted-color': colors.secondary, // Using secondary color for muted text
    };

    for (const [key, value] of Object.entries(derivedColors)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, []);

  const {
    name, setName, method, setMethod, url, setUrl, body, setBody, headers, setHeaders,
    queryParams, setQueryParams, globalHeaders, setGlobalHeaders, responseStatus,
    setResponseStatus, responseStatusText, setResponseStatusText, responseHeaders,
    setResponseHeaders, responseBody, setResponseBody, history, setHistory,
    collections, setCollections, isLoading, setIsLoading, bearerToken, setBearerToken,
    responseTime, setResponseTime, editingCollectionId, setEditingCollectionId,
    editingCollectionName, setEditingCollectionName,
    loadData, updateGlobalHeadersInDb, sendRequest, saveToCollection, loadRequest,
    deleteHistoryItem, deleteCollectionItem, startEditingCollectionName, cancelEditingCollectionName,
    saveCollectionName,
    updateCollectionsOrder
  } = useRequestData();

  const [historyFilter, setHistoryFilter] = useState<string>('');
  const [collectionFilter, setCollectionFilter] = useState<string>('');

  const filteredHistory = history.filter(item =>
    (item.name && item.name.toLowerCase().includes(historyFilter.toLowerCase())) ||
    item.url.toLowerCase().includes(historyFilter.toLowerCase())
  );

  const filteredCollections = collections.filter(item =>
    (item.name && item.name.toLowerCase().includes(collectionFilter.toLowerCase())) ||
    item.url.toLowerCase().includes(collectionFilter.toLowerCase())
  );

  useEffect(() => {
    const loadInitialTheme = async () => {
      const db = await openDB('api-client-db', 4);
      const savedThemeName = await db.get('uiSettings', 'theme');
      if (savedThemeName && themes[savedThemeName.name]) {
        setCurrentTheme(savedThemeName.name);
        setUiColors(themes[savedThemeName.name]);
        applyUiColors(themes[savedThemeName.name]);
      } else {
        applyUiColors(themes['Default Light']);
      }
    };
    loadInitialTheme();
  }, [applyUiColors]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-3">
      <Header setShowSettingsModal={setShowSettingsModal} />

      <div className="row flex-grow-1" style={{ minHeight: 0 }}>
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
            <HistoryPanel 
              history={filteredHistory}
              filter={historyFilter}
              setFilter={setHistoryFilter}
              loadRequest={loadRequest}
              saveToCollection={saveToCollection}
              deleteHistoryItem={deleteHistoryItem}
              getMethodColor={getMethodColor}
              formatTimestamp={formatTimestamp}
            />
            <CollectionsPanel
              collections={filteredCollections}
              filter={collectionFilter}
              setFilter={setCollectionFilter}
              editingCollectionId={editingCollectionId}
              editingCollectionName={editingCollectionName}
              setEditingCollectionName={setEditingCollectionName}
              saveCollectionName={saveCollectionName}
              cancelEditingCollectionName={cancelEditingCollectionName}
              loadRequest={loadRequest}
              startEditingCollectionName={startEditingCollectionName}
              deleteCollectionItem={deleteCollectionItem}
              getMethodColor={getMethodColor}
              updateCollectionsOrder={updateCollectionsOrder}
            />
          </div>
        </div>

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
            <RequestPanel
              method={method}
              setMethod={setMethod}
              url={url}
              setUrl={setUrl}
              sendRequest={sendRequest}
              isLoading={isLoading}
              name={name}
              setName={setName}
              body={body}
              setBody={setBody}
              headers={headers}
              setHeaders={setHeaders}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              globalHeaders={globalHeaders}
              setGlobalHeaders={setGlobalHeaders}
              updateGlobalHeadersInDb={updateGlobalHeadersInDb}
              bearerToken={bearerToken}
              setBearerToken={setBearerToken}
            />
            <ResponsePanel
              isLoading={isLoading}
              responseStatus={responseStatus}
              responseStatusText={responseStatusText}
              responseTime={responseTime}
              responseHeaders={responseHeaders}
              responseBody={responseBody}
            />
          </div>
        </div>
      </div>

      <SettingsModal 
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        setUiColors={setUiColors}
        applyUiColors={applyUiColors}
      />
    </div>
  );
}

export default App;
