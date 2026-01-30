import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectSuccessChartProps {
  data: Array<{ name: string; pass: number; fail: number }>;
}

export function ProjectSuccessChart({ data }: ProjectSuccessChartProps) {
  return (
    <Card className="bg-[#18181b] border-[#27272a] hover:border-[#3f3f46] transition-colors">
      <CardHeader>
        <CardTitle className="text-zinc-100">Project Success Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              dataKey="name" 
              stroke="#71717a"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#71717a"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#a1a1aa' }}
            />
            <Legend 
              wrapperStyle={{ color: '#a1a1aa' }}
            />
            <Bar dataKey="pass" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="fail" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
