import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { auth, db } from '../component/firebaseDB';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostScreen({ navigation }) {
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [map, setMap] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to enable permissions to access the media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeImages,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "Please log in to create a post.");
      return;
    }

    try {
      await addDoc(collection(db, "activities"), {
        activities: activity,
        description: description,
        date: date,
        time: time,
        map: map,
        contact: contact,
        userId: userId,
        image: image,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Post created successfully!");
      
      setActivity("");
      setDescription("");
      setDate("");
      setTime("");
      setMap("");
      setContact("");
      setImage(null);
  
      navigation.goBack();

    } catch (error) {
      console.error("Error creating post: ", error);
      Alert.alert("Error", "Failed to create post.");
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
      
      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageText}>เพิ่มรูปภาพ</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} value={activity} onChangeText={setActivity} placeholder="Activity Name" />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Date" />
      <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="Time" />
      <TextInput style={styles.input} value={map} onChangeText={setMap} placeholder="Location" />
      <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Contact Info" />

      <Button title="Create Post" onPress={createPost} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#262984',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    color: '#262984',
    borderColor: '#FFEDF6',
    backgroundColor: '#FFEDF6',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  pickImageButton: {
    backgroundColor: '#FFEDF6', // สีพื้นหลังของปุ่ม
    paddingVertical: 15, // ระยะห่างในแนวตั้ง
    paddingHorizontal: 20, // ระยะห่างในแนวนอน
    borderRadius: 25, // ขอบมุมโค้ง
    alignItems: 'center', // จัดข้อความให้อยู่กลาง
    justifyContent: 'center', // จัดข้อความให้อยู่กลาง
    marginBottom: 20,
  },
  pickImageText: {
    color: '#262984', // สีข้อความในปุ่ม
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 5,       // เพิ่มระยะห่างในแนวตั้ง
    paddingHorizontal: 12,     // เพิ่มระยะห่างในแนวนอน
    textAlign: 'center',       // จัดข้อความให้กลาง
  },
});
