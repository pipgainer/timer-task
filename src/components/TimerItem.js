import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TimerItem({ timer }) {
    const [remainingTime, setRemainingTime] = useState(timer.duration);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <View style={styles.timerCard}>
            <Text style={styles.timerName}>{timer.name}</Text>
            <Text style={styles.timerTime}>{remainingTime}s</Text>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => setIsRunning(!isRunning)} style={styles.button}>
                    <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRemainingTime(timer.duration)} style={[styles.button, styles.reset]}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    timerCard: { padding: 15, backgroundColor: "#E9ECEF", borderRadius: 10, marginVertical: 5 },
    timerName: { fontSize: 16, fontWeight: "bold" },
    timerTime: { fontSize: 14, color: "#6C757D", marginBottom: 10 },
    actions: { flexDirection: "row", justifyContent: "space-between" },
    button: { padding: 10, backgroundColor: "#28A745", borderRadius: 5 },
    reset: { backgroundColor: "#DC3545" },
    buttonText: { color: "white", fontWeight: "bold" },
});
