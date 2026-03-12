importScripts(
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
);
importScripts(
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
    apiKey: 'AIzaSyAfGENOMjYXS5Vr7UJ2rzxzzesBCXhwCI8',
    authDomain: 'spotify-clone-61bc6.firebaseapp.com',
    projectId: 'spotify-clone-61bc6',
    storageBucket: 'spotify-clone-61bc6.firebasestorage.app',
    messagingSenderId: '668307617687',
    appId: '1:668307617687:web:147a649a50193264d8f6d2',
});

const messaging = firebase.messaging();
