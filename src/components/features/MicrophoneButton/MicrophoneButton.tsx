// src/components/features/MicrophoneButton/MicrophoneButton.tsx
import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  ButtonContainer,
  Circle,
  MicrophoneIcon,
  WaveContainer,
  Wave,
} from "./MicrophoneButton.styles";

export interface MicrophoneButtonProps {
  onStartClick?: () => void;
  onStopClick?: () => void;
  isRecording: boolean;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  onStartClick,
  onStopClick,
  isRecording,
}) => {
  return (
    <ButtonContainer onClick={isRecording ? onStopClick : onStartClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 92.045 90"
        fill="none"
        overflow="visible"
      >
        <Circle cx="46.0225" cy="45" rx="46.0225" ry="45" />
        <AnimatePresence>
          {!isRecording && (
            <MicrophoneIcon
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* 마이크 아이콘 경로 */}
              <path d="M58.5 42.5C58.5 49.4 52.9 55 46 55C39.1 55 33.5 49.4 33.5 42.5H28.5C28.5 51.325 35.025 58.575 43.5 59.8V67.5H48.5V59.8C56.975 58.575 63.5 51.325 63.5 42.5H58.5Z" />
              <path d="M46 50C50.15 50 53.5 46.65 53.5 42.5V27.5C53.5 23.35 50.15 20 46 20C41.85 20 38.5 23.35 38.5 27.5V42.5C38.5 46.65 41.85 50 46 50ZM43.5 27.5C43.5 26.125 44.625 25 46 25C47.375 25 48.5 26.125 48.5 27.5V42.5C48.5 43.875 47.375 45 46 45C44.625 45 43.5 43.875 43.5 42.5V27.5Z" />
              <path d="M46 50C50.15 50 53.5 46.65 53.5 42.5V27.5C53.5 23.35 50.15 20 46 20C41.85 20 38.5 23.35 38.5 27.5V42.5C38.5 46.65 41.85 50 46 50Z" />
            </MicrophoneIcon>
          )}
        </AnimatePresence>
      </svg>
      <AnimatePresence>
        {isRecording && (
          <WaveContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <Wave
                key={i}
                animate={{
                  height: ["8px", "20px", "8px"],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </WaveContainer>
        )}
      </AnimatePresence>
    </ButtonContainer>
  );
};

export default MicrophoneButton;
