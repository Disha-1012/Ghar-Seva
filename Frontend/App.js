import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthProvider, AuthContext } from "./src/context/AuthContext";

import LandingScreen from "./src/screens/common/LandingScreen";

// 🔐 AUTH
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

// 👤 CUSTOMER
import HomeScreen from "./src/screens/customer/HomeScreen";
import ServiceList from "./src/screens/customer/ServiceList";
import ToolRentalScreen from "./src/screens/customer/ToolRentalScreen";

// ✅ NEW SCREENS (ADDED)
import CustomerHistoryScreen from "./src/screens/customer/CustomerHistoryScreen";
import HelpLineScreen from "./src/screens/customer/HelpLineScreen";

// 🔧 PROVIDER
import ProviderDashboard from "./src/screens/provider/ProviderDashboard";
import AddService from "./src/screens/provider/AddService";
import AddTool from "./src/screens/provider/AddTool";

import IncomingBookingScreen from "./src/screens/provider/IncomingBookingScreen";
import EarningsScreen from "./src/screens/provider/EarningsScreen";

import AddOptionsScreen from "./src/screens/provider/AddOptionsScreen";
import HistoryScreen from "./src/screens/provider/HistoryScreen";

// 🛡️ ADMIN
import AdminDashboard from "./src/screens/admin/AdminDashboard";
import AdminEarnings from "./src/screens/admin/AdminEarnings";

// PROFILE
import ProfileScreen from "./src/screens/common/ProfileScreen";

import { View, Text } from "react-native";

const Stack = createStackNavigator();

function AppNavigator() {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
    >

      {/* ❌ NOT LOGGED IN */}
      {!token ? (
        <>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : role === "customer" ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ServiceList" component={ServiceList} />
          <Stack.Screen name="ToolRental" component={ToolRentalScreen} />

          {/* ✅ NEW SCREENS */}
          <Stack.Screen name="History" component={CustomerHistoryScreen} />
          <Stack.Screen name="HelpLine" component={HelpLineScreen} />

          {/* PROFILE */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : role === "provider" ? (
        <>
          <Stack.Screen
            name="ProviderDashboard"
            component={ProviderDashboard}
          />

          <Stack.Screen name="AddService" component={AddService} />
          <Stack.Screen name="AddTool" component={AddTool} />

          <Stack.Screen
            name="IncomingBookings"
            component={IncomingBookingScreen}
          />

          <Stack.Screen name="Earnings" component={EarningsScreen} />

          <Stack.Screen
            name="AddOptions"
            component={AddOptionsScreen}
            options={{ title: "Add Options" }}
          />

          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: "Booking History" }}
          />

          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : role === "admin" ? (
        <>
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
          />

          <Stack.Screen
            name="AdminEarnings"
            component={AdminEarnings}
            options={{ title: "Earnings 💰" }}
          />

          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}