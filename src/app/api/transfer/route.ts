import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.fromAccountId || !body.toAccountNumber || !body.amount) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  
  // Validation du montant
  if (body.amount <= 0) {
    return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 });
  }
  
  // Simulation d'une vérification de solde
  const accounts = [
    { id: "acc_1", balance: 542300 },
    { id: "acc_2", balance: 1200000 },
  ];
  
  const account = accounts.find(acc => acc.id === body.fromAccountId);
  if (!account) {
    return NextResponse.json({ message: "Account not found" }, { status: 404 });
  }
  
  if (body.amount > account.balance) {
    return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
  }
  
  return NextResponse.json({
    transferId: "tr_123",
    status: "pending",
    estimatedCompletion: "2025-08-21T12:00:00Z"
  });
}
