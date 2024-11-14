import { InputHTMLAttributes, useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

// 유틸리티 함수: null이 아닌 Date만 형식에 맞춰 변환
function formatDateToServer(date: Date): string {
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );

  return utcDate.toISOString(); // 이미 UTC 시간이므로 그대로 반환
}
const DatePickerContainer = styled.div`
  width: 100% !important;
  margin-left: -20px;

  .datepicker-wrapper {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px; /* 좌우 패딩을 동일하게 유지 */
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #39a7f7;
    box-shadow: 0 0 0 2px #338bd0;
  }
`;

// 커스텀 입력 컴포넌트 타입 정의
interface CustomDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClick?: () => void;
  value?: string;
}

// 커스텀 입력 컴포넌트
const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, onChange, ...props }, ref) => (
    <StyledInput
      onClick={onClick}
      value={value}
      onChange={onChange}
      ref={ref}
      {...props}
    />
  ),
);
CustomDateInput.displayName = "CustomDateInput";

const ReactDatePicker = ({
  onDateChange,
  placeholderText,
}: {
  onDateChange: (date: string | null) => void;
  placeholderText?: string;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      const formattedDate = formatDateToServer(date);
      onDateChange(formattedDate);
    } else {
      onDateChange(null);
    }
  };

  return (
    <DatePickerContainer>
      <Global
        styles={css`
          .react-datepicker {
            background-color: #f0f8ff;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 0.85rem;
            margin-left: -5px;

            @media (max-width: 600px) {
              font-size: 0.75rem;
              max-width: 100vw;
              max-height: 40vh;
            }
          }

          .react-datepicker__day {
            color: #333;
            font-size: 0.9rem;
            padding: 0.3rem;
            border-radius: 50%;

            &:hover {
              background-color: #e6e6e6;
            }

            @media (max-width: 600px) {
              padding: 0.2rem;
            }
          }

          .react-datepicker__day--today {
            font-weight: bold;
            border: 1px solid #39a7f7;
            background-color: #f0e6ff;
          }

          .react-datepicker__day--selected {
            background-color: #39a7f7;
            color: #fff;
            border: 1px solid #39a7f7;
          }

          .react-datepicker__header {
            background-color: #39a7f7;
            color: #fff;
            border-bottom: none;
          }

          .react-datepicker__day-name,
          .react-datepicker__current-month {
            color: #fff;
          }

          .react-datepicker__navigation {
            top: 12px;

            @media (max-width: 600px) {
              top: 8px;
            }
          }

          .react-datepicker__navigation-icon::before {
            border-color: #fff;
          }

          /* 기존의 라벨을 숨김 */
          .react-datepicker-time__caption {
            display: none;
          }

          /* 시간 입력 필드 컨테이너 수정 */
          .react-datepicker__input-time-container {
            margin: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            .react-datepicker-time__caption {
              display: inline-block;
              font-size: 0.9rem;
              color: #666;
              margin-right: 4px;
            }
          }

          /* 시간 입력 필드 내부 input 스타일 */
          .react-datepicker-time__input-container input {
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: transparent;
            font-size: 1rem;
            color: #333;
            width: 50px;
            text-align: center;
            margin-right: 5px;
          }

          .react-datepicker-time__input-container input:focus {
            outline: none;
            border-color: #39a7f7;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(57, 167, 247, 0.1);
          }

          .react-datepicker-time__input-container label {
            font-size: 0.85rem;
            color: #666;
            margin-right: 5px;
          }

          /* 시간 및 분 리스트 항목 스타일 */
          react-datepicker__time-list-item {
            padding: 8px 0;
            color: #333;
            font-size: 0.85rem;
            cursor: pointer;
            background-color: #fff;
            border-radius: 4px;
            margin: 2px 0;

            /* 모바일 화면에서의 높이와 줄 간격 조정 */
            @media (max-width: 600px) {
              height: 20px !important;
              line-height: 20px !important;
              padding: 0 !important;
            }

            &:hover {
              background-color: #b3e0ff;
            }
          }
          .react-datepicker__time-list {
            border: none !important;
            box-shadow: none !important;

            @media (max-width: 600px) {
              height: 10px !important;
              overflow-y: auto;
            }
          }
        `}
      />
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        timeInputLabel="Time:"
        dateFormat="yyyy/MM/dd HH:mm:ss"
        showTimeInput
        placeholderText={placeholderText}
        customInput={<CustomDateInput />}
        wrapperClassName="datepicker-wrapper"
        popperPlacement="top"
      />
    </DatePickerContainer>
  );
};

export default ReactDatePickerComponent;
