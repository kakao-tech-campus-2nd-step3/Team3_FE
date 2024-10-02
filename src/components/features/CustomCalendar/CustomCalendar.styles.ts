import { css } from "@emotion/react";
import { breakpoints } from "@/variants"; // Breakpoints 파일을 import

export const globalStyles = css`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export const appContainerStyles = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

export const appTitleStyles = css`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const calendarStyles = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 8rem);
  font-size: 0.75rem; /* 모바일에서 기본 폰트 크기 설정 */

  .fc-toolbar-title {
    font-size: 1rem !important; /* 모바일에서 기본 설정 */
  }

  .fc-event-main {
    padding: 0.2rem; /* 모바일 기본 설정 */
  }

  /* 1시간 단위 슬롯 (실선) */
  .fc-timegrid-slot {
    height: 3rem; /* 1시간 단위 슬롯 */
    border-bottom: 1px solid #e5e7eb !important; /* 실선 */
  }

  /* 30분 단위 슬롯 (점선) */
  .fc-timegrid-slot-minor {
    height: 1.5rem; /* 30분 단위 슬롯 */
    border-bottom: 1px dashed rgba(229, 231, 235, 0.5) !important; /* 점선 */
  }

  /* 태블릿 화면 */
  ${breakpoints.tablet} {
    font-size: 0.875rem;
    .fc-toolbar-title {
      font-size: 1.25rem !important;
    }
    .fc-timegrid-slot {
      height: 2.5rem;
    }
  }

  /* 데스크탑 화면 */
  ${breakpoints.desktop} {
    font-size: 1rem;
    .fc-toolbar-title {
      font-size: 1.5rem !important;
    }
    .fc-timegrid-slot {
      height: 3rem;
    }
  }

  .fc-event {
    cursor: move;
  }

  .fc-event-main {
    padding: 0.25rem;
    width: 100% !important;
  }

  .fc-event-completed {
    background-color: #e5e7eb;
    border-left: 4px solid #9ca3af;
  }

  .fc-event-upcoming {
    background-color: #dbeafe;
    border-left: 4px solid #3b82f6;
  }

  .fc-event-incomplete {
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
  }

  .fc-event-completed .fc-event-title,
  .fc-event-completed .fc-event-time {
    text-decoration: line-through;
  }

  .fc-timegrid-axis {
    width: 3rem; /* 시간대 폭 */
  }

  .fc-timegrid-col {
    border-right: 1px solid #e5e7eb;
  }

  .fc-timegrid-col-frame {
    position: relative;
  }

  .fc-timegrid-event {
    border-radius: 0;
  }

  .fc-timegrid-event-harness {
    margin-right: 1px;
  }

  .fc-direction-ltr .fc-timegrid-col-events {
    margin: 0px !important;
  }

  /* 오늘 날짜 배경색 제거, 헤더 하이라이트 */
  .fc-day-today {
    background-color: inherit !important;
  }

  .fc-col-header-cell.fc-day-today {
    background-color: #39a7f7 !important;
    color: white;
  }

  /* 버튼 스타일 */
  .fc-button {
    border: none;
    padding: 0.5rem 1rem;
    background-color: #39a7f7;
    color: white;
    transition: background-color 0.3s ease;
  }

  .fc-button:hover {
    background-color: #338bd0;
  }

  .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fc-toolbar-title {
    font-size: 1.25rem !important;
  }
`;

export const eventItemStyles = (status: string, isDragging: boolean) => css`
  position: absolute;
  left: 0;
  right: 0;
  padding: 0.25rem;
  font-size: 1rem;
  border-left-width: 4px;
  box-sizing: border-box;
  opacity: ${isDragging ? 0.5 : 1};

  ${status === "completed" &&
  `
    background-color: #e5e7eb;
    border-left-color: #9ca3af;
  `}
  ${status === "upcoming" &&
  `
    background-color: #dbeafe;
    border-left-color: #3b82f6;
  `}
  ${status === "incomplete" &&
  `
    background-color: #fee2e2;
    border-left-color: #ef4444;
  `}
`;
