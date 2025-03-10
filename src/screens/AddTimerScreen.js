import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimerContext } from "../context/TimerContext";
import { useTheme } from "../context/ThemeContext";
import { Picker } from "@react-native-picker/picker";

export default function AddTimerScreen() {
    const { timers, setTimers } = useContext(TimerContext);
    const navigation = useNavigation();
    const { theme } = useTheme();

    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("Workout"); // Default category

    const addTimer = () => {
        if (!name || !duration || !category) {
            Alert.alert("Error", "Please fill all fields!");
            return;
        }

        const newTimer = {
            id: Date.now().toString(),
            name,
            duration: parseInt(duration, 10),
            category,
            remainingTime: parseInt(duration, 10),
            status: "Pending",
        };

        setTimers([...timers, newTimer]);
        navigation.goBack();
    };

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
        <View style={[styles.container, { backgroundColor: theme === "dark" ? "#232323" : "#FFF" }]}>
            <Text style={[styles.label, { color: theme === "dark" ? "#FFF" : "#000" }]}>Timer Name</Text>
            <TextInput
                style={[styles.input, { backgroundColor: theme === "dark" ? "#383838" : "#FFF", color: theme === "dark" ? "#FFF" : "#000" }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter timer name"
                placeholderTextColor={theme === "dark" ? "#AAA" : "#666"}
            />

            <Text style={[styles.label, { color: theme === "dark" ? "#FFF" : "#000" }]}>Duration (seconds)</Text>
            <TextInput
                style={[styles.input, { backgroundColor: theme === "dark" ? "#383838" : "#FFF", color: theme === "dark" ? "#FFF" : "#000" }]}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="Enter duration"
                placeholderTextColor={theme === "dark" ? "#AAA" : "#666"}
            />

            <Text style={[styles.label, { color: theme === "dark" ? "#FFF" : "#000" }]}>Category</Text>
            <View style={[styles.pickerContainer, { backgroundColor: theme === "dark" ? "#383838" : "#FFF" }]}>
                <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={{ color: theme === "dark" ? "#FFF" : "#000" }}>
                    <Picker.Item label="Workout" value="Workout" />
                    <Picker.Item label="Study" value="Study" />
                    <Picker.Item label="Break" value="Break" />
                </Picker>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme === "dark" ? "#007BFF" : "#007BFF", color: "#FFF" }]} onPress={addTimer} >
                <Text style={{ color: "#FFF", fontWeight: 'bold', fontSize: 18 }}>
                    Save Timer
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    input: { borderWidth: 1, borderColor: "#CCC", padding: 10, borderRadius: 5, marginTop: 5, height: 50 },
    pickerContainer: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, marginTop: 5, marginBottom: 20, height: 50 },
    button: { height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }
});
