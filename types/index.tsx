export interface Spot {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  criteria: Criteria[];
}

export interface SpotDetail extends Spot {
  image_url: string[];
}

export interface Criteria {
  id: number;
  attribute: string;
}
