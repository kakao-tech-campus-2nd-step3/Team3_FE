import React from "react";
import { AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react"; // Lucide에서 mic 아이콘 가져오기
import {
  ButtonContainer,
  CircleBackground,
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
      <CircleBackground /> {/* 원형 배경으로 사용할 div */}
      <AnimatePresence>
        {!isRecording && (
          <Mic
            color="white"
            size={28}
            style={{
              position: "absolute",
            }}
          />
        )}
      </AnimatePresence>
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
