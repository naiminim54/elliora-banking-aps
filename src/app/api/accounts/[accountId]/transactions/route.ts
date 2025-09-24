import { NextResponse } from "next/server";

const transactionsDB: Record<string, any[]> = {
  acc_1: [
    { id: "tx_1", date: "2025-07-12T09:22:00Z", amount: -25000, currency: "XAF", description: "Loyer Juillet", status: "posted" },
    { id: "tx_2", date: "2025-07-10T14:11:00Z", amount: 150000, currency: "XAF", description: "Salaire", status: "posted" },
    { id: "tx_3", date: "2025-07-08T16:30:00Z", amount: -5000, currency: "XAF", description: "Retrait ATM", status: "posted" },
    { id: "tx_4", date: "2025-07-05T12:15:00Z", amount: -12000, currency: "XAF", description: "Achat supermarché", status: "posted" },
    { id: "tx_5", date: "2025-07-03T08:45:00Z", amount: 75000, currency: "XAF", description: "Virement reçu", status: "posted" },
    { id: "tx_6", date: "2025-07-01T14:20:00Z", amount: -8000, currency: "XAF", description: "Frais bancaires", status: "posted" },
  ],
  acc_2: [
    { id: "tx_7", date: "2025-06-03T10:00:00Z", amount: 5000, currency: "XAF", description: "Intérêts", status: "posted" },
    { id: "tx_8", date: "2025-05-15T14:30:00Z", amount: 100000, currency: "XAF", description: "Dépôt initial", status: "posted" },
    { id: "tx_9", date: "2025-05-10T09:15:00Z", amount: 2500, currency: "XAF", description: "Intérêts", status: "posted" },
  ]
};

export async function GET(req: Request, { params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const search = url.searchParams.get('search') || '';
  const sortBy = url.searchParams.get('sortBy') || 'date';
  const sortOrder = url.searchParams.get('sortOrder') || 'desc';
  
  let items = transactionsDB[accountId] || [];
  
  // Filtrage par recherche
  if (search) {
    items = items.filter(item => 
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Tri
  items.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
  
  // Pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return NextResponse.json({
    items: paginatedItems,
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize)
  });
}
