# React Native Timer Management App

## 📌 Project Overview

This React Native app allows users to create, manage, and interact with multiple customizable timers. The app includes features like categories, progress visualization, and grouped actions, all while maintaining a clean UI/UX with minimal third-party dependencies.

## 🚀 Features

- **Add Timer:** Create timers with a name, duration, and category.
- **Timer List with Grouping:** Display timers grouped by categories in expandable/collapsible sections.
- **Timer Management:** Start, pause, reset, and complete timers.
- **Progress Visualization:** Show progress as a bar or percentage.
- **Bulk Actions:** Start, pause, or reset all timers within a category.
- **User Feedback:** Show an on-screen modal when a timer completes.
- **Timer History:** Log completed timers with timestamps.
- **Data Persistence:** Store timers and logs using AsyncStorage.
- **Navigation:** Use React Navigation for switching between screens.
- **Dark Mode Support:** Optional theme switching for light/dark mode.

## 🛠️ Tech Stack

- **React Native** (Expo-based project)
- **React Navigation** (for screen navigation)
- **AsyncStorage** (for data persistence)
- **React Native Reanimated** (for animations)
- **React Native Gesture Handler** (for smooth interactions)

## 📂 Folder Structure

```
project-root/
│-- src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Application screens
│   ├── context/          # Global state management (useContext/useReducer)
│   ├── navigation/       # App navigation setup
│-- App.js                # Entry point
│-- package.json          # Dependencies & scripts
│-- babel.config.js       # Babel configuration
│-- README.md             # Project documentation
```

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/pipgainer/timer-task.git
   cd timer-app
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the app:**
   ```sh
   npx expo start
   ```

## 🏆 Credits

Developed by **Abhishek Powade**. Feel free to contribute!

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
