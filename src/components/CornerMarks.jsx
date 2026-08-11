const CORNER_POSITIONS = [
  "left-1.5 top-1.5",
  "right-1.5 top-1.5 -scale-x-100",
  "left-1.5 bottom-1.5 -scale-y-100",
  "right-1.5 bottom-1.5 -scale-x-100 -scale-y-100",
];

// Technical-drawing registration marks — decorative only, drawn once per
// corner from a single top-left bracket mirrored via CSS transforms so all
// four stay pixel-identical. Requires a `relative` (or otherwise positioned)
// ancestor to anchor against.
export default function CornerMarks() {
  return (
    <>
      {CORNER_POSITIONS.map((position) => (
        <span key={position} aria-hidden="true" className={`pointer-events-none absolute h-2.5 w-2.5 ${position}`}>
          <span className="absolute left-0 top-0 h-full w-px bg-ink/40" />
          <span className="absolute left-0 top-0 h-px w-full bg-ink/40" />
        </span>
      ))}
    </>
  );
}
