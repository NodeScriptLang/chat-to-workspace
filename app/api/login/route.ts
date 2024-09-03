import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { workspaceId, token, assistantId } = await req.json() as { workspaceId: string, token: string, assistantId: string };

  const res = new NextResponse();
  const session = await getSession(req, res);

  console.log(session)

  // Store properties in the session
  session.workspaceId = workspaceId;
  session.token = token;
  session.assistantId = assistantId;

  // Save the session
  await session.save();

  return NextResponse.json({ success: true }, { headers: res.headers });
}
