import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useState, useEffect } from "react";
import API from "../../services/api";
import * as Location from "expo-location";

export default function AddService({ navigation }) {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  // ✅ TIME STATES
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("PM");

  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const handleAdd = async () => {
    if (!type || !price || !startTime || !endTime) {
      Alert.alert("Fill all fields");
      return;
    }

    try {
      await API.post("/services/add", {
        serviceType: type,
        basePrice: price,
        latitude: location.latitude,
        longitude: location.longitude,
        startTime: `${startTime} ${startPeriod}`,
        endTime: `${endTime} ${endPeriod}`,
      });

      Alert.alert("Service added ✅");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error adding service");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerBox}>
        <Text style={styles.heading}>Add New Service</Text>
        <Text style={styles.subHeading}>List your expertise for nearby customers</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Service Category</Text>
        <TextInput
          placeholder="e.g. Electrical, Cleaning..."
          placeholderTextColor="#94a3b8"
          value={type}
          onChangeText={setType}
          style={styles.input}
        />

        <Text style={styles.label}>Base Price (₹)</Text>
        <TextInput
          placeholder="Enter amount"
          placeholderTextColor="#94a3b8"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* 🔥 START TIME */}
        <Text style={styles.label}>Service Availability Start</Text>
        <View style={styles.timeRow}>
          <TextInput
            placeholder="Hour (e.g. 9)"
            placeholderTextColor="#94a3b8"
            value={startTime}
            onChangeText={setStartTime}
            keyboardType="numeric"
            style={[styles.input, styles.timeInput]}
          />
          <View style={styles.periodBtn}>
            <Button
              title={startPeriod}
              color="#0056b3" // Blue
              onPress={() => setStartPeriod(startPeriod === "AM" ? "PM" : "AM")}
            />
          </View>
        </View>

        {/* 🔥 END TIME */}
        <Text style={styles.label}>Service Availability End</Text>
        <View style={styles.timeRow}>
          <TextInput
            placeholder="Hour (e.g. 6)"
            placeholderTextColor="#94a3b8"
            value={endTime}
            onChangeText={setEndTime}
            keyboardType="numeric"
            style={[styles.input, styles.timeInput]}
          />
          <View style={styles.periodBtn}>
            <Button
              title={endPeriod}
              color="#0056b3" // Blue
              onPress={() => setEndPeriod(endPeriod === "AM" ? "PM" : "AM")}
            />
          </View>
        </View>

        <View style={styles.mainButtonWrapper}>
          <Button 
            title="Create Service Listing" 
            color="#ff8c00" // Orange
            onPress={handleAdd} 
          />
        </View>
      </View>
      
      {location && (
        <Text style={styles.locationInfo}>
          📍 Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Very light blue/white
  },
  scrollContent: {
    padding: 24,
  },
  headerBox: {
    marginBottom: 25,
    marginTop: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#003366", // Deep Blue
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 1,
    marginRight: 10,
  },
  periodBtn: {
    width: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  mainButtonWrapper: {
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  locationInfo: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});