import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/customer");

      // 🔥 IMPORTANT: FORCE NEW ARRAY (REACT UPDATE FIX)
      setBookings([...res.data]);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleAccept = async (id) => {
    await API.put(`/bookings/${id}/accept-offer`);
    fetchBookings();
  };

  const handleReject = async (id) => {
    await API.put(`/bookings/${id}/reject-offer`);
    fetchBookings();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.heading}>My Bookings</Text>

      {bookings.length === 0 ? (
        <Text>No bookings yet</Text>
      ) : (
        bookings.map((item) => (
          <View key={item._id} style={styles.card}>
            <Text>Service: {item.service?.serviceType}</Text>

            <Text>Base Price: ₹{item.basePrice}</Text>

            {/* 🔥 THIS WILL NOW UPDATE LIVE */}
            <Text style={{ fontWeight: "bold" }}>
              Current Offer: ₹{item.offeredPrice}
            </Text>

            <Text>Status: {item.status}</Text>

            {item.status === "negotiating" && (
              <>
                <Button
                  title="Accept Offer"
                  onPress={() => handleAccept(item._id)}
                />
                <Button
                  title="Reject Offer"
                  color="red"
                  onPress={() => handleReject(item._id)}
                />
              </>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },
});