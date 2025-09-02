export class FlashcardGenerator {
  constructor() {
    this.isGenerating = false
  }

  render() {
    return `
      <div class="generator-container fade-in">
        <h1 class="generator-title">✨ Generate Flashcards</h1>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: var(--spacing-xl);">
          Paste your study notes below and let AI create interactive flashcards for you!
        </p>
        
        <div class="input-group">
          <label class="input-label" for="study-notes">
            📝 Your Study Notes
          </label>
          <textarea 
            id="study-notes" 
            class="input-textarea" 
            placeholder="Paste your study notes here... For example:

Photosynthesis is the process by which plants convert sunlight into energy. It occurs in the chloroplasts and involves two main stages: light-dependent reactions and the Calvin cycle. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.

The mitochondria is known as the powerhouse of the cell because it produces ATP through cellular respiration..."
          ></textarea>
        </div>
        
        <button id="generate-btn" class="generate-btn" ${this.isGenerating ? 'disabled' : ''}>
          ${this.isGenerating ? `
            <div class="spinner"></div>
            Generating Flashcards...
          ` : `
            ✨ Generate Flashcards
          `}
        </button>
        
        <div id="generation-status"></div>
      </div>
    `
  }

  attachEventListeners() {
    const generateBtn = document.getElementById('generate-btn')
    const notesTextarea = document.getElementById('study-notes')
    
    generateBtn.addEventListener('click', () => {
      const notes = notesTextarea.value.trim()
      if (notes) {
        this.generateFlashcards(notes)
      } else {
        this.showMessage('Please enter some study notes first!', 'error')
      }
    })
  }

  async generateFlashcards(notes) {
    this.isGenerating = true
    this.updateGenerateButton()
    
    try {
      // Simulate AI processing
      this.showMessage('🤖 AI is analyzing your notes...', 'info')
      await this.delay(1000)
      
      this.showMessage('📝 Generating questions and answers...', 'info')
      await this.delay(1500)
      
      this.showMessage('✨ Creating interactive flashcards...', 'info')
      await this.delay(1000)
      
      // Generate flashcards from notes
      const flashcards = this.parseNotesToFlashcards(notes)
      
      this.showMessage(`🎉 Successfully generated ${flashcards.length} flashcards!`, 'success')
      
      // Dispatch event to notify app
      document.dispatchEvent(new CustomEvent('flashcardsGenerated', {
        detail: { flashcards }
      }))
      
    } catch (error) {
      this.showMessage('❌ Failed to generate flashcards. Please try again.', 'error')
    } finally {
      this.isGenerating = false
      this.updateGenerateButton()
    }
  }

  parseNotesToFlashcards(notes) {
    // Simple AI simulation - in real app, this would call Hugging Face API
    const sentences = notes.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const flashcards = []
    
    // Generate different types of questions
    const questionTypes = [
      { type: 'definition', template: 'What is {}?' },
      { type: 'function', template: 'What is the function of {}?' },
      { type: 'process', template: 'How does {} work?' },
      { type: 'comparison', template: 'What is the difference between {} and {}?' },
      { type: 'example', template: 'Give an example of {}.' }
    ]
    
    sentences.forEach((sentence, index) => {
      if (index < 10) { // Limit to 10 flashcards for demo
        const words = sentence.trim().split(' ')
        if (words.length > 5) {
          const keyTerm = this.extractKeyTerm(sentence)
          const questionType = questionTypes[index % questionTypes.length]
          
          let question = questionType.template.replace('{}', keyTerm)
          let answer = sentence.trim()
          
          // Make questions more specific based on content
          if (sentence.toLowerCase().includes('process')) {
            question = `Explain the process mentioned: ${keyTerm}`
          } else if (sentence.toLowerCase().includes('function') || sentence.toLowerCase().includes('role')) {
            question = `What is the function or role of ${keyTerm}?`
          } else if (sentence.toLowerCase().includes('equation') || sentence.toLowerCase().includes('formula')) {
            question = `What is the equation or formula for ${keyTerm}?`
          }
          
          flashcards.push({
            id: `card-${index}`,
            question: question,
            answer: answer,
            difficulty: this.calculateDifficulty(sentence),
            subject: this.detectSubject(sentence)
          })
        }
      }
    })
    
    // Add some sample flashcards if none were generated
    if (flashcards.length === 0) {
      flashcards.push(
        {
          id: 'sample-1',
          question: 'What is the main topic of your notes?',
          answer: 'Based on your notes: ' + notes.substring(0, 100) + '...',
          difficulty: 'medium',
          subject: 'General'
        },
        {
          id: 'sample-2',
          question: 'What key concept should you remember?',
          answer: 'The key concepts from your study material that you should focus on reviewing.',
          difficulty: 'easy',
          subject: 'General'
        }
      )
    }
    
    return flashcards
  }

  extractKeyTerm(sentence) {
    // Simple key term extraction
    const words = sentence.split(' ')
    const stopWords = ['the', 'is', 'are', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an']
    const contentWords = words.filter(word => 
      word.length > 3 && 
      !stopWords.includes(word.toLowerCase()) &&
      /^[a-zA-Z]+$/.test(word)
    )
    
    return contentWords[0] || 'this concept'
  }

  calculateDifficulty(sentence) {
    const length = sentence.length
    if (length < 50) return 'easy'
    if (length < 100) return 'medium'
    return 'hard'
  }

  detectSubject(sentence) {
    const subjects = {
      'Biology': ['cell', 'DNA', 'photosynthesis', 'mitochondria', 'organism', 'evolution'],
      'Chemistry': ['molecule', 'atom', 'reaction', 'compound', 'element', 'bond'],
      'Physics': ['energy', 'force', 'motion', 'wave', 'particle', 'gravity'],
      'Mathematics': ['equation', 'formula', 'calculate', 'solve', 'theorem', 'proof'],
      'History': ['war', 'empire', 'revolution', 'century', 'ancient', 'civilization']
    }
    
    const lowerSentence = sentence.toLowerCase()
    for (const [subject, keywords] of Object.entries(subjects)) {
      if (keywords.some(keyword => lowerSentence.includes(keyword))) {
        return subject
      }
    }
    
    return 'General'
  }

  updateGenerateButton() {
    const btn = document.getElementById('generate-btn')
    if (btn) {
      btn.innerHTML = this.isGenerating ? `
        <div class="spinner"></div>
        Generating Flashcards...
      ` : `
        ✨ Generate Flashcards
      `
      btn.disabled = this.isGenerating
    }
  }

  showMessage(text, type) {
    const statusDiv = document.getElementById('generation-status')
    statusDiv.innerHTML = `<div class="message ${type}">${text}</div>`
    
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.innerHTML = ''
      }, 3000)
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}