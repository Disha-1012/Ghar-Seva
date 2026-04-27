import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { useState, useContext } from "react";
import { registerUser, loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

const ROLES = [
  { key: "customer", label: "Customer", icon: "🛒" },
  { key: "provider", label: "Provider", icon: "🔧" },
  { key: "admin", label: "Admin", icon: "🛡️" },
];

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name, phone, password, role });
      const res = await loginUser({ phone, password });
      const token = res.data.token;
      const user = res.data.user;
      await login(token, user.role);
      Alert.alert("Success", "Registered & Logged in");
      if (user.role === "provider") {
        navigation.replace("ProviderDashboard");
      } else if (user.role === "admin") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("Home");
      }
    } catch (error) {
      console.log("REGISTER ERROR:", error?.response?.data || error.message);
      Alert.alert("Error", "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0e5ee9" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Sky-blue curved header */}
          <View style={styles.headerBg}>
            <View style={styles.headerCircle1} />
            <View style={styles.headerCircle2} />
            <View style={styles.headerCircle3} />

            <View style={styles.logoContainer}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Image
                    source={require("../../../assets/images/logo.jpeg")}
                    style={styles.logoIcon}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <Text style={styles.appName}>Create Account</Text>
              <Text style={styles.appSubtitle}>Join us — it only takes a minute</Text>
            </View>
          </View>

          {/* White card */}
          <View style={styles.card}>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#b0c4d8"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.inputWrapper, phoneFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor="#b0c4d8"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                  keyboardType="phone-pad"
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#b0c4d8"
                  value={password}
                  secureTextEntry
                  onChangeText={setPassword}
                  style={styles.input}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
            </View>

            {/* Role Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Role</Text>
              <View style={styles.roleRow}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[
                      styles.roleCard,
                      role === r.key && styles.roleCardActive,
                    ]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.roleCardIcon}>{r.icon}</Text>
                    <Text
                      style={[
                        styles.roleCardLabel,
                        role === r.key && styles.roleCardLabelActive,
                      ]}
                    >
                      {r.label}
                    </Text>
                    {role === r.key && (
                      <View style={styles.roleCheckDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonLoading]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
              {!loading && <Text style={styles.registerArrow}>→</Text>}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.loginContainer}
              activeOpacity={0.75}
            >
              <Text style={styles.loginText}>
                Already have an account?{"  "}
                <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom accent */}
          <View style={styles.bottomAccent}>
            <Text style={styles.bottomAccentText}>Secure & Encrypted Registration</Text>
            <Text style={styles.lockIcon}>🔐</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },

  /* ── Header ── */
  headerBg: {
    backgroundColor: "#4877c9",
    height: height * 0.35,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 32,
    position: "relative",
  },
  headerCircle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -60,
    right: -40,
  },
  headerCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 10,
    left: -50,
  },
  headerCircle3: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(249,115,22,0.18)",
    top: 30,
    left: width * 0.35,
  },

  /* ── Logo ── */
  logoContainer: {
    alignItems: "center",
    zIndex: 2,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  appName: {
    fontSize: 27,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  /* ── Card ── */
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -28,
    borderRadius: 28,
    padding: 26,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 10,
  },

  /* ── Inputs ── */
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0c4a6e",
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e0f2fe",
    borderRadius: 14,
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 2,
  },
  inputWrapperFocused: {
    borderColor: "#ffa361",
    backgroundColor: "#fff7ed",
    shadowColor: "#fe9b54",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0c4a6e",
    fontWeight: "500",
    paddingVertical: 4,
  },

  /* ── Role Selector ── */
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  roleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e0f2fe",
    borderRadius: 14,
    backgroundColor: "#f0f9ff",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  roleCardActive: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  roleCardIcon: {
    fontSize: 22,
    marginBottom: 5,
  },
  roleCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7ec8e8",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  roleCardLabelActive: {
    color: "#f97316",
  },
  roleCheckDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f97316",
  },

  /* ── Register Button ── */
  registerButton: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fcaf78",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 24,
    marginTop: 4,
  },
  registerButtonLoading: {
    backgroundColor: "#fdba74",
    shadowOpacity: 0.15,
    elevation: 3,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  registerArrow: {
    color: "#ffffff",
    fontSize: 20,
    marginLeft: 8,
    fontWeight: "700",
  },

  /* ── Divider ── */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0f2fe",
  },
  dividerText: {
    fontSize: 12,
    color: "#7ec8e8",
    fontWeight: "700",
    marginHorizontal: 12,
    letterSpacing: 1.5,
  },

  /* ── Login Link ── */
  loginContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  loginText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  loginLink: {
    color: "#0e5be9",
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  /* ── Bottom ── */
  bottomAccent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 6,
  },
  bottomAccentText: {
    fontSize: 12,
    color: "#7ec8e8",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  lockIcon: {
    fontSize: 14,
  },
});