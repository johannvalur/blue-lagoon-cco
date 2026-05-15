import { NextRequest } from "next/server";
import { handleChat } from "../_handler";
import type { InternalSurface } from "@/lib/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: readonly InternalSurface[] = ["ops", "crew"];

export function POST(req: NextRequest) {
  return handleChat(req, ALLOWED);
}
