// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAVNIh-RA2rgMZh3zGvQsO2DIepWfVIGJ8",
  authDomain: "supfamof-c8c84.firebaseapp.com",
  projectId: "supfamof-c8c84",
  storageBucket: "supfamof-c8c84.appspot.com",
  messagingSenderId: "799879175588",
  appId: "1:799879175588:web:26e0facc264f8bd6caf531",
  measurementId: "G-LLT7X3RFYH",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
