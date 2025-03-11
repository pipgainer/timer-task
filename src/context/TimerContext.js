import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import { Modal, View, Text, Button } from "react-native";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [timers, setTimers] = useState([]);
    const [completedTimer, setCompletedTimer] = useState(null); // Track completed timer
    const [completedTimers, setCompletedTimers] = useState([]);

    // Load completed timers from AsyncStorage on app start
    useEffect(() => {
        const loadCompletedTimers = async () => {
            try {
                const savedCompletedTimers = await AsyncStorage.getItem("completedTimers");
                if (savedCompletedTimers) {
                    setCompletedTimers(JSON.parse(savedCompletedTimers));
                }
            } catch (error) {
                console.error("Failed to load completed timers:", error);
            }
        };
        loadCompletedTimers();
    }, []);

    // Save completed timers to AsyncStorage when they change
    useEffect(() => {
        const saveCompletedTimers = async () => {
            try {
                await AsyncStorage.setItem("completedTimers", JSON.stringify(completedTimers));
            } catch (error) {
                console.error("Failed to save completed timers:", error);
            }
        };
        saveCompletedTimers();
    }, [completedTimers]);

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
                    const completionTime = new Date().toLocaleString(); // Get current timestamp
                    const completedTimerData = { name: timer.name, completionTime };
                    console.log("completioono ttimer", completedTimerData)

                    setCompletedTimers((prev) => [...prev, completedTimerData]); // Add to log
                    console.log("completed timers", completedTimers)
                    setCompletedTimer(completedTimerData); // Show modal

                    return { ...timer, status: "Completed", intervalId: null };
                }
                return timer;
            })
        );
    };

    // CATEGORY-WISE ACTIONS
    const startCategory = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category && timer.status !== "Running"
                    ? { ...timer, status: "Running", intervalId: setInterval(() => updateTimer(timer.id), 1000) }
                    : timer
            )
        );
    };

    const pauseCategory = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                if (timer.category === category && timer.intervalId) {
                    clearInterval(timer.intervalId);
                    return { ...timer, status: "Paused", intervalId: null };
                }
                return timer;
            })
        );
    };

    const resetCategory = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                if (timer.category === category) {
                    if (timer.intervalId) {
                        clearInterval(timer.intervalId);
                    }
                    return { ...timer, remainingTime: timer.duration, status: "Pending", intervalId: null };
                }
                return timer;
            })
        );
    };

    return (
        <TimerContext.Provider value={{ timers, completedTimers, setTimers, startTimer, pauseTimer, resetTimer, startCategory, pauseCategory, resetCategory }}>
            {children}
            {/* Modal for Completed Timer */}
            {completedTimer && (
                <Modal transparent={true} animationType="fade">
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 10,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>🎉 Congratulations! 🎉</Text>
                            <Text style={{ marginTop: 10 }}>Timer "{completedTimer.name}" has completed!</Text>
                            <Button title="OK" onPress={() => setCompletedTimer(null)} />
                        </View>
                    </View>
                </Modal>
            )}
        </TimerContext.Provider>
    );
};
