import firebase from 'firebase';  

const config = {
    apiKey: "AIzaSyBf3khG59EunwvbAHpMjzawpP-CPP9kuGM",
    authDomain: "refill-6fa9a.firebaseapp.com",
    databaseURL: "https://refill-6fa9a.firebaseio.com",
    projectId: "refill-6fa9a",
    storageBucket: "refill-6fa9a.appspot.com",
    messagingSenderId: "787023457233",
    appId: "1:787023457233:web:6ce5e72352166adf6d8ef0"
};
firebase.initializeApp(config);

export default firebase;