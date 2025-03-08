
import { createFoodService } from "../../services/foodService";
import { IndianDish } from "../../types/food";
import dishes from "../../common/indian_dishes.json";

const foodService = createFoodService(dishes as IndianDish[]);

const globalSearch = (req, res) => {
  try {
    const query = req.query.query as string;
    if (!query) return res.json([]);
    const results = foodService.searchDishes(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDishByName = (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const dish = foodService.getDishByName(name);

    if (!dish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const findPossibleDishes = (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({ error: "Invalid ingredients array" });
    return;
  }

  const possibleDishes = foodService.findPossibleDishes(ingredients);
  res.json(possibleDishes);
};


// Define route handlers
const getAllDishes = (req, res) => {
    const params = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      diet: req.query.diet as string,
      course: req.query.course as string
    };
    
    const allDishes = foodService.getAllDishes(params);
    res.json(allDishes);
  };

export { globalSearch, getDishByName, findPossibleDishes, getAllDishes };
