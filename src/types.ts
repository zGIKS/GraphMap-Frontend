export interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

export interface CitiesResponse {
  cities: City[];
}
