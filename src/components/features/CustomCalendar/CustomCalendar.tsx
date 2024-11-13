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
import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";
import {
  appContainerStyles,
  appTitleStyles,
  calendarStyles,
  eventItemStyles,
  dropdownItemStyles,
  dropdownItemRedStyles,
  dropdownMenuStyles,
} from "./CustomCalendar.styles";
import useDeletePlan from "@/api/hooks/useDeletePlan";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";

const ModalContainer = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.3);
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ToggleSwitch = styled.input`
  width: 20px;
  height: 20px;
`;

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

const EventContent = ({
  eventInfo,
  handleDelete,
  handleEdit,
  isReadOnly,
}: {
  eventInfo: EventContentArg;
  handleDelete: (id: string) => void;
  handleEdit: (
    id: string,
    title: string,
    description: string,
    accessibility: boolean | null,
    isCompleted: boolean | null,
  ) => void;
  isReadOnly: boolean;
}) => {
  const { event, timeText } = eventInfo;
  const description = event.extendedProps?.description || "";
  const accessibility = event.extendedProps?.accessibility || false;
  const isCompleted = event.extendedProps?.isCompleted || false;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };
  const handleOptionClick = (option: string) => {
    if (option === "edit") {
      handleEdit(
        event.id,
        event.title,
        description,
        accessibility,
        isCompleted,
      );
    } else if (option === "delete") {
      handleDelete(event.id);
    }
    setIsDropdownOpen(false);
  };
  // 드롭다운 외부 클릭 시 닫힘 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      setIsDropdownOpen(false);
    };
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <div
      css={eventItemStyles("", false)}
      onClick={handleEventClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={isDropdownOpen}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <div>{timeText}</div>
      <div>{event.title}</div>
      <div>{description}</div>
      {!isReadOnly && isDropdownOpen && (
        <ul css={dropdownMenuStyles}>
          <li
            css={dropdownItemStyles}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("edit");
            }}
          >
            수정
          </li>
          <li
            css={dropdownItemRedStyles}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("delete");
            }}
          >
            삭제
          </li>
        </ul>
      )}
    </div>
  );
};

// 이 함수도 컴포넌트 외부에 위치
const renderEventContent = (
  eventInfo: EventContentArg,
  currentView: string,
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
  if (currentView === "dayGridMonth") {
    return <div css={eventItemStyles("", false)} />;
  }

  return (
    <EventContent
      eventInfo={eventInfo}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      isReadOnly={isReadOnly}
    />
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
  const [currentView, setCurrentView] = useState<string>("timeGridWeek");
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const { mutate: deletePlan } = useDeletePlan();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPlan, setCurrentEditPlan] =
    useState<Partial<CalendarEvent> | null>(null);

  const handleDelete = useCallback(
    (id: string) => {
      if (onDeletePlan) {
        onDeletePlan(id);
      } else {
        deletePlan(Number(id));
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
    const currentMobile =
      typeof window !== "undefined" && window.innerWidth <= breakpoints.sm;
    setIsMobile(currentMobile);
    const calendarApi = calendarRef.current?.getApi();
    if (currentMobile && currentView !== VIEW_MODES.THREEDAY) {
      setCurrentView(VIEW_MODES.THREEDAY);
      calendarApi?.changeView(VIEW_MODES.THREEDAY);
    } else if (!currentMobile && currentView !== VIEW_MODES.WEEK) {
      setCurrentView(VIEW_MODES.WEEK);
      calendarApi?.changeView(VIEW_MODES.WEEK);
    }
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

  // useCallback으로 메모이제이션
  const eventContent = useCallback(
    (eventInfo: EventContentArg) =>
      renderEventContent(
        eventInfo,
        currentView,
        handleDelete,
        handleEdit,
        isReadOnly,
      ),
    [handleDelete, handleEdit, isReadOnly],
  );
  return (
    <div css={appContainerStyles}>
      {calendarOwner && <h1 css={appTitleStyles}>{calendarOwner}</h1>}
      <div css={calendarStyles}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          views={{
            timeGridThreeDay: {
              type: "timeGrid",
              duration: { days: 3 },
            },
            dayGridMonth: {
              type: "dayGridMonth",
              dayHeaderFormat: { weekday: "short" },
            },
          }}
          buttonText={{
            today: "오늘",
            month: "월",
            week: "주",
            day: "일",
            timeGridThreeDay: "3일",
          }}
          initialView={isMobile ? VIEW_MODES.THREEDAY : VIEW_MODES.WEEK}
          initialDate={currentDate}
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,timeGridThreeDay",
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
          eventContent={eventContent}
          selectable={false}
          selectMirror={false}
          dayMaxEvents
          weekends
          firstDay={1}
          timeZone="UTC"
          events={parsedEvents}
          viewDidMount={({ view }) => setCurrentView(view.type)}
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
            <ModalContainer>
              <Title>플랜 수정</Title>
              <StyledInput
                placeholder="제목"
                value={currentEditPlan.title || ""}
                onChange={(e) =>
                  setCurrentEditPlan((prev) =>
                    prev ? { ...prev, title: e.target.value } : prev,
                  )
                }
              />
              <StyledInput
                placeholder="설명"
                value={currentEditPlan.description || ""}
                onChange={(e) =>
                  setCurrentEditPlan((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev,
                  )
                }
              />
              <ToggleContainer>
                공개 여부
                <ToggleSwitch
                  type="checkbox"
                  checked={!!currentEditPlan.accessibility} // Converts null to false
                  onChange={(e) =>
                    setCurrentEditPlan((prev) => ({
                      ...prev,
                      accessibility: e.target.checked,
                    }))
                  }
                />
              </ToggleContainer>
              <ToggleContainer>
                완료 여부
                <ToggleSwitch
                  type="checkbox"
                  checked={currentEditPlan.complete}
                  onChange={(e) =>
                    setCurrentEditPlan((prev) => ({
                      ...prev,
                      complete: e.target.checked,
                    }))
                  }
                />
              </ToggleContainer>
              <Button onClick={handleEditSubmit}>저장</Button>
            </ModalContainer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
