/** @jsxImportSource @emotion/react */
import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { css, Global } from '@emotion/react';
import koLocale from '@fullcalendar/core/locales/ko';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  status: 'completed' | 'upcoming' | 'incomplete';
}

const globalStyles = css`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
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

  .fc-toolbar-title {
    font-size: 1.25rem !important;
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

  .fc-timegrid-slot {
    height: 3rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .fc-timegrid-slot-minor {
    border-bottom: 1px dashed rgba(229, 231, 235, 0.5);
  }

  .fc-timegrid-axis {
    width: 3rem;
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

  .fc-day-today {
    background-color: inherit !important;
  }

  .fc-col-header-cell.fc-day-today {
    background-color: #39A7F7 !important;
    color: white;
  }

  .fc-button {
    border: none;               /* 테두리 제거 */
    padding: 0.5rem 1rem;       /* 버튼 패딩 조절 */
  }

  .fc-button:hover {
    background-color: #338bd0;  /* 버튼 hover 효과 */
  }
  
  .fc-toolbar-chunk {
    display: flex;                  /* flex 레이아웃 사용 */
    justify-content: center;        /* 가운데 정렬 */
    align-items: center;            /* 수직 가운데 정렬 */
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

  ${status === 'completed' && `
    background-color: #e5e7eb;
    border-left-color: #9ca3af;
  `}
  ${status === 'upcoming' && `
    background-color: #dbeafe;
    border-left-color: #3b82f6;
  `}
  ${status === 'incomplete' && `
    background-color: #fee2e2;
    border-left-color: #ef4444;
  `}
`;

const CustomCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([ 
    {
      id: '1',
      title: '완료한 일정',
      start: new Date(2024, 8, 23, 10), //月은 -1후 입력
      end: new Date(2024, 8, 23, 14),
      description: '추가 Description',
      status: 'completed',
    },
    {
      id: '2',
      title: '예정 일정',
      start: new Date(2024, 8, 24, 13),
      end: new Date(2024, 8, 24, 17),
      description: '추가 Description',
      status: 'upcoming',
    },
    {
      id: '3',
      title: '미완료 일정',
      start: new Date(2024, 8, 25, 15),
      end: new Date(2024, 8, 25, 18),
      description: '추가 Description',
      status: 'incomplete',
    },
  ]);

  const handleEventDrop = useCallback((info: any) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === info.event.id
          ? { ...event, start: info.event.start, end: info.event.end }
          : event
      )
    );
  }, []);

  const handleEventResize = useCallback((info: any) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === info.event.id
          ? { ...event, start: info.event.start, end: info.event.end }
          : event
      )
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
              left: 'title',
              center: '',
              right: 'prev next today'
            }}
            locale={koLocale}
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            allDaySlot={false}
            editable={true}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            weekends={true}
            firstDay={1}
            events={events.map(event => ({
              ...event,
              className: `fc-event-${event.status}`,
            }))}
            eventResizableFromStart={true}
            eventContent={(eventInfo) => {
              const event = events.find(e => e.id === eventInfo.event.id);
              return (
                <div css={eventItemStyles(event ? event.status : '', false)}>
                  <div>{eventInfo.timeText}</div>
                  <div>{eventInfo.event.title}</div>
                  {event && <div>{event.description}</div>}
                  
                </div>
              )
            }}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            datesSet={(dateInfo) => setCurrentDate(dateInfo.start)}
            duration={{ days: 7 }}
            dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true }}
          />
        </div>
      </div>
    </>
  );
};

export default CustomCalendar;