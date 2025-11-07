import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseDB';

const sendNotification = async (activityId, ownerId, message) => {
  try {
    const notificationData = {
      activityId,
      ownerId,
      message,
      timestamp: serverTimestamp(),  // ใช้เวลาปัจจุบัน
    };

    await addDoc(collection(db, "notifications"), notificationData);
  } catch (error) {
    console.error("Error sending notification: ", error);
  }
};

export default sendNotification;
