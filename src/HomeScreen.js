import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../component/firebaseDB';

export default function HomeScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // เก็บข้อความค้นหา
  const [filteredActivities, setFilteredActivities] = useState([]); // เก็บรายการที่กรองแล้ว

  // ดึงข้อมูลจาก Firestore เมื่อหน้าโหลด
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "activities"));
        const activitiesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(activitiesList);
        setFilteredActivities(activitiesList); // ตั้งค่าเริ่มต้นให้ตรงกับรายการทั้งหมด
      } catch (error) {
        console.error("Error fetching activities: ", error);
      }
    };

    fetchActivities();
  }, []);

  // ฟังก์ชันกรองรายการตามข้อความค้นหา
  const handleSearch = (text) => {
    setSearchQuery(text); // อัปเดตข้อความค้นหา
    if (text === "") {
      setFilteredActivities(activities); // แสดงรายการทั้งหมดถ้าข้อความค้นหาว่าง
    } else {
      const filtered = activities.filter(activity =>
        activity.activities.toLowerCase().includes(text.toLowerCase()) || // กรองตามชื่อกิจกรรม
        activity.description.toLowerCase().includes(text.toLowerCase()) // กรองตามคำอธิบาย
      );
      setFilteredActivities(filtered);
    }
  };

  return (
    <View style={styles.container}>

      {/* ช่องค้นหา */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search activities..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* แสดงรายการกิจกรรม */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ActivityDetails', { activityId: item.id })}>
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.activities}</Text>
              <Text style={styles.activityDescription}>{item.description}</Text>
              <Text style={styles.activityMap}>สถานที่: {item.map}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#FFEDF6', // พื้นหลังสีชมพูอ่อน
  },
  searchBar: {
    height: 40,
    borderColor: '#98B6D7',
    backgroundColor: '#E5EAFD', // เปลี่ยนเป็นสีฟ้าอ่อน
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16, // ฟอนต์ใหญ่ขึ้นเพื่ออ่านง่าย
    color: '#1C315E', // สีข้อความในช่องค้นหา
  },
  activityCard: {
    backgroundColor: '#1C315E', 
    padding: 15,
    marginBottom: 10,
    borderRadius: 20, 
    marginHorizontal: 20,
    shadowColor: '#000', // เพิ่มเงา
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  activityTitle: {
    fontSize: 20, // ขนาดใหญ่ขึ้นสำหรับหัวข้อ
    fontWeight: 'bold',
    color: '#F6E1C3', // สีเหลืองอ่อน
  },
  activityDescription: {
    fontSize: 16,
    color: '#F1DEC9', // สีอ่อนกว่าหัวข้อ
    marginVertical: 5,
  },
  activityMap: {
    fontSize: 14,
    color: '#E8E8E8',
  },
});

