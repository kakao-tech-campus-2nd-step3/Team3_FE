import React, { useState, useRef } from 'react';
import MicrophoneButton from '../../components/common/MicrophoneButton/MicrophoneButton';

const SpeechRecognitionPage = () => {
  const [transcript, setTranscript] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = async () => {
    setIsRecording(true);

    // WebSocket 연결
    console.log('WebSocket 연결 시도 중...');
    socketRef.current = new WebSocket('ws://localhost:8080/ws/stt');
    socketRef.current.binaryType = 'arraybuffer';

    socketRef.current.onopen = () => {
      console.log('WebSocket 연결이 열렸습니다.');
    };

    socketRef.current.onmessage = (event) => {
      const text = event.data;
      console.log('인식된 텍스트:', text);
      setTranscript((prev) => prev + text);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket 오류 발생:', error);
    };

    socketRef.current.onclose = (event) => {
      console.log(`WebSocket이 닫혔습니다. 코드: ${event.code}, 이유: ${event.reason}`);
      setIsRecording(false);
    };

    // 마이크 접근 및 AudioContext 설정
    try {
      console.log('마이크 접근 요청 중...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('마이크 접근 성공');

      // AudioContext 생성
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
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
        const buffer = downsampleBuffer(inputData, audioContext.sampleRate, 16000);

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(buffer);
        }
      };

      input.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error('마이크 접근 오류:', error);
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
        console.log('WebSocket 연결 닫기 시도 중...');
        socketRef.current.close();
      }
      socketRef.current = null;
    }
  };

  // 오디오 데이터를 16kHz로 다운샘플링하는 함수
  function downsampleBuffer(buffer: Float32Array, inputSampleRate: number, outputSampleRate: number) {
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
      let accum = 0,
        count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return convertFloat32ToInt16(result);
  }

  // Float32Array를 Int16Array로 변환하는 함수
  function convertFloat32ToInt16(buffer: Float32Array) {
    const l = buffer.length;
    const result = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return result.buffer;
  }

  return (
    <div>
      <h1>실시간 음성 인식 테스트</h1>
      <MicrophoneButton
        onStart={handleStartRecording}
        onStop={handleStopRecording}
        isRecording={isRecording}
      />
      <div>
        <h2>인식된 텍스트:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechRecognitionPage;
