import { goddessAsset } from "@/lib/cinema";
export default function FragmentTransition({
  className = "",
  label,
  priority = false,
}: {
  className?: string;
  label: string;
  priority?: boolean;
}) {
  return (
    <div className={`fragment-art ${className}`} role="img" aria-label={label}>
      <img
        className="art-static"
        src={goddessAsset}
        width="1152"
        height="1664"
        alt=""
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
      />
      <div className="art-fragments" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            className={`art-fragment fragment-${i}`}
            key={i}
            style={{
              clipPath: `inset(${(i * 100) / 6}% 0 ${((5 - i) * 100) / 6}% 0)`,
            }}
          >
            <img
              src={goddessAsset}
              width="1152"
              height="1664"
              alt=""
              loading={priority ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
