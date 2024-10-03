import { css } from "@emotion/react";
import { breakpoints } from "@/variants"; // Breakpoints 파일을 import

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
  font-size: 0.75rem;

  .fc-toolbar-title {
    font-size: 1rem !important;
  }

  .fc-event-main {
    padding: 0.2rem;
  }

  /* 가로 스크롤을 강제 적용 */
  .fc-scroller {
    overflow-x: auto !important;
    overflow-y: hidden;
    display: block;
  }

  .fc-timegrid {
    min-width: 800px;
  }

  .fc-timegrid-col {
    min-width: 250px;
    border-right: 1px solid #e5e7eb;
  }

  /* 30분 단위 슬롯 (실선) */
  .fc-timegrid-slot {
    height: 3rem;
    border-bottom: 1px dashed rgba(229, 231, 235, 0.5) !important; /* 실선 */
  }

  /* 1시간 단위 슬롯 (점선) */
  .fc-timegrid-slot-minor {
    height: 3rem;
    border-bottom: 1px solid #e5e7eb !important; /* 점선 */
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
    width: 3rem;
  }

  .fc-direction-ltr .fc-timegrid-col-events {
    margin: 0px !important;
  }

  .fc-day-today {
    background-color: inherit !important;
  }

  .fc-col-header-cell {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  .fc-col-header-cell.fc-day-today {
    background-color: #39a7f7 !important;
    color: white;
  }

  .fc-button {
    border: none;
    padding: 0.5rem 1rem;
    background-color: #39a7f7;
    color: white;
    transition: background-color 0.3s ease;
    outline: none;
  }

  .fc-button:focus {
    outline: none;
    box-shadow: none;
  }

  .fc-button:hover {
    background-color: #8fd0ff;
  }

  .fc-button:active {
    background-color: #39a7f7;
    box-shadow: none;
    transform: none;
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
