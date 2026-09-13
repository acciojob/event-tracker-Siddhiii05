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

  const handleSelectSlot = ({ start }) => {
    setPopupMode("create");
    setSelectedEvent(null);
    setSelectedDate(start);

    setTitle("");
    setLocation("");

    setShowPopup(true);
  };

  const handleSelectEvent = (event) => {
    setPopupMode("edit");
    setSelectedEvent(event);

    setTitle(event.title);
    setLocation(event.location || "");

    setShowPopup(true);
  };

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

  const handleEditEvent = () => {
    if (title.trim() === "" || !selectedEvent) {
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: title.trim(),
              location: location.trim(),
            }
          : event
      )
    );

    closePopup();
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) {
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.filter(
        (event) => event.id !== selectedEvent.id
      )
    );

    closePopup();
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMode("create");

    setSelectedEvent(null);
    setSelectedDate(null);

    setTitle("");
    setLocation("");
  };

  const getFilteredEvents = () => {
    const currentTime = new Date();

    if (filter === "past") {
      return events.filter(
        (event) => event.start < currentTime
      );
    }

    if (filter === "upcoming") {
      return events.filter(
        (event) => event.start >= currentTime
      );
    }

    return events;
  };

  const eventStyleGetter = (event) => {
    const currentTime = new Date();

    const backgroundColor =
      event.start < currentTime
        ? "rgb(222, 105, 135)"
        : "rgb(140, 189, 76)";

    return {
      style: {
        backgroundColor,
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
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <input
              type="text"
              placeholder="Event Location"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            />

            <div className="mm-popup__box__footer">
              <div className="mm-popup__box__footer__left-space">
                {popupMode === "edit" && (
                  <button
                    className="mm-popup__btn--danger"
                    onClick={handleDeleteEvent}
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="mm-popup__box__footer__right-space">
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
        </div>
      )}
    </div>
  );
};

export default App;