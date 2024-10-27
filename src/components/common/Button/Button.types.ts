// Button.types.ts
import { ComponentProps } from "react";

export type Props = {
  theme?: "primary" | "secondary" | "kakao";
  size?: "small" | "large" | "long" | "responsive";
} & ComponentProps<"button">;
