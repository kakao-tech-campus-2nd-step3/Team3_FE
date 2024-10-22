/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventInput } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import breakpoints from "@/variants/variants";
import {
  appContainerStyles,
  appTitleStyles,
  calendarStyles,
  eventItemStyles,
} from "./CustomCalendar.styles";

// Event 인터페이스
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  accessibility: boolean | null;
  complete: boolean;
  status: "completed" | "upcoming" | "incomplete";
}

interface CustomCalendarProps {
  calendarOwner?: string; // calendarOwner prop 정의, 선택적 속성
}

// 주간 뷰 및
const VIEW_MODES = {
  THREEDAY: "timeGridThreeDay",
  WEEK: "timeGridWeek",
};

// 이벤트 상태 계산 함수
const calculateEventStatus = (event: CalendarEvent) => {
  const now = new Date();

  if (event.complete) {
    return "completed";
  }
  if (event.start > now) {
    return "upcoming";
  }
  if (!event.complete && event.end < now) {
    return "incomplete";
  }

  return "incomplete";
};

// 날짜 변환 함수
const parseEventDates = (event: any): CalendarEvent => ({
  ...event,
  id: event.id.toString(),
  start: new Date(event.start_date),
  end: new Date(event.end_date),
});

// 이벤트 렌더링 함수
const renderEventContent =
  (events: EventInput[]) => (eventInfo: { event: any; timeText: string }) => {
    const { event, timeText } = eventInfo;
    const foundEvent = events.find((e) => e.id === event.id);
    let className = "";

    if (foundEvent) {
      className = Array.isArray(foundEvent.className)
        ? foundEvent.className.join(" ")
        : foundEvent.className || "";
    }

    return (
      <div css={eventItemStyles(className, false)}>
        <div>{timeText}</div>
        <div>{event.title}</div>
        {foundEvent && <div>{event.extendedProps.description}</div>}
      </div>
    );
  };

const handleResizeEvent = (
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>,
  calendarRef: React.RefObject<FullCalendar>,
) => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= breakpoints.sm);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.updateSize();
      calendarApi.changeView(
        window.innerWidth <= breakpoints.sm
          ? VIEW_MODES.THREEDAY
          : VIEW_MODES.WEEK,
      );
    }
  };
  return handleResize;
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({ calendarOwner }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= breakpoints.sm,
  );
  const calendarRef = useRef<FullCalendar>(null);
  const calendarTitle = calendarOwner ? `${calendarOwner}` : "나만의 계획표";
  // 이벤트 데이터 fetch 및 초기화
  useEffect(() => {
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

    const updatedEvents = fetchedEvents.map((event) => {
      const parsedEvent = parseEventDates(event);
      return {
        ...parsedEvent,
        status: calculateEventStatus(parsedEvent),
      };
    });

    const eventInputs = updatedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      className: `fc-event-${event.status}`,
      extendedProps: {
        description: event.description,
      },
    }));

    setEvents(eventInputs);
  }, []);

  // 이벤트 drop 처리
  const handleEventDrop = useCallback((info: { event: any }) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? { ...event, start: info.event.start, end: info.event.end }
          : event,
      ),
    );
  }, []);

  // 이벤트 resize 처리
  const handleEventResize = useCallback((info: { event: any }) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? { ...event, start: info.event.start, end: info.event.end }
          : event,
      ),
    );
  }, []);

  // 화면 크기 변경 처리
  useEffect(() => {
    const resizeHandler = handleResizeEvent(setIsMobile, calendarRef);
    window.addEventListener("resize", resizeHandler);
    resizeHandler(); // 초기화 시에도 실행

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div css={appContainerStyles}>
      <h1 css={appTitleStyles}>{calendarTitle}</h1>
      <div css={calendarStyles}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          views={{
            timeGridThreeDay: {
              type: "timeGrid",
              duration: { days: 3 },
            },
          }}
          initialView={isMobile ? VIEW_MODES.THREEDAY : VIEW_MODES.WEEK}
          initialDate={currentDate}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,next,today",
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
          editable
          selectable={false}
          selectMirror={false}
          dayMaxEvents
          weekends
          firstDay={1}
          events={events}
          eventResizableFromStart
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventContent={renderEventContent(events)}
          datesSet={(dateInfo) => setCurrentDate(dateInfo.start)}
          dayHeaderFormat={{
            weekday: "short",
            month: "numeric",
            day: "numeric",
            omitCommas: true,
          }}
          height={isMobile ? "85%" : "100%"}
        />
      </div>
    </div>
  );
};

export default CustomCalendar;
