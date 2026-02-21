type JwtPayload = {
  iss: string;
  sub: string;
  exp: number;
};

export interface JwtPayloadCustom extends JwtPayload {
  userId?: string;
  gymId?: string;
  name: string;
  phone: string;
  email: string;
  document?: string;
  role: string;
  iat: number;
  exp: number;
  invite_count?: number;
  invite_code?: string;
  has_referred_by_invite_code?: boolean;
}

export function parseJwt(token: string): JwtPayloadCustom | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const buffer = Buffer.from(base64, "base64");
    const jsonPayload = buffer.toString("utf-8");

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
