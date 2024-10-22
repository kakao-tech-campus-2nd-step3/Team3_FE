// Button.types.ts
import { ComponentProps } from "react";

export type Props = {
  theme?: "primary" | "secondary" | "kakao";
  width?: string;
} & ComponentProps<"button">;
