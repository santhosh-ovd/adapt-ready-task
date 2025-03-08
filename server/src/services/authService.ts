import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserLoginDto, UserRegisterDto } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create a hashed password for the default user
const defaultPassword = '123456';
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(defaultPassword, salt);

const users: User[] = [
//     {
//   email: 'santhosh.ovd@gmail.com',
//   password: hashedPassword,
//   username: 'santhosh',
//   id: '1',
//   createdAt: new Date()
// }
]; // In-memory storage, replace with database in production

export const createAuthService = () => {
  /**
   * Register a new user
   */
  const register = async (userDto: UserRegisterDto): Promise<{ user: Omit<User, 'password'>, token: string }> => {
    try {
      // Check if user already exists
      if (users.find(u => u.email === userDto.email)) {
        throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userDto.password, salt);

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userDto.username,
        email: userDto.email,
        password: hashedPassword,
        createdAt: new Date()
      };

      // Add user to the array
      users.push(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Log the successful registration
      console.log('User registered:', {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      });

      const { password, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: UserLoginDto): Promise<{ user: Omit<User, 'password'>, token: string }> => {
    const user = users.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  };

  /**
   * Verify JWT token
   */
  const verifyToken = (token: string): { userId: string, email: string } => {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

  return {
    register,
    login,
    verifyToken
  };
}; 