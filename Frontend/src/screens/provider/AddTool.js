import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  StatusBar 
} from "react-native";
import { useState } from "react";
import API from "../../services/api";
import * as Location from "expo-location";

export default function AddTool({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      await API.post("/tools/add", {
        name,
        price: Number(price),
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      Alert.alert("Tool added successfully ✅");

      setName("");
      setPrice("");

      navigation.replace("ProviderDashboard");

    } catch (err) {
      console.log(err);
      Alert.alert("Error adding tool");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Register New Tool</Text>
        <Text style={styles.subHeading}>Add equipment for nearby rental requests</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tool Name</Text>
        <TextInput
          placeholder="e.g. Drill, Ladder, Saw"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Rental Price per Day (₹)</Text>
        <TextInput
          placeholder="Enter daily rate"
          placeholderTextColor="#94a3b8"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.buttonWrapper}>
          <Button 
            title="Add Tool" 
            onPress={handleAdd} 
            color="#ff8c00" // Vibrant Orange
          />
        </View>
      </View>

      <Text style={styles.locationNotice}>
        📍 Your current location will be used to show this tool to nearby customers.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff", // Soft blue-tinted white
  },
  scrollContent: {
    padding: 24,
  },
  headerContainer: {
    marginBottom: 30,
    marginTop: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#003366", // Deep Blue
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#003366",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 25,
    borderRadius: 12,
    overflow: "hidden", // Ensures border radius works for Android Buttons
    height: 48,
    justifyContent: "center",
  },
  locationNotice: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    color: "#94a3b8",
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});