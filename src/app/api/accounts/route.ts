import { NextResponse } from "next/server";

const accounts = [
  { id: "acc_1", type: "current", currency: "XAF", balance: 542300 },
  { id: "acc_2", type: "savings", currency: "XAF", balance: 1200000 },
];

export async function GET() {
  return NextResponse.json(accounts);
}
