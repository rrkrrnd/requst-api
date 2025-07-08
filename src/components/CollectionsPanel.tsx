import React from 'react';
import { CollectionItem } from '../types';
import { getMethodColor } from '../utils/helpers';

interface CollectionsPanelProps {
  collections: CollectionItem[];
  editingCollectionId: number | null;
  editingCollectionName: string;
  setEditingCollectionName: (name: string) => void;
  saveCollectionName: (id: number) => void;
  cancelEditingCollectionName: () => void;
  loadRequest: (request: CollectionItem) => void;
  startEditingCollectionName: (item: CollectionItem) => void;
  deleteCollectionItem: (id: number) => void;
  getMethodColor: (method: string) => string;
}

const CollectionsPanel = ({
  collections,
  editingCollectionId,
  editingCollectionName,
  setEditingCollectionName,
  saveCollectionName,
  cancelEditingCollectionName,
  loadRequest,
  startEditingCollectionName,
  deleteCollectionItem,
  getMethodColor,
}: CollectionsPanelProps) => {
  return (
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
                  onKeyDown={(e) => e.key === 'Enter' && saveCollectionName(item.id as number)}
                  autoFocus
                />
                <button className="btn btn-sm btn-success py-0 px-1 me-1" onClick={() => saveCollectionName(item.id as number)}>Save</button>
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
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                      </button>
                  </div>
                  <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={(e) => { e.stopPropagation(); deleteCollectionItem(item.id as number); }}>X</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsPanel;
