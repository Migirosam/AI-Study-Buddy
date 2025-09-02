export class FlashcardPractice {
  constructor() {
    this.flashcards = []
    this.currentIndex = 0
    this.isFlipped = false
    this.score = { correct: 0, total: 0 }
    this.sessionStartTime = null
  }

  setFlashcards(flashcards) {
    this.flashcards = flashcards
    this.currentIndex = 0
    this.isFlipped = false
    this.score = { correct: 0, total: 0 }
    this.sessionStartTime = Date.now()
  }

  render() {
    if (this.flashcards.length === 0) {
      return this.renderEmptyState()
    }

    return `
      <div class="flashcards-container fade-in">
        ${this.renderProgress()}
        ${this.renderCurrentFlashcard()}
        ${this.renderControls()}
        ${this.renderSessionStats()}
      </div>
    `
  }

  renderEmptyState() {
    return `
      <div class="generator-container">
        <h2 style="text-align: center; color: var(--text-secondary); margin-bottom: var(--spacing-lg);">
          🎯 No Flashcards Yet
        </h2>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: var(--spacing-xl);">
          Generate some flashcards first to start practicing!
        </p>
        <button class="generate-btn" onclick="document.querySelector('[data-tab=generate]').click()">
          ✨ Generate Flashcards
        </button>
      </div>
    `
  }

  renderProgress() {
    const progress = ((this.currentIndex + 1) / this.flashcards.length) * 100
    
    return `
      <div class="flashcard-counter">
        Card ${this.currentIndex + 1} of ${this.flashcards.length}
      </div>
      <div class="progress-container" style="margin-bottom: var(--spacing-xl);">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
    `
  }

  renderCurrentFlashcard() {
    const card = this.flashcards[this.currentIndex]
    if (!card) return ''

    return `
      <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="current-flashcard">
        <div class="flashcard-face">
          <div class="flashcard-content">
            ${card.question}
          </div>
          <div class="flip-hint">
            💡 Click to reveal answer
          </div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="flashcard-content">
            ${card.answer}
          </div>
          <div class="flip-hint">
            Did you get it right?
          </div>
        </div>
      </div>
    `
  }

  renderControls() {
    if (!this.isFlipped) {
      return `
        <div class="flashcard-controls">
          <button class="control-btn next" id="flip-btn">
            🔄 Show Answer
          </button>
        </div>
      `
    }

    return `
      <div class="flashcard-controls">
        <button class="control-btn incorrect" id="incorrect-btn">
          ❌ Incorrect
        </button>
        <button class="control-btn correct" id="correct-btn">
          ✅ Correct
        </button>
      </div>
    `
  }

  renderSessionStats() {
    if (this.score.total === 0) return ''

    const accuracy = Math.round((this.score.correct / this.score.total) * 100)
    const timeElapsed = Math.round((Date.now() - this.sessionStartTime) / 1000)
    
    return `
      <div style="background: var(--surface); padding: var(--spacing-lg); border-radius: var(--border-radius); box-shadow: var(--shadow); border: 1px solid var(--border); margin-top: var(--spacing-xl);">
        <h3 style="margin-bottom: var(--spacing-md); color: var(--text-primary);">📊 Session Stats</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--spacing-md);">
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">${this.score.correct}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">Correct</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--danger-color);">${this.score.total - this.score.correct}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">Incorrect</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--success-color);">${accuracy}%</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">Accuracy</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">${timeElapsed}s</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">Time</div>
          </div>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    // Flashcard flip
    const flashcard = document.getElementById('current-flashcard')
    if (flashcard) {
      flashcard.addEventListener('click', () => {
        if (!this.isFlipped) {
          this.flipCard()
        }
      })
    }

    // Control buttons
    const flipBtn = document.getElementById('flip-btn')
    if (flipBtn) {
      flipBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.flipCard()
      })
    }

    const correctBtn = document.getElementById('correct-btn')
    if (correctBtn) {
      correctBtn.addEventListener('click', () => {
        this.answerCard(true)
      })
    }

    const incorrectBtn = document.getElementById('incorrect-btn')
    if (incorrectBtn) {
      incorrectBtn.addEventListener('click', () => {
        this.answerCard(false)
      })
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.flashcards.length === 0) return
      
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          if (!this.isFlipped) {
            this.flipCard()
          }
          break
        case '1':
          if (this.isFlipped) {
            this.answerCard(false)
          }
          break
        case '2':
          if (this.isFlipped) {
            this.answerCard(true)
          }
          break
      }
    })
  }

  flipCard() {
    this.isFlipped = true
    const flashcard = document.getElementById('current-flashcard')
    if (flashcard) {
      flashcard.classList.add('flipped')
    }
    this.updateControls()
  }

  answerCard(isCorrect) {
    this.score.total++
    if (isCorrect) {
      this.score.correct++
    }

    // Add visual feedback
    this.showAnswerFeedback(isCorrect)

    // Move to next card after delay
    setTimeout(() => {
      this.nextCard()
    }, 1000)
  }

  showAnswerFeedback(isCorrect) {
    const flashcard = document.getElementById('current-flashcard')
    if (flashcard) {
      flashcard.style.transform = isCorrect ? 'scale(1.05)' : 'scale(0.95)'
      flashcard.style.borderColor = isCorrect ? 'var(--success-color)' : 'var(--danger-color)'
      flashcard.style.borderWidth = '3px'
      
      setTimeout(() => {
        flashcard.style.transform = ''
        flashcard.style.borderColor = ''
        flashcard.style.borderWidth = ''
      }, 500)
    }
  }

  nextCard() {
    if (this.currentIndex < this.flashcards.length - 1) {
      this.currentIndex++
      this.isFlipped = false
      this.renderCurrentCard()
    } else {
      this.completeSession()
    }
  }

  renderCurrentCard() {
    const container = document.querySelector('.flashcards-container')
    if (container) {
      container.innerHTML = this.render()
      this.attachEventListeners()
    }
  }

  updateControls() {
    const controlsContainer = document.querySelector('.flashcard-controls')
    if (controlsContainer) {
      controlsContainer.innerHTML = this.renderControls().match(/<div class="flashcard-controls">(.*?)<\/div>/s)[1]
      this.attachEventListeners()
    }
  }

  completeSession() {
    const accuracy = Math.round((this.score.correct / this.score.total) * 100)
    const xpEarned = this.score.correct * 10 + (accuracy >= 80 ? 50 : 0) // Bonus for high accuracy
    
    // Show completion message
    const container = document.querySelector('.flashcards-container')
    container.innerHTML = `
      <div class="generator-container fade-in">
        <h2 style="text-align: center; color: var(--success-color); margin-bottom: var(--spacing-lg);">
          🎉 Session Complete!
        </h2>
        <div style="background: var(--surface); padding: var(--spacing-xl); border-radius: var(--border-radius); box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: var(--spacing-xl);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--spacing-lg); text-align: center;">
            <div>
              <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${this.score.correct}/${this.score.total}</div>
              <div style="color: var(--text-secondary);">Correct Answers</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${accuracy}%</div>
              <div style="color: var(--text-secondary);">Accuracy</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 700; color: var(--accent-color);">+${xpEarned}</div>
              <div style="color: var(--text-secondary);">XP Earned</div>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
          <button class="control-btn next" onclick="location.reload()">
            🔄 Practice Again
          </button>
          <button class="control-btn correct" onclick="document.querySelector('[data-tab=dashboard]').click()">
            📊 View Dashboard
          </button>
        </div>
      </div>
    `

    // Dispatch completion event
    document.dispatchEvent(new CustomEvent('practiceComplete', {
      detail: {
        correct: this.score.correct,
        total: this.score.total,
        accuracy: accuracy,
        xpEarned: xpEarned
      }
    }))
  }
}