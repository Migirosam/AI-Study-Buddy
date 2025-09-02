export class UserData {
  constructor() {
    this.loadData()
  }

  loadData() {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('studyBuddyData')
    if (saved) {
      const data = JSON.parse(saved)
      this.user = data.user
      this.stats = data.stats
    } else {
      this.initializeDefaults()
    }
  }

  initializeDefaults() {
    this.user = {
      name: 'Student',
      level: 3,
      levelName: 'Knowledge Explorer',
      xp: 750,
      nextLevelXP: 1000,
      badges: ['first_card', 'streak_7']
    }

    this.stats = {
      totalXP: 1750,
      dailyXP: 120,
      currentStreak: 7,
      cardsMastered: 45,
      dailyCards: 8,
      accuracyRate: 78,
      subjects: [
        { name: 'Biology', accuracy: 85, recommendedCards: 5 },
        { name: 'Chemistry', accuracy: 72, recommendedCards: 8 },
        { name: 'Physics', accuracy: 68, recommendedCards: 10 },
        { name: 'Mathematics', accuracy: 91, recommendedCards: 3 },
        { name: 'History', accuracy: 45, recommendedCards: 15 }
      ],
      leaderboard: [
        { name: 'Alice', xp: 2200 },
        { name: 'John', xp: 1900 },
        { name: 'Student', xp: 1750 },
        { name: 'Sarah', xp: 1650 },
        { name: 'Mike', xp: 1400 }
      ]
    }
  }

  getUser() {
    return this.user
  }

  getStats() {
    return this.stats
  }

  updateStats(correct, total) {
    const xpGained = correct * 10
    const accuracy = Math.round((correct / total) * 100)
    
    // Update user XP
    this.user.xp += xpGained
    this.stats.totalXP += xpGained
    this.stats.dailyXP += xpGained
    
    // Update cards mastered
    this.stats.cardsMastered += correct
    this.stats.dailyCards += correct
    
    // Update accuracy (weighted average)
    this.stats.accuracyRate = Math.round((this.stats.accuracyRate + accuracy) / 2)
    
    // Check for level up
    if (this.user.xp >= this.user.nextLevelXP) {
      this.levelUp()
    }
    
    // Check for new badges
    this.checkBadges()
    
    // Update leaderboard position
    this.updateLeaderboard()
    
    this.saveData()
  }

  levelUp() {
    this.user.level++
    this.user.xp = this.user.xp - this.user.nextLevelXP
    this.user.nextLevelXP = Math.floor(this.user.nextLevelXP * 1.5)
    
    // Update level name
    const levelNames = [
      'Beginner', 'Novice', 'Learner', 'Knowledge Explorer', 'Study Master',
      'Academic Warrior', 'Wisdom Seeker', 'Scholar', 'Expert', 'Genius'
    ]
    this.user.levelName = levelNames[Math.min(this.user.level - 1, levelNames.length - 1)]
  }

  checkBadges() {
    const newBadges = []
    
    // First card badge
    if (!this.user.badges.includes('first_card') && this.stats.cardsMastered > 0) {
      newBadges.push('first_card')
    }
    
    // Streak badges
    if (!this.user.badges.includes('streak_7') && this.stats.currentStreak >= 7) {
      newBadges.push('streak_7')
    }
    
    // Hundred correct badge
    if (!this.user.badges.includes('hundred_correct') && this.stats.cardsMastered >= 100) {
      newBadges.push('hundred_correct')
    }
    
    // High accuracy badge
    if (!this.user.badges.includes('perfectionist') && this.stats.accuracyRate >= 90) {
      newBadges.push('perfectionist')
    }
    
    this.user.badges.push(...newBadges)
  }

  updateLeaderboard() {
    // Update current user's position
    const userIndex = this.stats.leaderboard.findIndex(u => u.name === this.user.name)
    if (userIndex !== -1) {
      this.stats.leaderboard[userIndex].xp = this.stats.totalXP
    }
    
    // Sort leaderboard
    this.stats.leaderboard.sort((a, b) => b.xp - a.xp)
  }

  saveData() {
    const data = {
      user: this.user,
      stats: this.stats
    }
    localStorage.setItem('studyBuddyData', JSON.stringify(data))
  }

  resetData() {
    localStorage.removeItem('studyBuddyData')
    this.initializeDefaults()
  }
}