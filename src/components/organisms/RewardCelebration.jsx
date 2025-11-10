import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const RewardCelebration = ({ 
  isVisible,
  onClose,
  rewards = {},
  achievements = [],
  gameResult = {}
}) => {
  const [showParticles, setShowParticles] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  const { starsEarned = 0, coinsEarned = 0 } = rewards
  const { score = 0, questionsAnswered = 0, correctAnswers = 0 } = gameResult
  
  const celebrationSteps = [
    "score",
    "stars", 
    "coins",
    ...(achievements.length > 0 ? ["achievements"] : []),
    "complete"
  ]
  
  useEffect(() => {
    if (isVisible) {
      setShowParticles(true)
      setCurrentStep(0)
      
      // Auto-advance through celebration steps
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < celebrationSteps.length - 1) {
            return prev + 1
          } else {
            clearInterval(stepInterval)
            return prev
          }
        })
      }, 2000)
      
      return () => clearInterval(stepInterval)
    }
  }, [isVisible, celebrationSteps.length])
  
  const createParticles = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-accent rounded-full"
        initial={{ 
          opacity: 1, 
          x: 0, 
          y: 0,
          scale: 1
        }}
        animate={{
          opacity: [1, 1, 0],
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
          scale: [1, 1.5, 0]
        }}
        transition={{
          duration: 2,
          delay: i * 0.1,
          ease: "easeOut"
        }}
      />
    ))
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15 
            }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lift text-center space-y-6 relative overflow-hidden"
          >
            {/* Particle Effects */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {createParticles()}
                </div>
              </div>
            )}
            
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
            
            <div className="relative z-10 space-y-6">
              {/* Step: Game Score */}
              {currentStep >= 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto flex items-center justify-center celebrate">
                    <ApperIcon name="Trophy" className="w-12 h-12 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-display font-bold text-gray-800">
                      Amazing Job!
                    </h2>
                    <p className="text-gray-600 font-body mt-2">
                      You got {correctAnswers} out of {questionsAnswered} questions right!
                    </p>
                    <div className="text-4xl font-display font-bold text-primary mt-3">
                      {score}%
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step: Stars */}
              {currentStep >= 1 && starsEarned > 0 && (
                <motion.div
                  initial={{ scale: 0, rotateZ: -180 }}
                  animate={{ scale: 1, rotateZ: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="text-2xl font-display font-bold text-gray-800">
                    Stars Earned!
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ scale: 0, rotateZ: -180 }}
                        animate={{ 
                          scale: star <= starsEarned ? 1.2 : 0.8,
                          rotateZ: 0 
                        }}
                        transition={{ 
                          delay: star * 0.3,
                          type: "spring",
                          stiffness: 200,
                          damping: 10
                        }}
                      >
                        <ApperIcon 
                          name="Star" 
                          className={cn(
                            "w-12 h-12",
                            star <= starsEarned 
                              ? "text-accent fill-accent sparkle" 
                              : "text-gray-300"
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step: Coins */}
              {currentStep >= 2 && coinsEarned > 0 && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="text-xl font-display font-bold text-gray-800">
                    Coins Earned!
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Coins" className="w-8 h-8 text-warning animate-bounce" />
                    <span className="text-3xl font-display font-bold text-warning">
                      +{coinsEarned}
                    </span>
                  </div>
                </motion.div>
              )}
              
              {/* Step: Achievements */}
              {currentStep >= 3 && achievements.length > 0 && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="text-xl font-display font-bold text-gray-800">
                    New Badge Unlocked! 🏆
                  </div>
                  
                  <div className="space-y-3">
                    {achievements.slice(0, 2).map((achievement, index) => (
                      <motion.div
                        key={achievement.badgeId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 * index }}
                        className="flex items-center space-x-3 bg-gradient-to-r from-accent/10 to-yellow-100 p-3 rounded-xl"
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center celebrate"
                          style={{ backgroundColor: achievement.badge?.color || "#FFD93D" }}
                        >
                          <ApperIcon 
                            name={achievement.badge?.icon || "Star"} 
                            className="w-6 h-6 text-white"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-display font-bold text-gray-800 text-sm">
                            {achievement.badge?.name}
                          </h4>
                          <p className="text-xs text-gray-600 font-body">
                            {achievement.badge?.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step: Complete */}
              {currentStep >= celebrationSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="text-lg font-body text-gray-600">
                    Keep up the amazing work! 🌟
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="secondary" 
                      onClick={onClose}
                      className="flex-1"
                    >
                      Play More Games
                    </Button>
                    <Button 
                      onClick={onClose}
                      className="flex-1"
                    >
                      Continue Learning
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RewardCelebration