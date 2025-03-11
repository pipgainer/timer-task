import React, { useContext, useState, useEffect, useRef } from "react";
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimerContext } from "../context/TimerContext";
import ProgressBar from "react-native-progress/Bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Feather from "@expo/vector-icons/Feather";

export default function HomeScreen() {
    const { timers, startTimer, pauseTimer, resetTimer, startCategory, pauseCategory, resetCategory } = useContext(TimerContext);
    const navigation = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const [expandedCategories, setExpandedCategories] = useState({});
    const switchAnimation = useRef(new Animated.Value(theme === "dark" ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(switchAnimation, {
            toValue: theme === "dark" ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [theme]);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme === "dark" ? "#232323" : "#F0F7FF",
            },
            headerTintColor: theme === "dark" ? "#FFF" : "#000",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerRight: () => (
                <TouchableOpacity onPress={toggleTheme} style={[styles.toggleContainer, { backgroundColor: theme === "light" ? "#DDD" : "#FFF" }]}>
                    <Animated.View
                        style={[
                            styles.toggleSwitch,
                            {
                                transform: [{ translateX: switchAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 35] }) }],
                                backgroundColor: theme === "light" ? "white" : "black"
                            }
                        ]}
                    />
                    <Feather name="sun" size={18} color="#FF0700" style={styles.sunIcon} />
                    <Ionicons name="moon" size={18} color="#B0C4DE" style={styles.moonIcon} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const groupedTimers = timers.reduce((acc, timer) => {
        if (!acc[timer.category]) acc[timer.category] = [];
        acc[timer.category].push(timer);
        return acc;
    }, {});

    const renderCategory = ({ item: category }) => {
        const isExpanded = expandedCategories[category];

        // Define category colors
        const categoryStyles = {
            Workout: { backgroundColor: "#FF5733", textColor: "#FFF" }, // Red-Orange (unchanged)
            Study: { backgroundColor: "#008E9B", textColor: "#FFF" }, // Deep Teal
            Break: { backgroundColor: "#4CAF50", textColor: "#FFF" }, // Classic Green
        };

        return (
            <View key={category} style={styles.categorySection}>
                <TouchableOpacity onPress={() => toggleCategory(category)}
                    style={[styles.categoryHeader, { backgroundColor: categoryStyles[category]?.backgroundColor || "#555" }]}
                >
                    <Text style={[styles.categoryHeaderText, { color: categoryStyles[category]?.textColor || "#FFF" }]}>
                        {category} ({groupedTimers[category].length})
                    </Text>
                    <View style={{ flex: 1 }} />
                    {isExpanded &&
                        <TouchableOpacity onPress={() => startCategory(category)} style={{ marginHorizontal: 5 }}>
                            <Feather name="play-circle" size={25} color="white" />
                        </TouchableOpacity>
                    }
                    {isExpanded &&
                        <TouchableOpacity onPress={() => pauseCategory(category)} style={{ marginHorizontal: 5 }}>
                            <Feather name="pause-circle" size={25} color="white" />
                        </TouchableOpacity>
                    }
                    {isExpanded &&
                        <TouchableOpacity onPress={() => resetCategory(category)} style={{ marginHorizontal: 5, marginRight: 20 }}>
                            <Feather name="refresh-ccw" size={22} color="white" />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity onPress={() => toggleCategory(category)}
                    >
                        <Feather
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={categoryStyles[category]?.textColor || "#FFF"}
                        />
                    </TouchableOpacity>

                </TouchableOpacity>

                {isExpanded && (
                    <FlatList
                        data={groupedTimers[category]}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTimerItem}
                    />
                )}
            </View>
        );
    };

    const renderTimerItem = ({ item }) => {
        const progress = item.remainingTime / item.duration;

        return (
            <View style={styles.timerItem}>
                <View style={styles.timerHeader}>
                    <Text style={styles.timerName}>{item.name}</Text>
                    <Text style={[styles.timerStatus, item.status == "Completed" ? { fontWeight: "900", color: "green", fontSize: 16 } : {}]}>{item.status}</Text>
                </View>

                <ProgressBar
                    progress={progress}
                    width={null}
                    height={10}
                    color={progress < 0.3 ? "#DC3545" : progress < 0.7 ? "#FFC107" : "#28A745"}
                    borderRadius={5}
                    style={styles.progressBar}
                />

                <Text style={styles.timeLeft}>⏳ Time Left: {item.remainingTime}s</Text>

                <View style={styles.buttonContainer}>
                    {item.status !== "Running" && (
                        <TouchableOpacity style={styles.startButton} onPress={() => startTimer(item.id)}>
                            <Feather name="play-circle" size={20} color="white" />
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                    )}

                    {item.status === "Running" && (
                        <TouchableOpacity style={styles.pauseButton} onPress={() => pauseTimer(item.id)}>
                            <Feather name="pause-circle" size={20} color="white" />
                            <Text style={styles.buttonText}>Pause</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.resetButton} onPress={() => resetTimer(item.id)}>
                        <Feather name="refresh-ccw" size={20} color="white" />
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, theme === "dark" ? styles.dark : styles.light]}>
            <StatusBar
                barStyle={theme === "dark" ? "light-content" : "dark-content"}
                backgroundColor={theme === "dark" ? "#232323" : "#F0F7FF"}
            />

            {timers.length === 0 && <Text style={[styles.noTimers, theme === "dark" ? styles.darkText : styles.lightText]}>No Timers added Yet. Please add Timers.</Text>}

            {/* {Object.keys(groupedTimers).map((category) => renderCategory(category))} */}
            <FlatList
                data={Object.keys(groupedTimers)}
                keyExtractor={(item) => item}
                renderItem={renderCategory}
                contentContainerStyle={{ paddingBottom: 100 }} // Prevents bottom cutoff
                showsVerticalScrollIndicator={false}
            />

            <View style={{ marginTop: 'auto' }}>
                <TouchableOpacity onPress={() => navigation.navigate("Add Timer")} style={styles.addButton}>
                    <Text style={styles.buttonText}>+ Add Timer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("History")} style={styles.historyButton}>
                    <Text style={styles.buttonText}>📜 See History</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    light: { backgroundColor: "#F8F9FA" },
    dark: { backgroundColor: "#232323" },
    addButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, marginBottom: 20, alignItems: "center" },
    historyButton: { backgroundColor: "#28A745", padding: 15, borderRadius: 10, marginBottom: 20, alignItems: "center" },
    addButtonText: { color: "white", fontWeight: "bold" },

    lightText: { color: "black" },
    darkText: { color: "white" },

    noTimers: { textAlign: "center", fontSize: 18, marginTop: 'auto', marginBottom: 'auto' },

    categorySection: {
        marginVertical: 10,
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },

    categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
    },

    categoryHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    timerItem: {
        padding: 15,
        backgroundColor: "#E9ECEF",
        borderRadius: 10,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    timerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    timerName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

    timerStatus: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
    },

    progressBar: {
        marginVertical: 8,
    },

    timeLeft: {
        fontSize: 14,
        color: "#555",
        marginBottom: 8,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    startButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#28A745",
        padding: 10,
        borderRadius: 5,
    },

    pauseButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFC107",
        padding: 10,
        borderRadius: 5,
    },

    resetButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DC3545",
        padding: 10,
        borderRadius: 5,
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 6,
    },
    toggleContainer: {
        width: 65,
        height: 35,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        position: "relative",
        marginRight: 20
    },
    toggleSwitch: {
        width: 23,
        height: 23,
        borderRadius: 10,
        position: "absolute",
        top: 6,
        left: 3,
    },
    sunIcon: { position: "absolute", left: 5 },
    moonIcon: { position: "absolute", right: 5 },
});