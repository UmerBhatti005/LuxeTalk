importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
// importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyAW8U0RKV4fwwW89Tzs2-iDP5KkgHH8hA4",
    authDomain: "fir-angularcrud-7ca3d.firebaseapp.com",
    projectId: "fir-angularcrud-7ca3d",
    storageBucket: "fir-angularcrud-7ca3d.appspot.com",
    messagingSenderId: "228700870128",
    appId: "1:228700870128:web:e586001c669f980791f935",
    measurementId: "G-1FNM9M79Z5",
});
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {debugger
//     console.log("Received background message ", payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });