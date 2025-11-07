import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { onSnapshot, collection, where, query } from 'firebase/firestore';
import { db, auth } from './firebaseDB';

const NotificationListener = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("ownerId", "==", currentUser.uid)  // ฟังเฉพาะการแจ้งเตือนของผู้ใช้ปัจจุบัน
      );

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const newNotifications = snapshot.docs.map(doc => doc.data());
        setNotifications(newNotifications);

        // แสดงการแจ้งเตือนด้วย Toast
        newNotifications.forEach(notification => {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: notification.message,
            visibilityTime: 4000,
          });
        });
      });

      return () => unsubscribe();  // หยุดฟังเมื่อคอมโพเนนต์นี้ถูกยกเลิก
    }
  }, [currentUser]);

  return (
    <View>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Text key={index}>{notification.message}</Text>
        ))
      ) : (
        <Text>No new notifications</Text>
      )}
    </View>
  );
};

export default NotificationListener;
