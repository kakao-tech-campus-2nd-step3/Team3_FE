/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { css, Global } from "@emotion/react";
import koLocale from "@fullcalendar/core/locales/ko";

// Event 인터페이스
interface Event {
  id: string; // id를 string으로 변경
  title: string;
  description: string;
  start: Date;
  end: Date;
  accessibility: boolean | null;
  complete: boolean;
  status: "completed" | "upcoming" | "incomplete";
}

const globalStyles = css`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const appContainerStyles = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const appTitleStyles = css`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const calendarStyles = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 8rem);
  font-size: 0.875rem;

  /* 모바일 화면 */
  @media (max-width: 768px) {
    font-size: 0.75rem; /* 폰트 크기 조정 */
    .fc-toolbar-title {
      font-size: 1rem !important;
    }
    .fc-event-main {
      padding: 0.2rem; /* 이벤트 패딩 조정 */
    }
    .fc-timegrid-slot {
      height: 2rem; /* 시간 슬롯 높이 */
    }
  }

  /* 태블릿 화면 */
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.875rem;
    .fc-toolbar-title {
      font-size: 1.25rem !important;
    }
    .fc-timegrid-slot {
      height: 2.5rem;
    }
  }

  /* 데스크탑 화면 */
  @media (min-width: 1025px) {
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

  /* 시간 슬롯 높이 설정 */
  .fc-timegrid-slot {
    height: 3rem; /* 각 시간 슬롯의 높이 */
    border-bottom: 1px solid #e5e7eb;
  }

  .fc-timegrid-slot-minor {
    border-bottom: 1px dashed rgba(229, 231, 235, 0.5);
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

const eventItemStyles = (status: string, isDragging: boolean) => css`
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

const CustomCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);

  // 상태를 계산하는 함수
  const calculateEventStatus = (
    event: Event,
  ): "completed" | "upcoming" | "incomplete" => {
    const now = new Date(); // 실제 현재 시간

    if (event.complete) {
      return "completed";
    } else if (event.start > now) {
      return "upcoming";
    } else if (!event.complete && event.end < now) {
      return "incomplete";
    }

    return "incomplete";
  };

  // 날짜 문자열을 Date 객체로 변환하는 함수 (id를 string으로 변환)
  const parseEventDates = (event: any): Event => ({
    ...event,
    id: event.id.toString(), // id를 문자열로 변환
    start: new Date(event.start_date),
    end: new Date(event.end_date),
  });

  useEffect(() => {
    // 백엔드에서 데이터를 가져온다고 가정
    const fetchedEvents = [
      {
        id: 1,
        title: "책 5장 정리",
        description: "집에서 공부",
        start_date: "2024-09-27T22:00:00Z",
        end_date: "2024-09-28T01:00:00Z",
        accessibility: true,
        complete: true,
      },
      {
        id: 2,
        title: "팀 미팅",
        description: "팀 프로젝트 미팅",
        start_date: "2024-09-29T00:00:00Z",
        end_date: "2024-09-29T03:00:00Z",
        accessibility: false,
        complete: false,
      },
      {
        id: 3,
        title: "개인 운동",
        description: "헬스장 운동",
        start_date: "2024-10-01T23:00:00Z",
        end_date: "2024-10-02T02:00:00Z",
        accessibility: true,
        complete: false,
      },
    ];

    // 상태를 계산하여 events 배열을 업데이트
    const updatedEvents = fetchedEvents.map((event) => {
      const parsedEvent = parseEventDates(event); // 날짜 변환
      return {
        ...parsedEvent,
        status: calculateEventStatus(parsedEvent),
      };
    });

    // FullCalendar에서 요구하는 형식으로 변환
    const eventInputs = updatedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      className: `fc-event-${event.status}`,
      extendedProps: {
        description: event.description, // extendedProps에 description 추가
      },
    }));

    setEvents(eventInputs); // 이벤트 설정
  }, []);

  const handleEventDrop = useCallback((info: any) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? { ...event, start: info.event.start, end: info.event.end }
          : event,
      ),
    );
  }, []);

  const handleEventResize = useCallback((info: any) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? { ...event, start: info.event.start, end: info.event.end }
          : event,
      ),
    );
  }, []);

  return (
    <>
      <Global styles={globalStyles} />
      <div css={appContainerStyles}>
        <h1 css={appTitleStyles}>계획표 예시</h1>
        <div css={calendarStyles}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            initialDate={currentDate}
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev next today",
            }}
            locale={koLocale}
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            allDaySlot={false}
            editable={true}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            weekends={true}
            firstDay={1}
            events={events}
            eventResizableFromStart={true}
            eventContent={(eventInfo) => {
              const event = events.find((e) => e.id === eventInfo.event.id); // id를 string으로 비교
              return (
                <div css={eventItemStyles(event ? event.className : "", false)}>
                  <div>{eventInfo.timeText}</div>
                  <div>{eventInfo.event.title}</div>
                  {event && (
                    <div>{eventInfo.event.extendedProps.description}</div>
                  )}
                </div>
              );
            }}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            datesSet={(dateInfo) => setCurrentDate(dateInfo.start)}
            duration={{ days: 7 }}
            dayHeaderFormat={{
              weekday: "short",
              month: "numeric",
              day: "numeric",
              omitCommas: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CustomCalendar;
