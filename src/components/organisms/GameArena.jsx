import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ProgressBar from "@/components/atoms/ProgressBar"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const GameArena = ({ 
  game, 
  onGameComplete,
  difficultyLevel = 1,
  className 
}) => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [gameQuestions, setGameQuestions] = useState([])
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  
  // Generate questions based on game type and difficulty
  useEffect(() => {
    const questions = generateQuestions(game.gameId, difficultyLevel)
    setGameQuestions(questions)
  }, [game.gameId, difficultyLevel])
  
  const generateQuestions = (gameId, level) => {
    const questionSets = {
      "counting-fun": generateCountingQuestions(level),
      "addition-adventure": generateAdditionQuestions(level),
      "shape-sorter": generateShapeQuestions(level),
      "subtraction-safari": generateSubtractionQuestions(level),
      "pattern-play": generatePatternQuestions(level),
      "letter-match": generateLetterQuestions(level),
      "phonics-fun": generatePhonicsQuestions(level),
      "word-builder": generateWordQuestions(level),
      "sight-words": generateSightWordQuestions(level),
      "story-time": generateStoryQuestions(level)
    }
    
    return questionSets[gameId] || generateCountingQuestions(level)
  }
  
  const generateCountingQuestions = (level) => {
    const questions = []
    const maxNumber = level === 1 ? 5 : level === 2 ? 10 : 20
    
    for (let i = 0; i < 5; i++) {
      const correctAnswer = Math.floor(Math.random() * maxNumber) + 1
      const wrongAnswers = []
      
      while (wrongAnswers.length < 3) {
        const wrong = Math.floor(Math.random() * maxNumber) + 1
        if (wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong)
        }
      }
      
      const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      questions.push({
        id: i + 1,
        question: `How many objects do you see?`,
        visual: `🔵`.repeat(correctAnswer),
        answers: allAnswers,
        correctAnswer: correctAnswer,
        type: "counting"
      })
    }
    
    return questions
  }
  
  const generateAdditionQuestions = (level) => {
    const questions = []
    const maxNumber = level === 1 ? 5 : level === 2 ? 10 : 15
    
    for (let i = 0; i < 5; i++) {
      const num1 = Math.floor(Math.random() * maxNumber) + 1
      const num2 = Math.floor(Math.random() * maxNumber) + 1
      const correctAnswer = num1 + num2
      
      const wrongAnswers = [
        correctAnswer + 1,
        correctAnswer - 1,
        correctAnswer + 2
      ].filter(n => n > 0)
      
      const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      questions.push({
        id: i + 1,
        question: `What is ${num1} + ${num2}?`,
        visual: `${"🟡".repeat(num1)} + ${"🔵".repeat(num2)} = ?`,
        answers: allAnswers.slice(0, 4),
        correctAnswer: correctAnswer,
        type: "addition"
      })
    }
    
    return questions
  }
  
  const generateLetterQuestions = (level) => {
    const questions = []
    const letters = level === 1 ? "ABCDEFGHIJ" : level === 2 ? "ABCDEFGHIJKLMNOP" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    for (let i = 0; i < 5; i++) {
      const correctLetter = letters[Math.floor(Math.random() * letters.length)]
      const wrongLetters = []
      
      while (wrongLetters.length < 3) {
        const wrong = letters[Math.floor(Math.random() * letters.length)]
        if (wrong !== correctLetter && !wrongLetters.includes(wrong)) {
          wrongLetters.push(wrong)
        }
      }
      
      const allAnswers = [correctLetter, ...wrongLetters].sort(() => Math.random() - 0.5)
      
      questions.push({
        id: i + 1,
        question: `Which letter comes next in the alphabet after ${String.fromCharCode(correctLetter.charCodeAt(0) - 1)}?`,
        visual: `📝 ${String.fromCharCode(correctLetter.charCodeAt(0) - 1)} → ?`,
        answers: allAnswers,
        correctAnswer: correctLetter,
        type: "letters"
      })
    }
    
    return questions
  }
  
  // Generate more question types...
  const generateShapeQuestions = (level) => {
    const shapes = ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"]
    const shapeNames = ["circle", "square", "triangle", "rectangle", "oval", "diamond"]
    const questions = []
    
    for (let i = 0; i < 5; i++) {
      const shapeIndex = Math.floor(Math.random() * shapes.length)
      const correctAnswer = shapeNames[shapeIndex]
      const wrongAnswers = shapeNames.filter(s => s !== correctAnswer).slice(0, 3)
      const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      questions.push({
        id: i + 1,
        question: "What shape is this?",
        visual: shapes[shapeIndex],
        answers: allAnswers,
        correctAnswer: correctAnswer,
        type: "shapes"
      })
    }
    
    return questions
  }
  
  const generateSubtractionQuestions = (level) => {
    const questions = []
    const maxNumber = level === 1 ? 5 : level === 2 ? 10 : 15
    
    for (let i = 0; i < 5; i++) {
      const num1 = Math.floor(Math.random() * maxNumber) + 5
      const num2 = Math.floor(Math.random() * (num1 - 1)) + 1
      const correctAnswer = num1 - num2
      
      const wrongAnswers = [
        correctAnswer + 1,
        correctAnswer - 1,
        correctAnswer + 2
      ].filter(n => n >= 0)
      
      const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      questions.push({
        id: i + 1,
        question: `What is ${num1} - ${num2}?`,
        visual: `${"🟡".repeat(num1)} - ${"❌".repeat(num2)} = ?`,
        answers: allAnswers.slice(0, 4),
        correctAnswer: correctAnswer,
        type: "subtraction"
      })
    }
    
    return questions
  }
  
  const generatePatternQuestions = (level) => {
    const patterns = [
      ["🔴", "🔵", "🔴", "🔵"],
      ["🟡", "🟢", "🟡", "🟢"],
      ["🔴", "🔴", "🔵", "🔴", "🔴"],
      ["🟣", "🟠", "🟣", "🟠"]
    ]
    const questions = []
    
    for (let i = 0; i < 5; i++) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)]
      const correctAnswer = pattern[pattern.length % 2]
      const wrongAnswers = ["🔴", "🔵", "🟡", "🟢"].filter(s => s !== correctAnswer).slice(0, 3)
      const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      questions.push({
        id: i + 1,
        question: "What comes next in this pattern?",
        visual: pattern.join(" ") + " ?",
        answers: allAnswers,
        correctAnswer: correctAnswer,
        type: "patterns"
      })
    }
    
    return questions
  }
  
  const generatePhonicsQuestions = (level) => {
    const phonics = {
      "A": "🍎 Apple",
      "B": "🐻 Bear", 
      "C": "🐱 Cat",
      "D": "🐕 Dog",
      "E": "🐘 Elephant"
    }
    const questions = []
    
    Object.entries(phonics).forEach(([letter, word], i) => {
      if (i < 5) {
        const correctAnswer = letter
        const wrongAnswers = Object.keys(phonics).filter(l => l !== letter).slice(0, 3)
        const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
        
        questions.push({
          id: i + 1,
          question: `What letter does this word start with?`,
          visual: word,
          answers: allAnswers,
          correctAnswer: correctAnswer,
          type: "phonics"
        })
      }
    })
    
    return questions
  }
  
  const generateWordQuestions = (level) => {
    const words = level === 1 ? ["CAT", "DOG", "SUN"] : level === 2 ? ["TREE", "BIRD", "FISH"] : ["HAPPY", "SMILE", "LEARN"]
    const questions = []
    
    words.forEach((word, i) => {
      if (i < 5) {
        const scrambled = word.split("").sort(() => Math.random() - 0.5).join("")
        const wrongAnswers = words.filter(w => w !== word).slice(0, 3)
        const allAnswers = [word, ...wrongAnswers].sort(() => Math.random() - 0.5)
        
        questions.push({
          id: i + 1,
          question: `Unscramble this word:`,
          visual: scrambled,
          answers: allAnswers,
          correctAnswer: word,
          type: "words"
        })
      }
    })
    
    return questions
  }
  
  const generateSightWordQuestions = (level) => {
    const sightWords = level === 1 ? ["THE", "AND", "YOU"] : level === 2 ? ["HAVE", "THEY", "SAID"] : ["COULD", "WOULD", "SHOULD"]
    const questions = []
    
    sightWords.forEach((word, i) => {
      if (i < 5) {
        const wrongAnswers = sightWords.filter(w => w !== word).slice(0, 3)
        const allAnswers = [word, ...wrongAnswers].sort(() => Math.random() - 0.5)
        
        questions.push({
          id: i + 1,
          question: `Which is the correct spelling?`,
          visual: `✨ ${word} ✨`,
          answers: allAnswers,
          correctAnswer: word,
          type: "sight-words"
        })
      }
    })
    
    return questions
  }
  
  const generateStoryQuestions = (level) => {
    const stories = [
      {
        text: "The cat sat on the mat. It was very happy.",
        question: "Where did the cat sit?",
        correct: "on the mat",
        wrong: ["on the chair", "in the box", "under the table"]
      }
    ]
    
    const questions = stories.slice(0, 5).map((story, i) => ({
      id: i + 1,
      question: story.question,
      visual: story.text,
      answers: [story.correct, ...story.wrong].sort(() => Math.random() - 0.5),
      correctAnswer: story.correct,
      type: "story"
    }))
    
    return questions
  }
  
  const currentQ = gameQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === gameQuestions.length - 1
  const progress = ((currentQuestion + 1) / gameQuestions.length) * 100
  
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    if (answer === currentQ.correctAnswer) {
      setScore(score + 1)
    }
    
    setTimeout(() => {
      if (isLastQuestion) {
        handleGameComplete()
      } else {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      }
    }, 2000)
  }
  
  const handleGameComplete = () => {
    const finalScore = selectedAnswer === currentQ.correctAnswer ? score + 1 : score
    const percentage = Math.round((finalScore / gameQuestions.length) * 100)
    
    const starsEarned = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0
    
    onGameComplete({
      score: percentage,
      starsEarned,
      questionsAnswered: gameQuestions.length,
      correctAnswers: finalScore
    })
  }
  
  const handleExit = () => {
    if (currentQuestion > 0) {
      setShowExitConfirm(true)
    } else {
      navigate(-1)
    }
  }
  
  if (!currentQ) return null
  
  if (showExitConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-8 text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-warning to-orange-400 rounded-full mx-auto flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-display font-bold text-gray-800">
              Are you sure?
            </h3>
            <p className="text-gray-600 font-body">
              You're doing great! If you leave now, you won't earn stars for this game.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="secondary" 
              onClick={() => setShowExitConfirm(false)}
              className="flex-1"
            >
              Keep Playing
            </Button>
            <Button 
              variant="error" 
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Exit Game
            </Button>
          </div>
        </Card>
      </div>
    )
  }
  
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-blue-50 to-purple-50", className)}>
      {/* Game Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleExit}
            icon="X"
            className="text-gray-600"
          />
          
          <div className="flex-1 mx-6">
            <ProgressBar 
              progress={progress}
              showLabel={false}
              variant="accent"
            />
          </div>
          
          <div className="flex items-center space-x-4 text-sm font-body">
            <span className="text-gray-600">
              {currentQuestion + 1} / {gameQuestions.length}
            </span>
            <div className="flex items-center space-x-1 text-accent">
              <ApperIcon name="Star" className="w-4 h-4" />
              <span className="font-semibold">{score}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 space-y-8">
          {/* Question */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-display font-bold text-gray-800">
              {currentQ.question}
            </h2>
            
            {currentQ.visual && (
              <div className="text-6xl p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                {currentQ.visual}
              </div>
            )}
          </div>
          
          {/* Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.answers.map((answer, index) => {
              let variant = "secondary"
              if (showFeedback) {
                if (answer === currentQ.correctAnswer) {
                  variant = "success"
                } else if (answer === selectedAnswer) {
                  variant = "error"
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleAnswerSelect(answer)}
                  disabled={showFeedback}
                  className={cn(
                    "p-6 rounded-2xl text-lg font-body font-semibold transition-all duration-200 transform hover:scale-105 btn-bounce",
                    variant === "success" && "bg-gradient-to-r from-success to-green-500 text-white celebrate",
                    variant === "error" && "bg-gradient-to-r from-error to-red-500 text-white",
                    variant === "secondary" && !showFeedback && "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-primary/10 hover:to-secondary/10",
                    showFeedback && variant === "secondary" && "bg-gray-100 text-gray-500"
                  )}
                >
                  {answer}
                </button>
              )
            })}
          </div>
          
          {/* Feedback */}
          {showFeedback && (
            <div className="text-center space-y-4">
              {selectedAnswer === currentQ.correctAnswer ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-success rounded-full mx-auto flex items-center justify-center celebrate">
                    <ApperIcon name="Check" className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-success">
                    Awesome! 🎉
                  </h3>
                  <p className="text-gray-600 font-body">
                    You're doing great! Keep it up!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-warning rounded-full mx-auto flex items-center justify-center">
                    <ApperIcon name="RotateCcw" className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-warning">
                    Good try! 
                  </h3>
                  <p className="text-gray-600 font-body">
                    The answer was <strong>{currentQ.correctAnswer}</strong>. You'll get it next time!
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default GameArena