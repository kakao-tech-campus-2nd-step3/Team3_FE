import { useState, forwardRef, InputHTMLAttributes } from "react";
import styled from "@emotion/styled";
import DatePicker from "react-datepicker";
import { Global, css } from "@emotion/react";
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

interface ReactDatePickerProps {
  placeholderText: string;
  onDateChange: (date: Date | null) => void;
  selectedDate?: Date | null;
  showTimeSelect?: boolean; // 시간 선택 기능
  dateFormat?: string; // 날짜 포맷 설정
}

const ReactDatePicker = ({
  placeholderText,
  onDateChange,
  selectedDate,
  showTimeSelect = false,
  dateFormat = "yyyy/MM/dd",
}: ReactDatePickerProps) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const utcDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      );
      onDateChange(utcDate);
    } else {
      onDateChange(null);
    }
  };

  return (
    <>
      <Global
        styles={css`
          /* DatePicker 래퍼 스타일 */
          .datepicker-wrapper {
            width: 100%;
            margin-left: -25px;
          }

          /* 전체 달력 스타일 */
          .custom-calendar {
            background-color: #f0f8ff;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 0.85rem;
            margin-left: -5px;

            /* 반응형 스타일 */
            @media (max-width: 600px) {
              font-size: 0.75rem;
              max-width: 100vw;
              max-height: 40vh;
            }
          }

          /* 개별 날짜 스타일 */
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

          /* 오늘 날짜 스타일 */
          .react-datepicker__day--today {
            font-weight: bold;
            border: 1px solid #6c63ff;
            background-color: #f0e6ff;
          }

          /* 선택된 날짜 스타일 */
          .react-datepicker__day--selected {
            background-color: #6c63ff;
            color: #fff;
            border: 1px solid #6c63ff;
          }

          /* 헤더 스타일 */
          .react-datepicker__header {
            background-color: #6c63ff;
            color: #fff;
            border-bottom: none;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            padding: 10px;

            @media (max-width: 600px) {
              padding: 8px;
            }
          }

          /* 월, 연도 네비게이션 화살표 */
          .react-datepicker__navigation {
            top: 12px;
            border-color: #fff;

            @media (max-width: 600px) {
              top: 8px;
            }
          }

          /* 시간 선택 스타일 */
          .react-datepicker__time-container .react-datepicker__time {
            background-color: #f0f8ff;
            border-left: 1px solid #ccc;

            @media (max-width: 600px) {
              font-size: 0.75rem;
            }
          }

          .react-datepicker__time-container
            .react-datepicker__time
            .react-datepicker__time-box {
            width: 100%;
          }
        `}
      />
      <DatePicker
        placeholderText={placeholderText}
        onChange={handleDateChange}
        selected={selectedDate}
        showTimeSelect={showTimeSelect} // 시간 선택 기능 활성화
        dateFormat={dateFormat} // 날짜 포맷 설정
        popperPlacement="bottom-start"
        calendarClassName="custom-calendar"
        wrapperClassName="datepicker-wrapper"
        customInput={<CustomDateInput placeholder={placeholderText} />}
      />
    </>
  );
};

export default ReactDatePicker;
