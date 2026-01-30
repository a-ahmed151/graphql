import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface XPProgressionChartProps {
  data: Array<{ date: string; xp: number }>;
}

export function XPProgressionChart({ data }: XPProgressionChartProps) {
  return (
    <Card className="bg-[#18181b] border-[#27272a] hover:border-[#3f3f46] transition-colors">
      <CardHeader>
        <CardTitle className="text-zinc-100">XP Progression Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              dataKey="date" 
              stroke="#71717a"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#71717a"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#a1a1aa' }}
              formatter={(value: number) => [`${value.toLocaleString()} XP`, 'Experience']}
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
