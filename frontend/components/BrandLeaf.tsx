import { cn } from "@/lib/utils";

type BrandLeafProps = {
  className?: string;
  title?: string;
};

/** Organic leaf mark used in the header and favicon. */
export default function BrandLeaf({
  className,
  title = "Daawa",
}: BrandLeafProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M16 3.5C10.2 9.8 6.5 15.2 6.5 20.2c0 4.8 3.6 8.3 9.5 8.3 6.4 0 10.5-4.2 10.5-9.8 0-6.8-5.8-12.5-10.5-15.2Z"
      />
      <path
        fill="currentColor"
        fillOpacity="0.28"
        d="M16 6.2c-2.8 4.6-4.2 8.8-3.6 12.6.5 3 2.4 5.2 5.2 6.1-3.2-3.8-3.8-9.4-1.6-18.7Z"
      />
    </svg>
  );
}
