import React from 'react';
import { HeaderItem, QueryParamsItem } from '../types';
import KeyValueInput from './KeyValueInput';
import { formatJson } from '../utils/helpers';

interface RequestPanelProps {
  method: string;
  setMethod: (method: string) => void;
  url: string;
  setUrl: (url: string) => void;
  sendRequest: () => void;
  isLoading: boolean;
  name: string;
  setName: (name: string) => void;
  body: string;
  setBody: (body: string) => void;
  headers: HeaderItem[];
  setHeaders: (headers: HeaderItem[]) => void;
  queryParams: QueryParamsItem[];
  setQueryParams: (queryParams: QueryParamsItem[]) => void;
  globalHeaders: HeaderItem[];
  setGlobalHeaders: (globalHeaders: HeaderItem[]) => void;
  updateGlobalHeadersInDb: (headers: HeaderItem[]) => void;
  bearerToken: string;
  setBearerToken: (token: string) => void;
  style?: React.CSSProperties;
}

const RequestPanel = ({
  method,
  setMethod,
  url,
  setUrl,
  sendRequest,
  isLoading,
  name,
  setName,
  body,
  setBody,
  headers,
  setHeaders,
  queryParams,
  setQueryParams,
  globalHeaders,
  setGlobalHeaders,
  updateGlobalHeadersInDb,
  bearerToken,
  setBearerToken,
  style
}: RequestPanelProps) => {

  const handleFormatBody = () => {
    setBody(formatJson(body));
  };

  return (
    <div className="col-5 d-flex flex-column" style={style}>
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
              <button className="btn btn-sm btn-primary mt-2" onClick={handleFormatBody}>Format JSON</button>
              <textarea className="form-control h-100" placeholder='{ "key": "value" }' value={body} onChange={(e) => setBody(e.target.value)} style={{minHeight: '100px'}}></textarea>
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
  );
};

export default RequestPanel;