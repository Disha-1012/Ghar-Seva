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
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser({ phone, password });
      const token = res.data.token;
      const role = res.data.user.role;
      await login(token, role);
      Alert.alert("Success", "Login successful");
    } catch (error) {
      Alert.alert("Error", "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0ea5e9" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Sky-blue curved header background */}
          <View style={styles.headerBg}>
            <View style={styles.headerCircle1} />
            <View style={styles.headerCircle2} />

            {/* App Icon / Logo Area */}
            <View style={styles.logoContainer}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Image
                    source={require("../../../assets/images/logo.jpeg")} // ✅ adjust path if needed
                    style={styles.logoIcon}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <Text style={styles.appName}>Welcome Back</Text>
              <Text style={styles.appSubtitle}>Sign in to continue</Text>
            </View>
          </View>

          {/* White card form */}
          <View style={styles.card}>
            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View
                style={[
                  styles.inputWrapper,
                  phoneFocused && styles.inputWrapperFocused,
                ]}
              >
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
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}
              >
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonLoading]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
              {!loading && <Text style={styles.loginArrow}>→</Text>}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.registerContainer}
              activeOpacity={0.75}
            >
              <Text style={styles.registerText}>
                Don't have an account?{"  "}
                <Text style={styles.registerLink}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom accent */}
          <View style={styles.bottomAccent}>
            <Text style={styles.bottomAccentText}>
              Secure & Encrypted Login
            </Text>
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
  },

  /* ── Header / Hero ── */
  headerBg: {
    backgroundColor: "#4877c9",
    height: height * 0.38,
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
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -60,
    right: -40,
  },
  headerCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 20,
    left: -50,
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
    resizeMode: "cover",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    marginTop: 4,
    fontWeight: "400",
    letterSpacing: 0.3,
  },

  /* ── Card ── */
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -28,
    borderRadius: 28,
    padding: 28,
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

  /* ── Forgot ── */
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -6,
  },
  forgotText: {
    fontSize: 13,
    color: "#f97316",
    fontWeight: "600",
  },

  /* ── Login Button ── */
  loginButton: {
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
  },
  loginButtonLoading: {
    backgroundColor: "#fdba74",
    shadowOpacity: 0.15,
    elevation: 3,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  loginArrow: {
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

  /* ── Register ── */
  registerContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  registerText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  registerLink: {
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