import express from "express";
import { getAllDishes, globalSearch, getDishByName, findPossibleDishes } from "./service";
import { authMiddleware } from "../../middleware/auth";

const dishesRouter = express.Router();
dishesRouter.use(authMiddleware);

// Protected routes
dishesRouter.get('/', getAllDishes);
dishesRouter.get('/search', globalSearch);
dishesRouter.get('/:name', getDishByName);
dishesRouter.post('/possible', findPossibleDishes);

export default dishesRouter;


