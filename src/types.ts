export interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

export interface CitiesResponse {
  cities: City[];
}

export interface Edge {
  source: number;
  target: number;
}

export interface EdgesResponse {
  edges: Edge[];
}

export interface GraphSummary {
  num_nodes: number;
  num_edges: number;
}
