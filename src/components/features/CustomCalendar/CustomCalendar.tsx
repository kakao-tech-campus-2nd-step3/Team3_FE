/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventInput, EventContentArg } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import breakpoints from "@/variants/breakpoints";
import {
  appContainerStyles,
  appTitleStyles,
  calendarStyles,
  eventItemStyles,
} from "./CustomCalendar.styles";
import useDeletePlan from "@/api/hooks/useDeletePlans";

// event interface
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  accessibility: boolean | null;
  complete: boolean;
}

interface CustomCalendarProps {
  calendarOwner?: string;
  plans?: CalendarEvent[];
}

const VIEW_MODES = {
  THREEDAY: "timeGridThreeDay",
  WEEK: "timeGridWeek",
};

// event 상태 계산기
const calculateEventStatus = (event: CalendarEvent) => {
  const now = new Date();
  if (event.complete) return "completed";
  if (event.start > now) return "upcoming";
  if (!event.complete && event.end < now) return "incomplete";
  return "incomplete";
};

// render event
const renderEventContent = (
  eventInfo: EventContentArg,
  handleDelete: (id: string) => void,
) => {
  const { event, timeText } = eventInfo;
  const description = event.extendedProps?.description || "";

  return (
    <div css={eventItemStyles("", false)}>
      <div>{timeText}</div>
      <div>{event.title}</div>
      <div>{description}</div>
      <button
        type="button"
        onClick={() => handleDelete(event.id)}
        style={{
          marginTop: "4px",
          color: "red",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
      >
        삭제
      </button>
    </div>
  );
};

// Main CustomCalendar component
const CustomCalendar: React.FC<CustomCalendarProps> = ({
  calendarOwner,
  plans = [],
}) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoints.sm);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const { mutate: deletePlan } = useDeletePlan();

  // 이벤트 삭제 핸들러
  const handleDelete = useCallback(
    (id: string) => {
      // eslint-disable-next-line no-alert
      if (window.confirm("정말로 삭제하시겠습니까? ")) {
        deletePlan(Number(id));
      }
    },
    [deletePlan],
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const currentMobile = window.innerWidth <= breakpoints.sm;
      setIsMobile(currentMobile);

      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.changeView(
          currentMobile ? "timeGridThreeDay" : "timeGridWeek",
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // 초기 화면 크기 설정
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // 빈 종속성 배열로 설정하여 처음 렌더링 시에만 실행

  // Initialize events from props
  useEffect(() => {
    const parsedEvents = plans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      start: new Date(plan.start),
      end: new Date(plan.end),
      className: `fc-event-${calculateEventStatus(plan)}`,
      extendedProps: {
        description: plan.description,
      },
    }));

    // 기존 events와 비교하여 변경된 경우에만 상태 업데이트
    const areEventsEqual =
      JSON.stringify(events) === JSON.stringify(parsedEvents);
    if (!areEventsEqual) {
      setEvents(parsedEvents);
    }
  }, [plans, events]);

  // event drop 및 resize handle
  const handleEventChange = useCallback((info: { event: any }) => {
    const description = info.event.extendedProps?.description || "";

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end,
              className: `fc-event-${calculateEventStatus({
                id: info.event.id || "",
                title: info.event.title || "",
                description,
                start: new Date(info.event.start),
                end: new Date(info.event.end),
                accessibility: null,
                complete: false,
              })}`,
            }
          : event,
      ),
    );
  }, []);

  return (
    <div css={appContainerStyles}>
      <h1 css={appTitleStyles}>{calendarOwner || "My Calendar"}</h1>
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
          slotDuration="00:30:00" // 30분 간격 설정
          slotLabelInterval="01:00:00" // 1시간 간격으로 시간 레이블 표시
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24시간 형식
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          allDaySlot={false} // 하루 종일 슬롯 비활성화
          editable // 이벤트 드래그 및 드롭 가능
          eventResizableFromStart
          eventDrop={handleEventChange}
          eventResize={handleEventChange}
          eventContent={(eventInfo) =>
            renderEventContent(eventInfo, handleDelete)
          }
          selectable={false}
          selectMirror={false}
          dayMaxEvents // 하루에 최대 이벤트 수 제한
          weekends // 주말 표시
          firstDay={1} // 주 시작 요일을 월요일로 설정
          events={events} // 이벤트 데이터
          datesSet={(dateInfo) => setCurrentDate(dateInfo.start)} // 날짜 범위가 변경될 때 호출
          dayHeaderFormat={{
            weekday: "short",
            month: "numeric",
            day: "numeric",
            omitCommas: true,
          }}
          height={isMobile ? "85%" : "100%"} // 모바일에서의 높이 설정
        />
      </div>
    </div>
  );
};

export default CustomCalendar;
