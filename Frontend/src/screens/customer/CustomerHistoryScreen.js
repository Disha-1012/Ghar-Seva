import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function HistoryScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/bookings/customer");
      setBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const serviceHistory = bookings.filter(
    (b) =>
      b.service &&
      ["completed", "rejected"].includes(b.status)
  );

  const toolHistory = bookings.filter(
    (b) =>
      b.tool &&
      ["rent_completed", "rejected"].includes(b.status)
  );

  // Helper to style status badges
  const getStatusStyle = (status) => {
    if (["completed", "rent_completed"].includes(status)) return styles.statusCompleted;
    if (status === "rejected") return styles.statusRejected;
    return styles.statusDefault;
  };

  const renderCard = (title, status, id) => (
    <TouchableOpacity key={id} style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <View style={[styles.statusBadge, getStatusStyle(status)]}>
          <Text style={styles.statusText}>{status.replace("_", " ").toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.dateText}>ID: {id.slice(-6).toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.heading}>Booking History</Text>
        <Text style={styles.subHeading}>Track your past activities</Text>
      </View>

      <Text style={styles.sectionTitle}>Services</Text>
      {serviceHistory.length > 0 ? (
        serviceHistory.map((b) => renderCard(b.service?.serviceType, b.status, b._id))
      ) : (
        <Text style={styles.emptyText}>No service history found.</Text>
      )}

      <Text style={styles.sectionTitle}>Tool Rentals</Text>
      {toolHistory.length > 0 ? (
        toolHistory.map((b) => renderCard(b.tool?.name, b.status, b._id))
      ) : (
        <Text style={styles.emptyText}>No rental history found.</Text>
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC", // Soft off-white background
    paddingHorizontal: 20 
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
  },
  heading: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: "#1E3A8A" // Deep Blue
  },
  subHeading: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  sectionTitle: { 
    marginTop: 25, 
    marginBottom: 10,
    fontSize: 18, 
    fontWeight: "700", 
    color: "#334155",
    letterSpacing: 0.5
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    // Professional Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6", // Primary Blue accent
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  statusCompleted: {
    backgroundColor: "#DCFCE7", // Light Green
    color: "#166534",
  },
  statusRejected: {
    backgroundColor: "#FEE2E2", // Light Red
    color: "#991B1B",
  },
  statusDefault: {
    backgroundColor: "#E2E8F0",
    color: "#475569",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "inherit", // Note: React Native doesn't support inherit, apply colors to text specifically
  },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 10,
    fontStyle: "italic",
  }
});