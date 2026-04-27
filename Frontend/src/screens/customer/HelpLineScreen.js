import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";

export default function HelpLineScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerBox}>
        <Text style={styles.heading}>📞 HelpLine</Text>
        <Text style={styles.subHeading}>We're here to help you 24/7</Text>
      </View>

      {/* Support Card */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.emoji}>🎧</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Customer Support</Text>
          <Text style={styles.value}>1800-123-456</Text>
        </View>
      </View>

      {/* Emergency Card */}
      <View style={[styles.card, styles.emergencyCard]}>
        <View style={[styles.iconCircle, styles.orangeCircle]}>
          <Text style={styles.emoji}>🚨</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.label, styles.orangeText]}>Emergency Service</Text>
          <Text style={styles.value}>112</Text>
        </View>
      </View>

      {/* Email Card */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.emoji}>✉️</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>support@gharseva.com</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Typical response time for emails is within 24 hours.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: "#ffffff" 
  },

  headerBox: {
    marginTop: 40,
    marginBottom: 30,
  },

  heading: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#003366", // Deep Blue
    letterSpacing: -0.5 
  },

  subHeading: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "500"
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    // Professional Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  emergencyCard: {
    backgroundColor: "#fff8f1", // Very light orange tint
    borderColor: "#ffebd5",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  orangeCircle: {
    backgroundColor: "#ffedd5",
  },

  emoji: {
    fontSize: 22,
  },

  info: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0056b3", // Professional Blue
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  orangeText: {
    color: "#ff8c00", // Vibrant Orange
  },

  value: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
  },

  footer: {
    marginTop: "auto",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 18,
  }
});