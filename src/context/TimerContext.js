import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [timers, setTimers] = useState([]);

    // Load timers from AsyncStorage when the app starts
    useEffect(() => {
        const loadTimers = async () => {
            try {
                const savedTimers = await AsyncStorage.getItem("timers");
                if (savedTimers) {
                    setTimers(JSON.parse(savedTimers));
                }
            } catch (error) {
                console.error("Failed to load timers:", error);
            }
        };
        loadTimers();
    }, []);

    // Save timers to AsyncStorage whenever they change
    useEffect(() => {
        const saveTimers = async () => {
            try {
                await AsyncStorage.setItem("timers", JSON.stringify(timers));
            } catch (error) {
                console.error("Failed to save timers:", error);
            }
        };
        saveTimers();
    }, [timers]);

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
                if (timer.id === id) {
                    if (timer.intervalId) {
                        clearInterval(timer.intervalId); // Stop the interval for that timer
                    }
                    return { ...timer, remainingTime: timer.duration, status: "Pending", intervalId: null };
                }
                return timer; // Keep other timers unchanged
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
