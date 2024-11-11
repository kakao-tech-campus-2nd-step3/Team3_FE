import { useState, forwardRef, InputHTMLAttributes } from "react";
import styled from "@emotion/styled";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// StyledInput 스타일 정의
const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.3);
  }
`;

// 커스텀 입력 컴포넌트 타입 정의
interface CustomDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClick?: () => void;
  value?: string;
  placeholder?: string;
}

// DatePicker의 커스텀 입력 컴포넌트
const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, placeholder }, ref) => (
    <StyledInput
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      placeholder={placeholder} // placeholder를 직접 설정
    />
  ),
);

const ReactDatePicker = ({ placeholder }: { placeholder: string }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={10}
      timeCaption="시간"
      dateFormat="yyyy/MM/dd HH:mm"
      popperPlacement="bottom-start"
      calendarClassName="custom-calendar"
      customInput={<CustomDateInput placeholder={placeholder} />} // customInput에 placeholder 전달
    />
  );
};

export default ReactDatePicker;
