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
import { useQueryClient } from "@tanstack/react-query";
import breakpoints from "@/variants/breakpoints";
import {
  appContainerStyles,
  appTitleStyles,
  calendarStyles,
  eventItemStyles,
} from "./CustomCalendar.styles";
import useDeletePlan from "@/api/hooks/useDeletePlans";
import useUpdatePlans from "@/api/hooks/useUpdatePlans";
import useDeletePlanCard from "@/api/hooks/useDeletePlanCard";
import useUpdatePlanCard from "@/api/hooks/useUpdatePlanCard";
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
  isPreviewMode?: boolean;
  previewDeviceId?: string; // Preview mode deviceId
  previewGroupId?: string;  // Preview mode groupId
}

const VIEW_MODES = {
  THREEDAY: "timeGridThreeDay",
  WEEK: "timeGridWeek",
};

// Calculate event status
const calculateEventStatus = (event: CalendarEvent) => {
  const now = new Date();
  if (event.complete) return "completed";
  if (event.start > now) return "upcoming";
  if (!event.complete && event.end < now) return "incomplete";
  return "incomplete";
};

// Render event content
const renderEventContent = (
  eventInfo: EventContentArg,
  handleDelete: (id: string) => void,
  handleEdit: (event: CalendarEvent) => void,
  isReadOnly: boolean
) => {
  const { event, timeText } = eventInfo;
  const description = event.extendedProps?.description || "";

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
              marginRight: "8px",
            }}
          >
            삭제
          </button>
          <button
            type="button"
            onClick={() =>
              handleEdit({
                id: event.id,
                title: event.title,
                description,
                start: event.start!,
                end: event.end!,
                accessibility: event.extendedProps?.accessibility || null,
                complete: event.extendedProps?.complete || false,
              })
            }
            style={{
              marginTop: "4px",
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

// Parse date utility
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
  isPreviewMode = false,
  previewDeviceId,
  previewGroupId,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoints.sm);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const queryClient = useQueryClient();

  const { mutate: deletePlan } = useDeletePlan();
  const { mutate: updatePlan } = useUpdatePlans();
  const { mutate: deletePlanCard } = useDeletePlanCard();
  const { mutate: updatePlanCard } = useUpdatePlanCard();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPlan, setCurrentEditPlan] =
    useState<Partial<CalendarEvent> | null>(null);

  // Handle delete
  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        if (onDeletePlan) {
          onDeletePlan(id);
        } else if (isPreviewMode && previewDeviceId && previewGroupId) {
          // Preview mode delete
          deletePlanCard(
            {
              deviceId: previewDeviceId,
              groupId: previewGroupId,
              cardId: id,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ["planCards"],
                  exact: true,
                });
              },
            }
          );
        } else {
          // Regular delete
          deletePlan(Number(id));
        }
      }
    },
    [
      deletePlan,
      deletePlanCard,
      isPreviewMode,
      previewDeviceId,
      previewGroupId,
      queryClient,
      onDeletePlan,
    ]
  );

  // Handle edit (open modal)
  const handleEdit = useCallback((event: CalendarEvent) => {
    setCurrentEditPlan(event);
    setIsEditModalOpen(true);
  }, []);

  // Handle edit submit (modal form submission)
  const handleEditSubmit = () => {
    if (currentEditPlan && currentEditPlan.id) {
      const { id, title, description, start, end } = currentEditPlan;
      if (isPreviewMode && previewDeviceId && previewGroupId) {
        // Preview mode update
        updatePlanCard({
          deviceId: previewDeviceId,
          groupId: previewGroupId,
          cardId: id,
          planData: {
            title: title!,
            description: description!,
            startDate: start!.toISOString(),
            endDate: end!.toISOString(),
          },
        });
      } else if (onPlanChange) {
        // Local state update
        const updatedPlans = plans.map((plan) =>
          plan.id === id
            ? { ...plan, title: title!, description: description! }
            : plan
        );
        onPlanChange(updatedPlans);
      } else {
        // Regular update
          updatePlan({
          planId: Number(id),
          planData: {
            title: title!,
            description: description!,
            startDate: start!.toISOString(), 
            endDate: end!.toISOString(),
            accessibility: currentEditPlan.accessibility ?? false, 
            isCompleted: currentEditPlan.complete ?? false,
          },
        });
      }
      setIsEditModalOpen(false);
      setCurrentEditPlan(null);
    }
  };

  // Handle window resize
  const handleResize = useCallback(() => {
    const currentMobile = window.innerWidth <= breakpoints.sm;
    setIsMobile(currentMobile);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(
        currentMobile ? VIEW_MODES.THREEDAY : VIEW_MODES.WEEK
      );
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Prepare events for the calendar
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
          complete: plan.complete,
        },
      })),
    [plans]
  );

  // Handle event change (drag and drop)
  const handleEventChange = useCallback(
    (info: { event: any }) => {
      const updatedPlans = plans.map((plan) =>
        plan.id === info.event.id
          ? {
              ...plan,
              start: info.event.start,
              end: info.event.end,
            }
          : plan
      );
      onPlanChange?.(updatedPlans);
    },
    [onPlanChange, plans]
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
          editable={!isReadOnly}
          eventStartEditable={!isReadOnly}
          eventDurationEditable={!isReadOnly}
          eventResizableFromStart={!isReadOnly}
          eventDrop={isReadOnly ? undefined : handleEventChange}
          eventResize={handleEventChange}
          eventContent={(eventInfo) =>
            renderEventContent(
              eventInfo,
              handleDelete,
              handleEdit,
              isReadOnly
            )
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
                  prev ? { ...prev, title: e.target.value } : prev
                )
              }
            />
            <input
              placeholder="설명"
              value={currentEditPlan.description || ""}
              onChange={(e) =>
                setCurrentEditPlan((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev
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
