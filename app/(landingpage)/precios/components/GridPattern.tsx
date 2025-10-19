import { useId } from 'react';

export function GridPattern({ width = 40, height = 40, x = -1, y = -1, strokeDasharray = 0, ...props }) {
  const id = useId(); 

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full stroke-neutral-200/50 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
