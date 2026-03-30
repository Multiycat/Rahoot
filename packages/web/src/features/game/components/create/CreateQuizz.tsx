import type {
  QuestionBankItem,
  Quizz,
  QuizzMusic,
  QuizzQuestion,
  QuizzTheme,
} from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"
import Circle from "@rahoot/web/features/game/components/icons/Circle"
import QuestionBankPanel from "@rahoot/web/features/game/components/create/QuestionBankPanel"
import Rhombus from "@rahoot/web/features/game/components/icons/Rhombus"
import Square from "@rahoot/web/features/game/components/icons/Square"
import Triangle from "@rahoot/web/features/game/components/icons/Triangle"
import MusicInput from "@rahoot/web/features/game/components/create/MusicInput"
import clsx from "clsx"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type Question = QuizzQuestion

type Props = {
  onSubmit: (quizz: Quizz) => void
  onCancel: () => void
  initialQuizz?: Quizz
  submitLabel?: string
  questionBankItems?: QuestionBankItem[]
  onAddToQuestionBank?: (_question: QuizzQuestion) => void
  onDeleteQuestionBankItem?: (_id: string) => void
}

const emptyQuestion: Question = {
  question: "",
  answers: ["", "", "", ""],
  solution: 0,
  cooldown: 5,
  time: 20,
  pointsMultiplier: 1,
}

const emptyMusic: QuizzMusic = {
  lobby: "",
  question: "",
  answer: "",
  results: "",
  leaderboard: "",
  podium: "",
}

const musicLabels: Record<keyof QuizzMusic, string> = {
  lobby: "Lobby (waiting room)",
  question: "Question display",
  answer: "Answering time",
  results: "Results",
  leaderboard: "Leaderboard",
  podium: "Final podium",
}

const timeOptions = [5, 10, 20, 30, 60, 90, 120]

const answerConfig = [
  { bg: "bg-red-500", hoverBg: "hover:bg-red-600", icon: Triangle, label: "Triangle" },
  { bg: "bg-blue-500", hoverBg: "hover:bg-blue-600", icon: Rhombus, label: "Rhombus" },
  { bg: "bg-yellow-500", hoverBg: "hover:bg-yellow-600", icon: Circle, label: "Circle" },
  { bg: "bg-green-500", hoverBg: "hover:bg-green-600", icon: Square, label: "Square" },
]

const themeOptions: Array<{ id: QuizzTheme; label: string }> = [
  { id: "classic", label: "Classic" },
  { id: "sunset", label: "Sunset" },
  { id: "ocean", label: "Ocean" },
]

