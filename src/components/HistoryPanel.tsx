import React from 'react';
import { HistoryItem } from '../types';
import { getMethodColor, formatTimestamp } from '../utils/helpers';

interface HistoryPanelProps {
  history: HistoryItem[];
  filter: string;
  setFilter: (filter: string) => void;
  loadRequest: (request: HistoryItem) => void;
  saveToCollection: (request: HistoryItem) => void;
  deleteHistoryItem: (id: number) => void;
  getMethodColor: (method: string) => string;
  formatTimestamp: (timestamp: Date) => string;
}

const HistoryPanel = ({
  history,
  filter,
  setFilter,
  loadRequest,
  saveToCollection,
  deleteHistoryItem,
  getMethodColor,
  formatTimestamp,
}: HistoryPanelProps) => {
  return (
    <div className="tab-pane fade show active h-100" id="history" role="tabpanel">
      <div className="p-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Filter by name or URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul className="list-group list-group-flush">
        {history.map((item) => (
          <li key={item.id} className="list-group-item list-group-item-action" style={{cursor: 'pointer'}}>
             <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="flex-grow-1" onClick={() => loadRequest(item)}>
                    <div>
                        <span className={`badge bg-${getMethodColor(item.method)} me-2`}>{item.method}</span>
                        <span>{item.name || item.url}</span>
                    </div>
                    <div className="text-muted small mt-1">{formatTimestamp(item.timestamp)}</div>
                </div>
                <div>
                    <button className="btn btn-sm btn-outline-primary py-0 px-1 me-1" title="Save to Collections" onClick={(e) => { e.stopPropagation(); saveToCollection(item); }}>Save</button>
                    <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id as number); }}>X</button>
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;
