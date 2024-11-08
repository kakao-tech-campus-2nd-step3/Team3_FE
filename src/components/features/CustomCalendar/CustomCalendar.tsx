/** @jsxImportSource @emotion/react */
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import FullCalendar from "@fullcalendar/react";
import { EventContentArg } from "@fullcalendar/core";
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
  onUpdatePlan?: (planId: string, planData: any) => void;
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
  handleEdit: (
    id: string,
    title: string,
    description: string,
    accessibility: boolean | null,
    isCompleted: boolean | null,
  ) => void,
  isReadOnly: boolean,
) => {
  const { event, timeText } = eventInfo;
  const description = event.extendedProps?.description || "";
  const accessibility = event.extendedProps?.accessibility || false;
  const isCompleted = event.extendedProps?.isCompleted || false;

  return (
    <div css={eventItemStyles("", false)}>
      <div>{timeText}</div>
      <div>{event.title}</div>
      <div>{description}</div>
      {!isReadOnly && (
        <div>
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
        onClick={() =>
          handleEdit(
            event.id,
            event.title,
            description,
            accessibility,
            isCompleted,
          )
        }
        style={{
          color: "blue",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
      >
        수정
      </button>
      </div>
    )}
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
          onDeletePlan(id);
        } else {
          deletePlan(Number(id));
        }
      }
    },
    [deletePlan, onDeletePlan],
  );

  const handleEdit = (
    id: string,
    title: string,
    description: string,
    accessibility: boolean | null,
    isCompleted: boolean | null,
  ) => {
    setCurrentEditPlan({
      id,
      title,
      description,
      accessibility,
      complete: isCompleted ?? undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    if (currentEditPlan && currentEditPlan.id) {
      const updatedPlan = {
        title: currentEditPlan.title || "",
        description: currentEditPlan.description || "",
        accessibility: Boolean(currentEditPlan.accessibility), 
        isCompleted: Boolean(currentEditPlan.complete), 
      };

      // 수정된 플랜 리스트 업데이트
      const updatedPlans = plans.map((plan) =>
        plan.id === currentEditPlan.id ? { ...plan, ...updatedPlan } : plan,
      );
      onPlanChange?.(updatedPlans);
      setIsEditModalOpen(false);
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
          accessibility: plan.accessibility,
          isCompleted: plan.complete,
        },
      })),
    [plans],
  );

  const handleEventChange = useCallback(
    (info: { event: any }) => {
      const updatedPlans = plans.map((plan) =>
        plan.id === info.event.id
          ? { ...plan, start: info.event.start, end: info.event.end }
          : plan,
      );
      onPlanChange?.(updatedPlans);
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
            renderEventContent(eventInfo, handleDelete, handleEdit, isReadOnly)
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
            공개 여부:
            <input
              type="checkbox"
              checked={currentEditPlan.accessibility || false}
              onChange={(e) =>
                setCurrentEditPlan((prev) =>
                  prev ? { ...prev, accessibility: e.target.checked } : prev,
                )
              }
            />
            완료 여부:
            <input
              type="checkbox"
              checked={currentEditPlan.complete || false}
              onChange={(e) =>
                setCurrentEditPlan((prev) =>
                  prev ? { ...prev, complete: e.target.checked } : prev,
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