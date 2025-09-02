export class Dashboard {
  constructor(userData) {
    this.userData = userData
  }

  render() {
    const user = this.userData.getUser()
    const stats = this.userData.getStats()
    
    return `
      <div class="dashboard fade-in">
        ${this.renderStatsGrid(stats)}
        ${this.renderProgressSection(user)}
        ${this.renderHeatmap(stats)}
        ${this.renderBottomSection(user, stats)}
      </div>
    `
  }

  renderStatsGrid(stats) {
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Total XP</span>
            <span class="stat-icon">⭐</span>
          </div>
          <div class="stat-value">${stats.totalXP.toLocaleString()}</div>
          <div class="stat-change">+${stats.dailyXP} today</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Current Streak</span>
            <span class="stat-icon">🔥</span>
          </div>
          <div class="stat-value">${stats.currentStreak}</div>
          <div class="stat-change">days</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Cards Mastered</span>
            <span class="stat-icon">🎯</span>
          </div>
          <div class="stat-value">${stats.cardsMastered}</div>
          <div class="stat-change">+${stats.dailyCards} today</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Accuracy Rate</span>
            <span class="stat-icon">📈</span>
          </div>
          <div class="stat-value">${stats.accuracyRate}%</div>
          <div class="stat-change">+2% this week</div>
        </div>
      </div>
    `
  }

  renderProgressSection(user) {
    const progressPercent = (user.xp / user.nextLevelXP) * 100
    
    return `
      <div class="dashboard-row" style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-xl); margin-bottom: var(--spacing-xl);">
        <div class="progress-container">
          <div class="progress-header">
            <span class="progress-title">Level Progress</span>
            <span class="progress-value">${user.xp} / ${user.nextLevelXP} XP</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>
        
        <div class="badges-container">
          <div class="badges-title">Recent Badges</div>
          <div class="badges-grid">
            ${this.renderBadges(user.badges)}
          </div>
        </div>
      </div>
    `
  }

  renderBadges(badges) {
    const allBadges = [
      { id: 'first_card', name: 'First Card', icon: '🎯', earned: badges.includes('first_card') },
      { id: 'streak_7', name: '7 Day Streak', icon: '🔥', earned: badges.includes('streak_7') },
      { id: 'hundred_correct', name: '100 Correct', icon: '💯', earned: badges.includes('hundred_correct') },
      { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', earned: badges.includes('speed_demon') },
      { id: 'perfectionist', name: 'Perfectionist', icon: '🏆', earned: badges.includes('perfectionist') }
    ]

    return allBadges.map(badge => `
      <div class="badge ${badge.earned ? 'earned' : ''}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
      </div>
    `).join('')
  }

  renderHeatmap(stats) {
    return `
      <div class="heatmap-container">
        <div class="heatmap-title">Performance Heatmap</div>
        <div class="heatmap-grid">
          ${stats.subjects.map(subject => `
            <div class="heatmap-item ${this.getPerformanceClass(subject.accuracy)}" 
                 data-subject="${subject.name}">
              <div class="heatmap-subject">${subject.name}</div>
              <div class="heatmap-score">${subject.accuracy}% accuracy</div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderBottomSection(user, stats) {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);">
        <div class="leaderboard-container">
          <div class="leaderboard-title">🏆 Leaderboard</div>
          <ul class="leaderboard-list">
            ${this.renderLeaderboard(stats.leaderboard, user.name)}
          </ul>
        </div>
        
        <div class="recommendations-container" style="background: var(--surface); padding: var(--spacing-lg); border-radius: var(--border-radius); box-shadow: var(--shadow); border: 1px solid var(--border);">
          <div style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--text-primary);">
            🎯 Smart Recommendations
          </div>
          ${this.renderRecommendations(stats)}
        </div>
      </div>
    `
  }

  renderLeaderboard(leaderboard, currentUser) {
    return leaderboard.map((user, index) => `
      <li class="leaderboard-item ${user.name === currentUser ? 'current-user' : ''}">
        <div class="leaderboard-rank">${index + 1}</div>
        <div class="leaderboard-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${user.name}</div>
          <div class="leaderboard-xp">${user.xp.toLocaleString()} XP</div>
        </div>
      </li>
    `).join('')
  }

  renderRecommendations(stats) {
    const weakSubjects = stats.subjects.filter(s => s.accuracy < 70)
    
    if (weakSubjects.length === 0) {
      return `
        <div style="color: var(--success-color); text-align: center; padding: var(--spacing-lg);">
          🎉 Great job! You're performing well in all subjects!
        </div>
      `
    }

    return `
      <div style="space-y: var(--spacing-sm);">
        ${weakSubjects.slice(0, 3).map(subject => `
          <div style="padding: var(--spacing-sm); background: var(--background); border-radius: var(--border-radius); margin-bottom: var(--spacing-sm);">
            <div style="font-weight: 600; color: var(--danger-color);">
              ⚡ Review ${subject.name}
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
              ${subject.accuracy}% accuracy - Practice ${subject.recommendedCards} cards
            </div>
          </div>
        `).join('')}
        <button class="control-btn next" style="width: 100%; margin-top: var(--spacing-md);" onclick="this.startSmartReview()">
          Start Smart Review
        </button>
      </div>
    `
  }

  getPerformanceClass(accuracy) {
    if (accuracy >= 80) return 'strong'
    if (accuracy >= 50) return 'moderate'
    return 'weak'
  }

  attachEventListeners() {
    // Heatmap item clicks
    document.querySelectorAll('.heatmap-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const subject = e.currentTarget.dataset.subject
        this.showSubjectDetails(subject)
      })
    })
  }

  showSubjectDetails(subject) {
    // This would show a modal or navigate to subject-specific practice
    console.log(`Showing details for ${subject}`)
  }

  updateDisplay() {
    // Re-render the dashboard with updated data
    const container = document.querySelector('.dashboard').parentElement
    container.innerHTML = this.render()
    this.attachEventListeners()
  }

  startSmartReview() {
    // This would start a smart review session
    console.log('Starting smart review...')
  }
}