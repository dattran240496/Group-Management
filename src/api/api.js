import * as firebase from "firebase"
let config = {
    apiKey: "AIzaSyCdDN5ToVt0Th7CUEt1Fw0BjWLah6lr_XM",
    authDomain: "app-expo-56081.firebaseapp.com",
    databaseURL: "https://app-expo-56081.firebaseio.com",
    projectId: "app-expo-56081",
    storageBucket: "app-expo-56081.appspot.com",
    messagingSenderId: "276292883381"
};

firebase.initializeApp(config);
export default firebase;