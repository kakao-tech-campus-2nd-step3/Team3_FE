import styled from "@emotion/styled";
import { motion } from "framer-motion";
import breakpoints from "@/variants/variants";

export const ButtonContainer = styled(motion.button)({
  border: "none",
  background: "none",
  cursor: "pointer",
  position: "relative",
  overflow: "visible",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  outline: "none",
  padding: 0,

  "&:focus": {
    outline: "none",
  },

  // 반응형 설정
  width: "50px",
  height: "50px",

  [breakpoints.tablet]: {
    width: "58px",
    height: "58px",
  },

  [breakpoints.desktop]: {
    width: "64px",
    height: "64px",
  },
});

export const Circle = styled(motion.ellipse)({
  fill: "#39a7f7",
  filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))",
});

export const MicrophoneIcon = styled(motion.g)({
  fill: "white",
});

export const WaveContainer = styled(motion.div)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
});

export const Wave = styled(motion.div)({
  backgroundColor: "white",
  borderRadius: "5.625px",

  // 반응형 설정
  width: "4px",
  height: "4px",

  [breakpoints.tablet]: {
    width: "6px",
    height: "6px",
  },

  [breakpoints.desktop]: {
    width: "8px",
    height: "8px",
  },
});
