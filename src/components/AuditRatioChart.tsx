import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes } from '@/lib/utils';

interface AuditRatioChartProps {
  auditUp: number;
  auditDown: number;
  auditUpBonus: number;
}

export function AuditRatioChart({ auditUp, auditDown, auditUpBonus }: AuditRatioChartProps) {
  const total = auditUp + auditDown;
  const upPercentage = (auditUp / total) * 100;
  const downPercentage = (auditDown / total) * 100;
  const ratio = (auditUp / auditDown).toFixed(2);
  
  // Calculate the arc path for the donut chart
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset for the "down" section
  const upStrokeDasharray = `${(upPercentage / 100) * circumference} ${circumference}`;
  const downStrokeDashoffset = -((upPercentage / 100) * circumference);
  const downStrokeDasharray = `${(downPercentage / 100) * circumference} ${circumference}`;

  return (
    <Card className="bg-[#18181b] border-[#27272a] hover:border-[#3f3f46] transition-colors">
      <CardHeader>
        <CardTitle className="text-zinc-100">Audit Ratio</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative size-[200px]">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#27272a"
              strokeWidth={strokeWidth}
            />
            
            {/* Audit Down (red) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeDasharray={downStrokeDasharray}
              strokeDashoffset={downStrokeDashoffset}
              strokeLinecap="round"
            />
            
            {/* Audit Up (green) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeDasharray={upStrokeDasharray}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">{ratio}</span>
            <span className="text-xs text-zinc-400 mt-1">Ratio</span>
          </div>
        </div>
        
        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-green-500" />
            <div className="text-sm">
              <div className="text-zinc-400">Audit Up</div>
              <div className="text-white font-semibold">{formatBytes(auditUp - auditUpBonus,2)} <span className="text-zinc-400">+{formatBytes(auditUpBonus,1)}</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="text-sm">
              <div className="text-zinc-400">Audit Down</div>
              <div className="text-white font-semibold">{formatBytes(auditDown,2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
