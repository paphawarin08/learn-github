import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../component/firebaseDB'; // ตรวจสอบการเชื่อมต่อ Firebase

export default function ParticipantsScreen({ route, navigation }) {
  const { postId } = route.params; // รับ postId จากการนำทาง
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // ตรวจสอบว่า postId ถูกต้องหรือไม่
        if (!postId) {
          Alert.alert('Error', 'Invalid post ID!');
          return;
        }

        // ดึงข้อมูลกิจกรรมจาก Firestore โดยใช้ postId
        const docRef = doc(db, 'activities', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // ตรวจสอบว่า participants เป็นอาเรย์หรือไม่
          const participantList = Array.isArray(data.participants) ? data.participants : [];
          setParticipants(participantList); // อัพเดต state ด้วยข้อมูลผู้เข้าร่วม
        } else {
          Alert.alert('ไม่พบข้อมูลกิจกรรม', 'ไม่พบข้อมูลกิจกรรมนี้ในระบบ');
        }
      } catch (error) {
        console.error('Error fetching participants: ', error);
        Alert.alert('Error', 'Failed to load participants.');
      }
    };

    fetchParticipants();
  }, [postId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ผู้เข้าร่วมกิจกรรม</Text>

      <FlatList
        data={participants}
        keyExtractor={(item, index) => index.toString()} // ใช้ index เป็น key ถ้าไม่มี id
        renderItem={({ item }) => (
          <View style={styles.participantCard}>
            {/* ตรวจสอบว่า item.userName มีข้อมูลหรือไม่ */}
            <Text style={styles.participantName}>
            <Text style={styles.participantName}>{item.userEmail}</Text> {/* แสดง userEmail */}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  participantCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
