
importScripts(
  'https://www.gstatic.com/firebasejs/4.5.0/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/4.5.0/firebase-messaging.js'
)
firebase.initializeApp({"apiKey":"AIzaSyBtPN8N7_89PI8afj35vkmM6evyKPUpGHI","authDomain":"sanghumg-40254.firebaseapp.com","databaseURL":"https:\u002F\u002Fsanghumg-40254-default-rtdb.firebaseio.com","projectId":"sanghumg-40254","storageBucket":"sanghumg-40254.appspot.com","messagingSenderId":"693271265844","appId":"1:693271265844:web:2cde270451b3fff1d38061","measurementId":"G-6MPW57KK30"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

// Setup event listeners for actions provided in the config:
self.addEventListener('notificationclick', function(e) {
  const actions = [{"action":"goToLupasGithub","url":"https:\u002F\u002Fgithub.com\u002Flupas"},{"action":"goToModuleGithub","url":"https:\u002F\u002Fgithub.com\u002Fnuxt-community\u002Ffirebase-module"}]
  const action = actions.find(x => x.action === e.action)
  const notification = e.notification

  if (!action) return

  if (action.url) {
    clients.openWindow(action.url)
    notification.close()
  }
})
