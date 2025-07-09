import React from 'react';

interface ResponsePanelProps {
  isLoading: boolean;
  responseStatus: number | null;
  responseStatusText: string | null;
  responseTime: number | null;
  responseHeaders: any;
  responseBody: any;
  style?: React.CSSProperties;
}

const ResponsePanel = ({
  isLoading,
  responseStatus,
  responseStatusText,
  responseTime,
  responseHeaders,
  responseBody,
}: ResponsePanelProps) => {
  return (
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
  );
};

export default ResponsePanel;
