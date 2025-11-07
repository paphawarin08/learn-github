import { useState } from 'react';
import { StyleSheet, View, Button, TextInput, Text, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../component/firebaseDB'; // ใช้ Firebase Authentication

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // เพื่อแสดงข้อความผิดพลาดหากล็อกอินไม่ได้

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      // ล็อกอินโดยใช้ Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // ไปยังหน้าหลังจากล็อกอินสำเร็จ เช่น หน้า Home
      navigation.navigate("Main");
    } catch (error) {
      console.error("Login Error: ", error);
    if (error.code === 'auth/network-request-failed') {
      alert("เกิดปัญหาการเชื่อมต่ออินเทอร์เน็ต โปรดลองใหม่อีกครั้ง");
    } else {
      setErrorMessage(error.message);
    }
    }
  };

  return (
    <View style={styles.container}>

       <Text style={styles.mainTitle}>SUTMatch</Text>  {/* Add this for large text */}
      <Text style={styles.label} > Please Login </Text>

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
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("Register")}>ยังไม่มีบัญชีใช่ไหม? สร้างบัญชีที่นี่</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
    color: 'red',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#262984',  // You can customize the color
    marginBottom: 30,
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

  label: {
    alignItems: 'center',    // ทำให้ข้อความอยู่ทางซ้าย
    fontSize: 20,
    color: '#333',  // สีของข้อความ
    fontWeight: 'bold',
    marginBottom: 10,  // ระยะห่างจากช่องกรอกข้อมูล
    marginLeft: 20,  // ระยะห่างจากขอบซ้าย
  },

  linkText: {
    color: 'gray',
    marginTop: 15,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },

});
