import { useState } from 'react';
import { StyleSheet, View, Button, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../component/firebaseDB'; // ใช้ Firebase Authentication

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (email === "" || password === "" || confirmPassword === "") {
      Alert.alert("Error", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      // สมัครสมาชิกโดยใช้ Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("สำเร็จ", "สมัครสมาชิกเรียบร้อย");
      navigation.navigate("Login"); // นำทางไปยังหน้า Login หลังจากสมัครสมาชิกสำเร็จ
    } catch (error) {
      // จัดการข้อผิดพลาด เช่น อีเมลซ้ำ หรือรหัสผ่านไม่ตรงตามเงื่อนไข
      setErrorMessage(error.message);
      console.error("Register Error: ", error.message);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.mainTitle}>SUTMatch</Text>  {/* Add this for large text */}

      <Text style={styles.label}> Please Register </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry={true} // ซ่อนรหัสผ่าน
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry={true} // ซ่อนรหัสผ่าน
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Text
        style={styles.linkText}
        onPress={() => navigation.navigate("Login")}>มีบัญชีแล้ว? ล็อกอินที่นี่</Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEDF6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#262984',  // You can customize the color
    marginBottom: 30,
  },
  input: {
    height: 40,
    color: 'white',
    borderColor: '#262984',
    backgroundColor: '#262984',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    width: '100%',
  },
  errorText: {
    color: 'pink',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#262984',  // สีพื้นหลัง
    paddingVertical: 10,          // ระยะห่างแนวตั้ง
    paddingHorizontal: 20,        // ระยะห่างแนวนอน
    borderRadius: 25,             // ขอบมุมโค้ง
    marginBottom: 10,             // ระยะห่างด้านล่าง
    alignItems: 'center',         // จัดตำแหน่งข้อความให้อยู่กลาง
    justifyContent: 'center',     // จัดตำแหน่งข้อความให้อยู่กลาง
  },
  buttonText: {
    color: '#fff',                // สีข้อความ
    fontSize: 16,                 // ขนาดตัวอักษร
    fontWeight: 'bold',           // ทำให้ข้อความตัวหนา
  },

  linkText: {
    color: 'gray',
    marginTop: 15,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },

  label: {
    fontSize: 20,
    color: '#333',  // สีของข้อความ
    fontWeight: 'bold',
    marginBottom: 10,  // ระยะห่างจากช่องกรอกข้อมูล
    marginLeft: 20,  // ระยะห่างจากขอบซ้าย
  },
});
