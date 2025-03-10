import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AddTimerScreen from "../screens/AddTimerScreen";
import { TimerProvider } from "../context/TimerContext";
import { ThemeProvider } from "../context/ThemeContext";

const Stack = createStackNavigator();

export default function App() {
    return (
        <ThemeProvider>
            <TimerProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Add Timer" component={AddTimerScreen} />
                        <Stack.Screen name="History" component={HistoryScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </TimerProvider>
        </ThemeProvider>
    );
}
