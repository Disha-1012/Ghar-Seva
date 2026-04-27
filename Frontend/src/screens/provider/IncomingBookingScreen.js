import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
  TextInput,
  StatusBar,
} from "react-native";

import { useEffect, useState } from "react";

import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  counterOffer,
} from "../../services/api";

import API from "../../services/api";

export default function IncomingBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerOffers, setProviderOffers] = useState({});

  const loadData = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (id) => {
    await acceptBooking(id);
    loadData();
  };

  const handleReject = async (id) => {
    await rejectBooking(id);
    loadData();
  };

  const handleSendCounterOffer = async (id) => {
    const price = providerOffers[id];

    if (!price) {
      alert("Enter a price first");
      return;
    }

    await counterOffer(id, price);

    setProviderOffers((prev) => ({
      ...prev,
      [id]: "",
    }));

    loadData();
  };

  const handleServiceEnd = async (id) => {
    try {
      await API.put(`/bookings/${id}/end`);
      alert("Service marked as completed");
      loadData();
    } catch (err) {
      alert("Failed to end service");
    }
  };

  const handleEndRenting = async (id) => {
    try {
      await API.put(`/bookings/${id}/end-rent`, {});
      alert("Renting is completed successfully ✅");
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed ❌");
    }
  };

  const activeBookings = bookings.filter(
    (b) =>
      b.status !== "completed" &&
      b.status !== "rent_completed" &&
      b.status !== "rejected"
  );

  const serviceBookings = activeBookings.filter((b) => b.service);
  const toolBookings = activeBookings.filter((b) => b.tool);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={styles.loadingText}>Loading Bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Text style={styles.heading}>📥 Incoming Bookings</Text>

      {/* ================= SERVICES ================= */}
      <View style={styles.sectionHeader}>
        <View style={styles.accentBarBlue} />
        <Text style={styles.subHeading}>Service Bookings</Text>
      </View>

      {serviceBookings.length === 0 ? (
        <View style={styles.emptyCard}><Text style={styles.emptyText}>No active service bookings</Text></View>
      ) : (
        serviceBookings.map((b) => {
          const isAccepted = b.status === "accepted";
          const isRejected = b.status === "rejected";
          const isCustomerBooked = b.status === "customer_booked";
          const isCompleted = b.status === "completed";

          return (
            <View key={b._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{b.service?.serviceType}</Text>
                <Text style={styles.priceTag}>₹{b.offeredPrice || b.basePrice}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Customer:</Text>
                <Text style={styles.value}>{b.customer?.name || "N/A"}</Text>
              </View>

              <View style={styles.locationBox}>
                <Text style={styles.locationText}>📍 {b.customerCity || ""} - {b.customerPincode || ""}</Text>
                <Text style={styles.addressText}>{b.customerAddress || "Address not available"}</Text>
              </View>

              <View style={styles.metaRow}>
                {b.bookingDate && <Text style={styles.metaText}>📅 {b.bookingDate}</Text>}
                {b.startTime && <Text style={styles.metaText}>⏰ {b.startTime} - {b.endTime}</Text>}
              </View>

              {!isAccepted && !isRejected && !isCompleted && (
                <View style={styles.actionContainer}>
                  {!isCustomerBooked && (
                    <View style={styles.negotiationBox}>
                      <TextInput
                        placeholder="Counter Offer Price"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={providerOffers[b._id] || ""}
                        onChangeText={(val) =>
                          setProviderOffers((prev) => ({
                            ...prev,
                            [b._id]: val,
                          }))
                        }
                        style={styles.input}
                      />
                      <View style={styles.buttonMini}>
                        <Button
                          title="Send Offer"
                          color="#ff8c00"
                          onPress={() => handleSendCounterOffer(b._id)}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.buttonGroup}>
                    <View style={styles.flex1}><Button title="Accept" color="#28a745" onPress={() => handleAccept(b._id)} /></View>
                    <View style={{ width: 10 }} />
                    <View style={styles.flex1}><Button title="Reject" color="#dc3545" onPress={() => handleReject(b._id)} /></View>
                  </View>
                </View>
              )}

              {isAccepted && !isCompleted && (
                <View style={styles.dealBox}>
                  <Text style={styles.accepted}>✅ Deal Finalized</Text>
                  <View style={styles.mt10}>
                    <Button title="Mark Service Completed" color="#0056b3" onPress={() => handleServiceEnd(b._id)} />
                  </View>
                </View>
              )}
            </View>
          );
        })
      )}

      {/* ================= TOOLS ================= */}
      <View style={styles.sectionHeader}>
        <View style={styles.accentBarOrange} />
        <Text style={styles.subHeading}>Tool Renting</Text>
      </View>

      {toolBookings.length === 0 ? (
        <View style={styles.emptyCard}><Text style={styles.emptyText}>No active tool bookings</Text></View>
      ) : (
        toolBookings.map((b) => {
          const isAccepted = b.status === "accepted";
          const isRejected = b.status === "rejected";
          const isCustomerBooked = b.status === "customer_booked";
          const isReturnRequested = b.status === "return_requested";
          const isCompleted = b.status === "rent_completed";

          return (
            <View key={b._id} style={[styles.card, { borderLeftColor: '#ff8c00' }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{b.tool?.name}</Text>
                <Text style={[styles.priceTag, { color: '#ff8c00' }]}>₹{b.offeredPrice || b.basePrice}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Customer:</Text>
                <Text style={styles.value}>{b.customer?.name || "N/A"}</Text>
              </View>

              <View style={styles.metaRow}>
                {b.bookingDate && <Text style={styles.metaText}>📅 Start: {b.bookingDate}</Text>}
                {b.endDate && <Text style={styles.metaText}>📅 End: {b.endDate}</Text>}
              </View>

              {isReturnRequested && (
                <View style={styles.alertBox}>
                  <Text style={styles.alertText}>🟡 Customer wants to return tool</Text>
                  <Button title="End Renting" color="#ff8c00" onPress={() => handleEndRenting(b._id)} />
                </View>
              )}

              {!isAccepted && !isRejected && !isReturnRequested && !isCompleted && (
                <View style={styles.actionContainer}>
                  {!isCustomerBooked && (
                    <View style={styles.negotiationBox}>
                      <TextInput
                        placeholder="Counter Offer Price"
                        keyboardType="numeric"
                        value={providerOffers[b._id] || ""}
                        onChangeText={(val) =>
                          setProviderOffers((prev) => ({
                            ...prev,
                            [b._id]: val,
                          }))
                        }
                        style={styles.input}
                      />
                      <View style={styles.buttonMini}>
                         <Button title="Send Offer" color="#ff8c00" onPress={() => handleSendCounterOffer(b._id)} />
                      </View>
                    </View>
                  )}
                  <View style={styles.buttonGroup}>
                    <View style={styles.flex1}><Button title="Accept" color="#28a745" onPress={() => handleAccept(b._id)} /></View>
                    <View style={{ width: 10 }} />
                    <View style={styles.flex1}><Button title="Reject" color="#dc3545" onPress={() => handleReject(b._id)} /></View>
                  </View>
                </View>
              )}

              {isAccepted && !isReturnRequested && !isCompleted && (
                <View style={styles.dealBox}>
                  <Text style={styles.accepted}>✅ Rental Active</Text>
                  <View style={styles.mt10}>
                    <Button title="End Rental Session" color="#ff8c00" onPress={() => handleEndRenting(b._id)} />
                  </View>
                </View>
              )}
            </View>
          );
        })
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#0056b3', fontWeight: '600' },
  
  heading: { fontSize: 26, fontWeight: "900", color: "#002d62", marginBottom: 20, marginTop: 10 },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 12 },
  accentBarBlue: { width: 4, height: 20, backgroundColor: '#0056b3', marginRight: 10, borderRadius: 2 },
  accentBarOrange: { width: 4, height: 20, backgroundColor: '#ff8c00', marginRight: 10, borderRadius: 2 },
  subHeading: { fontSize: 18, fontWeight: "800", color: "#333" },

  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#0056b3",
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1a1a1a", flex: 1 },
  priceTag: { fontSize: 18, fontWeight: "800", color: "#0056b3" },

  infoRow: { flexDirection: 'row', marginBottom: 4 },
  label: { fontSize: 13, color: '#777', fontWeight: '600', width: 75 },
  value: { fontSize: 13, color: '#333', fontWeight: '500' },

  locationBox: { backgroundColor: '#f1f4f9', padding: 10, borderRadius: 10, marginVertical: 8 },
  locationText: { fontSize: 13, fontWeight: '700', color: '#0056b3' },
  addressText: { fontSize: 12, color: '#666', marginTop: 2 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  metaText: { fontSize: 12, color: '#555', backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },

  actionContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  negotiationBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 12, height: 40, backgroundColor: "#fafafa", marginRight: 8, fontSize: 14 },
  buttonMini: { height: 40, justifyContent: 'center' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  flex1: { flex: 1 },

  dealBox: { marginTop: 15, padding: 12, backgroundColor: '#eef9f1', borderRadius: 12, alignItems: 'center' },
  accepted: { color: "#28a745", fontWeight: "900", fontSize: 15 },
  
  alertBox: { backgroundColor: '#fff4e5', padding: 12, borderRadius: 12, marginVertical: 10 },
  alertText: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  
  emptyCard: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#999', fontStyle: 'italic' },
  mt10: { marginTop: 10, width: '100%' }
});