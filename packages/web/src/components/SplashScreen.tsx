import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

const SplashScreen = ({ onComplete, duration = 3000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Start animation immediately
    setIsAnimating(true)

    // Hide splash screen after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Animated title with pop effect */}
        <h1
          className={`text-7xl md:text-9xl font-black text-white drop-shadow-2xl transition-all duration-1000 ${
            isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          style={{
            textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
            animation: isAnimating ? "popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
          }}
        >
          Rahoot
        </h1>

        {/* Animated subtitle */}
        <p
          className={`text-2xl md:text-4xl text-white/90 drop-shadow-lg mt-4 transition-all duration-1000 delay-300 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          by Multiycat
        </p>

        {/* Animated dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-white opacity-0"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes popIn {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          40% {
            transform: translateY(-15px);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen
