import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-popup/style.css";
import "../styles/App.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const openCreatePopup = ({ start }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
    setTitle("");
    setLocation("");

    Popup.create({
      title: "Create Event",
      content: (
        <div>
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
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn",
            action: () => {
              if (title.trim() === "") {
                return;
              }

              const newEvent = {
                id: Date.now(),
                title: title,
                location: location,
                start: selectedDate,
                end: moment(selectedDate).add(1, "hour").toDate(),
              };

              setEvents((previousEvents) => [
                ...previousEvents,
                newEvent,
              ]);

              Popup.close();
            },
          },
        ],
      },
    });
  };

  const openEditPopup = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setLocation(event.location);

    Popup.create({
      title: "Edit Event",
      content: (
        <div>
          <input
            placeholder="Event Title"
            defaultValue={event.title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Event Location"
            defaultValue={event.location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      ),
      buttons: {
        left: [
          {
            text: "Delete",
            className: "mm-popup__btn--danger",
            action: () => {
              setEvents((previousEvents) =>
                previousEvents.filter(
                  (currentEvent) => currentEvent.id !== event.id
                )
              );

              Popup.close();
            },
          },
        ],
        right: [
          {
            text: "Edit",
            className: "mm-popup__btn--info",
            action: () => {
              setEvents((previousEvents) =>
                previousEvents.map((currentEvent) =>
                  currentEvent.id === event.id
                    ? {
                        ...currentEvent,
                        title: title,
                        location: location,
                      }
                    : currentEvent
                )
              );

              Popup.close();
            },
          },
        ],
      },
    });
  };

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

  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();

    return {
      style: {
        backgroundColor: isPast
          ? "rgb(222, 105, 135)"
          : "rgb(140, 189, 76)",
        color: "white",
        borderRadius: "4px",
        border: "none",
      },
    };
  };

  return (
    <div className="app">
      <h1>Event Tracker Calendar</h1>

      <div className="filters">
        <button className="btn" onClick={() => setFilter("all")}>
          All
        </button>

        <button className="btn" onClick={() => setFilter("past")}>
          Past
        </button>

        <button className="btn" onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={getFilteredEvents()}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={openCreatePopup}
        onSelectEvent={openEditPopup}
        eventPropGetter={eventStyleGetter}
        style={{ height: 600 }}
      />

      <Popup />
    </div>
  );
};

export default App;