const CreateQuizz = ({
  onSubmit,
  onCancel,
  initialQuizz,
  submitLabel = "Save",
  questionBankItems = [],
  onAddToQuestionBank,
  onDeleteQuestionBankItem,
}: Props) => {
  const [subject, setSubject] = useState("")
  const [music, setMusic] = useState<QuizzMusic>({ ...emptyMusic })
  const [theme, setTheme] = useState<QuizzTheme>("classic")
  const [showMusicSettings, setShowMusicSettings] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([{ ...emptyQuestion }])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    if (!initialQuizz) {
      setSubject("")
      setMusic({ ...emptyMusic })
      setTheme("classic")
      setQuestions([{ ...emptyQuestion }])
      setCurrentQuestionIndex(0)
      return
    }

    setSubject(initialQuizz.subject)
    setMusic({ ...emptyMusic, ...(initialQuizz.music || {}) })
    setTheme(initialQuizz.theme || "classic")
    setQuestions(initialQuizz.questions.length ? initialQuizz.questions : [{ ...emptyQuestion }])
    setCurrentQuestionIndex(0)
  }, [initialQuizz])

  const currentQuestion = questions[currentQuestionIndex]

  const updateMusic = (key: keyof QuizzMusic, value: string) => {
    setMusic((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const updateQuestion = (updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentQuestionIndex ? { ...q, ...updates } : q))
    )
  }

  const updateAnswer = (answerIndex: number, value: string) => {
    const newAnswers = [...currentQuestion.answers]
    newAnswers[answerIndex] = value
    updateQuestion({ answers: newAnswers })
  }

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { ...emptyQuestion }])
    setCurrentQuestionIndex(questions.length)
  }

  const addQuestionFromBank = (question: QuizzQuestion) => {
    const cloned: QuizzQuestion = {
      ...question,
      answers: [...question.answers],
    }

    setQuestions((prev) => [...prev, cloned])
    setCurrentQuestionIndex(questions.length)
    toast.success("Question inserted from bank")
  }

  const saveCurrentQuestionToBank = () => {
    if (!currentQuestion.question.trim()) {
      toast.error("Question is empty")
      return
    }

    const filledAnswers = currentQuestion.answers.filter((a) => a.trim())
    if (filledAnswers.length < 2) {
      toast.error("Need at least 2 answers")
      return
    }

    if (!currentQuestion.answers[currentQuestion.solution]?.trim()) {
      toast.error("Invalid correct answer")
      return
    }

    const questionToSave: QuizzQuestion = {
      ...currentQuestion,
      question: currentQuestion.question.trim(),
      answers: currentQuestion.answers.map((a) => a.trim()).filter(Boolean),
    }

    onAddToQuestionBank?.(questionToSave)
  }

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...questions[index], answers: [...questions[index].answers] }
    setQuestions((prev) => [...prev.slice(0, index + 1), questionToDuplicate, ...prev.slice(index + 1)])
    setCurrentQuestionIndex(index + 1)
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error("You need at least one question")
      return
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index))
    if (currentQuestionIndex >= index && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (!subject.trim()) {
      toast.error("Please enter a quizz name")
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`)
        return
      }
      const filledAnswers = q.answers.filter((a) => a.trim())
      if (filledAnswers.length < 2) {
        toast.error(`Question ${i + 1} needs at least 2 answers`)
        return
      }
      if (!q.answers[q.solution]?.trim()) {
        toast.error(`Question ${i + 1} has an invalid correct answer`)
        return
      }
    }

    const cleanedQuestions = questions.map((q) => ({
      ...q,
      answers: q.answers.filter((a) => a.trim()),
    }))

    // Clean music object (remove empty strings)
    const cleanedMusic: QuizzMusic = {}
    for (const [key, value] of Object.entries(music)) {
      if (value && value.trim()) {
        cleanedMusic[key as keyof QuizzMusic] = value.trim()
      }
    }

    onSubmit({
      subject,
      music: Object.keys(cleanedMusic).length > 0 ? cleanedMusic : undefined,
      theme,
      questions: cleanedQuestions,
    })
  }

  return (
    <div className="z-10 flex h-[85vh] w-full max-w-7xl gap-4">
      {/* Left Sidebar - Question List */}
      <div className="flex w-48 flex-col gap-2 rounded-lg bg-gray-800 p-3 overflow-y-auto">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Questions</span>
          <button
            onClick={addQuestion}
            className="flex h-7 w-7 items-center justify-center rounded bg-purple-600 text-white hover:bg-purple-700"
            title="Add question"
          >
            +
          </button>
        </div>
        
        {questions.map((q, index) => (
          <div
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={clsx(
              "group relative cursor-pointer rounded-lg p-2 transition-all",
              index === currentQuestionIndex
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-black/20 text-xs font-bold">
                {index + 1}
              </span>
              <span className="truncate text-xs">
                {q.question || "New question"}
              </span>
              {q.pointsMultiplier && q.pointsMultiplier > 1 && (
                <span className="ml-auto shrink-0 rounded bg-orange-500/50 px-1.5 py-0.5 text-xs font-bold text-orange-200">
                  {q.pointsMultiplier}x
                </span>
              )}
            </div>
            
            {/* Question actions */}
            <div className="absolute right-1 top-1 hidden gap-1 group-hover:flex">
              <button
                onClick={(e) => { e.stopPropagation(); duplicateQuestion(index) }}
                className="rounded bg-black/30 p-1 text-xs hover:bg-black/50"
                title="Duplicate"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              {questions.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeQuestion(index) }}
                  className="rounded bg-red-500/50 p-1 text-xs hover:bg-red-500"
                  title="Delete"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Answer preview indicators */}
            <div className="mt-2 flex gap-1">
              {q.answers.map((answer, i) => (
                <div
                  key={i}
                  className={clsx(
                    "h-1.5 flex-1 rounded-full",
                    answer.trim() ? answerConfig[i].bg : "bg-gray-500/50"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Top Bar - Quiz Settings */}
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            Exit
          </button>

          <div className="flex items-center gap-2 rounded-lg bg-gray-700 p-1">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={clsx(
                  "rounded px-3 py-1 text-xs font-semibold",
                  theme === option.id
                    ? "bg-orange-500 text-white"
                    : "text-gray-200 hover:bg-gray-600",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter quiz title..."
            className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={() => setShowMusicSettings(!showMusicSettings)}
            className={clsx(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              showMusicSettings ? "bg-purple-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            Music
          </button>
          
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-bold text-white hover:bg-green-700"
          >
            {submitLabel}
          </button>
        </div>

        {/* Question Editor */}
        <div className="flex flex-1 flex-col rounded-lg bg-gray-700 overflow-hidden">
          {/* Question Input Area */}
          <div className="flex flex-col items-center justify-center bg-gray-800 p-6">
            <textarea
              value={currentQuestion.question}
              onChange={(e) => updateQuestion({ question: e.target.value })}
              placeholder="Click to start typing your question"
              className="w-full max-w-2xl resize-none rounded-lg bg-white p-4 text-center text-xl font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-1 items-center justify-center bg-gray-600 p-4">
            {currentQuestion.image ? (
              <div className="relative">
                <img 
                  src={currentQuestion.image} 
                  alt="Question" 
                  className="max-h-48 rounded-lg object-contain"
                />
                <button
                  onClick={() => updateQuestion({ image: undefined })}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg bg-gray-500 p-4">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={currentQuestion.image || ""}
                  onChange={(e) => updateQuestion({ image: e.target.value || undefined })}
                  placeholder="Paste image URL here..."
                  className="w-64 rounded bg-gray-500 px-3 py-2 text-center text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Answers Grid */}
          <div className="grid grid-cols-2 gap-2 p-2">
            {answerConfig.map((config, index) => {
              const Icon = config.icon
              const isCorrect = currentQuestion.solution === index
              const hasContent = currentQuestion.answers[index]?.trim()
              
              return (
                <div
                  key={index}
                  className={clsx(
                    "relative flex items-center gap-3 rounded-lg p-4 transition-all",
                    config.bg,
                    config.hoverBg,
                    isCorrect && "ring-4 ring-white ring-offset-2 ring-offset-gray-700"
                  )}
                >
                  {/* Shape Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    <Icon className="h-8 w-8" fill="white" />
                  </div>
                  
                  {/* Answer Input */}
                  <input
                    type="text"
                    value={currentQuestion.answers[index]}
                    onChange={(e) => updateAnswer(index, e.target.value)}
                    placeholder={`Add answer ${index + 1}`}
                    className="flex-1 bg-transparent text-lg font-medium text-white placeholder:text-white/60 focus:outline-none"
                  />
                  
                  {/* Correct Answer Toggle */}
                  <button
                    onClick={() => updateQuestion({ solution: index })}
                    className={clsx(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                      isCorrect 
                        ? "bg-white text-green-600" 
                        : hasContent 
                          ? "bg-white/20 text-white hover:bg-white/40" 
                          : "bg-white/10 text-white/40"
                    )}
                    title={isCorrect ? "Correct answer" : "Mark as correct"}
                  >
                    {isCorrect ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

        {/* Right Sidebar - Question Settings */}
      <div className="flex w-56 flex-col gap-4 rounded-lg bg-gray-800 p-4">
        <h3 className="text-sm font-semibold text-white">Question Settings</h3>

        <Button
          className="bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-600"
          onClick={saveCurrentQuestionToBank}
        >
          Save to Bank
        </Button>
        
        {/* Time Limit */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">
            Time limit
          </label>
          <div className="grid grid-cols-4 gap-1">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => updateQuestion({ time })}
                className={clsx(
                  "rounded py-2 text-xs font-medium transition-colors",
                  currentQuestion.time === time
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        {/* Cooldown */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">
            Cooldown (before question)
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[3, 5, 10, 15].map((cooldown) => (
              <button
                key={cooldown}
                onClick={() => updateQuestion({ cooldown })}
                className={clsx(
                  "rounded py-2 text-xs font-medium transition-colors",
                  currentQuestion.cooldown === cooldown
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                {cooldown}s
              </button>
            ))}
          </div>
        </div>

        {/* Points Multiplier */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">
            Points Multiplier
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((multiplier) => (
              <button
                key={multiplier}
                onClick={() => updateQuestion({ pointsMultiplier: multiplier })}
                className={clsx(
                  "rounded py-2 text-xs font-medium transition-colors",
                  (currentQuestion.pointsMultiplier || 1) === multiplier
                    ? "bg-orange-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                {multiplier}x
              </button>
            ))}
          </div>
        </div>

        {/* Question Info */}
        <div className="mt-auto rounded-lg bg-gray-700 p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">Answers filled</span>
            <span className="font-medium text-white">
              {currentQuestion.answers.filter(a => a.trim()).length}/4
            </span>
          </div>
          <div className="flex gap-1">
            {currentQuestion.answers.map((answer, i) => (
              <div
                key={i}
                className={clsx(
                  "h-2 flex-1 rounded-full transition-colors",
                  answer.trim() ? answerConfig[i].bg : "bg-gray-600"
                )}
              />
            ))}
          </div>
        </div>

        {/* Total Questions Info */}
        <div className="rounded-lg bg-purple-600/20 p-3 text-center">
          <span className="text-2xl font-bold text-purple-400">{questions.length}</span>
          <p className="text-xs text-purple-300">question{questions.length > 1 ? "s" : ""}</p>
        </div>

        <QuestionBankPanel
          items={questionBankItems}
          onInsert={addQuestionFromBank}
          onDelete={(id) => onDeleteQuestionBankItem?.(id)}
        />
      </div>

      {/* Music Settings Modal */}
      {showMusicSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl rounded-xl bg-gray-800 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Music Settings</h3>
              <button
                onClick={() => setShowMusicSettings(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Add custom music for each phase of the game. You can paste a URL or upload a file (max 5MB).
            </p>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(musicLabels) as Array<keyof QuizzMusic>).map((key) => (
                <MusicInput
                  key={key}
                  label={musicLabels[key]}
                  value={music[key] || ""}
                  onChange={(value) => updateMusic(key, value)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMusicSettings(false)}
                className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateQuizz
