import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  title,
  value,
  delta,
  prefix = ""
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  delta: number;
  prefix?: string;
}) {
  const up = delta >= 0;
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-orange">
          <Icon className="h-[22px] w-[22px]" />
        </div>
        <div>
          <div className="text-[12.5px] text-slate-500">{title}</div>
          <div className="text-2xl font-bold">
            {prefix}
            {value.toLocaleString()}
          </div>
        </div>
      </div>
      {delta !== 0 && (
        <div className={`text-xs ${up ? "text-emerald-600" : "text-rose-600"}`}>
          {up ? "↑" : "↓"} {Math.abs(delta)}% from last month
        </div>
      )}
    </Card>
  );
}
