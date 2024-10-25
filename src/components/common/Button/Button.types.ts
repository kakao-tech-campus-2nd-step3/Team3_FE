// Button.types.ts
import { ComponentProps } from "react";

export type Props = {
  theme?: "primary" | "secondary" | "kakao";
  size?: "large" | "small" | "long" | "responsive" | "mini";
} & ComponentProps<"button">;
