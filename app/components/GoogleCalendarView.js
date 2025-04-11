'use client'
import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const GoogleCalendarView = ({ events }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [view, setView] = useState('timeGridWeek');
  const calendarRef = useRef(null);

  useEffect(() => {
    if (events) {
      setCalendarEvents(events);
    }
  }, [events]);

  const handleViewChange = (newView) => {
    setView(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Your Calendar</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewChange('timeGridDay')}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${view === 'timeGridDay'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Day
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${view === 'timeGridWeek'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${view === 'dayGridMonth'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="calendar-container">
          <style jsx global>{`
            .fc {
              --fc-border-color: rgba(75, 85, 99, 0.5);
              --fc-button-bg-color: #4B5563;
              --fc-button-border-color: #4B5563;
              --fc-button-hover-bg-color: #374151;
              --fc-button-hover-border-color: #374151;
              --fc-button-active-bg-color: #7C3AED;
              --fc-button-active-border-color: #7C3AED;
              --fc-event-bg-color: #7C3AED;
              --fc-event-border-color: #7C3AED;
              --fc-today-bg-color: rgba(124, 58, 237, 0.1);
            }
            .fc-theme-standard td, .fc-theme-standard th {
              border-color: rgba(75, 85, 99, 0.5);
            }
            .fc-day-today {
              background: rgba(124, 58, 237, 0.1) !important;
            }
            .fc-button {
              padding: 6px 12px;
              font-size: 14px;
              border-radius: 6px !important;
              transition: all 0.2s;
            }
            .fc-button:focus {
              box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.5);
            }
            .fc-daygrid-day-number,
            .fc-col-header-cell-cushion {
              color: #D1D5DB;
            }
            .fc-daygrid-day-number:hover {
              color: #F3F4F6;
            }
            .fc-event {
              background: #7C3AED;
              border: none;
              padding: 2px 4px;
              border-radius: 4px;
              font-size: 12px;
            }
            .fc-event:hover {
              background: #6D28D9;
            }
            .fc-toolbar-title {
              color: #F3F4F6;
            }
            .fc-view {
              background: #1F2937;
              border-radius: 8px;
              overflow: hidden;
            }
          `}</style>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            events={calendarEvents}
            height="700px"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarView;
