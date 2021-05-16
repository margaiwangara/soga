export interface RegisterUserInput extends EmailPasswordInput {
  name: string;
  surname?: string;
}

export interface EmailPasswordInput {
  email: string;
  password: string;
}
