/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import {appContainerStyles, appTitleStyles, calendarStyles, eventItemStyles} from "./CustomCalendar.styles"

// Event 인터페이스
interface Event {
  id: string;
  title: string;  
  description: string;
  start: Date;
  end: Date;
  accessibility: boolean | null;
  complete: boolean;
  status: "completed" | "upcoming" | "incomplete";
}

const mobileBreakpoint = 768;
const CustomCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const calendarRef = useRef<FullCalendar>(null);

  const calculateEventStatus = (
    event: Event,
  ): "completed" | "upcoming" | "incomplete" => {
    const now = new Date();

    if (event.complete) {
      return "completed";
    } else if (event.start > now) {
      return "upcoming";
    } else if (!event.complete && event.end < now) {
      return "incomplete";
    }

    return "incomplete";
  };

  const parseEventDates = (event: any): Event => ({
    ...event,
    id: event.id.toString(),
    start: new Date(event.start_date),
    end: new Date(event.end_date),
  });

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint);
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateSize();
        calendarApi.changeView(window.innerWidth <= mobileBreakpoint ? 'timeGridDay' : 'timeGridWeek');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint);
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        // 모바일에서는 3일 뷰, 데스크탑에서는 주간 뷰로 전환
        calendarApi.changeView(window.innerWidth <= mobileBreakpoint ? 'timeGridThreeDay' : 'timeGridWeek');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div css={appContainerStyles}>
        <h1 css={appTitleStyles}>계획표 예시</h1>
        <div css={calendarStyles}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            views={{
              timeGridThreeDay: {
                type: 'timeGrid',
                duration: { days: 3 }, // 3일 뷰 설정
              }
            }}
            initialView={isMobile ? "timeGridThreeDay" : "timeGridWeek"}
            initialDate={currentDate}
            headerToolbar={{
              left: "title",
              center: "",
              right: isMobile ? "prev,next,today" : "prev,next,today",
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
              const event = events.find((e) => e.id === eventInfo.event.id);
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
    </>
  );
};

export default CustomCalendar;