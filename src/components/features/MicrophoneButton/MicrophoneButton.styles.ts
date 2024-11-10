// src/components/features/MicrophoneButton/MicrophoneButton.styles.ts
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import breakpoints from "@/variants/breakpoints";

export const ButtonContainer = styled(motion.button)`
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  outline: none;

  width: 58px;
  height: 58px;

  @media (max-width: ${breakpoints.sm}px) {
    width: 50px;
    height: 50px;
  }

  &:focus {
    outline: none;
  }
`;

export const Circle = styled(motion.ellipse)`
  fill: #39a7f7;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2));
`;

export const MicrophoneIcon = styled(motion.g)`
  fill: white;
`;

export const WaveContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Wave = styled(motion.div)`
  background-color: white;
  border-radius: 5px;
  width: 4px;
  height: 8px;

  @media (max-width: ${breakpoints.sm}px) {
    width: 3px;
    height: 6px;
  }
`;
