"use client";

import { forwardRef, InputHTMLAttributes } from "react";
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
  margin-left: -10px;
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

// DatePicker의 커스텀 입력 컴포넌트
const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, placeholder }, ref) => (
    <StyledInput
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      placeholder={placeholder}
    />
  ),
);

// CustomInputWrapper를 만들어 CustomDateInput을 감싸기
const CustomInputWrapper = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, placeholder }, ref) => (
    <div className="datepicker-wrapper">
      <CustomDateInput
        onClick={onClick}
        ref={ref}
        value={value}
        placeholder={placeholder}
      />
    </div>
  ),
);

interface ReactDatePickerProps {
  placeholderText: string;
  onDateChange: (date: Date | null) => void;
  selectedDate?: Date | null;
  showTimeSelect?: boolean;
  dateFormat?: string;
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
          .react-datepicker {
            font-family: "Arial", sans-serif;
            border-color: #e5e7eb;
            box-shadow:
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .react-datepicker__header {
            background-color: #f3f4f6;
            border-bottom: none;
          }
          .react-datepicker__navigation-icon::before {
            display: none;
          }
          .react-datepicker__current-month,
          .react-datepicker-time__header {
            color: #374151;
            font-weight: 600;
          }
          .react-datepicker__day-name,
          .react-datepicker__day {
            color: #4b5563;
          }
          .react-datepicker__day:hover {
            background-color: #e5e7eb;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected {
            background-color: #39a7f7;
            color: white;
          }
          .react-datepicker__day--selected:hover {
            background-color: #2196f3;
          }
          .react-datepicker__time-container
            .react-datepicker__time
            .react-datepicker__time-box
            ul.react-datepicker__time-list
            li.react-datepicker__time-list-item--selected {
            background-color: #39a7f7;
            color: white;
          }
          .react-datepicker__time-container
            .react-datepicker__time
            .react-datepicker__time-box
            ul.react-datepicker__time-list
            li.react-datepicker__time-list-item--selected:hover {
            background-color: #2196f3;
          }
          /* Custom styling for the wrapper to set full width */
          .datepicker-wrapper {
            width: 100%;
          }
        `}
      />
      <DatePicker
        placeholderText={placeholderText}
        onChange={handleDateChange}
        selected={selectedDate}
        showTimeSelect={showTimeSelect}
        timeIntervals={10}
        timeFormat="HH:mm" /* 24시간 형식으로 시간 설정 */
        dateFormat={
          showTimeSelect ? "yyyy/MM/dd HH:mm" : dateFormat
        } /* 시간 선택 시 포맷 포함 */
        popperPlacement="bottom-start"
        wrapperClassName="datepicker-wrapper" /* Wrapper class name */
        customInput={<CustomInputWrapper placeholder={placeholderText} />}
      />
    </>
  );
};

export default ReactDatePicker;
