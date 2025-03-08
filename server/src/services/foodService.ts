import { IndianDish, SearchQuery, PaginationParams, DishFilters } from '../types/food';

/**
 * Creates a food service instance with the provided dishes data
 * @param dishes - Array of IndianDish objects to be managed
 * @returns Object containing all food service functions
 */
export const createFoodService = (dishes: IndianDish[]) => {
  /**
   * Retrieves all dishes with pagination, sorting and filtering
   */
  const getAllDishes = (params: any): { data: IndianDish[], total: number } => {
    let result = [...dishes];
    
    // Apply filters first
    if (params.diet) {
      console.log('Filtering by diet:', params.diet);
      result = result.filter(dish => {
        const match = dish.diet.toLowerCase() === params.diet.toLowerCase();
        return match;
      });
    }

    if (params.course) {
      console.log('Filtering by course:', params.course);
      result = result.filter(dish => 
        dish.course.toLowerCase() === params.course.toLowerCase()
      );
    }
    
    // Calculate total count after applying filters
    const totalCount = result.length;
    console.log('Total filtered count:', totalCount);
    
    // Apply sorting
    if (params.sortBy) {
      result.sort((a: any, b: any) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        return params.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }
    
    // Apply pagination last
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const paginatedData = result.slice(start, start + limit);
    
    return {
      data: paginatedData,
      total: totalCount  // Return filtered total count
    };
  };

  /**
   * Find a specific dish by name (case-insensitive)
   */
  const getDishByName = (name: string): IndianDish | undefined => {
    return dishes.find(dish => 
      dish.name.toLowerCase() === name.toLowerCase()
    );
  };

 /**
   * Search dishes by name, ingredients, state, or region
   * @param query - Search string to match against dish properties
   * @returns Array of dishes that match any of the search criteria
   */
 const searchDishes = (query: string): IndianDish[] => {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const searchTerms = query.toLowerCase().trim();
  
  if (!searchTerms) {
    return [];
  }

  console.log('Searching dishes with terms:', searchTerms); // Debug log

  return dishes.filter(dish => {
    const matches = (
      dish?.name?.toLowerCase()?.includes(searchTerms) ||
      dish?.ingredients?.toLowerCase()?.includes(searchTerms) ||
      dish?.state?.toLowerCase()?.includes(searchTerms) ||
      dish?.region?.toLowerCase()?.includes(searchTerms)
    );
    
    if (matches) {
      console.log('Found matching dish:', dish.name); // Debug log
    }
    
    return matches;
  });
};

/**
 * Advanced search with multiple criteria
 */
const advancedSearch = (query: SearchQuery): IndianDish[] => {
  return dishes.filter(dish => {
    if (query.name && !dish.name.toLowerCase().includes(query.name.toLowerCase())) {
      return false;
    }
    
    if (query.state && dish.state.toLowerCase() !== query.state.toLowerCase()) {
      return false;
    }
    
    if (query.region && dish.region.toLowerCase() !== query.region.toLowerCase()) {
      return false;
    }
    
    if (query.diet && dish.diet !== query.diet) {
      return false;
    }
    
    if (query.course && dish.course.toLowerCase() !== query.course.toLowerCase()) {
      return false;
    }
    
    if (query.flavor_profile && dish.flavor_profile !== query.flavor_profile) {
      return false;
    }
    
    return true;
  });
};

  /**
   * Find dishes that can be made with given ingredients
   */
  const findPossibleDishes = (ingredients: string[]): IndianDish[] => {
    const normalizedIngredients = ingredients.map(i => i.toLowerCase().trim());
    
    return dishes.filter(dish => {
      const requiredIngredients = dish.ingredients
        .toLowerCase()
        .split(',')
        .map(i => i.trim());
        
      // Check if any required ingredient matches available ingredients
      return requiredIngredients.some(required =>
        normalizedIngredients.some(available => 
          required.includes(available) || available.includes(required)
        )
      );
    });
  };

  /**
   * Filters dishes by their region (e.g., North, South, East, West)
   * @param region - The region to filter by (case-insensitive)
   * @returns Array of IndianDish objects from the specified region
   */
  const getDishesByRegion = (region: string): IndianDish[] => {
    return dishes.filter(dish => dish.region.toLowerCase() === region.toLowerCase());
  };

  /**
   * Filters dishes by their state of origin
   * @param state - The state to filter by (case-insensitive)
   * @returns Array of IndianDish objects from the specified state
   */
  const getDishesByState = (state: string): IndianDish[] => {
    return dishes.filter(dish => dish.state.toLowerCase() === state.toLowerCase());
  };

  /**
   * Filters dishes by their diet type
   * @param diet - The diet type, either 'vegetarian' or 'non vegetarian'
   * @returns Array of IndianDish objects matching the specified diet type
   */
  const getDishesByDiet = (diet: 'vegetarian' | 'non vegetarian'): IndianDish[] => {
    return dishes.filter(dish => dish.diet === diet);
  };

  /**
   * Filters dishes by their course type (e.g., main, dessert, appetizer)
   * @param course - The course type to filter by (case-insensitive)
   * @returns Array of IndianDish objects of the specified course type
   */
  const getDishesByCourse = (course: string): IndianDish[] => {
    return dishes.filter(dish => dish.course.toLowerCase() === course.toLowerCase());
  };

  /**
   * Searches for dishes that contain all specified ingredients
   * @param ingredients - Array of ingredient names to search for
   * @returns Array of IndianDish objects that contain all specified ingredients
   * @example
   * searchByIngredients(['rice', 'milk']) // Returns dishes containing both rice AND milk
   */
  const searchByIngredients = (ingredients: string[]): IndianDish[] => {
    return dishes.filter(dish => {
      const dishIngredients = dish.ingredients.toLowerCase().split(',').map(i => i.trim());
      return ingredients.every(ingredient => 
        dishIngredients.some(di => di.includes(ingredient.toLowerCase()))
      );
    });
  };

  /**
   * Find a specific dish by ID
   */
  const getDishById = (id: string): IndianDish | undefined => {
    return dishes.find(dish => dish.id === id);
  };

  return {
    getAllDishes,
    getDishById,
    getDishByName,
    searchDishes,
    advancedSearch,
    findPossibleDishes,
    getDishesByRegion,
    getDishesByState,
    getDishesByDiet,
    getDishesByCourse,
    searchByIngredients
  };
};