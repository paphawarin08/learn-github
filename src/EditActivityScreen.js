import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../component/firebaseDB'; // ตรวจสอบการเชื่อมต่อ Firebase

export default function EditActivityScreen({ route, navigation }) {
  const { postId } = route.params; // รับ postId จาก navigation
  const [activity, setActivity] = useState({
    activities: '',
    description: '',
    date: '',
    time: '',
    contact: '',
    map: '',
  });

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const docRef = doc(db, "activities", postId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setActivity(docSnap.data()); // โหลดข้อมูลจาก Firestore ไปแสดงในฟอร์ม
        } else {
          Alert.alert("Error", "Activity not found.");
        }
      } catch (error) {
        console.error("Error fetching activity: ", error);
        Alert.alert("Error", "Failed to load activity details.");
      }
    };

    fetchActivityDetails();
  }, [postId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "activities", postId);
      await updateDoc(docRef, {
        activities: activity.activities,
        description: activity.description,
        date: activity.date,
        time: activity.time,
        contact: activity.contact,
        map: activity.map,
      });

      Alert.alert("Success", "Post updated successfully.");
      navigation.goBack(); // กลับไปยังหน้าก่อนหน้านี้หลังจากบันทึก
    } catch (error) {
      console.error("Error updating post: ", error);
      Alert.alert("Error", "Failed to update post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>แก้ไขโพสต์กิจกรรม</Text>

      <TextInput
        style={styles.input}
        value={activity.activities}
        onChangeText={(text) => setActivity({ ...activity, activities: text })}
        placeholder="ชื่อกิจกรรม"
      />
      <TextInput
        style={styles.input}
        value={activity.description}
        onChangeText={(text) => setActivity({ ...activity, description: text })}
        placeholder="รายละเอียด"
      />
      <TextInput
        style={styles.input}
        value={activity.date}
        onChangeText={(text) => setActivity({ ...activity, date: text })}
        placeholder="วันที่"
      />
      <TextInput
        style={styles.input}
        value={activity.time}
        onChangeText={(text) => setActivity({ ...activity, time: text })}
        placeholder="เวลา"
      />
      <TextInput
        style={styles.input}
        value={activity.contact}
        onChangeText={(text) => setActivity({ ...activity, contact: text })}
        placeholder="ติดต่อ"
      />
      <TextInput
        style={styles.input}
        value={activity.map}
        onChangeText={(text) => setActivity({ ...activity, map: text })}
        placeholder="สถานที่"
      />

      <Button title="บันทึกการแก้ไข" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 8,
    fontSize: 16,
  },
});
