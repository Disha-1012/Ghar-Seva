import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import API from "../../services/api";
import * as Location from "expo-location";
import { useRoute, useFocusEffect } from "@react-navigation/native";

export default function ToolRentalScreen() {
  const route = useRoute();
  const toolName = route.params?.toolName;

  const [tools, setTools] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [offers, setOffers] = useState({});
  const [location, setLocation] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const intervalRef = useRef(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const fetchData = async () => {
    if (!location) return;
    try {
      const t = await API.get("/tools/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          name: toolName,
        },
      });
      const b = await API.get("/bookings/customer");
      setTools(t.data || []);
      setBookings(b.data || []);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!location) return;
      let isMounted = true;
      const start = async () => {
        await fetchData();
        intervalRef.current = setInterval(() => {
          if (isMounted) fetchData();
        }, 2500);
      };
      start();
      return () => {
        isMounted = false;
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [location])
  );

  const current = bookings.filter((b) => b.tool && b.status === "negotiating");
  const activeBookings = bookings.filter((b) => b.tool && ["accepted", "customer_booked"].includes(b.status));

  const handleBook = async () => {
    const price = offers[selectedTool];
    if (!price) return Alert.alert("Enter price");
    if (!startDate || !endDate) return Alert.alert("Select start & end date");

    await API.post("/bookings/tool", {
      toolId: selectedTool, // corrected logic to use state
      directBook: true,
      bookingDate: startDate,
      endDate: endDate,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    Alert.alert("Offer Sent ✅");
    setSelectedTool(null);
    setOffers({});
    fetchData();
  };

  const handleCounter = async (id) => {
    const price = offers[id];
    if (!price) return Alert.alert("Enter price");
    await API.put(`/bookings/${id}/counter`, { offeredPrice: price });
    fetchData();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.heading}>
        Tool Rental 🛠️ {toolName ? `\n${toolName}` : ""}
      </Text>

      {/* DATE SELECTORS (Decent UI for inputs) */}
      <View style={styles.datePickerGroup}>
        <View style={styles.dateInputWrapper}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
            style={styles.input}
          />
        </View>
        <View style={styles.dateInputWrapper}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.input}
          />
        </View>
      </View>

      {/* TOOL LIST */}
      <Text style={styles.sectionTitle}>Available Providers</Text>
      {tools.length === 0 ? (
        <View style={styles.emptyBox}><Text style={styles.emptyText}>No Providers Available Nearby</Text></View>
      ) : (
        tools.map((t) => (
          <TouchableOpacity
            key={t._id}
            activeOpacity={0.9}
            onPress={() => setSelectedTool(t._id)}
            style={[
              styles.card,
              selectedTool === t._id && styles.cardSelected,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.toolName}>{t.name}</Text>
              <Text style={styles.priceTag}>₹{t.price}</Text>
            </View>

            <View style={styles.ownerInfo}>
              <Text style={styles.ownerText}>👤 {t.owner?.name}</Text>
              <Text style={styles.ownerText}>📞 {t.owner?.phone || "N/A"}</Text>
            </View>

            <View style={styles.locationInfo}>
              <Text style={styles.locText}>📍 {t.city || "City"} - {t.pincode}</Text>
              <Text style={styles.addressText} numberOfLines={1}>{t.address}</Text>
            </View>

            <View style={styles.buttonSpacing}>
              <Button
                title="Direct Book"
                color="#0056b3"
                onPress={async () => {
                  if (!startDate || !endDate) return Alert.alert("Select dates first");
                  await API.post("/bookings/tool", {
                    toolId: t._id,
                    directBook: true,
                    bookingDate: startDate,
                    endDate: endDate,
                    latitude: location.latitude,
                    longitude: location.longitude,
                  });
                  fetchData();
                  Alert.alert("Success", "Booking request sent");
                }}
              />
            </View>
            <Button
              title="Negotiate Price"
              color="#ff8c00"
              onPress={() => setSelectedTool(t._id)}
            />
          </TouchableOpacity>
        ) )
      )}

      {/* NEGOTIATION UI */}
      {selectedTool && (
        <View style={styles.boxHighlight}>
          <Text style={styles.boxTitle}>Negotiate Price 💬</Text>
          <TextInput
            placeholder="Enter your offer price (₹)"
            keyboardType="numeric"
            value={offers[selectedTool] || ""}
            onChangeText={(val) => setOffers({ ...offers, [selectedTool]: val })}
            style={styles.input}
          />
          <View style={styles.mt10}>
            <Button title="Send Offer & Book" color="#ff8c00" onPress={handleBook} />
          </View>
        </View>
      )}

      {/* CURRENT NEGOTIATIONS */}
      <Text style={styles.sectionTitle}>Active Negotiations</Text>
      <View style={styles.box}>
        {current.length === 0 ? <Text style={styles.noneText}>No current negotiations</Text> : current.map((b) => (
          <View key={b._id} style={styles.subCard}>
            <Text style={styles.subCardTitle}>{b.tool?.name}</Text>
            <Text style={styles.priceHighlight}>My Offer: ₹{b.offeredPrice}</Text>
            <Text style={styles.smallDate}>📅 {b.date} to {b.endDate}</Text>

            <TextInput
              placeholder="Counter Offer"
              keyboardType="numeric"
              value={offers[b._id] || ""}
              onChangeText={(val) => setOffers({ ...offers, [b._id]: val })}
              style={styles.input}
            />
            
            <View style={styles.btnRow}>
              <View style={styles.flex1}>
                <Button title="Update Offer" color="#ff8c00" onPress={() => handleCounter(b._id)} />
              </View>
              <View style={{ width: 10 }} />
              <View style={styles.flex1}>
                <Button title="Confirm" color="#0056b3" onPress={async () => {
                    await API.put(`/bookings/${b._id}/confirm`);
                    fetchData();
                }} />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* ACTIVE BOOKINGS */}
      <Text style={styles.sectionTitle}>Your Bookings</Text>
      <View style={styles.box}>
        {activeBookings.length === 0 ? <Text style={styles.noneText}>No active bookings</Text> : activeBookings.map((b) => {
          const isAccepted = b.status === "accepted";
          return (
            <View key={b._id} style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.toolName}>{b.tool?.name}</Text>
                <Text style={styles.statusBadge}>{isAccepted ? "ACCEPTED" : "BOOKED"}</Text>
              </View>
              <Text style={styles.priceTag}>₹{b.finalPrice || b.offeredPrice || b.basePrice}</Text>
              <Text style={styles.smallDate}>📅 {b.date} - {b.endDate}</Text>

              {isAccepted && (
                <View style={styles.mt10}>
                  <Button
                    title="Return Tool"
                    color="#ff8c00"
                    onPress={async () => {
                      await API.put(`/bookings/${b._id}/return`);
                      Alert.alert("Return request sent");
                      fetchData();
                    }}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  heading: { fontSize: 24, fontWeight: "900", color: "#003366", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#003366", marginTop: 25, marginBottom: 10 },
  
  // Cards
  card: {
    padding: 15,
    backgroundColor: "#ffffff",
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#0056b3",
  },
  cardSelected: {
    backgroundColor: "#e7f1ff",
    borderColor: "#0056b3",
    borderWidth: 1,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  toolName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  priceTag: { fontSize: 18, fontWeight: "800", color: "#ff8c00" },
  
  ownerInfo: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  ownerText: { fontSize: 13, color: "#555" },
  
  locationInfo: { backgroundColor: "#f1f3f5", padding: 8, borderRadius: 6, marginBottom: 10 },
  locText: { fontSize: 12, fontWeight: "700", color: "#0056b3" },
  addressText: { fontSize: 11, color: "#777" },
  
  // Form/Input UI
  datePickerGroup: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  dateInputWrapper: { width: "48%" },
  label: { fontSize: 12, fontWeight: "700", color: "#666", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#333",
  },
  
  // Section Boxes
  box: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  boxHighlight: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff4e5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff8c00",
  },
  boxTitle: { fontSize: 16, fontWeight: "bold", color: "#ff8c00", marginBottom: 10 },
  
  // Secondary Cards
  subCard: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee", marginBottom: 10 },
  subCardTitle: { fontWeight: "bold", color: "#333" },
  priceHighlight: { color: "#ff8c00", fontWeight: "700", fontSize: 15, marginVertical: 4 },
  smallDate: { fontSize: 11, color: "#888" },
  
  bookingCard: { padding: 12, marginBottom: 10, backgroundColor: "#f0f7ff", borderRadius: 8 },
  statusBadge: { backgroundColor: "#0056b3", color: "#fff", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 10, fontWeight: "bold", overflow: "hidden" },
  
  // Utilities
  btnRow: { flexDirection: "row", marginTop: 10 },
  buttonSpacing: { marginBottom: 10 },
  flex1: { flex: 1 },
  mt10: { marginTop: 10 },
  noneText: { textAlign: "center", color: "#999", fontStyle: "italic" },
  emptyBox: { padding: 20, alignItems: "center" },
  emptyText: { color: "#999" },
});