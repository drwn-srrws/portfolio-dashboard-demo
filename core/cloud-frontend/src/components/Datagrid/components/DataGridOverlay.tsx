export const DataGridOverlay = () => (
  <>
    <div
      className="absolute top-[30px] left-0 w-full bg-neutral-900 h-[3px] z-[99] overflow-hidden"
      data-testid="data-grid-loader"
    >
      <div className="absolute top-0 left-0 w-[250px] h-full bg-white/50 animate-[loader-animation_1.4s_infinite_linear] z-[99]" />
    </div>
    <div className="absolute inset-0 bg-black/20" />
  </>
);
