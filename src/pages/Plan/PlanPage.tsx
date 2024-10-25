import { useState, useEffect, useRef, HTMLAttributes } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/common/MicrophoneButton/MicrophoneButton";
import RouterPath from "@/router/RouterPath";

interface MessageSliderProps extends HTMLAttributes<HTMLDivElement> {
  index: number; // index 속성에 대한 타입 정의
}
const MessagesContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 37px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 100vw;
`;

const MessageSlider = styled.div<MessageSliderProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.8s ease-in-out;
  transform: ${({ index }) => `translateY(-${index * 37}px)`};
`;

const MessageItem = styled.div`
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  font-weight: bold;
  color: #000;
  font-family: "Montserrat", sans-serif;
  color: #a9a9a9;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const StyledInputWrapper = styled.div`
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  width: 100%; /* 너비를 100%로 설정 */
  margin-bottom: 24px; /* 아래쪽 여백 설정 */
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 140px;
  margin-top: 24px 0px 24px;
  width: 100%;
  @media (max-width: 768px) {
    gap: 80px;
  }
`;

const Description = styled.h1`
  font-size: 23px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 24px;
  @media (max-width: 768px) {
    font-size: 18px;
    margin-top: 50px;
  }
`;

const MicrophoneButtonWrapper = styled.div`
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

export default function PlanPage() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요",
    "고정된 일정이 있나요?",
    "쉬고 싶은 시간은 꼭 말해주세요",
  ];

  const [transcript, setTranscript] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleStartRecording = async () => {
    setIsRecording(true);

    // WebSocket 연결
    console.log("WebSocket 연결 시도 중...");
    socketRef.current = new WebSocket("wss://splanet.co.kr/wss/stt'");
    socketRef.current.binaryType = "arraybuffer";

    socketRef.current.onopen = () => {
      console.log("WebSocket 연결이 열렸습니다.");
    };

    socketRef.current.onmessage = (event) => {
      const text = event.data;
      console.log("인식된 텍스트:", text);
      setTranscript((prev) => prev + text);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket 오류 발생:", error);
    };

    socketRef.current.onclose = (event) => {
      console.log(
        `WebSocket이 닫혔습니다. 코드: ${event.code}, 이유: ${event.reason}`,
      );
      setIsRecording(false);
    };

    // 마이크 접근 및 AudioContext 설정
    try {
      console.log("마이크 접근 요청 중...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("마이크 접근 성공");

      // AudioContext 생성
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      streamRef.current = stream;

      // 입력 소스 생성
      const input = audioContext.createMediaStreamSource(stream);

      // ScriptProcessorNode 생성
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      // 오디오 처리
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const buffer = downsampleBuffer(
          inputData,
          audioContext.sampleRate,
          16000,
        );

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(buffer);
        }
      };

      input.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error("마이크 접근 오류:", error);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    // 오디오 스트림 및 프로세서 종료
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // WebSocket 종료
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket 연결 닫기 시도 중...");
        socketRef.current.close();
      }
      socketRef.current = null;
    }
  };

  // 오디오 데이터를 16kHz로 다운샘플링하는 함수
  function downsampleBuffer(
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number,
  ) {
    if (outputSampleRate === inputSampleRate) {
      return convertFloat32ToInt16(buffer);
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i+= 1
      ) {
        accum += buffer[i];
        count+= 1;
      }
      result[offsetResult] = accum / count;
      offsetResult+= 1;
      offsetBuffer = nextOffsetBuffer;
    }
    return convertFloat32ToInt16(result);
  }

  // Float32Array를 Int16Array로 변환하는 함수
  function convertFloat32ToInt16(buffer: Float32Array) {
    const l = buffer.length;
    const result = new Int16Array(l);
    for (let i = 0; i < l; i+= 1) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return result.buffer;
  }
  
  return (
    <div className="w-full h-full px-6 py-3 flex flex-col items-center justify-start gap-6">
      <Description>
        마이크 버튼을 누르고 일정을 자세히 이야기해주세요.
      </Description>

      <MessagesContainer>
        <MessageSlider index={currentMessageIndex}>
          {messages.map((message, index) => (
            <MessageItem key={`message-${index}`}>{message}</MessageItem>
          ))}
        </MessageSlider>
      </MessagesContainer>

      <StyledInputWrapper>
        {/* Input 컴포넌트에 transcript 값 전달 */}
        <Input
          placeholder="일정을 입력하세요..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)} // 사용자가 수정할 때 transcript 업데이트
        />
      </StyledInputWrapper>

      <MicrophoneButtonWrapper>
        <MicrophoneButton
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          isRecording={isRecording}
        />
      </MicrophoneButtonWrapper>

      <ButtonWrapper>
        <Button
          theme="primary"
          className="w-[200px] h-[52px] bg-[#39A7F7] text-white text-lg font-bold shadow-md"
          onClick={() => navigate(RouterPath.plan_select)}
        >
          다음
        </Button>
        <Button
          theme="secondary"
          className="w-[200px] h-[52px] border-[#39A7F7] border-[1.5px] text-[#39A7F7] text-lg font-semibold shadow-md"
        >
          취소
        </Button>
      </ButtonWrapper>
    </div>
  );
}
