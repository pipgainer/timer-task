import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TimerContext } from "../context/TimerContext";

export default function AddTimerScreen() {
    const { timers, setTimers } = useContext(TimerContext);
    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("");

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
        navigation.goBack(); // Go back to home screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Timer Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter timer name" />

            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="Enter duration" />

            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Enter category" />

            <Button title="Save Timer" onPress={addTimer} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
    label: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    input: { borderWidth: 1, borderColor: "#CCC", padding: 10, borderRadius: 5, marginTop: 5 },
});
