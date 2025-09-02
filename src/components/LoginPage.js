export class LoginPage {
  constructor() {
    this.isLoading = false
  }

  render() {
    return `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="login-logo">
              🧠 AI Study Buddy
            </div>
            <h1 class="login-title">Welcome Back!</h1>
            <p class="login-subtitle">Sign in to continue your learning journey</p>
          </div>

          <form class="login-form" id="login-form">
            <div class="input-group">
              <label class="input-label" for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                class="login-input" 
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="input-group">
              <label class="input-label" for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                class="login-input" 
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" class="login-btn" ${this.isLoading ? 'disabled' : ''}>
              ${this.isLoading ? `
                <div class="spinner"></div>
                Signing In...
              ` : `
                🚀 Sign In
              `}
            </button>
          </form>

          <div class="login-divider">
            <span>or</span>
          </div>

          <button class="signup-btn" id="signup-btn">
            ✨ Create New Account
          </button>

          <div class="demo-section">
            <p class="demo-text">Want to try it out first?</p>
            <button class="demo-btn" id="demo-btn">
              🎮 Continue as Guest
            </button>
          </div>

          <div id="login-status"></div>
        </div>

        <div class="login-features">
          <h3>Why AI Study Buddy?</h3>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">🤖</span>
              <div>
                <strong>AI-Powered Generation</strong>
                <p>Transform any notes into interactive flashcards instantly</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <div>
                <strong>Gamified Learning</strong>
                <p>Earn XP, badges, and maintain streaks while studying</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <div>
                <strong>Performance Tracking</strong>
                <p>Visual heatmaps show your strengths and weaknesses</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🏆</span>
              <div>
                <strong>Competitive Learning</strong>
                <p>Compete with friends on the leaderboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    const loginForm = document.getElementById('login-form')
    const signupBtn = document.getElementById('signup-btn')
    const demoBtn = document.getElementById('demo-btn')

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleLogin()
    })

    signupBtn.addEventListener('click', () => {
      this.showSignupForm()
    })

    demoBtn.addEventListener('click', () => {
      this.loginAsGuest()
    })
  }

  async handleLogin() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!email || !password) {
      this.showMessage('Please fill in all fields', 'error')
      return
    }

    this.isLoading = true
    this.updateLoginButton()

    try {
      // Simulate authentication
      await this.delay(1500)
      
      // In a real app, this would validate against a backend
      const userData = this.authenticateUser(email, password)
      
      if (userData) {
        this.showMessage('Login successful! Welcome back!', 'success')
        await this.delay(1000)
        this.loginUser(userData)
      } else {
        this.showMessage('Invalid email or password', 'error')
      }
    } catch (error) {
      this.showMessage('Login failed. Please try again.', 'error')
    } finally {
      this.isLoading = false
      this.updateLoginButton()
    }
  }

  authenticateUser(email, password) {
    // Demo authentication - in real app, this would be a backend call
    const demoUsers = [
      { email: 'student@example.com', password: 'password123', name: 'Alex Student' },
      { email: 'demo@study.com', password: 'demo123', name: 'Demo User' },
      { email: 'test@ai.com', password: 'test123', name: 'Test User' }
    ]

    const user = demoUsers.find(u => u.email === email && u.password === password)
    return user || null
  }

  showSignupForm() {
    const loginCard = document.querySelector('.login-card')
    loginCard.innerHTML = `
      <div class="login-header">
        <div class="login-logo">
          🧠 AI Study Buddy
        </div>
        <h1 class="login-title">Create Account</h1>
        <p class="login-subtitle">Join thousands of students improving their study habits</p>
      </div>

      <form class="login-form" id="signup-form">
        <div class="input-group">
          <label class="input-label" for="signup-name">Full Name</label>
          <input 
            type="text" 
            id="signup-name" 
            class="login-input" 
            placeholder="Enter your full name"
            required
          />
        </div>

        <div class="input-group">
          <label class="input-label" for="signup-email">Email</label>
          <input 
            type="email" 
            id="signup-email" 
            class="login-input" 
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="input-group">
          <label class="input-label" for="signup-password">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            class="login-input" 
            placeholder="Create a password"
            required
          />
        </div>

        <button type="submit" class="login-btn">
          ✨ Create Account
        </button>
      </form>

      <div class="login-divider">
        <span>or</span>
      </div>

      <button class="signup-btn" id="back-to-login">
        🔙 Back to Sign In
      </button>

      <div class="demo-section">
        <p class="demo-text">Want to try it out first?</p>
        <button class="demo-btn" id="demo-btn">
          🎮 Continue as Guest
        </button>
      </div>

      <div id="login-status"></div>
    `

    this.attachSignupListeners()
  }

  attachSignupListeners() {
    const signupForm = document.getElementById('signup-form')
    const backBtn = document.getElementById('back-to-login')
    const demoBtn = document.getElementById('demo-btn')

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleSignup()
    })

    backBtn.addEventListener('click', () => {
      this.showLoginForm()
    })

    demoBtn.addEventListener('click', () => {
      this.loginAsGuest()
    })
  }

  async handleSignup() {
    const name = document.getElementById('signup-name').value
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value

    if (!name || !email || !password) {
      this.showMessage('Please fill in all fields', 'error')
      return
    }

    if (password.length < 6) {
      this.showMessage('Password must be at least 6 characters', 'error')
      return
    }

    try {
      // Simulate account creation
      this.showMessage('Creating your account...', 'info')
      await this.delay(2000)
      
      this.showMessage('Account created successfully! Welcome to AI Study Buddy!', 'success')
      await this.delay(1000)
      
      // Login the new user
      this.loginUser({ name, email })
    } catch (error) {
      this.showMessage('Failed to create account. Please try again.', 'error')
    }
  }

  showLoginForm() {
    const loginCard = document.querySelector('.login-card')
    loginCard.innerHTML = this.render().match(/<div class="login-card">(.*?)<\/div>/s)[1]
    this.attachEventListeners()
  }

  loginAsGuest() {
    this.showMessage('Logging in as guest...', 'info')
    setTimeout(() => {
      this.loginUser({ name: 'Guest User', email: 'guest@example.com' })
    }, 1000)
  }

  loginUser(userData) {
    // Store user session
    sessionStorage.setItem('currentUser', JSON.stringify(userData))
    
    // Dispatch login event
    document.dispatchEvent(new CustomEvent('userLoggedIn', {
      detail: { user: userData }
    }))
  }

  updateLoginButton() {
    const btn = document.querySelector('.login-btn')
    if (btn) {
      btn.innerHTML = this.isLoading ? `
        <div class="spinner"></div>
        Signing In...
      ` : `
        🚀 Sign In
      `
      btn.disabled = this.isLoading
    }
  }

  showMessage(text, type) {
    const statusDiv = document.getElementById('login-status')
    if (statusDiv) {
      statusDiv.innerHTML = `<div class="message ${type}">${text}</div>`
      
      if (type === 'success' || type === 'info') {
        setTimeout(() => {
          statusDiv.innerHTML = ''
        }, 3000)
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
