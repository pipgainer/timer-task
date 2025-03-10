import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimerContext } from "../context/TimerContext";
import { useTheme } from "../context/ThemeContext"; // Import Theme Hook

export default function HistoryScreen() {
    const { timers } = useContext(TimerContext);
    const navigation = useNavigation();
    const { theme } = useTheme(); // Get theme state

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme === "dark" ? "#232323" : "#F0F7FF",
            },
            headerTintColor: theme === "dark" ? "#FFF" : "#000",
            headerTitleStyle: {
                fontWeight: "bold",
            },
        });
    }, [navigation, theme]);

    return (
        <View style={[styles.container, theme === "dark" ? styles.dark : styles.light]}>
            <Text style={[styles.header, theme === "dark" ? styles.darkText : styles.lightText]}>Completed Timers</Text>

            {timers.length === 0 ? (
                <Text style={[styles.noTimers, theme === "dark" ? styles.darkText : styles.lightText]}>No timers completed yet.</Text>
            ) : (
                <FlatList
                    data={timers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.timerItem, theme === "dark" ? styles.light : styles.dark]}>
                            <Text style={[styles.timerName, theme === "dark" ? styles.lightText : styles.darkText]}>{item.name}</Text>
                            <Text style={[styles.timerDuration, theme === "dark" ? styles.lightText : styles.darkText]}>{item.duration}s</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, { backgroundColor: theme.primary }]}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    light: { backgroundColor: "#F8F9FA" },
    dark: { backgroundColor: "#232323" },
    lightText: { color: "black" },
    darkText: { color: "white" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    noTimers: { textAlign: "center", fontSize: 16 },
    timerItem: { padding: 15, borderRadius: 10, marginVertical: 5 },
    timerName: { fontSize: 16, fontWeight: "bold" },
    timerDuration: { fontSize: 14 },
    button: { padding: 20, borderRadius: 10, marginTop: 20, alignItems: "center" },
    buttonText: { color: "white", fontWeight: "bold" },
});
