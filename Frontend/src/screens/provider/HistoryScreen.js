import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { getProviderBookings } from "../../services/api";

export default function HistoryScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ COMPLETED + REJECTED
  const history = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "rent_completed" ||
      b.status === "rejected"
  );

  const serviceHistory = history.filter((b) => b.service);
  const toolHistory = history.filter((b) => b.tool);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Fetching your records...</Text>
      </View>
    );
  }

  const renderStatus = (status) => {
    const isSuccess = status.includes("completed");
    return (
      <View style={[styles.statusBadge, isSuccess ? styles.successBadge : styles.rejectedBadge]}>
        <Text style={[styles.statusText, isSuccess ? styles.successText : styles.rejectedText]}>
          {status.replace("_", " ").toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.headerBox}>
        <Text style={styles.heading}>📜 Booking History</Text>
        <Text style={styles.subHeadingDesc}>Track your past activities and earnings</Text>
      </View>

      {/* SERVICES */}
      <View style={styles.sectionHeader}>
        <View style={styles.accentBarBlue} />
        <Text style={styles.subHeading}>Service History</Text>
      </View>

      {serviceHistory.length === 0 ? (
        <Text style={styles.emptyText}>No service history found.</Text>
      ) : (
        serviceHistory.map((b) => (
          <View key={b._id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.title}>{b.service?.serviceType}</Text>
              <Text style={styles.priceText}>₹{b.finalPrice || b.basePrice}</Text>
            </View>
            <View style={styles.cardBottom}>
              {renderStatus(b.status)}
              <Text style={styles.dateText}>{b.bookingDate || "Past Date"}</Text>
            </View>
          </View>
        ))
      )}

      {/* TOOLS */}
      <View style={styles.sectionHeader}>
        <View style={styles.accentBarOrange} />
        <Text style={styles.subHeading}>Tool History</Text>
      </View>

      {toolHistory.length === 0 ? (
        <Text style={styles.emptyText}>No tool history found.</Text>
      ) : (
        toolHistory.map((b) => (
          <View key={b._id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.title}>{b.tool?.name}</Text>
              <Text style={styles.priceText}>₹{b.finalPrice || b.basePrice}</Text>
            </View>
            <View style={styles.cardBottom}>
              {renderStatus(b.status)}
              <Text style={styles.dateText}>{b.bookingDate || "Past Date"}</Text>
            </View>
          </View>
        ))
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 10, color: "#003366", fontWeight: "600" },

  headerBox: { marginTop: 30, marginBottom: 20 },
  heading: { fontSize: 26, fontWeight: "800", color: "#003366", letterSpacing: -0.5 },
  subHeadingDesc: { fontSize: 14, color: "#6c757d", marginTop: 4 },

  sectionHeader: { flexDirection: "row", alignItems: "center", marginTop: 25, marginBottom: 12 },
  accentBarBlue: { width: 4, height: 18, backgroundColor: "#003366", marginRight: 10, borderRadius: 2 },
  accentBarOrange: { width: 4, height: 18, backgroundColor: "#ff8c00", marginRight: 10, borderRadius: 2 },
  subHeading: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },

  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginVertical: 8,
    borderRadius: 16,
    // Professional Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f3f5",
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontWeight: "700", fontSize: 16, color: "#333", flex: 1 },
  priceText: { fontWeight: "800", fontSize: 16, color: "#ff8c00" },

  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateText: { fontSize: 12, color: "#adb5bd", fontWeight: "500" },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  successBadge: { backgroundColor: "#e8f5e9" },
  rejectedBadge: { backgroundColor: "#ffebee" },
  statusText: { fontSize: 10, fontWeight: "800" },
  successText: { color: "#2e7d32" },
  rejectedText: { color: "#c62828" },

  emptyText: { textAlign: "center", color: "#adb5bd", marginTop: 10, fontStyle: "italic", fontSize: 14 },
});