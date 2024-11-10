// src/components/common/Input/StyledInput.styles.ts
import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

const StyledInputContainer = styled.div`
  margin-bottom: 24px; /* mb-6 */
  width: 100%;
  display: flex; /* 플렉스 컨테이너로 변경 */
  justify-content: center; /* 수평 중앙 정렬 */
`;

export const StyledInput = styled.textarea`
  width: 80%; /* 전체 너비의 80% 차지 */
  max-width: 500px; /* 데스크탑에서 최대 너비 420px */
  padding: 8px 12px; /* px-3 py-2 */
  font-size: 16px;
  font-family: "Inter", sans-serif;
  color: #4a5568; /* text-gray-700 */
  border: 1px solid #cbd5e0; /* border */
  border-radius: 8px; /* rounded-lg */
  resize: none; /* resize-none */
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease; /* transition duration-200 */

  &:focus {
    outline: none; /* focus:outline-none */
    border-color: #2196f3; /* focus:border-[#2196F3] */
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2); /* focus:ring-2 focus:ring-[#2196F3] */
  }

  &::placeholder {
    color: #a0aec0; /* placeholder text color */
  }

  /* 기존 높이 유지 */
  height: 450px;
  max-height: 300px;

  /* 모바일 반응형 스타일 */
  ${breakpoints.mobile} {
    width: 80%;
    max-width: none; /* 모바일에서는 max-width 제한 해제 */
    height: 250px;
    font-size: 14px;
  }
`;

export default StyledInputContainer;
