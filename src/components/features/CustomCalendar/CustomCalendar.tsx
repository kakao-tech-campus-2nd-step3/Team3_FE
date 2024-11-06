/** @jsxImportSource @emotion/react */
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import FullCalendar from "@fullcalendar/react";
import { EventContentArg } from "@fullcalendar/core/index.js";
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
import Modal from "./PlanModal";
import Button from "@/components/common/Button/Button";

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
  isReadOnly?: boolean;
  onPlanChange?: (plans: CalendarEvent[]) => void;
  onDeletePlan?: (planId: string) => void;
}

const VIEW_MODES = {
  THREEDAY: "timeGridThreeDay",
  WEEK: "timeGridWeek",
};

const calculateEventStatus = (event: CalendarEvent) => {
  const now = new Date();
  if (event.complete) return "completed";
  if (event.start > now) return "upcoming";
  if (!event.complete && event.end < now) return "incomplete";
  return "incomplete";
};

const renderEventContent = (
  eventInfo: EventContentArg,
  handleDelete: (id: string) => void,
  handleEdit: (id: string, title: string, description: string) => void,
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
      <button
        type="button"
        onClick={() => handleEdit(event.id, event.title, description)}
        style={{
          color: "blue",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
      >
        수정
      </button>
    </div>
  );
};

const parseDate = (date: any) => {
  return typeof date === "string" || typeof date === "number"
    ? new Date(date)
    : date;
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  calendarOwner,
  plans = [],
  isReadOnly = false,
  onPlanChange,
  onDeletePlan,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoints.sm);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const { mutate: deletePlan } = useDeletePlan();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPlan, setCurrentEditPlan] =
    useState<Partial<CalendarEvent> | null>(null);

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("정말로 삭제하시겠습니까? ")) {
        if (onDeletePlan) {
          onDeletePlan(id); // Use the provided onDeletePlan function
        } else {
          deletePlan(Number(id)); // Fall back to internal delete function if not provided
        }
      }
    },
    [deletePlan],
  );

  const handleEdit = (id: string, title: string, description: string) => {
    setCurrentEditPlan({ id, title, description });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    if (currentEditPlan && currentEditPlan.id) {
      const updatedPlans = plans.map((plan) =>
        plan.id === currentEditPlan.id
          ? {
              ...plan,
              title: currentEditPlan.title || "",
              description: currentEditPlan.description || "",
            }
          : plan,
      );
      onPlanChange?.(updatedPlans); // 업데이트된 플랜 반영
      setIsEditModalOpen(false); // 모달 닫기
      setCurrentEditPlan(null);
    }
  };

  const handleResize = useCallback(() => {
    const currentMobile = window.innerWidth <= breakpoints.sm;
    setIsMobile(currentMobile);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(
      currentMobile ? "timeGridThreeDay" : "timeGridWeek",
    );
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const parsedEvents = useMemo(
    () =>
      (plans || []).map((plan) => ({
        id: plan.id,
        title: plan.title,
        start: parseDate(plan.start),
        end: parseDate(plan.end),
        className: `fc-event-${calculateEventStatus(plan)}`,
        extendedProps: {
          description: plan.description,
        },
      })),
    [plans],
  );

  const handleEventChange = useCallback(
    (info: { event: any }) => {
      const updatedPlans = plans.map((plan) =>
        plan.id === info.event.id
          ? {
              ...plan,
              start: info.event.start,
              end: info.event.end,
            }
          : plan,
      );
      onPlanChange?.(updatedPlans); // 외부에 변경된 plans 전달
    },
    [onPlanChange, plans],
  );

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
          slotDuration="00:10:00"
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
          editable={!isReadOnly}
          eventStartEditable={!isReadOnly}
          eventDurationEditable={!isReadOnly}
          eventResizableFromStart={!isReadOnly}
          eventDrop={isReadOnly ? undefined : handleEventChange}
          eventResize={handleEventChange}
          eventContent={(eventInfo) =>
            renderEventContent(eventInfo, handleDelete, handleEdit)
          }
          selectable={false}
          selectMirror={false}
          dayMaxEvents
          weekends
          firstDay={1}
          events={parsedEvents}
          datesSet={(dateInfo) => setCurrentDate(dateInfo.start)}
          dayHeaderFormat={{
            weekday: "short",
            month: "numeric",
            day: "numeric",
            omitCommas: true,
          }}
          height={isMobile ? "85%" : "100%"}
        />
        {/* Edit Modal */}
        {isEditModalOpen && currentEditPlan && (
          <Modal onClose={() => setIsEditModalOpen(false)}>
            <h2>플랜 수정</h2>
            <input
              placeholder="제목"
              value={currentEditPlan.title || ""}
              onChange={(e) =>
                setCurrentEditPlan((prev) =>
                  prev ? { ...prev, title: e.target.value } : prev,
                )
              }
            />
            <input
              placeholder="설명"
              value={currentEditPlan.description || ""}
              onChange={(e) =>
                setCurrentEditPlan((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev,
                )
              }
            />
            <Button onClick={handleEditSubmit}>저장</Button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
