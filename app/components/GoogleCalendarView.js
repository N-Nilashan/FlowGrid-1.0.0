'use client'
import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const GoogleCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('timeGridWeek');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/calendar/events');
        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to change calendar view
  const changeView = (newView) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Fetching Your Calendar Events</h3>
                <p className="text-gray-400 max-w-md">
                  Please wait while we sync your latest calendar events...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-red-500/20">
          <div className="p-8 text-center">
            <div className="text-red-400 mb-4">Error: {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131314] rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-[#1A1A1C] rounded-2xl max-w-lg w-full shadow-2xl border border-white/10"
            style={{
              background: 'linear-gradient(145deg, #1A1A1C 0%, #131314 100%)'
            }}
          >
            {/* Header with color accent */}
            <div
              className="p-6 rounded-t-2xl flex justify-between items-start"
              style={{
                backgroundColor: selectedEvent.backgroundColor,
                borderBottom: `1px solid ${selectedEvent.borderColor}`
              }}
            >
              <h3 className="text-2xl font-semibold text-white break-words max-w-[80%]">
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-black/20 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Time Section */}
              <div className="flex items-start space-x-3">
                <div className="text-purple-400 mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {selectedEvent.allDay ? (
                      new Date(selectedEvent.start).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    ) : (
                      <>
                        {new Date(selectedEvent.start).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        <br />
                        <span className="text-gray-400">
                          {new Date(selectedEvent.start).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {' - '}
                          {new Date(selectedEvent.end).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </>
                    )}
                  </p>
                  {selectedEvent.allDay && (
                    <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      All Day
                    </span>
                  )}
                </div>
              </div>

              {/* Location Section */}
              {selectedEvent.location && (
                <div className="flex items-start space-x-3">
                  <div className="text-purple-400 mt-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {/* Description Section */}
              {selectedEvent.description && (
                <div className="flex items-start space-x-3">
                  <div className="text-purple-400 mt-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Your Calendar</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => changeView('timeGridDay')}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${view === 'timeGridDay'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Day
            </button>
            <button
              onClick={() => changeView('timeGridWeek')}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${view === 'timeGridWeek'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => changeView('dayGridMonth')}
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
              --fc-today-bg-color: rgba(124, 58, 237, 0.1);
              --fc-page-bg-color: #131314;
              --fc-neutral-bg-color: #131314;
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
              padding: 2px 4px;
              border: none !important;
              border-radius: 4px !important;
              font-size: 12px;
              cursor: pointer;
            }
            .fc-event:hover {
              filter: brightness(90%);
            }
            .fc-event-title,
            .fc-event-time {
              font-weight: 500;
              padding: 2px 4px;
            }
            .fc-toolbar-title {
              color: #F3F4F6;
            }
            .fc-view {
              background: #131314;
              border-radius: 8px;
              overflow: hidden;
            }
            .fc-timegrid-event-harness {
              margin: 0 1px;
            }
            .fc-timegrid-event {
              border-radius: 4px !important;
              border: none !important;
              padding: 2px 4px;
            }
            .fc-timegrid-event .fc-event-time {
              font-size: 12px;
              font-weight: 500;
              opacity: 0.9;
            }
            .fc-timegrid-event .fc-event-title {
              font-size: 12px;
              font-weight: 400;
            }
            .fc-timegrid-slot-label {
              color: #9CA3AF;
            }
            .fc-col-header-cell {
              background-color: rgba(75, 85, 99, 0.2);
            }
            .fc-scrollgrid {
              border-radius: 8px;
            }
            .fc-day-disabled {
              background-color: rgba(75, 85, 99, 0.1);
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
            events={events}
            height="700px"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            slotMinTime="00:00:00"
            slotMaxTime="23:59:00"
            eventClick={(info) => {
              setSelectedEvent(info.event);
            }}
            eventContent={(eventInfo) => {
              return (
                <>
                  <div className="fc-event-time" style={{ color: eventInfo.event.textColor }}>
                    {eventInfo.timeText}
                  </div>
                  <div className="fc-event-title" style={{ color: eventInfo.event.textColor }}>
                    {eventInfo.event.title}
                  </div>
                </>
              );
            }}
            eventDidMount={(info) => {
              // Add hover effect and set background color
              info.el.style.transition = 'filter 0.2s ease';
              info.el.style.backgroundColor = info.event.backgroundColor;
              info.el.style.borderColor = info.event.borderColor;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarView;
