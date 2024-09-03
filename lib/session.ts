import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

export interface CustomSessionData {
  workspaceId?: string;
  assistantId?: string;
  token?: string;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string, // Ensure this is at least 32 characters long
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Set to true if your app is served over HTTPS
    httpOnly: false,
    path: "/",
  },
};

// Function to get the session
export async function getSession(req: NextRequest, res: NextResponse): Promise<IronSession<CustomSessionData>> {
  return getIronSession<CustomSessionData>(req, res, sessionOptions);
}
