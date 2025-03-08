export interface IndianDish {
  id: string;
  name: string;
  ingredients: string;
  diet: 'vegetarian' | 'non vegetarian';
  prep_time: number;
  cook_time: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
}

export interface SearchQuery {
  name?: string;
  ingredients?: string[];
  state?: string;
  region?: string;
  diet?: 'vegetarian' | 'non vegetarian';
  course?: string;
  flavor_profile?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  diet?: string;
  course?: string;
}

export interface DishFilters {
  diet?: 'vegetarian' | 'non vegetarian';
  course?: string;
  state?: string;
  region?: string;
  flavor_profile?: string;
}
