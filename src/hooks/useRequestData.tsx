import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { dbPromise } from '../utils/db';
import { UNSAFE_HEADERS } from '../utils/helpers';
import { HistoryItem, CollectionItem, HeaderItem, QueryParamsItem } from '../types';

const useRequestData = () => {
  const [name, setName] = useState<string>('');
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [headers, setHeaders] = useState<HeaderItem[]>([{ key: '', value: '', enabled: true }]);
  const [queryParams, setQueryParams] = useState<QueryParamsItem[]>([{ key: '', value: '', enabled: true }]);
  const [globalHeaders, setGlobalHeaders] = useState<HeaderItem[]>([]);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<any>(null);
  const [responseBody, setResponseBody] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bearerToken, setBearerToken] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [editingCollectionName, setEditingCollectionName] = useState<string>('');

  const loadData = useCallback(async () => {
    const db = await dbPromise;
    const historyData: HistoryItem[] = await db.getAll('history');
    const collectionsData: CollectionItem[] = await db.getAll('collections');
    const globalHeadersData: HeaderItem[] = await db.getAll('globalHeaders');

    console.log("Loading data...");
    console.log("History data from DB:", historyData);
    console.log("Collections data from DB:", collectionsData);
    console.log("Global Headers data from DB:", globalHeadersData);

    historyData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setHistory(historyData);
    setCollections(collectionsData);
    setGlobalHeaders(globalHeadersData.map(h => ({ ...h, enabled: h.enabled !== false })));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateGlobalHeadersInDb = useCallback(async (updatedHeaders: HeaderItem[]) => {
    const db = await dbPromise;
    const tx = db.transaction('globalHeaders', 'readwrite');
    await tx.store.clear();
    for (const header of updatedHeaders) {
        const { id, ...headerToSave } = header as any;
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

    const combinedHeaders: { [key: string]: string } = {}
    globalHeaders.forEach(h => { if (h.enabled && h.key) combinedHeaders[h.key] = h.value; });
    headers.forEach(h => { if (h.enabled && h.key) combinedHeaders[h.key] = h.value; });

    if (bearerToken) {
      combinedHeaders['Authorization'] = `Bearer ${bearerToken}`;
    }

    const finalHeaders = Object.keys(combinedHeaders)
      .filter(key => !UNSAFE_HEADERS.some(unsafeHeader => unsafeHeader.toLowerCase() === key.toLowerCase()))
      .reduce((acc: { [key: string]: string }, key: string) => { acc[key] = combinedHeaders[key]; return acc; }, {});

    let requestUrl = url;
    const activeQueryParams = queryParams.filter(p => p.enabled && p.key);
    if (activeQueryParams.length > 0) {
      const queryString = activeQueryParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
      requestUrl = `${url}?${queryString}`;
    }

    try {
      const config: any = {
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
        } catch (e: any) {
          console.error("Error parsing JSON body:", e); // More specific error log
          setResponseStatus('Error' as any);
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

      const newHistoryItem: HistoryItem = { name: name || url, method, url, body, headers, queryParams, bearerToken, timestamp: new Date() };

      const db = await dbPromise;
      const allHistory: HistoryItem[] = await db.getAll('history');

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
    } catch (error: any) {
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

  const saveToCollection = async (request: HistoryItem) => {
    const db = await dbPromise;
    const allCollections: CollectionItem[] = await db.getAll('collections');
    
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
    const newCollectionItem: CollectionItem = { ...requestData, name: newName };

    await db.add('collections', newCollectionItem);
    console.log("Collection item added to DB:", newCollectionItem);
    
    // Clear the name field after saving to avoid accidentally reusing it.
    setName(''); 
    
    loadData();
  };

  const loadRequest = (request: HistoryItem | CollectionItem) => {
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

  const deleteHistoryItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this history item?')) {
      const db = await dbPromise;
      await db.delete('history', id);
      console.log("History item deleted from DB:", id);
      loadData();
    }
  };

  const deleteCollectionItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this collection item?')) {
      const db = await dbPromise;
      await db.delete('collections', id);
      console.log("Collection item deleted from DB:", id);
      loadData();
    }
  };

  const startEditingCollectionName = (item: CollectionItem) => {
    setEditingCollectionId(item.id || null);
    setEditingCollectionName(item.name);
  };

  const cancelEditingCollectionName = () => {
    setEditingCollectionId(null);
    setEditingCollectionName('');
  };

  const saveCollectionName = async (id: number) => {
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

  return {
    name, setName, method, setMethod, url, setUrl, body, setBody, headers, setHeaders,
    queryParams, setQueryParams, globalHeaders, setGlobalHeaders, responseStatus,
    setResponseStatus, responseStatusText, setResponseStatusText, responseHeaders,
    setResponseHeaders, responseBody, setResponseBody, history, setHistory,
    collections, setCollections, isLoading, setIsLoading, bearerToken, setBearerToken,
    responseTime, setResponseTime, editingCollectionId, setEditingCollectionId,
    editingCollectionName, setEditingCollectionName,
    loadData, updateGlobalHeadersInDb, sendRequest, saveToCollection, loadRequest,
    deleteHistoryItem, deleteCollectionItem, startEditingCollectionName, cancelEditingCollectionName,
    saveCollectionName
  };
};

export default useRequestData;