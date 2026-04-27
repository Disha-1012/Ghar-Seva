import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image, // Added Image
} from "react-native";

import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  getMyServices,
  toggleAvailability,
} from "../../services/api";

import API from "../../services/api";

export default function ProviderDashboard({ navigation }) {
  const [services, setServices] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const intervalRef = useRef(null);

  const loadData = async () => {
    try {
      const [s, t] = await Promise.all([
        getMyServices(),
        API.get("/tools/my"),
      ]);

      setServices(s.data);
      setTools(t.data);
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };

    init();

    intervalRef.current = setInterval(() => {
      if (isMounted) loadData();
    }, 3000);

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleToggle = async (id) => {
    await toggleAvailability(id);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* HEADER WITH LOGO SECTION */}
      <View style={styles.headerContainer}>
        {/* LOGO SECTION ADDED HERE */}
        <View style={styles.logoSection}>
           <View style={styles.logoCircle}>
              <Image 
                source={require("../../../assets/images/logo.jpeg")} // Ensure path is correct
                style={styles.logoImage}
                resizeMode="cover"
              />
           </View>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.heading}>Provider Dashboard 🔧</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profile}>👤 Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* SERVICES */}
        <View style={styles.sectionHeader}>
            <View style={styles.accentBar} />
            <Text style={styles.subHeading}>My Services</Text>
        </View>

        {services.map((s) => (
          <View key={s._id} style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.title}>{s.serviceType}</Text>
                <Text style={styles.priceText}>Base Price: <Text style={styles.priceValue}>₹{s.basePrice}</Text></Text>
                {s.startTime && (
                  <Text style={styles.timeText}>⏰ {s.startTime} - {s.endTime}</Text>
                )}
            </View>
            <View style={styles.cardAction}>
                <Text style={[styles.statusText, { color: s.availability ? "#2e7d32" : "#d32f2f" }]}>
                    {s.availability ? "Active" : "Offline"}
                </Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#ff8c00" }}
                  thumbColor={s.availability ? "#fff" : "#f4f3f4"}
                  value={s.availability}
                  onValueChange={() => handleToggle(s._id)}
                />
            </View>
          </View>
        ))}

        {/* TOOLS */}
        <View style={styles.sectionHeader}>
            <View style={[styles.accentBar, { backgroundColor: '#ff8c00' }]} />
            <Text style={styles.subHeading}>My Tools</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsScroll}>
            {tools.map((t) => (
            <View key={t._id} style={styles.toolCard}>
                <Text style={styles.toolEmoji}>🛠️</Text>
                <Text style={styles.title}>{t.name}</Text>
                <Text style={styles.toolPrice}>₹{t.price || 0}</Text>
            </View>
            ))}
            {tools.length === 0 && <Text style={styles.emptyText}>No tools listed yet.</Text>}
        </ScrollView>

        {/* QUICK ACTIONS */}
        <Text style={styles.subHeading}>Quick Actions</Text>
        <View style={styles.blockContainer}>
          <TouchableOpacity
            style={[styles.block, { borderColor: '#003366' }]}
            onPress={() => navigation.navigate("IncomingBookings")}
          >
            <View style={styles.blockIconCircle}>
                <Text style={styles.blockEmoji}>📥</Text>
            </View>
            <Text style={styles.blockText}>Incoming Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.block, { borderColor: '#ff8c00' }]}
            onPress={() => navigation.navigate("Earnings")}
          >
            <View style={[styles.blockIconCircle, { backgroundColor: '#fff4e5' }]}>
                <Text style={styles.blockEmoji}>💰</Text>
            </View>
            <Text style={styles.blockText}>Your Earnings</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("ProviderDashboard")}
        >
          <Text style={[styles.navText, { color: '#003366' }]}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("AddOptions")}
        >
          <View style={styles.addIconBg}>
            <Text style={[styles.navText, { color: '#fff' }]}>➕ Add</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.navText}>📜 History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#003366', fontWeight: '600' },

  headerContainer: {
    backgroundColor: "#003366",
    paddingTop: 15, // Adjusted for logo
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  logoSection: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ff8c00", // Orange accent border
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  heading: { fontSize: 20, fontWeight: "800", color: "#fff" },

  profileBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  profile: { fontSize: 14, fontWeight: "bold", color: "#fff" },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  accentBar: {
    width: 4,
    height: 20,
    backgroundColor: '#003366',
    marginRight: 10,
    borderRadius: 2,
  },
  subHeading: { fontSize: 18, fontWeight: "700", color: "#333" },

  card: {
    flexDirection: 'row',
    padding: 18,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardInfo: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16, color: '#333', marginBottom: 4 },
  priceText: { color: '#666', fontSize: 13 },
  priceValue: { color: '#ff8c00', fontWeight: 'bold' },
  timeText: { color: '#003366', fontSize: 12, marginTop: 5, fontWeight: '600' },
  
  cardAction: { alignItems: 'center' },
  statusText: { fontSize: 11, fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase' },

  toolsScroll: { marginTop: 10 },
  toolCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginRight: 15,
    width: 130,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  toolEmoji: { fontSize: 24, marginBottom: 5 },
  toolPrice: { color: '#ff8c00', fontWeight: 'bold', marginTop: 2 },
  emptyText: { color: '#999', fontStyle: 'italic' },

  blockContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  block: {
    width: "48%",
    height: 140,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  blockIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  blockEmoji: { fontSize: 22 },
  blockText: { fontSize: 14, fontWeight: "bold", color: '#333', textAlign: 'center', paddingHorizontal: 10 },

  bottomNav: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  navBtn: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, fontWeight: "bold", color: '#888' },
  addIconBg: {
    backgroundColor: '#ff8c00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: -5
  }
});