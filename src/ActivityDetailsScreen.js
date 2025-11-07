import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Alert, ScrollView, Image } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, setDoc, deleteField } from 'firebase/firestore';
import { arrayRemove } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../component/firebaseDB';
import { getAuth } from 'firebase/auth';

export default function ActivityDetailsScreen({ route, navigation }) {
  const { activityId } = route.params;
  const [activity, setActivity] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const docRef = doc(db, 'activities', activityId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const activityData = docSnap.data();

          // ดึงรูปจาก Firebase Storage
          if (activityData.imagePath) {
            const imageRef = ref(storage, activityData.imagePath);
            activityData.image = await getDownloadURL(imageRef);
          }

          setActivity(activityData);

          // ตรวจสอบว่าผู้ใช้เข้าร่วมกิจกรรมหรือยัง
          const userRef = doc(db, 'userActivities', auth.currentUser?.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().activities?.[activityId]) {
            setIsJoined(true);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching activity details: ', error);
      }
    };

    fetchActivityDetails();
  }, [activityId]);

  const handleJoinOrLeave = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please login first!');
      return;
    }

    const userId = auth.currentUser.uid;
    const userRef = doc(db, 'userActivities', userId);

    try {
      if (!isJoined) {
        const participant = {
          userId,
          userEmail: auth.currentUser.email,
        };

        const activityRef = doc(db, 'activities', activityId);
        await updateDoc(activityRef, {
          participants: arrayUnion(participant),
        });

        await setDoc(
          userRef,
          {
            activities: {
              [activityId]: activity,
            },
          },
          { merge: true }
        );
        setIsJoined(true);
        Alert.alert('Success', 'Joined successfully!');
      } else {
        const activityRef = doc(db, 'activities', activityId);
        await updateDoc(activityRef, {
          participants: arrayRemove({
            userId,
            userEmail: auth.currentUser.email,
          }),
        });

        await updateDoc(userRef, {
          [`activities.${activityId}`]: deleteField(),
        });
        setIsJoined(false);
        Alert.alert('Success', 'Left successfully!');
      }
    } catch (error) {
      console.error('Error updating user activities: ', error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  if (!activity) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {activity.image && <Image source={{ uri: activity.image }} style={styles.image} />}
      <Text style={styles.activityTitle}>{activity.activities}</Text>
      <Text style={styles.activityDescription}>{activity.description}</Text>
      <Text style={styles.activityDate}>
        {activity.date ? new Date(activity.date).toLocaleDateString() : 'TBA'} | {activity.time || 'TBA'}
      </Text>
      <Text style={styles.activityContact}>Contact: {activity.contact || 'N/A'}</Text>
      <Text style={styles.activityMap}>Location: {activity.map || 'TBA'}</Text>
      <Button
        title={isJoined ? 'Leave Activity' : 'Join Activity'}
        onPress={handleJoinOrLeave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  activityDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  activityContact: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  activityMap: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  loadingText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
