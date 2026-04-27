import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://192.168.31.158:5000/api",
});

// ✅ Attach token properly
API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔧 Provider APIs
export const getProviderBookings = () => API.get("/bookings/provider");
export const getMyServices = () => API.get("/services/my");

export const acceptBooking = (id) =>
  API.put(`/bookings/${id}/accept`);

export const rejectBooking = (id) =>
  API.put(`/bookings/${id}/reject`);

export const toggleAvailability = (id) =>
  API.put(`/services/toggle/${id}`);

export const acceptOffer = (id) =>
  API.put(`/bookings/${id}/accept-offer`);

export const rejectOffer = (id) =>
  API.put(`/bookings/${id}/reject-offer`);

// 🔥 FIXED: SEND PRICE
export const counterOffer = (id, price) =>
  API.put(`/bookings/${id}/counter`, {
    offeredPrice: price,
  });

export default API;