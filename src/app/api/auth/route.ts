import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (username === "alice" && password === "password123") {
    return NextResponse.json({
      token: "mock.jwt.token",
      user: { id: "u1", name: "Alice T." }
    });
  }
  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
