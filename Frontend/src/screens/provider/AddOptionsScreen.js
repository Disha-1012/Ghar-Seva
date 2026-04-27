import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";

export default function AddOptionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerBox}>
        <Text style={styles.heading}>➕ Add Options</Text>
        <Text style={styles.subHeading}>Choose what you would like to list</Text>
      </View>

      <View style={styles.boxContainer}>
        {/* ADD SERVICE BOX */}
        <TouchableOpacity
          style={[styles.box, styles.serviceBox]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddService")}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>🛠️</Text>
          </View>
          <Text style={[styles.text, styles.blueText]}>Add Service</Text>
        </TouchableOpacity>

        {/* ADD TOOL BOX */}
        <TouchableOpacity
          style={[styles.box, styles.toolBox]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddTool")}
        >
          <View style={[styles.iconCircle, styles.orangeCircle]}>
            <Text style={styles.emoji}>🧰</Text>
          </View>
          <Text style={[styles.text, styles.orangeText]}>Add Tool</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.footerText}>
          Your listings will be visible to customers in your local area.
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
    marginBottom: 40,
  },

  heading: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#003366", // Deep Blue
    letterSpacing: -0.5
  },

  subHeading: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "500"
  },

  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  box: {
    width: "47%",
    height: 180,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    // Realistic Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
  },

  serviceBox: {
    borderColor: "#e2e8f0",
    borderBottomWidth: 5,
    borderBottomColor: "#0056b3", // Deep Blue accent
  },

  toolBox: {
    borderColor: "#e2e8f0",
    borderBottomWidth: 5,
    borderBottomColor: "#ff8c00", // Orange accent
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  orangeCircle: {
    backgroundColor: "#fff4e5",
  },

  emoji: {
    fontSize: 24,
  },

  text: { 
    fontSize: 15, 
    fontWeight: "800",
    textAlign: "center"
  },

  blueText: {
    color: "#003366",
  },

  orangeText: {
    color: "#ff8c00",
  },

  footerInfo: {
    marginTop: "auto",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
  },

  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  }
});