/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  globalStyles,
  appContainerStyles,
  appTitleStyles,
  calendarStyles,
  eventItemStyles,
} from "./CustomCalendar.styles";
import { Global } from "@emotion/react";
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
