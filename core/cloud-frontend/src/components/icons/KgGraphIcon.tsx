export interface KgGraphIconProps {
  className?: string;
  size?: number;
}

const STROKE_WIDTH = 10;

const CENTER = { x: 100, y: 100, r: 26 };

const OUTER_NODES = [
  { x: 60, y: 48, r: 15 },
  { x: 150, y: 58, r: 15 },
  { x: 45, y: 105, r: 15 },
  { x: 150, y: 120, r: 12 },
  { x: 110, y: 158, r: 15 },
] as const;

const spokeEndpoints = (
  hubX: number,
  hubY: number,
  hubR: number,
  nodeX: number,
  nodeY: number,
  nodeR: number
) => {
  const dx = nodeX - hubX;
  const dy = nodeY - hubY;
  const dist = Math.hypot(dx, dy);
  const ux = dx / dist;
  const uy = dy / dist;

  return {
    x1: hubX + ux * hubR,
    y1: hubY + uy * hubR,
    x2: nodeX - ux * nodeR,
    y2: nodeY - uy * nodeR,
  };
};

export const KgGraphIcon = ({ className, size = 16 }: KgGraphIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <g stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round">
      {OUTER_NODES.map((node) => {
        const { x1, y1, x2, y2 } = spokeEndpoints(
          CENTER.x,
          CENTER.y,
          CENTER.r,
          node.x,
          node.y,
          node.r
        );

        return (
          <line key={`${node.x}-${node.y}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        );
      })}
    </g>

    <g fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH}>
      {OUTER_NODES.map((node) => (
        <circle
          key={`node-${node.x}-${node.y}`}
          cx={node.x}
          cy={node.y}
          r={node.r}
        />
      ))}
    </g>

    <circle
      cx={CENTER.x}
      cy={CENTER.y}
      r={CENTER.r}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
    />
  </svg>
);
