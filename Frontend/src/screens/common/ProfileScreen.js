import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");

      const data = res.data.user || res.data;

      setUser(data);

      if (data.profilePic) {
        setImage(data.profilePic);
      }
    } catch (err) {
      console.log("Profile fetch error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // PICK IMAGE
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  // UPLOAD IMAGE
  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();

      formData.append("profilePic", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      await API.put("/auth/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Profile photo updated successfully ✅");
    } catch (err) {
      console.log("Upload error:", err?.response?.data || err.message);
      Alert.alert("Error", "Failed to upload image ❌");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0e5ee9" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0e5ee9" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerBg}>
          <View style={styles.headerCircle1} />
          <View style={styles.headerCircle2} />
          <View style={styles.headerCircle3} />

          <Text style={styles.heading}>My Profile</Text>
          <Text style={styles.subHeading}>
            Manage your account details
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.card}>
          {/* PROFILE IMAGE */}
          <TouchableOpacity
            style={styles.imageSection}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <View style={styles.imageRing}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>👤</Text>
                </View>
              )}
            </View>

            <Text style={styles.changePhotoText}>
              Tap to change profile photo
            </Text>
          </TouchableOpacity>

          {/* USER INFO */}
          <View style={styles.infoCard}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>
              {user?.name || "Not Available"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>
              {user?.phone || "Not Available"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Customer"}
            </Text>
          </View>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => {
              await AsyncStorage.removeItem("token");
              logout();
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.bottomAccent}>
          <Text style={styles.bottomAccentText}>
            Your account is secure & protected
          </Text>
          <Text style={styles.lockIcon}>🔐</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#f0f9ff",
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#0c4a6e",
    fontWeight: "500",
  },

  /* HEADER */
  headerBg: {
    backgroundColor: "#4273c7",
    height: height * 0.32,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 35,
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
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 20,
    left: -40,
  },

  headerCircle3: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(249,115,22,0.18)",
    top: 30,
    left: width * 0.4,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.4,
  },

  subHeading: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 5,
  },

  /* CARD */
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -35,
    borderRadius: 28,
    padding: 28,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },

  /* IMAGE */
  imageSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  imageRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fbff",
  },

  image: {
    width: 118,
    height: 118,
    borderRadius: 59,
  },

  imagePlaceholder: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    fontSize: 42,
  },

  changePhotoText: {
    marginTop: 12,
    fontSize: 13,
    color: "#f97316",
    fontWeight: "700",
  },

  /* INFO */
  infoCard: {
    backgroundColor: "#f8fbff",
    borderWidth: 1.2,
    borderColor: "#e0f2fe",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.6,
  },

  value: {
    fontSize: 16,
    color: "#0c4a6e",
    fontWeight: "700",
  },

  /* LOGOUT */
  logoutBtn: {
    backgroundColor: "#fa8a44",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#f58c30",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },

  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* FOOTER */
  bottomAccent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 24,
    gap: 6,
  },

  bottomAccentText: {
    fontSize: 12,
    color: "#7ec8e8",
    fontWeight: "600",
  },

  lockIcon: {
    fontSize: 14,
  },
});