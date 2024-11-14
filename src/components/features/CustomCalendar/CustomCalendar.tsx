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
import { css } from "@emotion/react";
import { createPortal } from "react-dom";
import breakpoints from "@/variants/breakpoints";
import {
  appContainerStyles,
  appTitleStyles,
  calendarStyles,
  eventItemStyles,
  dropdownItemStyles,
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
    border-color: #2196f3; /* focus:border-[#2196F3] */
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2); /* focus:ring-2 focus:ring-[#2196F3] */
  }
`;

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  accessibility: boolean | null;
  isCompleted: boolean;
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
  if (event.isCompleted) return "completed";
  if (event.start > now) return "upcoming";
  if (!event.isCompleted && event.end < now) return "incomplete";
  return "incomplete";
};

const EventContent = ({
  eventInfo,
  handleDelete,
  handleEdit,
  handleToggleComplete,
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
  handleToggleComplete: (id: string) => void;
  isReadOnly: boolean;
}) => {
  const { event, timeText } = eventInfo;
  const description = event.extendedProps?.description || "";
  const accessibility = event.extendedProps?.accessibility || false;
  const isCompleted = event.extendedProps?.isCompleted ?? false;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const eventRef = useRef<HTMLDivElement>(null);

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsDropdownOpen((prev) => !prev);

    // Calculate and set the dropdown position
    if (eventRef.current) {
      const rect = eventRef.current.getBoundingClientRect();
      const dropdownWidth = 120; // 드롭다운 메뉴의 예상 너비
      const dropdownHeight = 150; // 드롭다운 메뉴의 예상 높이
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY; // 기본적으로 아래쪽에 표시

      // 드롭다운 메뉴가 화면의 오른쪽 밖으로 나가는지 확인
      if (left + dropdownWidth > viewportWidth) {
        left = viewportWidth - dropdownWidth - 10; // 오른쪽 여백 10px 확보
      }

      // 드롭다운 메뉴가 화면의 하단 밖으로 나가는지 확인
      if (rect.bottom + dropdownHeight > viewportHeight) {
        top = rect.top + window.scrollY - dropdownHeight; // 위쪽에 표시
      }
      setDropdownPosition({
        top,
        left,
      });
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
    } else if (option === "toggleComplete") {
      handleToggleComplete(event.id);
    }
    setIsDropdownOpen(false);
  };

  // 드롭다운 외부 클릭 시 닫힘 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (eventRef.current && !eventRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Portal 이용해서 드랍다운 메뉴 렌더링
  const DropdownMenu = (
    <div
      css={dropdownMenuStyles}
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        zIndex: 9999,
      }}
    >
      <div
        css={css`
          ${dropdownItemStyles};
          white-space: normal;
          word-break: break-word;
        `}
      >
        {description}
      </div>
      {!isReadOnly && (
        <>
          <div
            css={[
              dropdownItemStyles,
              css`
                color: blue;
                transition:
                  background-color 0.3s ease,
                  transform 0.2s ease;
                &:hover {
                  background-color: rgba(0, 0, 255, 0.1);
                }
              `,
            ]}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("edit");
            }}
          >
            수정
          </div>
          <div
            css={[
              dropdownItemStyles,
              css`
                color: red;
                transition:
                  background-color 0.3s ease,
                  transform 0.2s ease;
                &:hover {
                  background-color: rgba(255, 0, 0, 0.1);
                }
              `,
            ]}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("delete");
            }}
          >
            삭제
          </div>
          <div
            css={[
              dropdownItemStyles,
              css`
                color: green;
                transition:
                  background-color 0.3s ease,
                  transform 0.2s ease;
                &:hover {
                  background-color: rgba(0, 255, 0, 0.1);
                }
              `,
            ]}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("toggleComplete");
            }}
          >
            완료
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div
        ref={eventRef}
        css={eventItemStyles("", false)}
        onClick={handleEventClick}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
        style={{ position: "relative", cursor: "pointer" }}
      >
        <div>{timeText}</div>
        <div>{event.title}</div>
      </div>
      {isDropdownOpen && createPortal(DropdownMenu, document.body)}
    </>
  );
};

// renderEventContent 함수
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
  handleToggleComplete: (id: string) => void,
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
      handleToggleComplete={handleToggleComplete}
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
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= breakpoints.sm,
  );
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
      isCompleted: isCompleted ?? undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    if (currentEditPlan && currentEditPlan.id) {
      const updatedPlan = {
        title: currentEditPlan.title || "",
        description: currentEditPlan.description || "",
        accessibility: Boolean(currentEditPlan.accessibility),
        isCompleted: Boolean(currentEditPlan.isCompleted),
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

  const handleToggleComplete = useCallback(
    (id: string) => {
      const updatedPlans = plans.map((plan) =>
        plan.id === id ? { ...plan, isCompleted: !plan.isCompleted } : plan,
      );
      onPlanChange?.(updatedPlans);
    },
    [plans, onPlanChange],
  );

  const handleResize = useCallback(() => {
    const isMobileNow =
      typeof window !== "undefined" && window.innerWidth <= breakpoints.sm;
    setIsMobile(isMobileNow);
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    const currentViewType = calendarApi.view.type;
    // 화면 크기에 따라 뷰를 설정
    if (isMobileNow && currentViewType !== VIEW_MODES.THREEDAY) {
      calendarApi.changeView(VIEW_MODES.THREEDAY);
    } else if (!isMobileNow && currentViewType !== VIEW_MODES.WEEK) {
      calendarApi.changeView(VIEW_MODES.WEEK);
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
          isCompleted: plan.isCompleted,
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

  const eventContent = useCallback(
    (eventInfo: EventContentArg) =>
      renderEventContent(
        eventInfo,
        currentView,
        handleDelete,
        handleEdit,
        handleToggleComplete,
        isReadOnly,
      ),
    [handleDelete, handleEdit, handleToggleComplete, isReadOnly, currentView],
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
          datesSet={(dateInfo) => {
            setCurrentDate(dateInfo.start);
            setCurrentView(dateInfo.view.type);
          }}
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
              <Button onClick={handleEditSubmit}>저장</Button>
            </ModalContainer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
