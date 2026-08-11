export default function CapacityBar({ usedEffort, capacity }) {
  const pct = Math.min(100, (usedEffort / capacity) * 100);
  const overCapacity = usedEffort > capacity;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${pct}%`,
            backgroundColor: overCapacity ? "#E2596B" : "#4FBE7E",
          }}
        />
      </div>
      <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#8CA3BC]">
        {usedEffort.toFixed(1)}/{capacity} pts
      </span>
    </div>
  );
}
