import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";

import { useEffect, useState, useCallback, useRef } from "react";
import API from "../../services/api";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

export default function ServiceList() {
  const route = useRoute();
  const selectedServiceType = route.params?.serviceType;

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [offers, setOffers] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [showTimeInputs, setShowTimeInputs] = useState(false);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [startAMPM, setStartAMPM] = useState("AM");
  const [endAMPM, setEndAMPM] = useState("PM");

  const intervalRef = useRef(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAll = async () => {
    if (!location) return;

    try {
      const [serviceRes, bookingRes] = await Promise.all([
        API.get("/services/nearby", {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            serviceType: selectedServiceType,
          },
        }),
        API.get("/bookings/customer"),
      ]);

      setServices(serviceRes.data || []);
      setBookings(bookingRes.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!location) return;

      let isMounted = true;

      const start = async () => {
        await fetchAll();

        intervalRef.current = setInterval(() => {
          if (isMounted) fetchAll();
        }, 2500);
      };

      start();

      return () => {
        isMounted = false;

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [location])
  );

  const currentBookings = bookings.filter(
    (b) => b.status === "negotiating" || b.status === "accepted"
  );

  const confirmedBookings = bookings.filter(
    (b) => b.status === "customer_booked"
  );

  const handleBookNow = async (serviceId) => {
    if (!selectedDate) {
      return Alert.alert("Select date");
    }

    await API.post("/bookings", {
      serviceId,
      directBook: true,
      bookingDate: selectedDate,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    Alert.alert("Booked Successfully");
    fetchAll();
  };

  const handleNewBooking = async () => {
    const price = offers[selectedService];

    if (!price) return Alert.alert("Enter offer");
    if (!selectedDate) return Alert.alert("Select date");

    await API.post("/bookings", {
      serviceId: selectedService,
      offeredPrice: price,
      bookingDate: selectedDate,
      latitude: location.latitude,
      longitude: location.longitude,

      startTime: `${startTime} ${startAMPM}`,
      endTime: `${endTime} ${endAMPM}`,
    });

    setSelectedService(null);
    setOffers({});
    setShowTimeInputs(false);

    fetchAll();
  };

  const handleCounterOffer = async (id) => {
    const price = offers[id];

    if (!price) return Alert.alert("Enter offer");

    await API.put(`/bookings/${id}/counter`, {
      offeredPrice: price,
    });

    fetchAll();
  };

  const handleConfirmBook = async (id) => {
    await API.put(`/bookings/${id}/confirm`);
    fetchAll();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.heading}>
        Nearby {selectedServiceType} Services 📍
      </Text>

      <Text style={styles.sectionLabel}>Available Professionals</Text>
      {services.map((item) => (
        <View key={item._id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.serviceType}</Text>
            <Text style={styles.priceText}>₹{item.basePrice}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>👤 {item.providerId?.name || "Unknown"}</Text>
            <Text style={styles.infoText}>📞 {item.providerId?.phone || "N/A"}</Text>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              📍 {item.city || "City"} - {item.pincode || ""}
            </Text>
            <Text style={styles.addressText}>{item.address || "Address not available"}</Text>
          </View>

          {item.startTime && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>
                ⏰ {item.startTime} - {item.endTime}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Book Now"
              color="#0056b3"
              onPress={() => handleBookNow(item._id)}
            />
            <View style={{ height: 10 }} />
            <Button
              title="Negotiate & Book"
              color="#ff8c00"
              onPress={() => setSelectedService(item._id)}
            />
          </View>
        </View>
      ))}

      <View style={styles.datePickerBox}>
        <Text style={styles.label}>Select Service Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={selectedDate}
          onChangeText={setSelectedDate}
          style={styles.input}
        />
      </View>

      {selectedService && (
        <View style={styles.box}>
          <Text style={styles.boxTitle}>New Negotiation Offer</Text>
          
          <View style={styles.buttonGroup}>
            <Button
              title={showTimeInputs ? "Hide Time Options" : "Select Specific Time"}
              color="#0056b3"
              onPress={() => setShowTimeInputs(!showTimeInputs)}
            />
          </View>

          {showTimeInputs && (
            <View style={styles.timeInputsWrapper}>
              <View style={styles.timeRow}>
                <TextInput
                  placeholder="Start Time (e.g. 6)"
                  value={startTime}
                  onChangeText={setStartTime}
                  style={[styles.input, { flex: 2 }]}
                />
                <View style={styles.ampmBtn}>
                  <Button
                    title={startAMPM}
                    color="#666"
                    onPress={() => setStartAMPM(startAMPM === "AM" ? "PM" : "AM")}
                  />
                </View>
              </View>

              <View style={styles.timeRow}>
                <TextInput
                  placeholder="End Time (e.g. 10)"
                  value={endTime}
                  onChangeText={setEndTime}
                  style={[styles.input, { flex: 2 }]}
                />
                <View style={styles.ampmBtn}>
                  <Button
                    title={endAMPM}
                    color="#666"
                    onPress={() => setEndAMPM(endAMPM === "AM" ? "PM" : "AM")}
                  />
                </View>
              </View>
            </View>
          )}

          <TextInput
            placeholder="Enter your offer price"
            keyboardType="numeric"
            value={offers[selectedService] || ""}
            onChangeText={(val) =>
              setOffers({
                ...offers,
                [selectedService]: val,
              })
            }
            style={styles.input}
          />

          <Button
            title="Send Offer to Provider"
            color="#ff8c00"
            onPress={handleNewBooking}
          />
        </View>
      )}

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Current Negotiations 💬</Text>
        {currentBookings.length === 0 ? <Text style={styles.emptyText}>No active negotiations</Text> : null}
        {currentBookings.map((b) => (
          <View key={b._id} style={styles.negoCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.negoTitle}>{b.service?.serviceType}</Text>
                <Text style={styles.negoPrice}>₹{b.offeredPrice}</Text>
            </View>

            {b.bookingDate && <Text style={styles.infoText}>📅 Date: {b.bookingDate}</Text>}
            {b.startTime && (
              <Text style={styles.infoText}>
                ⏰ Time: {b.startTime} - {b.endTime}
              </Text>
            )}

            <TextInput
              placeholder="Enter New Offer"
              keyboardType="numeric"
              value={offers[b._id] || ""}
              onChangeText={(val) =>
                setOffers({ ...offers, [b._id]: val })
              }
              style={styles.input}
            />

            <View style={styles.negoActions}>
              <View style={{flex: 1, marginRight: 5}}>
                <Button
                    title="Send Offer"
                    color="#666"
                    onPress={() => handleCounterOffer(b._id)}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Button
                    title="Confirm Book"
                    color="#28a745"
                    onPress={() => handleConfirmBook(b._id)}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Confirmed Bookings ✅</Text>
        {confirmedBookings.length === 0 ? <Text style={styles.emptyText}>No confirmed bookings yet</Text> : null}
        {confirmedBookings.map((b) => (
          <View key={b._id} style={styles.confirmedCard}>
            <Text style={styles.title}>{b.service?.serviceType}</Text>
            <Text style={styles.finalPriceText}>
              Final Price: ₹{b.finalPrice || b.offeredPrice || b.basePrice}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>STATUS: BOOKED</Text>
            </View>
            {b.bookingDate && <Text style={styles.infoText}>📅 {b.bookingDate}</Text>}
            {b.startTime && (
              <Text style={styles.infoText}>
                ⏰ {b.startTime} - {b.endTime}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },
  heading: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: "#003366", 
    marginBottom: 20,
    marginTop: 10 
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10
  },
  card: { 
    padding: 18, 
    backgroundColor: "#ffffff", 
    borderRadius: 15, 
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#0056b3'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: { fontSize: 18, fontWeight: "bold", color: '#333' },
  priceText: { fontSize: 18, fontWeight: '800', color: '#ff8c00' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  infoText: { color: "#555", fontSize: 14, marginVertical: 2 },
  locationContainer: {
    backgroundColor: '#f1f4f9',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8
  },
  locationText: { fontWeight: "700", color: "#0056b3", fontSize: 13 },
  addressText: { fontSize: 12, color: '#777', marginTop: 2 },
  timeBadge: {
    backgroundColor: '#fff3e0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 15
  },
  timeBadgeText: { color: '#e65100', fontWeight: 'bold', fontSize: 12 },
  buttonContainer: { marginTop: 5 },
  
  label: { fontSize: 14, fontWeight: '700', color: '#003366', marginBottom: 5 },
  datePickerBox: { marginVertical: 15 },
  input: { 
    backgroundColor: '#ffffff',
    borderWidth: 1.5, 
    borderColor: '#d1d9e6', 
    borderRadius: 10,
    padding: 12, 
    marginVertical: 8,
    fontSize: 15,
    color: '#333'
  },
  
  box: { 
    marginTop: 25, 
    padding: 20, 
    backgroundColor: "#ffffff", 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2
  },
  boxTitle: { fontSize: 18, fontWeight: '800', color: '#003366', marginBottom: 15 },
  timeInputsWrapper: { marginBottom: 15 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ampmBtn: { flex: 1 },
  
  negoCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15
  },
  negoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  negoPrice: { fontSize: 16, fontWeight: 'bold', color: '#ff8c00' },
  negoActions: { flexDirection: 'row', marginTop: 10 },
  
  confirmedCard: {
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#bbdefb'
  },
  finalPriceText: { fontSize: 16, fontWeight: 'bold', color: '#0056b3', marginVertical: 5 },
  statusBadge: {
    backgroundColor: '#28a745',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginVertical: 5
  },
  statusBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  emptyText: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginVertical: 10 }
});