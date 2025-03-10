import React, { useContext, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimerContext } from "../context/TimerContext";
import ProgressBar from "react-native-progress/Bar";

export default function HomeScreen() {
    const { timers, startTimer, pauseTimer, resetTimer } = useContext(TimerContext);
    const navigation = useNavigation();
    const [expandedCategories, setExpandedCategories] = useState({});

    const animatedHeights = {}; // Store animated values for each category

    // Initialize animation values
    Object.keys(timers).forEach((category) => {
        if (!animatedHeights[category]) {
            animatedHeights[category] = new Animated.Value(0);
        }
    });

    const toggleCategory = (category) => {
        const isExpanded = expandedCategories[category];

        Animated.timing(animatedHeights[category], {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    // Group timers by category
    const groupedTimers = timers.reduce((acc, timer) => {
        if (!acc[timer.category]) acc[timer.category] = [];
        acc[timer.category].push(timer);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Add Timer")} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Timer</Text>
            </TouchableOpacity>

            {Object.keys(groupedTimers).map((category) => {
                const animatedHeight = animatedHeights[category]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, groupedTimers[category].length * 70], // Adjust height dynamically
                });

                return (
                    <View key={category} style={styles.categorySection}>
                        <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
                            <Text style={styles.categoryHeaderText}>{category} ({groupedTimers[category].length})</Text>
                        </TouchableOpacity>

                        <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
                            <FlatList
                                data={groupedTimers[category]}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => {
                                    const progress = item.remainingTime / item.duration;
                                    return (
                                        <View style={styles.timerItem}>
                                            <Text style={styles.timerName}>{item.name}</Text>
                                            <ProgressBar progress={progress} width={null} height={10} color="#28A745" />
                                            <Text>Time Left: {item.remainingTime}s</Text>
                                            <Text>Status: {item.status}</Text>

                                            <View style={styles.buttonContainer}>
                                                {item.status !== "Running" && (
                                                    <TouchableOpacity style={styles.startButton} onPress={() => startTimer(item.id)}>
                                                        <Text style={styles.buttonText}>Start</Text>
                                                    </TouchableOpacity>
                                                )}

                                                {item.status === "Running" && (
                                                    <TouchableOpacity style={styles.pauseButton} onPress={() => pauseTimer(item.id)}>
                                                        <Text style={styles.buttonText}>Pause</Text>
                                                    </TouchableOpacity>
                                                )}

                                                <TouchableOpacity style={styles.resetButton} onPress={() => resetTimer(item.id)}>
                                                    <Text style={styles.buttonText}>Reset</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }}
                            />
                        </Animated.View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
    addButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, marginBottom: 20, alignItems: "center" },
    addButtonText: { color: "white", fontWeight: "bold" },
    categorySection: { marginBottom: 10 },
    categoryHeader: { backgroundColor: "#DDD", padding: 10, borderRadius: 5 },
    categoryHeaderText: { fontSize: 18, fontWeight: "bold" },
    timerItem: { padding: 10, backgroundColor: "#E9ECEF", borderRadius: 5, marginVertical: 5 },
    timerName: { fontSize: 16, fontWeight: "bold" },
    buttonContainer: { flexDirection: "row", marginTop: 10 },
    startButton: { backgroundColor: "#28A745", padding: 10, marginRight: 5, borderRadius: 5 },
    pauseButton: { backgroundColor: "#FFC107", padding: 10, marginRight: 5, borderRadius: 5 },
    resetButton: { backgroundColor: "#DC3545", padding: 10, borderRadius: 5 },
    buttonText: { color: "white", fontWeight: "bold" },
});
