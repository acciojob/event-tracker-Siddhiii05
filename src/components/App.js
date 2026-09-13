import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/App.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);

  const [filter, setFilter] = useState("all");

  const [showPopup, setShowPopup] = useState(false);

  const [popupMode, setPopupMode] = useState("create");

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);

  const [title, setTitle] = useState("");

  const [location, setLocation] = useState("");

  // Open popup when an empty date/time slot is selected
  const handleSelectSlot = ({ start }) => {
    setPopupMode("create");
    setSelectedEvent(null);
    setSelectedDate(start);

    setTitle("");
    setLocation("");

    setShowPopup(true);
  };

  // Open popup when an existing event is selected
  const handleSelectEvent = (event) => {
    setPopupMode("edit");
    setSelectedEvent(event);

    setTitle(event.title);
    setLocation(event.location);

    setShowPopup(true);
  };

  // Save a new event
  const handleCreateEvent = () => {
    if (title.trim() === "") {
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      location: location.trim(),
      start: selectedDate,
      end: moment(selectedDate).add(1, "hour").toDate(),
    };

    setEvents((previousEvents) => [
      ...previousEvents,
      newEvent,
    ]);

    closePopup();
  };

  // Update an existing event
  const handleEditEvent = () => {
    if (title.trim() === "") {
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.map((event) => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            title: title.trim(),
            location: location.trim(),
          };
        }

        return event;
      })
    );

    closePopup();
  };

  // Delete an existing event
  const handleDeleteEvent = () => {
    setEvents((previousEvents) =>
      previousEvents.filter(
        (event) => event.id !== selectedEvent.id
      )
    );

    closePopup();
  };

  // Close popup and reset popup-related state
  const closePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    setTitle("");
    setLocation("");
  };

  // Filter events according to the selected filter
  const getFilteredEvents = () => {
    const currentTime = new Date();

    if (filter === "past") {
      return events.filter((event) => event.start < currentTime);
    }

    if (filter === "upcoming") {
      return events.filter((event) => event.start >= currentTime);
    }

    return events;
  };

  // Apply different colors to past and upcoming events
  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();

    return {
      style: {
        backgroundColor: isPast
          ? "rgb(222, 105, 135)"
          : "rgb(140, 189, 76)",
        color: "white",
        border: "none",
        borderRadius: "4px",
      },
    };
  };

  return (
    <div className="app">
      <h1>Event Tracker Calendar</h1>

      <div className="filters">
        <button
          className="btn"
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className="btn"
          onClick={() => setFilter("past")}
        >
          Past
        </button>

        <button
          className="btn"
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={getFilteredEvents()}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        style={{ height: 600 }}
      />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>
              {popupMode === "create"
                ? "Create Event"
                : "Edit Event"}
            </h2>

            <input
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Event Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <div className="popup-footer">
              {popupMode === "edit" && (
                <button
                  className="mm-popup__btn--danger"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              )}

              <button
                className="close-btn"
                onClick={closePopup}
              >
                Cancel
              </button>

              <button
                className={
                  popupMode === "edit"
                    ? "mm-popup__btn--info"
                    : "mm-popup__btn"
                }
                onClick={
                  popupMode === "create"
                    ? handleCreateEvent
                    : handleEditEvent
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;