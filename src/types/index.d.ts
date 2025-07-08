export interface HistoryItem {
  id?: number;
  name: string;
  method: string;
  url: string;
  body?: string;
  headers?: HeaderItem[];
  queryParams?: QueryParamsItem[];
  bearerToken?: string;
  timestamp: Date;
}

export interface CollectionItem {
  id?: number;
  name: string;
  method: string;
  url: string;
  body?: string;
  headers?: HeaderItem[];
  queryParams?: QueryParamsItem[];
  bearerToken?: string;
  order?: number;
  timestamp?: Date;
}

export interface HeaderItem {
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryParamsItem {
  key: string;
  value: string;
  enabled: boolean;
}
