/* eslint-env node */
/* eslint-disable no-console */
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  const baseURL = process.env.VUE_APP_BASE_URL || '/';
  const serviceWorkerURL = `${baseURL}service-worker.js`;
  console.log(`Registering service worker with URL: ${serviceWorkerURL}`);
  register(serviceWorkerURL, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
