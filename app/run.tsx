import { Ionicons } from "@expo/vector-icons";
// ✅ เพิ่มการนำเข้า Stack จาก expo-router เพื่อใช้ซ่อน Header อัตโนมัติ
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../services/supabase";

interface RunItem {
  id: number;
  location: string;
  distance: number;
  time_of_day: string;
  run_date: string;
  image_url: string | null;
}

export default function RunScreen() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRunsData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        Alert.alert(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถโหลดข้อมูลได้: " + error.message,
        );
      } else {
        setRuns(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRunsData();
    }, []),
  );

  const renderItem = ({ item }: { item: RunItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cardImage, styles.noImage]}>
          <Ionicons name="image-outline" size={30} color="#b6b6b6" />
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.location}
        </Text>
        <Text style={styles.cardDate}>{item.run_date}</Text>
      </View>

      <View style={styles.distanceContainer}>
        <Text style={styles.cardDistance}>{item.distance.toFixed(1)} km</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ccc"
          style={styles.cardArrow}
        />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.logoContainer}>
      <Image
        source={require("@/assets/images/runlogo.png")}
        style={styles.runlogo}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ สั่งปิด Header อัตโนมัติของตัว Expo Router เพื่อไม่ให้ซ้อนกัน 2 อัน */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header สีฟ้าล้วน ของเราที่สร้างเอง (จะเหลือแค่อันนี้อันเดียว) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Run Tracker V.1.0.0</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0b63c6" />
          <Text style={styles.loadingText}>กำลังโหลด...</Text>
        </View>
      ) : runs.length === 0 ? (
        <View style={styles.centered}>
          {renderHeader()}
          <Ionicons name="walk-outline" size={52} color="#ccc" />
          <Text style={styles.emptyText}>ยังไม่มีข้อมูลการวิ่ง</Text>
          <Text style={styles.emptySubText}>กด + เพื่อเพิ่มเส้นทางแรก</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={runs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchRunsData}
          refreshing={loading}
        />
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    backgroundColor: "#0b57d0",
    paddingTop: 60, // ดันเนื้อหาลงมาไม่ให้ชนกับขอบจอมือถือด้านบน
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Kanit_700Bold",
    letterSpacing: 0.5,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  runlogo: {
    width: 200,
    height: 150,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  noImage: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 20,
    fontFamily: "Kanit_700Bold",
    color: "#111",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    fontFamily: "Kanit_400Regular",
    color: "#666",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDistance: {
    fontSize: 18,
    fontFamily: "Kanit_700Bold",
    color: "#0b57d0",
    marginRight: 10,
  },
  cardArrow: {
    paddingRight: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "Kanit_400Regular",
  },
  emptyText: {
    color: "#555",
    fontSize: 18,
    fontFamily: "Kanit_700Bold",
  },
  emptySubText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "Kanit_400Regular",
  },
  addBtn: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 65,
    height: 65,
    backgroundColor: "#0b57d0",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#0b57d0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});
