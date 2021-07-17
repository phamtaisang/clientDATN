import * as firebase from 'firebase/app'
import 'firebase/auth'
// const firebaseConfig = {
//   apiKey: "AIzaSyBtPN8N7_89PI8afj35vkmM6evyKPUpGHI",
//   authDomain: "sanghumg-40254.firebaseapp.com",
//   databaseURL: "https://sanghumg-40254-default-rtdb.firebaseio.com",
//   projectId: "sanghumg-40254",
//   storageBucket: "sanghumg-40254.appspot.com",
//   messagingSenderId: "693271265844",
//   appId: "1:693271265844:web:2cde270451b3fff1d38061",
//   measurementId: "G-6MPW57KK30"
//
// };
var firebaseConfig = {
  apiKey: "AIzaSyAmN6vkESO0-VxUzj0QpZ-1HYILsJf_-30",
  authDomain: "travel-6651b.firebaseapp.com",
  databaseURL: "https://travel-6651b-default-rtdb.firebaseio.com",
  projectId: "travel-6651b",
  storageBucket: "travel-6651b.appspot.com",
  messagingSenderId: "662972372767",
  appId: "1:662972372767:web:2434063ecaa76a30a5822a",
  measurementId: "G-4RQH2719DQ"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase
