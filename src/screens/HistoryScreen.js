import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimerContext } from "../context/TimerContext";

export default function HistoryScreen() {
    const { timers } = useContext(TimerContext);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Completed Timers</Text>
            {timers.length === 0 ? (
                <Text style={styles.noTimers}>No timers completed yet.</Text>
            ) : (
                <FlatList
                    data={timers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.timerItem}>
                            <Text style={styles.timerName}>{item.name}</Text>
                            <Text style={styles.timerDuration}>{item.duration}s</Text>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    noTimers: { textAlign: "center", color: "#6C757D" },
    timerItem: { padding: 15, backgroundColor: "#E9ECEF", borderRadius: 10, marginVertical: 5 },
    timerName: { fontSize: 16, fontWeight: "bold" },
    timerDuration: { fontSize: 14, color: "#6C757D" },
    button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
    buttonText: { color: "white", fontWeight: "bold" },
});
