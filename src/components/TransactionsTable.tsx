import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  projectName: string;
  type: 'XP' | 'Audit';
  amount: number;
  date: string;
  status: 'PASS' | 'FAIL';
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Card className="bg-[#18181b] border-[#27272a]">
      <CardHeader>
        <CardTitle className="text-zinc-100">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[#27272a] hover:bg-transparent">
              <TableHead className="text-zinc-400">Project Name</TableHead>
              <TableHead className="text-zinc-400">Type</TableHead>
              <TableHead className="text-zinc-400">Amount</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="border-[#27272a] hover:bg-[#27272a]/50 transition-colors"
              >
                <TableCell className="text-zinc-100 font-medium">
                  {transaction.projectName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      transaction.type === 'XP'
                        ? 'border-indigo-500/50 text-indigo-400 bg-indigo-950/30'
                        : 'border-purple-500/50 text-purple-400 bg-purple-950/30'
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-100">
                  {transaction.type === 'XP'
                    ? `+${transaction.amount.toLocaleString()} XP`
                    : `${(transaction.amount / 1024).toFixed(1)} KB`}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      transaction.status === 'PASS'
                        ? 'border-green-500/50 text-green-400 bg-green-950/30'
                        : 'border-red-500/50 text-red-400 bg-red-950/30'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400 text-right">
                  {transaction.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
