import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../component/firebaseDB'; // ตรวจสอบการเชื่อมต่อ Firebase

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigation.replace("Login"); // ถ้าผู้ใช้ไม่ได้ล็อกอิน ให้นำทางไปหน้าล็อกอิน
        return;
      }

      const userId = user.uid; // ดึง userId ของผู้ใช้ที่ล็อกอิน

      try {
        const q = query(collection(db, "activities"), where("userId", "==", userId)); // ค้นหาข้อมูลที่มี userId ตรงกับผู้ใช้
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts); // อัพเดต state ด้วยโพสต์ของผู้ใช้
      } catch (error) {
        console.error("Error fetching user posts: ", error);
        Alert.alert("Error", "Failed to load posts.");
      }
    };

    fetchUserPosts();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login"); // ออกจากระบบและนำทางไปหน้าล็อกอิน
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
        Alert.alert("Error", "Failed to log out.");
      });
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "activities", postId)); // ลบโพสต์จาก Firestore
      setPosts(posts.filter(post => post.id !== postId)); // อัพเดต state เพื่อให้ลบโพสต์ออกจากหน้าจอ
      Alert.alert("Success", "Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post: ", error);
      Alert.alert("Error", "Failed to delete post.");
    }
  };

  const handleEdit = (postId) => {
    // นำทางไปยังหน้าจอแก้ไขโพสต์ และส่ง postId เพื่อให้สามารถแก้ไขได้
    navigation.navigate("EditPost", { postId });
  };

  const handleViewParticipants = (postId) => {
    // นำทางไปยังหน้าจอที่แสดงรายชื่อผู้เข้าร่วมกิจกรรม
    navigation.navigate("Participants", { postId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>โพสต์ของคุณ</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>{item.activities}</Text>
            <Text style={styles.activityDescription}>{item.description}</Text>
            <Text style={styles.activityDate}>{item.date} | {item.time}</Text>
            <Text style={styles.activityContact}>ติดต่อ: {item.contact}</Text>
            <Text style={styles.activityMap}>สถานที่: {item.map}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleEdit(item.id)}>
                <Text style={styles.buttonText}>แก้ไข</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>ลบ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleViewParticipants(item.id)}>
                <Text style={styles.buttonText}>ดูผู้เข้าร่วม</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <Button title="ออกจากระบบ" onPress={handleLogout} />
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
  activityCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
  },
  activityContact: {
    fontSize: 12,
    color: '#888',
  },
  activityMap: {
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
