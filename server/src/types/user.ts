export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto extends UserLoginDto {
  username: string;
} 