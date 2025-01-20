// firebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyBJ_m35kQ_zp21nz5sFgR-AP_4f1EJyBlY',
//   authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'test-app-5c40f',
  storageBucket: 'test-app-5c40f.firebasestorage.app',
//   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: '1:640351118069:android:fb53650226e1bbead05bbc',
};

initializeApp(firebaseConfig);

export { firestore };

