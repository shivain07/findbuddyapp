import jwt from "jsonwebtoken";

interface IjwtPayload {
  username: string;
  email: string;
  _id: string;
}
export const generateAccessToken = (payload: IjwtPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: IjwtPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};



