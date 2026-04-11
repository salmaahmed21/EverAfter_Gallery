import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ messages: [] as Row[], configured: false as const });
  }

  const { data, error } = await supabase
    .from("guestbook_messages")
    .select("id, author, body, created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: (data ?? []) as Row[], configured: true as const });
}

export async function POST(request: Request) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Guestbook is not configured yet. Add your Supabase URL and service role key to enable posting.",
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const author = "author" in payload && typeof payload.author === "string" ? payload.author.trim() : "";
  const body = "message" in payload && typeof payload.message === "string" ? payload.message.trim() : "";

  if (!author || !body) {
    return NextResponse.json({ error: "Please include your name and a message." }, { status: 400 });
  }

  if (author.length > 120 || body.length > 2000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("guestbook_messages")
    .insert({ author, body })
    .select("id, author, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data as Row }, { status: 201 });
}
