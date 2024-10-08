import { css } from "@emotion/react";
import { breakpoints } from "@/variants";

export const appContainerStyles = css`
  max-width: 960px;
  margin: 0 auto;
  padding: 0.8rem;
`;

export const appTitleStyles = css`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
`;

export const calendarStyles = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 6.4rem - 40px);
  min-height: 400px;
  max-height: 720px;
  font-size: 0.7rem;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    //모바일
    font-size: 0.6rem;
    height: calc(100vh - 4.8rem - 40px);
    min-height: 320px;

    .fc-toolbar {
      flex-direction: column;
      align-items: center;
    }

    .fc-toolbar-chunk {
      margin-bottom: 0.5rem;
    }

    .fc-toolbar-title {
      font-size: 0.8rem !important;
    }

    .fc-event-main {
      padding: 0.16rem;
    }

    .fc-timegrid-slot {
      height: 1.6rem;
    }

    .fc-view-harness {
      height: calc(100vh - 120px) !important;
    }
  }

  ${breakpoints.tablet} {
    font-size: 0.7rem;
    height: calc(100vh - 5.6rem - 40px);
    min-height: 360px;
    .fc-toolbar-title {
      font-size: 1rem !important;
    }
    .fc-timegrid-slot {
      height: 2rem;
    }
  }

  ${breakpoints.desktop} {
    font-size: 0.8rem;
    .fc-toolbar-title {
      font-size: 1.2rem !important;
    }
    .fc-timegrid-slot {
      height: 2.4rem;
    }
  }

  .fc-event {
    cursor: move;
  }

  .fc-event-main {
    padding: 0.2rem;
    width: 100% !important;
  }

  .fc-event-completed {
    background-color: #e5e7eb;
    border-left: 3.2px solid #9ca3af;
  }

  .fc-event-upcoming {
    background-color: #dbeafe;
    border-left: 3.2px solid #3b82f6;
  }

  .fc-event-incomplete {
    background-color: #fee2e2;
    border-left: 3.2px solid #ef4444;
  }

  .fc-event-completed .fc-event-title,
  .fc-event-completed .fc-event-time {
    text-decoration: line-through;
  }

  .fc-timegrid-slot {
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }

  // 1시간 간격
  .fc-timegrid-slot-minor {
    border-bottom: 1px dashed rgba(229, 231, 235, 0.8);
  }

  .fc-timegrid-axis {
    width: 2.4rem;
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
    margin-right: 0.8px;
  }

  .fc-direction-ltr .fc-timegrid-col-events {
    margin: 0px !important;
  }

  .fc-day-today {
    background-color: inherit !important;
  }

  .fc-col-header-cell.fc-day-today {
    background-color: #39a7f7 !important;
    color: white;
  }

  .fc-button {
    border: none;
    padding: 0.4rem 0.8rem;
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
    font-size: 1rem !important;
  }
`;

export const eventItemStyles = (status: string, isDragging: boolean) => css`
  position: absolute;
  left: 0;
  right: 0;
  padding: 0.2rem;
  font-size: 0.8rem;
  border-left-width: 3.2px;
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
