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

export default function EarningsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_PERCENT = 10; 

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

  const completed = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "rent_completed"
  );

  const serviceBookings = completed.filter((b) => b.service);
  const toolBookings = completed.filter((b) => b.tool);

  const calculate = (list) => {
    const gross = list.reduce(
      (sum, b) => sum + (b.finalPrice || 0),
      0
    );

    const adminCut = (gross * ADMIN_PERCENT) / 100;
    const net = gross - adminCut;

    return { gross, adminCut, net };
  };

  const serviceCalc = calculate(serviceBookings);
  const toolCalc = calculate(toolBookings);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Analyzing financial data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.headerBox}>
        <Text style={styles.heading}>Earnings Report 📊</Text>
        <Text style={styles.subHeading}>Summary of your completed transactions</Text>
      </View>

      {/* 🧾 FINAL TOTAL SUMMARY CARD */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Net Earnings</Text>
        <Text style={styles.totalText}>
          ₹{serviceCalc.net + toolCalc.net}
        </Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>After {ADMIN_PERCENT}% platform fee</Text>
        </View>
      </View>

      {/* 🔧 SERVICE EARNINGS SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={styles.accentBarBlue} />
            <Text style={styles.sectionTitle}>Home Services</Text>
        </View>

        {serviceBookings.length === 0 ? (
          <Text style={styles.emptyText}>No completed services recorded</Text>
        ) : (
          serviceBookings.map((b) => (
            <View key={b._id} style={styles.card}>
              <View style={styles.cardMain}>
                <Text style={styles.title}>{b.service?.serviceType}</Text>
                <Text style={styles.cardPrice}>+ ₹{b.finalPrice}</Text>
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>👤 {b.customer?.name || "Customer"}</Text>
                {b.bookingDate && <Text style={styles.detailText}>📅 {b.bookingDate}</Text>}
              </View>
              
              {b.startTime && (
                <Text style={styles.timeText}>
                  ⏰ {b.startTime} - {b.endTime}
                </Text>
              )}
            </View>
          ))
        )}

        <View style={styles.billBox}>
          <View style={styles.billRow}><Text style={styles.billLabel}>Gross Revenue</Text><Text style={styles.billValue}>₹{serviceCalc.gross}</Text></View>
          <View style={styles.billRow}><Text style={styles.billLabel}>Admin Fee</Text><Text style={styles.billValue}>- ₹{serviceCalc.adminCut}</Text></View>
          <View style={styles.separator} />
          <View style={styles.billRow}><Text style={styles.netLabel}>Service Net</Text><Text style={styles.net}>₹{serviceCalc.net}</Text></View>
        </View>
      </View>

      {/* 🛠 TOOL EARNINGS SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={styles.accentBarOrange} />
            <Text style={styles.sectionTitle}>Tool Rentals</Text>
        </View>

        {toolBookings.length === 0 ? (
          <Text style={styles.emptyText}>No completed tool rentals recorded</Text>
        ) : (
          toolBookings.map((b) => (
            <View key={b._id} style={styles.card}>
              <View style={styles.cardMain}>
                <Text style={styles.title}>{b.tool?.name}</Text>
                <Text style={styles.cardPrice}>+ ₹{b.finalPrice}</Text>
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>👤 {b.customer?.name || "Customer"}</Text>
                {b.bookingDate && <Text style={styles.detailText}>📅 {b.bookingDate}</Text>}
              </View>
            </View>
          ))
        )}

        <View style={[styles.billBox, styles.billBoxOrange]}>
          <View style={styles.billRow}><Text style={styles.billLabel}>Gross Revenue</Text><Text style={styles.billValue}>₹{toolCalc.gross}</Text></View>
          <View style={styles.billRow}><Text style={styles.billLabel}>Admin Fee</Text><Text style={styles.billValue}>- ₹{toolCalc.adminCut}</Text></View>
          <View style={styles.separator} />
          <View style={styles.billRow}><Text style={styles.netLabel}>Tool Net</Text><Text style={styles.net}>₹{toolCalc.net}</Text></View>
        </View>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#003366', fontWeight: '600' },

  headerBox: { marginBottom: 20, marginTop: 10 },
  heading: { fontSize: 26, fontWeight: "900", color: "#003366", letterSpacing: -0.5 },
  subHeading: { fontSize: 14, color: "#6c757d", marginTop: 4 },

  totalBox: {
    backgroundColor: "#003366",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#003366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  totalLabel: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "600", textTransform: 'uppercase', letterSpacing: 1 },
  totalText: { fontSize: 36, fontWeight: "900", color: "#ffffff", marginVertical: 8 },
  totalBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  totalBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  accentBarBlue: { width: 4, height: 20, backgroundColor: '#003366', marginRight: 10, borderRadius: 2 },
  accentBarOrange: { width: 4, height: 20, backgroundColor: '#ff8c00', marginRight: 10, borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1a1a1a" },

  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cardMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: "700", fontSize: 16, color: "#333" },
  cardPrice: { fontSize: 15, fontWeight: "800", color: "#28a745" },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  detailText: { color: "#6c757d", fontSize: 12 },
  timeText: { color: "#003366", fontSize: 12, marginTop: 8, fontWeight: "600" },

  billBox: {
    marginTop: 15,
    padding: 16,
    backgroundColor: "#f0f4f8",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#d1d9e6",
  },
  billBoxOrange: { backgroundColor: '#fff5eb', borderColor: '#ffe0bd' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  billLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  billValue: { fontSize: 13, color: '#333', fontWeight: '700' },
  separator: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 8 },
  netLabel: { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  net: { fontWeight: "900", color: "#28a745", fontSize: 16 },

  emptyText: { color: "#adb5bd", fontStyle: "italic", textAlign: 'center', marginVertical: 10 },
});