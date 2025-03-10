import React, { createContext, useState, useEffect } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [timers, setTimers] = useState([]);

    // Function to start a timer
    const startTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id
                    ? { ...timer, status: "Running", intervalId: setInterval(() => updateTimer(id), 1000) }
                    : timer
            )
        );
    };

    // Function to pause a timer
    const pauseTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                if (timer.id === id && timer.intervalId) {
                    clearInterval(timer.intervalId);
                    return { ...timer, status: "Paused", intervalId: null };
                }
                return timer;
            })
        );
    };

    // Function to reset a timer
    const resetTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                if (timer.id === id && timer.intervalId) {
                    clearInterval(timer.intervalId);
                }
                return { ...timer, remainingTime: timer.duration, status: "Pending", intervalId: null };
            })
        );
    };

    // Function to update time every second
    const updateTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                if (timer.id === id && timer.remainingTime > 0) {
                    return { ...timer, remainingTime: timer.remainingTime - 1 };
                } else if (timer.id === id && timer.remainingTime === 0) {
                    clearInterval(timer.intervalId);
                    return { ...timer, status: "Completed", intervalId: null };
                }
                return timer;
            })
        );
    };

    return (
        <TimerContext.Provider value={{ timers, setTimers, startTimer, pauseTimer, resetTimer }}>
            {children}
        </TimerContext.Provider>
    );
};
