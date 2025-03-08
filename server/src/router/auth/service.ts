import { Request, Response } from 'express';
import { createAuthService } from '../../services/authService';
const authService = createAuthService();

const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
      } catch (error) {
        res.status(401).json({ error: (error as Error).message });
      }
}

const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ 
          error: (error as Error).message || 'Registration failed' 
        });
      }
}

export { login, register };

