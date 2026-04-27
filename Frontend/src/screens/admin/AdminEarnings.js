import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminEarnings() {
  const [bookings, setBookings] = useState([]);
  const [providerEarnings, setProviderEarnings] = useState({});
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/admin");
      const data = res.data || [];

      setBookings(data);
      calculateEarnings(data);
    } catch (err) {
      console.log("Earnings Fetch Error:", err);
    }
  };

  // =========================
  // 🔥 FINAL PRICE LOGIC
  // =========================
  const getFinalPrice = (b) => {
    if (b.finalPrice && b.finalPrice !== 0) {
      return b.finalPrice;
    }
    return b.offeredPrice || b.basePrice || 0;
  };

  // =========================
  // 💰 VALID STATUS CHECK
  // =========================
  const isValid = (status) => {
    return (
      status === "accepted" ||
      status === "completed" ||
      status === "rent_completed"
    );
  };

  // =========================
  // 🔥 MAIN EARNINGS LOGIC
  // =========================
  const calculateEarnings = (data) => {
    let providerMap = {};
    let total = 0;

    data.forEach((b) => {
      if (!isValid(b.status)) return;

      const earning = (getFinalPrice(b) * 10) / 100;

      const providerId = b.provider?._id;
      const providerName = b.provider?.name || "Unknown";

      if (!providerId) return;

      if (!providerMap[providerId]) {
        providerMap[providerId] = {
          name: providerName,
          total: 0,
        };
      }

      providerMap[providerId].total += earning;
      total += earning;
    });

    setProviderEarnings(providerMap);
    setTotalEarnings(total);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>💰 Admin Earnings</Text>

      {/* ========================= */}
      {/* 📊 PROVIDER-WISE EARNINGS */}
      {/* ========================= */}
      <View style={styles.box}>
        <Text style={styles.subHeading}>
          Provider-wise Earnings
        </Text>

        <View style={styles.rowHeader}>
          <Text style={styles.cell}>Provider Name</Text>
          <Text style={styles.cell}>Earnings</Text>
        </View>

        {Object.keys(providerEarnings).map((id) => (
          <View key={id} style={styles.row}>
            <Text style={styles.cell}>
              {providerEarnings[id].name}
            </Text>
            <Text style={styles.cell}>
              ₹{providerEarnings[id].total}
            </Text>
          </View>
        ))}
      </View>

      {/* ========================= */}
      {/* 💵 TOTAL EARNINGS */}
      {/* ========================= */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total Earnings: ₹{totalEarnings}
        </Text>
      </View>
    </ScrollView>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  subHeading: {
    fontSize: 18,
    marginBottom: 10,
  },

  box: {
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 20,
  },

  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    paddingVertical: 10,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#ddd",
  },

  cell: {
    flex: 1,
    textAlign: "center",
  },

  totalBox: {
    backgroundColor: "#3f65b7",
    padding: 15,
    alignItems: "center",
  },

  totalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});