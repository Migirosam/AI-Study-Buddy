import './style.css'
import { StudyBuddyApp } from './components/StudyBuddyApp.js'

document.querySelector('#app').innerHTML = `
  <div id="study-buddy-app"></div>
`

const app = new StudyBuddyApp()
app.mount('#study-buddy-app')