import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import API from "../../services/api";

const { width } = Dimensions.get("window");

// Service icon map — extend as needed
const SERVICE_ICONS = {
  Electrical: "🔌",
  Plumbing: "🚰",
  Painting: "🎨",
  Cleaning: "🧹",
  Carpentry: "🪚",
  "AC Repair": "❄️",
  Gardening: "🌱",
  Security: "🔐",
  default: "🔧",
};

// Tool icon map
const TOOL_ICONS = {
  Drill: "🪛",
  Ladder: "🪜",
  Hammer: "🔨",
  Saw: "🪚",
  Wrench: "🔧",
  default: "🛠️",
};

// Ad banners data
const ADS = [
  {
    id: "1",
    title: "50% Off First Booking!",
    subtitle: "Use code GHAR50 at checkout",
    bg: "#0e5ee9",
    accent: "#f97316",
    emoji: "🎉",
  },
  {
    id: "2",
    title: "Rent Tools Today",
    subtitle: "Drills, ladders & more — at your door",
    bg: "#f97316",
    accent: "#fff",
    emoji: "🛠️",
  },
  {
    id: "3",
    title: "Verified Professionals",
    subtitle: "Background checked, always safe",
    bg: "#0c6e3f",
    accent: "#fff",
    emoji: "🛡️",
  },
];

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [services, setServices] = useState([]);
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  const adScrollRef = useRef(null);
  const adAnimVal = useRef(new Animated.Value(1)).current;

  // Auto-scroll ads
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (adIndex + 1) % ADS.length;
      setAdIndex(nextIndex);
      adScrollRef.current?.scrollTo({ x: nextIndex * (width - 40), animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [adIndex]);

  useEffect(() => {
    fetchServices();
    fetchTools();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    setFilteredServices(services.filter((s) => s.name.toLowerCase().includes(keyword)));
    setFilteredTools(tools.filter((t) => t.name.toLowerCase().includes(keyword)));
  }, [search, services, tools]);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      const uniqueTypes = [...new Set(res.data.map((s) => s.serviceType))];
      const formatted = uniqueTypes.map((type, index) => ({ id: index.toString(), name: type }));
      setServices(formatted);
      setFilteredServices(formatted);
    } catch (err) {
      console.log("Service fetch error:", err);
    }
  };

  const fetchTools = async () => {
    try {
      const res = await API.get("/tools");
      const availableTools = res.data.filter((t) => t.availability !== false);
      const formatted = availableTools.map((tool, index) => ({
        id: tool._id || index.toString(),
        name: tool.name,
      }));
      setTools(formatted);
      setFilteredTools(formatted);
    } catch (err) {
      console.log("Tool fetch error:", err);
    }
  };

  const getServiceIcon = (name) =>
    SERVICE_ICONS[name] || SERVICE_ICONS.default;

  const getToolIcon = (name) =>
    TOOL_ICONS[name] || TOOL_ICONS.default;

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.82}
      onPress={() => navigation.navigate("ServiceList", { serviceType: item.name })}
    >
      <View style={styles.serviceCardIconBg}>
        <Text style={styles.serviceCardIcon}>{getServiceIcon(item.name)}</Text>
      </View>
      <Text style={styles.serviceCardText} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderToolCard = ({ item }) => (
    <TouchableOpacity
      style={styles.toolCard}
      activeOpacity={0.82}
      onPress={() => navigation.navigate("ToolRental", { toolName: item.name })}
    >
      <View style={styles.toolCardIconBg}>
        <Text style={styles.toolCardIcon}>{getToolIcon(item.name)}</Text>
      </View>
      <Text style={styles.toolCardText} numberOfLines={2}>{item.name}</Text>
      <View style={styles.toolRentBadge}>
        <Text style={styles.toolRentBadgeText}>Rent</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0e5ee9" />

      {/* ══════════════ STICKY HEADER ══════════════ */}
      <View style={styles.header}>
        <View style={styles.headerDecCircle1} />
        <View style={styles.headerDecCircle2} />

        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.logoBtn} activeOpacity={0.7}>
            <View style={styles.logoCircle}>
              {/* Replace the Image source with your actual logo URI or local file */}
              <Image
                source={require("../../../assets/images/logo.jpeg")} // ✅ adjust path if needed
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchWrapper, searchFocused && styles.searchWrapperFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search services or tools..."
            placeholderTextColor="#b0c4d8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ══════════════ SCROLLABLE BODY ══════════════ */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ══════════════ AD BANNER SECTION ══════════════ */}
        <View style={styles.adSection}>
          <ScrollView
            ref={adScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
              setAdIndex(idx);
            }}
          >
            {ADS.map((ad) => (
              <TouchableOpacity
                key={ad.id}
                activeOpacity={0.92}
                style={[styles.adCard, { backgroundColor: ad.bg, width: width - 40 }]}
              >
                <View style={styles.adCircle1} />
                <View style={styles.adCircle2} />
                <View style={styles.adTextCol}>
                  <View style={[styles.adPill, { borderColor: ad.accent + "55" }]}>
                    <Text style={[styles.adPillText, { color: ad.accent === "#fff" ? "#fff" : ad.accent }]}>
                      SPECIAL OFFER
                    </Text>
                  </View>
                  <Text style={styles.adTitle}>{ad.title}</Text>
                  <Text style={styles.adSubtitle}>{ad.subtitle}</Text>
                  <View style={[styles.adCtaBtn, { backgroundColor: ad.accent === "#fff" ? "rgba(255,255,255,0.18)" : ad.accent }]}>
                    <Text style={styles.adCtaText}>Claim Now →</Text>
                  </View>
                </View>
                <Text style={styles.adEmoji}>{ad.emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dot indicators */}
          <View style={styles.adDots}>
            {ADS.map((_, i) => (
              <View
                key={i}
                style={[styles.adDot, i === adIndex && styles.adDotActive]}
              />
            ))}
          </View>
        </View>

        {/* ══════════════ SERVICES SECTION ══════════════ */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {filteredServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredServices}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={renderServiceCard}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
            />
          )}
        </View>

        {/* ══════════════ TOOLS SECTION ══════════════ */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionAccentBar, { backgroundColor: "#f97316" }]} />
            <Text style={styles.sectionTitle}>Tool Rental</Text>
            <TouchableOpacity style={[styles.seeAllBtn, { borderColor: "#f9731633" }]}>
              <Text style={[styles.seeAllText, { color: "#f97316" }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {filteredTools.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🛠️</Text>
              <Text style={styles.emptyText}>No tools found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTools}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={renderToolCard}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
            />
          )}
        </View>

        {/* Bottom spacer for nav bar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ══════════════ BOTTOM NAVIGATION BAR ══════════════ */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={[styles.navIconBg, styles.navIconBgActive]}>
            <Text style={styles.navIcon}>🏠</Text>
          </View>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("History")}
        >
          <View style={styles.navIconBg}>
            <Text style={styles.navIcon}>📜</Text>
          </View>
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HelpLine")}
        >
          <View style={styles.navIconBg}>
            <Text style={styles.navIcon}>☎️</Text>
          </View>
          <Text style={styles.navLabel}>HelpLine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },

  /* ══════════════ HEADER ══════════════ */
  header: {
    backgroundColor: "#0e5ee9",
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    position: "relative",
    zIndex: 10,
    shadowColor: "#0e5ee9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  headerDecCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -60,
    right: -30,
  },
  headerDecCircle2: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(249,115,22,0.12)",
    bottom: -30,
    left: -20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoBtn: {
    padding: 0,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileBtn: {
    padding: 2,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  profileAvatarText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 18,
  },

  /* Search */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchWrapperFocused: {
    backgroundColor: "#ffffff",
    borderColor: "#f97316",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0c4a6e",
    fontWeight: "500",
    paddingVertical: 0,
  },
  searchClear: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "700",
    paddingLeft: 8,
  },

  /* ══════════════ SCROLL BODY ══════════════ */
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },

  /* ══════════════ AD BANNER ══════════════ */
  adSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  adCard: {
    borderRadius: 22,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginRight: 0,
  },
  adCircle1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -40,
    right: -20,
  },
  adCircle2: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -30,
    left: 20,
  },
  adTextCol: {
    flex: 1,
    zIndex: 2,
  },
  adPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  adPillText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  adTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -0.2,
    marginBottom: 5,
  },
  adSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 14,
    fontWeight: "400",
  },
  adCtaBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  adCtaText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  adEmoji: {
    fontSize: 56,
    marginLeft: 12,
    zIndex: 2,
  },
  adDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  adDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#c0d8f0",
  },
  adDotActive: {
    backgroundColor: "#0e5ee9",
    width: 20,
  },

  /* ══════════════ SECTION BLOCKS ══════════════ */
  sectionBlock: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  sectionAccentBar: {
    width: 5,
    height: 22,
    borderRadius: 3,
    backgroundColor: "#0ea5e9",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0c2461",
    flex: 1,
    letterSpacing: -0.2,
  },
  seeAllBtn: {
    borderWidth: 1.5,
    borderColor: "#0ea5e933",
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0ea5e9",
  },

  /* ── Grid row ── */
  gridRow: {
    justifyContent: "flex-start",
    marginBottom: 0,
    gap: 12,
  },

  /* ── Service Card ── */
  serviceCard: {
    flex: 1,
    maxWidth: (width - 64) / 3,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: "#e0f2fe",
  },
  serviceCardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  serviceCardIcon: {
    fontSize: 22,
  },
  serviceCardText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0c4a6e",
    textAlign: "center",
    letterSpacing: 0.1,
  },

  /* ── Tool Card ── */
  toolCard: {
    flex: 1,
    maxWidth: (width - 64) / 3,
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
    position: "relative",
  },
  toolCardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  toolCardIcon: {
    fontSize: 22,
  },
  toolCardText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7c2d12",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  toolRentBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  toolRentBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* ── Empty State ── */
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#7ec8e8",
    fontWeight: "600",
  },

  /* ══════════════ BOTTOM NAV ══════════════ */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0f2fe",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginBottom: 4,
  },
  navIconBgActive: {
    backgroundColor: "#e0f2fe",
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: "#0e5ee9",
    fontWeight: "800",
  },
});