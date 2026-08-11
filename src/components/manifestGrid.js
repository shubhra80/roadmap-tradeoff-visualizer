// Shared between ManifestPanel's header and ManifestRow's cells so columns
// stay aligned. Every track uses minmax(floor, share) — never plain
// min-content/auto — so a track can shrink below its content's natural
// width instead of forcing the row (and the panel) wider than its
// container. The title track's floor of 0 is what lets long titles wrap
// onto a second line rather than pushing the row into horizontal scroll.
// The last track holds the rank badge + Why trigger + score badge as one
// cluster (see ManifestRow) rather than a dedicated rank column, so it's
// wider than a single-badge track would need to be.
export const MANIFEST_GRID_TEMPLATE =
  "2rem minmax(0,3fr) repeat(4, minmax(4.5rem,1fr)) 7.25rem";
