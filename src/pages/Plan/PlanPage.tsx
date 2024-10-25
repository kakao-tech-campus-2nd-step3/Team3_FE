import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/common/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  `;
const PlanPageContainer = styled.div`
  width: 60%
  display: grid;
  justify-content: center;
  align-items: center;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
`;
const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #938e8e;
  text-align: center;
  margin: 50px 0 0 0;
  ${breakpoints.desktop} {
    font-size: 30px;
  }
`;
const SubTitle = styled.p<{ animate: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin: 0;
  ${breakpoints.desktop} {
    font-size: 30px;
  }

  &.animate {
    animation: ${({ animate }) => (animate ? slideDown : "none")} 1s ease-in-out;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 130px;
  margin-bottom: 40px;
`;

// 고정된 부분들에 대해 memoization 적용
const MemoizedTitle = memo(() => {
  return <Title>마이크 버튼을 누르고 자세히 얘기해주세요.</Title>;
});

const MemoizedInput = memo(Input);
const MemoizedMicrophoneButton = memo(MicrophoneButton);
const MemoizedButton = memo(Button);
const MemoizedButtonContainer = memo(({ navigate }: { navigate: any }) => {
  return (
    <ButtonContainer>
      <MemoizedButton onClick={() => navigate(RouterPath.PLAN_SELECT)}>
        다음
      </MemoizedButton>
      <MemoizedButton onClick={() => navigate(-1)} theme="secondary">
        취소
      </MemoizedButton>
    </ButtonContainer>
  );
});

const PlanPage: React.FC = () => {
  const subTitleMessages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요.",
    "고정된 일정이 있나요?",
    "쉬고 싶은 날은 꼭 말해주세요.",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 타이머 실행
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === subTitleMessages.length - 1 ? 0 : prevIndex + 1,
      );

      // 에니메이션 시작
      setAnimate(true);

      // 애니메이션이 끝난 후 에니메이션 초기화
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // useNavigate 선언
  const navigate = useNavigate();

  const [transcript, setTranscript] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Float32Array를 Int16Array로 변환하는 함수
  function convertFloat32ToInt16(buffer: Float32Array) {
    const l = buffer.length;
    const result = new Int16Array(l);
    for (let i = 0; i < l; i += 1) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return result.buffer;
  }

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
        i += 1
      ) {
        accum += buffer[i];
        count += 1;
      }
      result[offsetResult] = accum / count;
      offsetResult += 1;
      offsetBuffer = nextOffsetBuffer;
    }
    return convertFloat32ToInt16(result);
  }

  const handleStartRecording = async () => {
    console.log("녹음 시작");
    setIsRecording(true);

    // WebSocket 연결
    console.log("WebSocket 연결 시도 중...");
    socketRef.current = new WebSocket("wss://splanet.co.kr/ws/stt");
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
    console.log("녹음 중지");
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

  return (
    <PlanPageContainer>
      <InputWrapper>
        <MemoizedTitle />
        <SubTitle animate={animate}>
          {subTitleMessages[currentMessageIndex]}
        </SubTitle>
        <MemoizedInput
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <MemoizedMicrophoneButton
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          isRecording={isRecording}
        />
        <MemoizedButtonContainer navigate={navigate} />
      </InputWrapper>
    </PlanPageContainer>
  );
};

export default PlanPage;
