import { BadgeCheck } from "@/lib/icons";

type Props = {
  size?: "sm" | "md";
  /** Show only the icon (for tight chips). */
  iconOnly?: boolean;
};

export default function VerifiedBadge({ size = "sm", iconOnly }: Props) {
  return (
    <span className={`verified-badge ${size}`} title="Photo verified">
      <BadgeCheck size={size === "md" ? 16 : 13} />
      {!iconOnly && <span>Verified</span>}
    </span>
  );
}
