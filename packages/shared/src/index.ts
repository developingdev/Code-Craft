export type UserPayload = {
  name: string;
  email: string;
};

export const userSchema = {
  name: 'string',
  email: 'string'
};
