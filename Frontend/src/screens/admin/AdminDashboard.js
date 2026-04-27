import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminDashboard({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchProviders();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/admin");
      setBookings(res.data || []);
    } catch (err) {
      console.log("Admin Fetch Error:", err);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await API.get("/admin/providers");
      setProviders(res.data || []);
    } catch (err) {
      console.log("Provider Fetch Error:", err);
    }
  };

  const handleVerify = async (id) => {
    await API.put(`/admin/verify/${id}`);
    fetchProviders();
  };

  const handleReject = async (id) => {
    await API.put(`/admin/reject/${id}`);
    fetchProviders();
  };

  const getFinalPrice = (b) =>
    b.finalPrice || b.offeredPrice || b.basePrice || 0;

  const getEarning = (b) =>
    ["accepted", "completed", "rent_completed"].includes(b.status)
      ? (getFinalPrice(b) * 10) / 100
      : 0;

  const serviceBookings = bookings.filter((b) => b.service);
  const toolBookings = bookings.filter((b) => b.tool);

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <ScrollView style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.heading}>Admin Dashboard 🛠️</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.profile}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        {/* PROVIDERS */}
        <View style={styles.card}>
          <Text style={styles.subHeading}>Providers</Text>

          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>ID</Text>
            <Text style={styles.cellHeader}>Name</Text>
            <Text style={styles.cellHeader}>Phone</Text>
            <Text style={styles.cellHeader}>Status</Text>
          </View>

          {providers.map((p) => (
            <View key={p._id} style={styles.row}>
              <Text style={styles.cell}>{p._id}</Text>
              <Text style={styles.cell}>{p.name}</Text>
              <Text style={styles.cell}>{p.phone}</Text>

              <View style={styles.cell}>
                <Text
                  style={[
                    styles.status,
                    p.isVerified === "verified"
                      ? styles.verified
                      : styles.pending,
                  ]}
                >
                  {p.isVerified}
                </Text>

                {p.isVerified === "pending" && (
                  <View style={styles.btnRow}>
                    <TouchableOpacity
                      style={styles.verifyBtn}
                      onPress={() => handleVerify(p._id)}
                    >
                      <Text style={styles.btnText}>Verify</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleReject(p._id)}
                    >
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* SERVICES */}
        <View style={styles.card}>
          <Text style={styles.subHeading}>Services</Text>

          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>Cust ID</Text>
            <Text style={styles.cellHeader}>Name</Text>
            <Text style={styles.cellHeader}>Service</Text>
            <Text style={styles.cellHeader}>Prov ID</Text>
            <Text style={styles.cellHeader}>Prov Name</Text>
            <Text style={styles.cellHeader}>Status</Text>
            <Text style={styles.cellHeader}>Price</Text>
            <Text style={styles.cellHeader}>Earn</Text>
          </View>

          {serviceBookings.map((b) => (
            <View key={b._id} style={styles.row}>
              <Text style={styles.cell}>{b.customer?._id}</Text>
              <Text style={styles.cell}>{b.customer?.name}</Text>
              <Text style={styles.cell}>{b.service?.serviceType}</Text>
              <Text style={styles.cell}>{b.provider?._id}</Text>
              <Text style={styles.cell}>{b.provider?.name}</Text>
              <Text style={styles.cell}>{b.status}</Text>
              <Text style={styles.price}>₹{getFinalPrice(b)}</Text>
              <Text style={styles.earning}>₹{getEarning(b)}</Text>
            </View>
          ))}
        </View>

        {/* TOOLS */}
        <View style={styles.card}>
          <Text style={styles.subHeading}>Tools</Text>

          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>Cust ID</Text>
            <Text style={styles.cellHeader}>Name</Text>
            <Text style={styles.cellHeader}>Tool</Text>
            <Text style={styles.cellHeader}>Prov ID</Text>
            <Text style={styles.cellHeader}>Prov Name</Text>
            <Text style={styles.cellHeader}>Status</Text>
            <Text style={styles.cellHeader}>Price</Text>
            <Text style={styles.cellHeader}>Earn</Text>
          </View>

          {toolBookings.map((b) => (
            <View key={b._id} style={styles.row}>
              <Text style={styles.cell}>{b.customer?._id}</Text>
              <Text style={styles.cell}>{b.customer?.name}</Text>
              <Text style={styles.cell}>{b.tool?.name}</Text>
              <Text style={styles.cell}>{b.provider?._id}</Text>
              <Text style={styles.cell}>{b.provider?.name}</Text>
              <Text style={styles.cell}>{b.status}</Text>
              <Text style={styles.price}>₹{getFinalPrice(b)}</Text>
              <Text style={styles.earning}>₹{getEarning(b)}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("AdminDashboard")}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AdminEarnings")}>
          <Text style={styles.navText}>💰 Earnings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D4ED8", // 🔵 Blue
  },

  profile: {
    fontSize: 16,
    color: "#F97316", // 🟠 Orange
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#1D4ED8", // blue accent
    elevation: 3,
  },

  subHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0F172A",
  },

  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#E0F2FE", // light blue
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  cellHeader: {
    flex: 1,
    fontWeight: "700",
    fontSize: 12,
    color: "#1D4ED8",
    textAlign: "center",
  },

  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    color: "#1E293B",
  },

  price: {
    flex: 1,
    textAlign: "center",
    color: "#1D4ED8",
    fontWeight: "600",
  },

  earning: {
    flex: 1,
    textAlign: "center",
    color: "#F97316",
    fontWeight: "700",
  },

  status: {
    fontWeight: "600",
    marginBottom: 5,
  },

  verified: {
    color: "#16A34A",
  },

  pending: {
    color: "#F97316",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },

  verifyBtn: {
    backgroundColor: "#1D4ED8",
    padding: 6,
    borderRadius: 6,
  },

  rejectBtn: {
    backgroundColor: "#F97316",
    padding: 6,
    borderRadius: 6,
  },

  btnText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#1D4ED8",
  },

  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});