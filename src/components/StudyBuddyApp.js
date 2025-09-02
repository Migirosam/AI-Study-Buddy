import { Dashboard } from './Dashboard.js'
import { FlashcardGenerator } from './FlashcardGenerator.js'
import { FlashcardPractice } from './FlashcardPractice.js'
import { UserData } from '../data/UserData.js'

export class StudyBuddyApp {
  constructor() {
    this.currentTab = 'dashboard'
    this.userData = new UserData()
    this.flashcards = []
    this.currentFlashcardIndex = 0
    
    this.dashboard = new Dashboard(this.userData)
    this.generator = new FlashcardGenerator()
    this.practice = new FlashcardPractice()
    
    this.bindEvents()
  }

  bindEvents() {
    // Listen for flashcard generation
    document.addEventListener('flashcardsGenerated', (event) => {
      this.flashcards = event.detail.flashcards
      this.switchTab('practice')
      this.practice.setFlashcards(this.flashcards)
    })

    // Listen for practice completion
    document.addEventListener('practiceComplete', (event) => {
      const { correct, total } = event.detail
      this.userData.updateStats(correct, total)
      this.dashboard.updateDisplay()
      this.switchTab('dashboard')
    })
  }

  mount(selector) {
    const container = document.querySelector(selector)
    container.innerHTML = this.render()
    this.attachEventListeners()
    this.renderCurrentTab()
  }

  render() {
    return `
      <div class="app">
        ${this.renderHeader()}
        ${this.renderNavigation()}
        <main class="main-content">
          <div class="container">
            <div id="tab-content"></div>
          </div>
        </main>
      </div>
    `
  }

  renderHeader() {
    const user = this.userData.getUser()
    return `
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              🧠 AI Study Buddy
            </div>
            <div class="user-info">
              <div class="user-level">
                <div class="level-text">Level ${user.level}</div>
                <div class="level-name">${user.levelName}</div>
              </div>
              <div class="user-avatar">
                ${user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>
    `
  }

  renderNavigation() {
    const tabs = [
      { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
      { id: 'generate', label: '✨ Generate', icon: '✨' },
      { id: 'practice', label: '🎯 Practice', icon: '🎯' }
    ]

    return `
      <nav class="nav">
        <div class="container">
          <ul class="nav-tabs">
            ${tabs.map(tab => `
              <li class="nav-tab ${this.currentTab === tab.id ? 'active' : ''}" 
                  data-tab="${tab.id}">
                ${tab.label}
              </li>
            `).join('')}
          </ul>
        </div>
      </nav>
    `
  }

  attachEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabId = e.target.dataset.tab
        this.switchTab(tabId)
      })
    })
  }

  switchTab(tabId) {
    this.currentTab = tabId
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId)
    })
    
    this.renderCurrentTab()
  }

  renderCurrentTab() {
    const tabContent = document.getElementById('tab-content')
    
    switch (this.currentTab) {
      case 'dashboard':
        tabContent.innerHTML = this.dashboard.render()
        this.dashboard.attachEventListeners()
        break
      case 'generate':
        tabContent.innerHTML = this.generator.render()
        this.generator.attachEventListeners()
        break
      case 'practice':
        tabContent.innerHTML = this.practice.render()
        this.practice.attachEventListeners()
        break
    }
  }
}