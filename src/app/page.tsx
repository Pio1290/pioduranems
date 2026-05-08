'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAppStore, type PageName } from '@/lib/store'
import { questions, acronyms, glossaryTerms, scenarios, competencies, quotes, assessmentScripts, simulations, visualizations, translations } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Heart, Activity, Shield, BookOpen, AlertTriangle, Users, Stethoscope, Truck,
  Siren, Phone, Radio, Baby, Cloud, Bone, Award, MessageSquare, FileText,
  Lightbulb, ClipboardList, Star, Bookmark, Settings, Home as HomeIcon, ChevronLeft,
  ChevronRight, Menu, X, Check, Clock, Zap, User, Brain, Wind, Eye, Ear,
  Hand, Thermometer, Droplets, Gauge, Search, Filter, ArrowLeft, ArrowRight,
  Play, Pause, RotateCcw, Volume2, VolumeX, Moon, Sun, Languages, Download,
  Wifi, WifiOff, Flag, Target, TrendingUp, BarChart3, List, Grid, Maximize,
  Minimize, RefreshCw, ChevronDown, ChevronUp, Plus, Minus, Info, HelpCircle,
  Sparkles, ArrowUpRight, Timer, ToggleLeft, ToggleRight, Layers, ShieldCheck,
  Move, AlignCenter, PhoneCall, Car, UsersRound, Bandage, HeartPulse
} from 'lucide-react'

// ─── Helper Functions ──────────────────────────────────────────────
const t = (key: string, language: string): string => {
  return (translations[language]?.[key]) || (translations['en']?.[key]) || key
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const iconMap: Record<string, React.ElementType> = {
  MessageSquare, Users, Award, Shield, Lightbulb, FileText, ShieldCheck, Activity,
  Stethoscope, Bone, BookOpen, Move, Radio, ClipboardList, Heart, Wind, Truck,
  AlertTriangle, HeartPulse, Siren, Cloud, AlignCenter, Bandage, PhoneCall, Car,
  UsersRound, Baby, Thermometer, Gauge
}

const getIcon = (iconName: string): React.ElementType => iconMap[iconName] || BookOpen

const categoryColors: Record<string, string> = {
  basic: 'bg-blue-600',
  common: 'bg-emerald-600',
  core: 'bg-red-600',
}

// ─── ECG Animation Component ───────────────────────────────────────
function ECGLine() {
  const pathRef = useRef<SVGPathElement>(null)
  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    let frame: number
    let offset = 0
    const animate = () => {
      offset = (offset + 0.8) % 200
      el.setAttribute('stroke-dashoffset', String(offset))
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <svg viewBox="0 0 200 40" className="w-full h-10 opacity-30" preserveAspectRatio="none">
      <path
        ref={pathRef}
        d="M0,20 L30,20 L35,20 L38,5 L41,35 L44,10 L47,20 L60,20 L65,20 L70,20 L75,2 L78,38 L81,12 L84,20 L100,20 L130,20 L135,20 L138,5 L141,35 L144,10 L147,20 L160,20 L165,20 L170,20 L175,2 L178,38 L181,12 L184,20 L200,20"
        fill="none"
        stroke="#e53935"
        strokeWidth="2"
        strokeDasharray="200"
        strokeDashoffset="0"
      />
    </svg>
  )
}

// ─── Sidebar Navigation ────────────────────────────────────────────
const navItems: { page: PageName; icon: React.ElementType; labelKey: string }[] = [
  { page: 'home', icon: HomeIcon, labelKey: 'home' },
  { page: 'basic-competencies', icon: BookOpen, labelKey: 'basic-competencies' },
  { page: 'common-competencies', icon: Users, labelKey: 'common-competencies' },
  { page: 'core-competencies', icon: Heart, labelKey: 'core-competencies' },
  { page: 'assessment', icon: Target, labelKey: 'assessment' },
  { page: 'practice-exam', icon: ClipboardList, labelKey: 'practice-exam' },
  { page: 'scenarios', icon: Siren, labelKey: 'scenarios' },
  { page: 'simulations', icon: Layers, labelKey: 'simulations' },
  { page: 'acronyms', icon: Zap, labelKey: 'acronyms' },
  { page: 'definitions', icon: BookOpen, labelKey: 'definitions' },
  { page: 'visualization', icon: Eye, labelKey: 'visualization' },
  { page: 'assessment-scripts', icon: MessageSquare, labelKey: 'assessment-scripts' },
  { page: 'study-review', icon: FileText, labelKey: 'study-review' },
  { page: 'infographic', icon: BarChart3, labelKey: 'infographic' },
  { page: 'audio-reviewer', icon: Volume2, labelKey: 'audio-reviewer' },
  { page: 'bookmarks', icon: Bookmark, labelKey: 'bookmarks' },
  { page: 'settings', icon: Settings, labelKey: 'settings' },
]

function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, darkMode, language } = useAppStore()
  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = currentPage === item.page
    const Icon = item.icon
    return (
      <button
        onClick={() => { setCurrentPage(item.page); setSidebarOpen(false) }}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? darkMode
              ? 'bg-red-900/50 text-red-400 border-l-4 border-red-500'
              : 'bg-red-50 text-red-700 border-l-4 border-red-500'
            : darkMode
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{t(item.labelKey, language)}</span>
      </button>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-blue-800 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>EMS NC II</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reviewer</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-0.5">
          {navItems.slice(0, 4).map(item => <NavButton key={item.page} item={item} />)}
        </div>
        <Separator className={`my-2 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
        <div className="space-y-0.5">
          {navItems.slice(4, 8).map(item => <NavButton key={item.page} item={item} />)}
        </div>
        <Separator className={`my-2 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
        <div className="space-y-0.5">
          {navItems.slice(8, 14).map(item => <NavButton key={item.page} item={item} />)}
        </div>
        <Separator className={`my-2 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
        <div className="space-y-0.5">
          {navItems.slice(14).map(item => <NavButton key={item.page} item={item} />)}
        </div>
      </ScrollArea>
      <div className={`p-3 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <WifiOff className="w-3 h-3" />
          <span>Offline Ready</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 border-r ${
        darkMode ? 'bg-[#0d1b2a] border-white/10' : 'bg-white border-gray-200'
      }`}>
        {sidebarContent}
      </aside>
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className={`w-72 p-0 ${darkMode ? 'bg-[#0d1b2a]' : 'bg-white'}`}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Main navigation menu</SheetDescription>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}

// ─── HOME DASHBOARD ────────────────────────────────────────────────
function HomePage() {
  const { setCurrentPage, darkMode, language, studyHistory, completedQuizzes, completedModules, weakAreas } = useAppStore()
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length))
  const quote = quotes[quoteIdx]
  const totalQ = questions.length
  const avgScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((s, q) => s + q.score, 0) / completedQuizzes.length)
    : 0

  const quickAccess = [
    { page: 'assessment' as PageName, icon: Target, label: t('startAssessment', language), color: 'from-red-500 to-red-700' },
    { page: 'practice-exam' as PageName, icon: ClipboardList, label: t('practiceExam', language), color: 'from-blue-500 to-blue-700' },
    { page: 'acronyms' as PageName, icon: Zap, label: t('flashcards', language), color: 'from-emerald-500 to-emerald-700' },
    { page: 'scenarios' as PageName, icon: Siren, label: t('scenarios', language), color: 'from-amber-500 to-amber-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#e53935] p-6 md:p-8">
        <ECGLine />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-white/80" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">EMS NC II</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{t('welcome', language)}</h1>
          <p className="text-white/80 text-sm md:text-base max-w-lg">{quote.text}</p>
          <p className="text-white/60 text-xs mt-1">— {quote.author}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('quickAccess', language)}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickAccess.map(item => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className="group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`} />
              <div className="relative z-10">
                <item.icon className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold text-sm">{item.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`backdrop-blur-sm ${darkMode ? 'bg-[#1b2838]/80 border-white/10 text-white' : 'bg-white shadow-sm'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('completed', language)} Modules</span>
              <Award className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
            </div>
            <p className="text-2xl font-bold">{completedModules.length}<span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/{competencies.length}</span></p>
            <Progress value={(completedModules.length / competencies.length) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className={`backdrop-blur-sm ${darkMode ? 'bg-[#1b2838]/80 border-white/10 text-white' : 'bg-white shadow-sm'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg {t('score', language)}</span>
              <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            </div>
            <p className="text-2xl font-bold">{avgScore}%</p>
            <Progress value={avgScore} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className={`backdrop-blur-sm ${darkMode ? 'bg-[#1b2838]/80 border-white/10 text-white' : 'bg-white shadow-sm'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('question', language)} Bank</span>
              <BookOpen className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <p className="text-2xl font-bold">{totalQ}</p>
            <Progress value={100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <Card className={`backdrop-blur-sm ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : 'bg-white shadow-sm'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {weakAreas.map(area => (
                <Badge key={area} variant="outline" className="border-amber-500 text-amber-500">{area}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {studyHistory.length > 0 && (
        <Card className={`backdrop-blur-sm ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : 'bg-white shadow-sm'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-semibold ${darkMode ? 'text-white' : ''}`}>{t('recentActivity', language)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {studyHistory.slice(-5).reverse().map((entry, i) => (
                <div key={i} className={`flex items-center justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>{entry.topic}</span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{entry.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── COMPETENCIES PAGE ─────────────────────────────────────────────
function CompetenciesPage({ category }: { category: 'basic' | 'common' | 'core' }) {
  const { darkMode, language, setCurrentPage, addStudyHistoryEntry, addCompletedModule } = useAppStore()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [flashcardMode, setFlashcardMode] = useState(false)
  const [flippedCard, setFlippedCard] = useState(false)
  const [cardIdx, setCardIdx] = useState(0)

  const filtered = competencies.filter(c => c.category === category)
  const mod = selectedModule ? competencies.find(c => c.id === selectedModule) : null
  const modQuestions = selectedModule ? questions.filter(q => q.area === selectedModule) : []

  const startQuickQuiz = () => {
    if (!selectedModule || modQuestions.length === 0) return
    const q = shuffleArray(modQuestions).slice(0, Math.min(5, modQuestions.length)).map(q => ({
      id: q.id, question: q.question, options: q.options, correctAnswer: q.correctAnswer, area: q.area, explanation: q.explanation
    }))
    useAppStore.getState().startAssessment({
      questions: q, currentQuestionIndex: 0,
      answers: new Array(q.length).fill(null),
      startTime: Date.now(), timeLimit: 0, mode: 'practice'
    })
    setCurrentPage('assessment')
  }

  if (mod) {
    const flashcards = modQuestions.length > 0 ? modQuestions : []
    if (flashcardMode && flashcards.length > 0) {
      const card = flashcards[cardIdx % flashcards.length]
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setFlashcardMode(false); setFlippedCard(false) }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {cardIdx + 1} / {flashcards.length}
            </span>
          </div>
          <div
            className={`min-h-[300px] rounded-2xl p-6 cursor-pointer transition-all duration-500 ${
              flippedCard
                ? darkMode ? 'bg-blue-900/50 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                : darkMode ? 'bg-[#1b2838] border border-white/10' : 'bg-white border border-gray-200 shadow-lg'
            }`}
            onClick={() => setFlippedCard(!flippedCard)}
          >
            {!flippedCard ? (
              <div>
                <Badge className="mb-3">{t('question', language)}</Badge>
                <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.question}</p>
                <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tap to see answer</p>
              </div>
            ) : (
              <div>
                <Badge className="mb-3 bg-emerald-600">Answer</Badge>
                <p className={`text-lg font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {card.options[card.correctAnswer]}
                </p>
                <p className={`text-sm mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{card.explanation}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setCardIdx(Math.max(0, cardIdx - 1)); setFlippedCard(false) }} disabled={cardIdx === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => { setCardIdx(Math.min(flashcards.length - 1, cardIdx + 1)); setFlippedCard(false) }} disabled={cardIdx >= flashcards.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setSelectedModule(null)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Badge className={`${category === 'basic' ? 'bg-blue-600' : category === 'common' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {t(`${category}-competencies`, language)}
          </Badge>
        </div>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'fil' && mod.titleFil ? mod.titleFil : mod.title}
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {language === 'fil' && mod.descriptionFil ? mod.descriptionFil : mod.description}
        </p>

        {/* Lessons */}
        <div className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
            <BookOpen className="w-4 h-4" /> {t('lessons', language)}
          </h3>
          <Accordion type="multiple" className="space-y-2">
            {mod.lessons.map(lesson => (
              <AccordionItem key={lesson.id} value={lesson.id} className={`rounded-lg border ${darkMode ? 'border-white/10 bg-[#1b2838]/60' : 'border-gray-200 bg-gray-50'} px-4`}>
                <AccordionTrigger className={`text-sm font-medium ${darkMode ? 'text-white hover:text-red-400' : ''}`}>
                  {language === 'fil' && lesson.titleFil ? lesson.titleFil : lesson.title}
                </AccordionTrigger>
                <AccordionContent>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'fil' && lesson.contentFil ? lesson.contentFil : lesson.content}
                  </p>
                  <div className="space-y-1.5">
                    <p className={`text-xs font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{t('keyPoints', language)}:</p>
                    {(language === 'fil' && lesson.keyPointsFil ? lesson.keyPointsFil : lesson.keyPoints).map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={startQuickQuiz} disabled={modQuestions.length === 0} className="bg-red-600 hover:bg-red-700">
            <Zap className="w-4 h-4 mr-2" /> Quick Quiz ({Math.min(5, modQuestions.length)} Q)
          </Button>
          <Button variant="outline" onClick={() => { setFlashcardMode(true); setCardIdx(0); setFlippedCard(false) }} disabled={modQuestions.length === 0}>
            <Sparkles className="w-4 h-4 mr-2" /> {t('flashcards', language)}
          </Button>
          <Button variant="outline" onClick={() => {
            addCompletedModule(mod.id)
            addStudyHistoryEntry({ date: new Date().toLocaleDateString(), page: 'competencies', topic: mod.title })
          }}>
            <Check className="w-4 h-4 mr-2" /> Mark Complete
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className={`${categoryColors[category]} text-white`}>
          {t(`${category}-competencies`, language)}
        </Badge>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{filtered.length} modules</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(mod => {
          const Icon = getIcon(mod.icon)
          return (
            <Card
              key={mod.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg backdrop-blur-sm ${
                darkMode ? 'bg-[#1b2838]/80 border-white/10 hover:border-red-500/50' : 'bg-white border-gray-200 hover:border-red-300'
              }`}
              onClick={() => setSelectedModule(mod.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    category === 'basic' ? 'bg-blue-100 text-blue-600' : category === 'common' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'fil' && mod.titleFil ? mod.titleFil : mod.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {language === 'fil' && mod.descriptionFil ? mod.descriptionFil : mod.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{mod.totalQuestions} Q</Badge>
                      <Badge variant="outline" className="text-xs">{mod.lessons.length} lessons</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── ASSESSMENT MODE ───────────────────────────────────────────────
function AssessmentPage() {
  const store = useAppStore()
  const { darkMode, language, currentAssessment, finishAssessment, answerQuestion, nextQuestion, previousQuestion, goToQuestion, addStudyHistoryEntry, addCompletedQuiz, addWeakArea, setCurrentPage } = store
  const [config, setConfig] = useState({ area: 'all', difficulty: 'all', count: 20, timeLimit: 0 })
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answeredCurrent, setAnsweredCurrent] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const areas = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.area)))], [])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  useEffect(() => {
    if (currentAssessment && currentAssessment.timeLimit > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            handleFinish()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [currentAssessment && !showResults, handleFinish])

  const startAssessment = () => {
    let pool = questions
    if (config.area !== 'all') pool = pool.filter(q => q.area === config.area)
    if (config.difficulty !== 'all') pool = pool.filter(q => q.difficulty === config.difficulty)
    const selected = shuffleArray(pool).slice(0, config.count)
    if (selected.length === 0) return
    const assessmentQuestions = selected.map(q => ({
      id: q.id, question: q.question, options: q.options, correctAnswer: q.correctAnswer, area: q.area, explanation: q.explanation
    }))
    useAppStore.getState().startAssessment({
      questions: assessmentQuestions, currentQuestionIndex: 0,
      answers: new Array(assessmentQuestions.length).fill(null),
      startTime: Date.now(), timeLimit: config.timeLimit * 60, mode: 'practice'
    })
    setTimeLeft(config.timeLimit * 60)
    setShowResults(false)
    setAnsweredCurrent(false)
  }

  const handleAnswer = (optionIdx: number) => {
    if (answeredCurrent || !currentAssessment) return
    answerQuestion(currentAssessment.currentQuestionIndex, optionIdx)
    setAnsweredCurrent(true)
  }

  const handleNext = () => {
    if (!currentAssessment) return
    nextQuestion()
    setAnsweredCurrent(false)
  }

  const handlePrev = () => {
    if (!currentAssessment) return
    previousQuestion()
    setAnsweredCurrent(currentAssessment.answers[currentAssessment.currentQuestionIndex - 1] !== null)
  }

  const handleFinish = useCallback(() => {
    if (!currentAssessment) return
    if (timerRef.current) clearInterval(timerRef.current)
    const correct = currentAssessment.answers.reduce((acc, ans, idx) => {
      if (ans === currentAssessment.questions[idx].correctAnswer) return acc + 1
      return acc
    }, 0)
    const total = currentAssessment.questions.length
    const pct = Math.round((correct / total) * 100)
    const timeTaken = Math.round((Date.now() - currentAssessment.startTime) / 1000)
    finishAssessment({
      id: `result-${Date.now()}`, score: pct, total, date: new Date().toISOString(),
      area: config.area, timeTaken, answers: currentAssessment.answers
    })
    addCompletedQuiz({ quizId: `quiz-${Date.now()}`, score: pct, date: new Date().toISOString() })
    addStudyHistoryEntry({ date: new Date().toLocaleDateString(), page: 'assessment', topic: `Assessment: ${config.area} - ${pct}%` })
    currentAssessment.questions.forEach((q, idx) => {
      if (currentAssessment.answers[idx] !== q.correctAnswer) {
        addWeakArea(q.area)
      }
    })
    setShowResults(true)
  }, [currentAssessment, config.area, finishAssessment, addCompletedQuiz, addStudyHistoryEntry, addWeakArea])

  // Results View
  if (showResults && currentAssessment === null) {
    const results = useAppStore.getState().assessmentResults
    const latest = results[results.length - 1]
    if (!latest) return null
    const passed = latest.score >= 70
    const areaBreakdown: Record<string, { correct: number; total: number }> = {}
    const lastAssessment = useAppStore.getState().assessmentResults[results.length - 1]
    // We need the questions from the last quiz - reconstruct from answers
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className={`text-center p-8 rounded-2xl ${passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`text-6xl font-bold mb-2 ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
            {passed ? t('pass', language) : t('fail', language)}
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{latest.score}%</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('yourScore', language)}</p>
        </div>
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardHeader><CardTitle className={darkMode ? 'text-white' : ''}>{t('competencyBreakdown', language)}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(areaBreakdown).length > 0 ? Object.entries(areaBreakdown).map(([area, data]) => (
                <div key={area} className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{area}</span>
                  <span className={`text-sm font-medium ${data.correct / data.total >= 0.7 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {data.correct}/{data.total}
                  </span>
                </div>
              )) : (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Score: {latest.score}% | Time: {Math.round(latest.timeTaken / 60)} min</p>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => { setShowResults(false); setAnsweredCurrent(false) }} className="bg-red-600 hover:bg-red-700">
            <RotateCcw className="w-4 h-4 mr-2" /> {t('takeNewExam', language)}
          </Button>
          <Button variant="outline" onClick={() => setCurrentPage('study-review')}>
            <FileText className="w-4 h-4 mr-2" /> {t('reviewAnswers', language)}
          </Button>
        </div>
      </div>
    )
  }

  // Quiz Interface
  if (currentAssessment && !showResults) {
    const q = currentAssessment.questions[currentAssessment.currentQuestionIndex]
    const userAnswer = currentAssessment.answers[currentAssessment.currentQuestionIndex]
    const isCorrect = userAnswer === q.correctAnswer
    const progress = ((currentAssessment.currentQuestionIndex + 1) / currentAssessment.questions.length) * 100

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Progress & Timer */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('question', language)} {currentAssessment.currentQuestionIndex + 1} {t('of', language)} {currentAssessment.questions.length}
          </span>
          {currentAssessment.timeLimit > 0 && (
            <Badge variant={timeLeft < 60 ? 'destructive' : 'secondary'} className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </Badge>
          )}
        </div>
        <Progress value={progress} className="h-2" />

        {/* Question */}
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardContent className="p-6">
            <Badge variant="outline" className="mb-3">{q.area}</Badge>
            <p className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                let btnClass = darkMode
                  ? 'border-white/10 text-gray-300 hover:border-red-500/50 hover:bg-red-900/20'
                  : 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
                if (userAnswer !== null) {
                  if (idx === q.correctAnswer) btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  else if (idx === userAnswer && !isCorrect) btnClass = 'border-red-500 bg-red-50 text-red-700'
                  else btnClass = darkMode ? 'border-white/5 text-gray-500' : 'border-gray-100 text-gray-400'
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={userAnswer !== null}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${btnClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        userAnswer !== null && idx === q.correctAnswer ? 'border-emerald-500 bg-emerald-500 text-white' :
                        userAnswer === idx && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                        'border-current'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                      {userAnswer !== null && idx === q.correctAnswer && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                      {userAnswer === idx && !isCorrect && <X className="w-4 h-4 text-red-500 ml-auto" />}
                    </div>
                  </button>
                )
              })}
            </div>
            {userAnswer !== null && (
              <Alert className={`mt-4 ${isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'}`}>
                <AlertDescription className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  <strong>{isCorrect ? t('correct', language) + '!' : t('incorrect', language)}</strong>
                  <br />{q.explanation}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentAssessment.currentQuestionIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('previous', language)}
          </Button>
          {currentAssessment.currentQuestionIndex < currentAssessment.questions.length - 1 ? (
            <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
              {t('next', language)} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-700">
              {t('finish', language)} <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {currentAssessment.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { goToQuestion(idx); setAnsweredCurrent(currentAssessment.answers[idx] !== null) }}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                idx === currentAssessment.currentQuestionIndex
                  ? 'bg-red-600 text-white scale-110'
                  : currentAssessment.answers[idx] !== null
                    ? currentAssessment.answers[idx] === currentAssessment.questions[idx].correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Configuration Panel
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center">
        <Target className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('startAssessment', language)}</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure your assessment</p>
      </div>
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className={darkMode ? 'text-gray-300' : ''}>{t('selectArea', language)}</Label>
            <Select value={config.area} onValueChange={v => setConfig({ ...config, area: v })}>
              <SelectTrigger className={darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {areas.map(a => <SelectItem key={a} value={a}>{a === 'all' ? t('all', language) : a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={darkMode ? 'text-gray-300' : ''}>{t('selectDifficulty', language)}</Label>
            <Select value={config.difficulty} onValueChange={v => setConfig({ ...config, difficulty: v })}>
              <SelectTrigger className={darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all', language)}</SelectItem>
                <SelectItem value="easy">{t('easy', language)}</SelectItem>
                <SelectItem value="medium">{t('medium', language)}</SelectItem>
                <SelectItem value="hard">{t('hard', language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={darkMode ? 'text-gray-300' : ''}>{t('numberOfQuestions', language)}</Label>
            <div className="flex gap-2 mt-1">
              {[10, 20, 30, 50].map(n => (
                <Button key={n} variant={config.count === n ? 'default' : 'outline'} size="sm"
                  className={config.count === n ? 'bg-red-600' : ''}
                  onClick={() => setConfig({ ...config, count: n })}>
                  {n}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className={darkMode ? 'text-gray-300' : ''}>{t('timeLimit', language)}</Label>
            <div className="flex gap-2 mt-1">
              {[0, 15, 30, 60].map(m => (
                <Button key={m} variant={config.timeLimit === m ? 'default' : 'outline'} size="sm"
                  className={config.timeLimit === m ? 'bg-red-600' : ''}
                  onClick={() => setConfig({ ...config, timeLimit: m })}>
                  {m === 0 ? 'Off' : `${m}m`}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={startAssessment} className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg">
            <Play className="w-5 h-5 mr-2" /> {t('start', language)}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── PRACTICE EXAM MODE ────────────────────────────────────────────
function PracticeExamPage() {
  const store = useAppStore()
  const { darkMode, language, currentAssessment, finishAssessment, answerQuestion, nextQuestion, previousQuestion, goToQuestion, addStudyHistoryEntry, addCompletedQuiz, addWeakArea, setCurrentPage } = store
  const [examMode, setExamMode] = useState<'tesda' | 'pressure' | 'full' | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  useEffect(() => {
    if (currentAssessment && currentAssessment.timeLimit > 0 && !showResults && examMode) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            handleFinish()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [currentAssessment && !showResults && examMode, handleFinish])

  const startExam = (mode: 'tesda' | 'pressure' | 'full') => {
    setExamMode(mode)
    const configs = { tesda: { count: 60, time: 60 }, pressure: { count: 30, time: 15 }, full: { count: 100, time: 0 } }
    const cfg = configs[mode]
    const selected = shuffleArray(questions).slice(0, cfg.count)
    const assessmentQuestions = selected.map(q => ({
      id: q.id, question: q.question, options: q.options, correctAnswer: q.correctAnswer, area: q.area, explanation: q.explanation
    }))
    useAppStore.getState().startAssessment({
      questions: assessmentQuestions, currentQuestionIndex: 0,
      answers: new Array(assessmentQuestions.length).fill(null),
      startTime: Date.now(), timeLimit: cfg.time * 60, mode: 'timed'
    })
    setTimeLeft(cfg.time * 60)
    setShowResults(false)
  }

  const handleFinish = useCallback(() => {
    if (!currentAssessment) return
    if (timerRef.current) clearInterval(timerRef.current)
    const correct = currentAssessment.answers.reduce((acc, ans, idx) => {
      if (ans === currentAssessment.questions[idx].correctAnswer) return acc + 1
      return acc
    }, 0)
    const total = currentAssessment.questions.length
    const pct = Math.round((correct / total) * 100)
    const timeTaken = Math.round((Date.now() - currentAssessment.startTime) / 1000)
    finishAssessment({
      id: `exam-${Date.now()}`, score: pct, total, date: new Date().toISOString(),
      area: `Practice Exam (${examMode})`, timeTaken, answers: currentAssessment.answers
    })
    addCompletedQuiz({ quizId: `exam-${Date.now()}`, score: pct, date: new Date().toISOString() })
    addStudyHistoryEntry({ date: new Date().toLocaleDateString(), page: 'practice-exam', topic: `Practice Exam: ${pct}%` })
    currentAssessment.questions.forEach((q, idx) => {
      if (currentAssessment.answers[idx] !== q.correctAnswer) addWeakArea(q.area)
    })
    setShowResults(true)
  }, [currentAssessment, examMode, finishAssessment, addCompletedQuiz, addStudyHistoryEntry, addWeakArea])

  // Results
  if (showResults && currentAssessment === null) {
    const results = useAppStore.getState().assessmentResults
    const latest = results[results.length - 1]
    if (!latest) return null
    const passed = latest.score >= 70
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className={`text-center p-8 rounded-2xl ${passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`text-6xl font-bold mb-2 ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
            {passed ? '✓ ' + t('pass', language) : '✗ ' + t('fail', language)}
          </div>
          <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{latest.score}%</p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Time: {Math.round(latest.timeTaken / 60)} min | {latest.total} questions
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => { setShowResults(false); setExamMode(null) }} className="bg-red-600 hover:bg-red-700">
            <RotateCcw className="w-4 h-4 mr-2" /> {t('takeNewExam', language)}
          </Button>
        </div>
      </div>
    )
  }

  // Exam Interface (no feedback until end)
  if (currentAssessment && !showResults && examMode) {
    const q = currentAssessment.questions[currentAssessment.currentQuestionIndex]
    const userAnswer = currentAssessment.answers[currentAssessment.currentQuestionIndex]
    const progress = ((currentAssessment.currentQuestionIndex + 1) / currentAssessment.questions.length) * 100

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Q{currentAssessment.currentQuestionIndex + 1}/{currentAssessment.questions.length}
          </span>
          {currentAssessment.timeLimit > 0 && (
            <Badge variant={timeLeft < 60 ? 'destructive' : 'secondary'} className="flex items-center gap-1">
              <Timer className="w-3 h-3" /> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </Badge>
          )}
        </div>
        <Progress value={progress} className="h-2" />
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardContent className="p-6">
            <p className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{q.question}</p>
            <RadioGroup value={userAnswer !== null ? String(userAnswer) : undefined} onValueChange={v => answerQuestion(currentAssessment.currentQuestionIndex, parseInt(v))}>
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <Label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    userAnswer === idx
                      ? 'border-red-500 bg-red-50'
                      : darkMode ? 'border-white/10 hover:border-white/30' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value={String(idx)} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{opt}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={previousQuestion} disabled={currentAssessment.currentQuestionIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
          {currentAssessment.currentQuestionIndex < currentAssessment.questions.length - 1 ? (
            <Button onClick={nextQuestion} className="bg-red-600 hover:bg-red-700">
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-700">
              {t('finish', language)} <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {currentAssessment.questions.map((_, idx) => (
            <button key={idx} onClick={() => goToQuestion(idx)}
              className={`w-6 h-6 rounded text-xs font-bold ${
                idx === currentAssessment.currentQuestionIndex ? 'bg-red-600 text-white' :
                currentAssessment.answers[idx] !== null ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') :
                darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Mode Selection
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center">
        <ClipboardList className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('practiceExam', language)}</h2>
      </div>
      <div className="space-y-3">
        {[
          { mode: 'tesda' as const, title: 'TESDA Simulation', desc: '60 questions, 60 minutes', icon: Award, color: 'from-blue-600 to-blue-800' },
          { mode: 'pressure' as const, title: 'Pressure Mode', desc: '30 questions, 15 minutes', icon: Zap, color: 'from-amber-500 to-red-600' },
          { mode: 'full' as const, title: 'Random Full Exam', desc: '100 questions, no time limit', icon: Brain, color: 'from-emerald-500 to-emerald-700' },
        ].map(item => (
          <Card key={item.mode} className={`cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}`}
            onClick={() => startExam(item.mode)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                </div>
                <ArrowUpRight className={`w-5 h-5 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── PRE-HOSPITAL SCENARIOS ────────────────────────────────────────
function ScenariosPage() {
  const { darkMode, language, currentScenario, startScenario, setCurrentScenarioNode, addScenarioDecision, setScenarioScore, clearCurrentScenario, addStudyHistoryEntry } = useAppStore()
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  const startScen = (scenId: string) => {
    const scen = scenarios.find(s => s.id === scenId)
    if (!scen) return
    startScenario({ scenarioId: scenId, currentNode: scen.initialNode, decisions: [], score: 0 })
    setSelectedScenario(scenId)
  }

  if (currentScenario) {
    const scen = scenarios.find(s => s.id === currentScenario.scenarioId)
    if (!scen) return null
    const node = scen.nodes[currentScenario.currentNode]
    if (!node) return null

    if (node.isEndNode) {
      const result = node.endResult || 'partial'
      const resultColors = { success: 'bg-emerald-50 border-emerald-200 text-emerald-700', partial: 'bg-amber-50 border-amber-200 text-amber-700', failure: 'bg-red-50 border-red-200 text-red-700' }
      return (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className={`text-center p-6 rounded-2xl border ${resultColors[result]}`}>
            <div className="text-4xl font-bold mb-2">{result === 'success' ? '🎉' : result === 'partial' ? '⚠️' : '❌'}</div>
            <h2 className="text-2xl font-bold capitalize">{result}</h2>
            <p className="mt-2 text-sm">{language === 'fil' && node.endFeedbackFil ? node.endFeedbackFil : node.endFeedback}</p>
            <p className="mt-2 font-semibold">Score: {currentScenario.score} points</p>
          </div>
          <Button onClick={() => { clearCurrentScenario(); setSelectedScenario(null) }} className="bg-red-600 hover:bg-red-700">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Another Scenario
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { clearCurrentScenario(); setSelectedScenario(null) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Exit
          </Button>
          <Badge>{scen.title}</Badge>
          <Badge variant="outline" className="ml-auto">Score: {currentScenario.score}</Badge>
        </div>
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardContent className="p-6">
            {node.vitalSigns && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'HR', value: node.vitalSigns.hr, icon: Heart },
                  { label: 'BP', value: node.vitalSigns.bp, icon: Gauge },
                  { label: 'RR', value: node.vitalSigns.rr, icon: Wind },
                  { label: 'SpO2', value: node.vitalSigns.spo2, icon: Droplets },
                ].map(vs => (
                  <div key={vs.label} className={`text-center p-2 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
                    <vs.icon className="w-3 h-3 mx-auto mb-1 text-red-500" />
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{vs.label}</p>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>{vs.value}</p>
                  </div>
                ))}
              </div>
            )}
            <p className={`text-base ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {language === 'fil' && node.narrationFil ? node.narrationFil : node.narration}
            </p>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {node.options.map((opt, idx) => (
            <Button key={idx} variant="outline" className={`w-full text-left justify-start h-auto py-3 px-4 ${darkMode ? 'border-white/10 text-gray-300 hover:bg-red-900/20 hover:border-red-500/50' : 'hover:bg-red-50 hover:border-red-300'}`}
              onClick={() => {
                addScenarioDecision(opt.text)
                setScenarioScore(currentScenario.score + opt.scoreChange)
                setCurrentScenarioNode(opt.nextNodeId)
              }}>
              <span className="mr-2 font-bold text-red-500">{String.fromCharCode(65 + idx)}.</span>
              {language === 'fil' && opt.textFil ? opt.textFil : opt.text}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('scenarios', language)}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map(scen => (
          <Card key={scen.id} className={`cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}`}
            onClick={() => startScen(scen.id)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
                  <Siren className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'fil' && scen.titleFil ? scen.titleFil : scen.title}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {language === 'fil' && scen.descriptionFil ? scen.descriptionFil : scen.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{scen.category}</Badge>
                    <Badge variant="outline" className="text-xs">{scen.difficulty}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── PROCEDURE SIMULATIONS ─────────────────────────────────────────
function SimulationsPage() {
  const { darkMode, language } = useAppStore()
  const [selectedSim, setSelectedSim] = useState<string | null>(null)
  const [stepIdx, setStepIdx] = useState(0)

  const sim = selectedSim ? simulations.find(s => s.id === selectedSim) : null

  if (sim) {
    const step = sim.steps[stepIdx]
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedSim(null); setStepIdx(0) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Badge>{sim.title}</Badge>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stepIdx + 1}/{sim.steps.length}</span>
        </div>
        <Progress value={((stepIdx + 1) / sim.steps.length) * 100} className="h-2" />
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'fil' && step.instructionFil ? step.instructionFil : step.instruction}
              </h3>
              {step.criticalStep && <Badge variant="destructive" className="text-xs"><AlertTriangle className="w-3 h-3 mr-1" /> Critical</Badge>}
            </div>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'fil' && step.descriptionFil ? step.descriptionFil : step.description}
            </p>
            <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <Check className="w-4 h-4 inline mr-1" /> Correct Action: {step.correctAction}
              </p>
            </div>
            {step.commonMistakes.length > 0 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  <X className="w-4 h-4 inline mr-1" /> {t('commonMistakes', language)}:
                </p>
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {step.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('previous', language)}
          </Button>
          <Button onClick={() => setStepIdx(Math.min(sim.steps.length - 1, stepIdx + 1))} disabled={stepIdx >= sim.steps.length - 1}
            className="bg-red-600 hover:bg-red-700">
            {t('next', language)} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {/* Equipment & Precautions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
            <CardContent className="p-3">
              <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : ''}`}>{t('equipment', language)}</p>
              <ul className="space-y-1">
                {(language === 'fil' && sim.equipmentFil ? sim.equipmentFil : sim.equipment).map((e, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Plus className="w-3 h-3 text-blue-500" /> {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
            <CardContent className="p-3">
              <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : ''}`}>{t('precautions', language)}</p>
              <ul className="space-y-1">
                {(language === 'fil' && sim.precautionsFil ? sim.precautionsFil : sim.precautions).map((p, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <AlertTriangle className="w-3 h-3 text-amber-500" /> {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('simulations', language)}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {simulations.map(s => (
          <Card key={s.id} className={`cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}`}
            onClick={() => { setSelectedSim(s.id); setStepIdx(0) }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'fil' && s.titleFil ? s.titleFil : s.title}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{s.category}</Badge>
                    <Badge variant="outline" className="text-xs">{s.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{s.steps.length} steps</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── EMS ACRONYMS ──────────────────────────────────────────────────
function AcronymsPage() {
  const { darkMode, language } = useAppStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [flashcardMode, setFlashcardMode] = useState(false)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const categories = useMemo(() => ['all', ...Array.from(new Set(acronyms.map(a => a.category)))], [])
  const filtered = useMemo(() => {
    return acronyms.filter(a => {
      const matchSearch = a.acronym.toLowerCase().includes(search.toLowerCase()) ||
        a.fullForm.toLowerCase().includes(search.toLowerCase()) ||
        a.definition.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'all' || a.category === categoryFilter
      return matchSearch && matchCat
    })
  }, [search, categoryFilter])

  if (flashcardMode && filtered.length > 0) {
    const card = filtered[cardIdx % filtered.length]
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setFlashcardMode(false); setFlipped(false) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cardIdx + 1}/{filtered.length}</span>
        </div>
        <div className={`min-h-[280px] rounded-2xl p-8 cursor-pointer transition-all duration-500 text-center ${
          flipped ? (darkMode ? 'bg-blue-900/50 border-2 border-blue-500/30' : 'bg-blue-50 border-2 border-blue-200') :
          (darkMode ? 'bg-[#1b2838] border-2 border-white/10' : 'bg-white border-2 border-gray-200 shadow-lg')
        }`} onClick={() => setFlipped(!flipped)}>
          {!flipped ? (
            <div>
              <p className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.acronym}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tap to reveal</p>
            </div>
          ) : (
            <div>
              <p className={`text-3xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{card.acronym}</p>
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'fil' && card.fullFormFil ? card.fullFormFil : card.fullForm}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'fil' && card.definitionFil ? card.definitionFil : card.definition}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => { setCardIdx(Math.max(0, cardIdx - 1)); setFlipped(false) }} disabled={cardIdx === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => { setCardIdx(Math.min(filtered.length - 1, cardIdx + 1)); setFlipped(false) }} disabled={cardIdx >= filtered.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('acronyms', language)}</h2>
        <Button variant="outline" size="sm" onClick={() => { setFlashcardMode(true); setCardIdx(0); setFlipped(false) }}>
          <Sparkles className="w-4 h-4 mr-1" /> Flashcards
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder={t('searchAcronyms', language)} value={search} onChange={e => setSearch(e.target.value)}
            className={`pl-9 ${darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}`} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className={`w-full sm:w-40 ${darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? t('all', language) : c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <p className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('noResults', language)}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(acr => (
            <Accordion key={acr.id} type="single" collapsible>
              <AccordionItem value={acr.id} className={`rounded-lg border ${darkMode ? 'border-white/10 bg-[#1b2838]/60' : 'border-gray-200 bg-white'} px-4`}>
                <AccordionTrigger className={`hover:no-underline ${darkMode ? 'text-white hover:text-red-400' : ''}`}>
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-lg font-bold text-red-600">{acr.acronym}</span>
                    <Badge variant="secondary" className="text-xs">{acr.category}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    {language === 'fil' && acr.fullFormFil ? acr.fullFormFil : acr.fullForm}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'fil' && acr.definitionFil ? acr.definitionFil : acr.definition}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DEFINITION OF TERMS ───────────────────────────────────────────
function DefinitionsPage() {
  const { darkMode, language } = useAppStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const categories = useMemo(() => ['all', ...Array.from(new Set(glossaryTerms.map(g => g.category)))], [])
  const filtered = useMemo(() => {
    return glossaryTerms.filter(g => {
      const ms = g.term.toLowerCase().includes(search.toLowerCase()) || g.definition.toLowerCase().includes(search.toLowerCase())
      const mc = catFilter === 'all' || g.category === catFilter
      return ms && mc
    })
  }, [search, catFilter])

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('definitions', language)}</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder={t('searchTerms', language)} value={search} onChange={e => setSearch(e.target.value)}
            className={`pl-9 ${darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}`} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className={`w-full sm:w-40 ${darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? t('all', language) : c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <p className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('noResults', language)}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(term => (
            <Card key={term.id} className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{term.term}</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {language === 'fil' && term.definitionFil ? term.definitionFil : term.definition}
                    </p>
                    {term.relatedTerms && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {term.relatedTerms.map(rt => (
                          <Badge key={rt} variant="outline" className="text-xs">{rt}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">{term.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── VISUALIZATION CENTER ──────────────────────────────────────────
function VisualizationPage() {
  const { darkMode, language } = useAppStore()
  const [catFilter, setCatFilter] = useState('all')
  const [selectedViz, setSelectedViz] = useState<string | null>(null)

  const categories = useMemo(() => ['all', ...Array.from(new Set(visualizations.map(v => v.category)))], [])
  const filtered = useMemo(() => visualizations.filter(v => catFilter === 'all' || v.category === catFilter), [catFilter])
  const viz = selectedViz ? visualizations.find(v => v.id === selectedViz) : null

  if (viz) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => setSelectedViz(null)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardHeader>
            <CardTitle className={darkMode ? 'text-white' : ''}>
              {language === 'fil' && viz.titleFil ? viz.titleFil : viz.title}
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              {language === 'fil' && viz.descriptionFil ? viz.descriptionFil : viz.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {viz.labels.map((label, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('visualization', language)}</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <Button key={c} variant={catFilter === c ? 'default' : 'outline'} size="sm"
            className={catFilter === c ? 'bg-red-600' : ''}
            onClick={() => setCatFilter(c)}>
            {c === 'all' ? t('all', language) : c}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(v => (
          <Card key={v.id} className={`cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}`}
            onClick={() => setSelectedViz(v.id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'fil' && v.titleFil ? v.titleFil : v.title}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{v.category}</Badge>
                    <Badge variant="outline" className="text-xs">{v.labels.length} labels</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── ASSESSMENT DAY SCRIPTS ────────────────────────────────────────
function AssessmentScriptsPage() {
  const { darkMode, language } = useAppStore()
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [showFilipino, setShowFilipino] = useState(false)

  const script = selectedScript ? assessmentScripts.find(s => s.id === selectedScript) : null

  if (script) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setSelectedScript(null)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Languages className="w-4 h-4 text-gray-400" />
            <Switch checked={showFilipino} onCheckedChange={setShowFilipino} />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filipino</span>
          </div>
        </div>
        <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
          <CardHeader>
            <CardTitle className={darkMode ? 'text-white' : ''}>
              {showFilipino && script.titleFil ? script.titleFil : script.title}
            </CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              {showFilipino && script.descriptionFil ? script.descriptionFil : script.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {script.lines.map((line, i) => (
                <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-xs ${line.speaker === 'Candidate' || line.speaker === 'Provider' ? 'border-red-500 text-red-500' : ''}`}>
                      {line.speaker}
                    </Badge>
                    {line.note && (
                      <span className={`text-xs italic ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        💡 {showFilipino && line.noteFil ? line.noteFil : line.note}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {showFilipino && line.lineFil ? line.lineFil : line.line}
                  </p>
                </div>
              ))}
            </div>
            {(script.tips.length > 0) && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Tips:</p>
                <ul className="space-y-1">
                  {(showFilipino && script.tipsFil ? script.tipsFil : script.tips).map((tip, i) => (
                    <li key={i} className={`text-xs flex items-start gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Star className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('assessment-scripts', language)}</h2>
      <div className="space-y-3">
        {assessmentScripts.map(s => (
          <Card key={s.id} className={`cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}`}
            onClick={() => setSelectedScript(s.id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'fil' && s.titleFil ? s.titleFil : s.title}
                  </h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {language === 'fil' && s.descriptionFil ? s.descriptionFil : s.description}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">{s.category}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── STUDY REVIEW ──────────────────────────────────────────────────
function StudyReviewPage() {
  const { darkMode, language, bookmarkedItems, addBookmarkedItem, removeBookmarkedItem } = useAppStore()
  const [search, setSearch] = useState('')
  const [areaFilter, setAreaFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const areas = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.area)))], [])
  const filtered = useMemo(() => {
    return questions.filter(q => {
      const ms = q.question.toLowerCase().includes(search.toLowerCase())
      const ma = areaFilter === 'all' || q.area === areaFilter
      return ms && ma
    })
  }, [search, areaFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('study-review', language)}</h2>
        <div className="flex gap-1">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm"
            className={viewMode === 'list' ? 'bg-red-600' : ''} onClick={() => setViewMode('list')}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm"
            className={viewMode === 'grid' ? 'bg-red-600' : ''} onClick={() => setViewMode('grid')}>
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
            className={`pl-9 ${darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}`} />
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className={`w-full sm:w-44 ${darkMode ? 'bg-[#0d1b2a] border-white/10' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {areas.map(a => <SelectItem key={a} value={a}>{a === 'all' ? t('all', language) : a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{filtered.length} questions</p>
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-2'}>
        {filtered.slice(0, 50).map(q => {
          const isBookmarked = bookmarkedItems.some(b => b.id === q.id)
          return (
            <Card key={q.id} className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{q.area}</Badge>
                  <button onClick={() => isBookmarked ? removeBookmarkedItem(q.id) : addBookmarkedItem({ id: q.id, type: 'question', title: q.question })}>
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                  </button>
                </div>
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{q.question}</p>
                <div className="space-y-1 mb-2">
                  {q.options.map((opt, i) => (
                    <p key={i} className={`text-xs ${i === q.correctAnswer ? 'text-emerald-600 font-semibold' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {i === q.correctAnswer && <Check className="w-3 h-3 inline mr-1" />}
                      {String.fromCharCode(65 + i)}. {opt}
                    </p>
                  ))}
                </div>
                <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{q.explanation}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {filtered.length > 50 && (
        <p className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Showing 50 of {filtered.length} questions. Use filters to narrow results.</p>
      )}
    </div>
  )
}

// ─── INFOGRAPHIC ───────────────────────────────────────────────────
function InfographicPage() {
  const { darkMode, language } = useAppStore()

  const vitalSignsData = [
    { label: 'Heart Rate', normal: '60-100 bpm', icon: Heart, color: 'text-red-500' },
    { label: 'Blood Pressure', normal: '~120/80 mmHg', icon: Gauge, color: 'text-blue-500' },
    { label: 'Respiratory Rate', normal: '12-20/min', icon: Wind, color: 'text-emerald-500' },
    { label: 'Temperature', normal: '36.5-37.5°C', icon: Thermometer, color: 'text-amber-500' },
    { label: 'SpO2', normal: '95-100%', icon: Droplets, color: 'text-purple-500' },
  ]

  const oxygenDevices = [
    { device: 'Nasal Cannula', flow: '1-6 L/min', concentration: '24-44%', color: 'bg-green-100 border-green-300' },
    { device: 'Simple Face Mask', flow: '6-10 L/min', concentration: '40-60%', color: 'bg-blue-100 border-blue-300' },
    { device: 'Non-Rebreather', flow: '10-15 L/min', concentration: '80-95%', color: 'bg-red-100 border-red-300' },
    { device: 'BVM', flow: '10-15 L/min', concentration: '90-100%', color: 'bg-purple-100 border-purple-300' },
  ]

  const triageColors = [
    { color: 'RED', label: 'Immediate', desc: 'Life-threatening, needs immediate care', bg: 'bg-red-500', text: 'text-white' },
    { color: 'YELLOW', label: 'Delayed', desc: 'Serious but can wait', bg: 'bg-yellow-500', text: 'text-black' },
    { color: 'GREEN', label: 'Minor', desc: 'Walking wounded, non-urgent', bg: 'bg-green-500', text: 'text-white' },
    { color: 'BLACK', label: 'Expectant/Deceased', desc: 'Not breathing after airway opening', bg: 'bg-gray-800', text: 'text-white' },
  ]

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('infographic', language)}</h2>

      {/* Vital Signs */}
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
            <Activity className="w-5 h-5 text-red-500" /> Vital Signs Normal Ranges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vitalSignsData.map(vs => (
              <div key={vs.label} className={`p-3 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <vs.icon className={`w-4 h-4 ${vs.color}`} />
                  <span className={`font-semibold text-sm ${darkMode ? 'text-white' : ''}`}>{vs.label}</span>
                </div>
                <p className={`text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{vs.normal}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Oxygen Delivery Devices */}
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
            <Cloud className="w-5 h-5 text-blue-500" /> Oxygen Delivery Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  <th className="text-left p-2">Device</th>
                  <th className="text-left p-2">Flow Rate</th>
                  <th className="text-left p-2">O2 Concentration</th>
                </tr>
              </thead>
              <tbody>
                {oxygenDevices.map(d => (
                  <tr key={d.device} className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <td className="p-2 font-medium">{d.device}</td>
                    <td className="p-2">{d.flow}</td>
                    <td className="p-2">
                      <Badge className={`${d.color} border`}>{d.concentration}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Triage Color Coding */}
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
            <Flag className="w-5 h-5 text-amber-500" /> START Triage Color Coding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {triageColors.map(tc => (
              <div key={tc.color} className={`${tc.bg} ${tc.text} rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold">{tc.color}</p>
                <p className="font-semibold text-sm">{tc.label}</p>
                <p className="text-xs mt-1 opacity-80">{tc.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
            <Brain className="w-5 h-5 text-purple-500" /> Key EMS Concepts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Golden Hour', desc: 'First 60 min from injury to definitive care', icon: Clock },
              { title: 'Platinum 10', desc: 'Max on-scene time for critical trauma', icon: Timer },
              { title: 'CAB Sequence', desc: 'Compressions, Airway, Breathing', icon: Heart },
              { title: 'FAST Stroke', desc: 'Face, Arms, Speech, Time', icon: Zap },
              { title: 'SAMPLE', desc: 'Signs, Allergies, Meds, Past, Last oral, Events', icon: ClipboardList },
              { title: 'OPQRST', desc: 'Onset, Provocation, Quality, Radiation, Severity, Time', icon: Stethoscope },
            ].map(item => (
              <div key={item.title} className={`p-3 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-4 h-4 text-red-500" />
                  <span className={`font-semibold text-sm ${darkMode ? 'text-white' : ''}`}>{item.title}</span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── AUDIO REVIEWER ────────────────────────────────────────────────
function AudioReviewerPage() {
  const { darkMode, language } = useAppStore()
  const [playing, setPlaying] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const topics = useMemo(() => [
    { id: 'ar-01', title: 'Primary Assessment (ABCs)', text: 'The primary assessment follows the CAB sequence: Compressions, Airway, Breathing. First, check for responsiveness. If unresponsive, call for help and begin chest compressions. Open the airway using head-tilt chin-lift or jaw-thrust maneuver. Check breathing for no more than 10 seconds. Provide rescue breaths if needed.' },
    { id: 'ar-02', title: 'SAMPLE History', text: 'SAMPLE stands for Signs and Symptoms, Allergies, Medications, Past medical history, Last oral intake, and Events leading up to the illness or injury. This is the standard history-taking format used in EMS.' },
    { id: 'ar-03', title: 'OPQRST Pain Assessment', text: 'OPQRST assesses pain characteristics. O stands for Onset, when did it start. P for Provocation, what makes it worse or better. Q for Quality, describe the pain. R for Radiation, does it spread. S for Severity on a scale of 0 to 10. T for Time, how long has it been.' },
    { id: 'ar-04', title: 'CPR Procedure', text: 'Adult CPR: Verify unresponsiveness, call for help, check breathing and pulse for maximum 10 seconds. Begin chest compressions at a rate of 100 to 120 per minute, depth at least 2 inches. Compression to ventilation ratio is 30 to 2. Apply AED as soon as available and follow voice prompts.' },
    { id: 'ar-05', title: 'Vital Signs Normal Ranges', text: 'Normal adult heart rate is 60 to 100 beats per minute. Blood pressure is approximately 120 over 80 millimeters of mercury. Respiratory rate is 12 to 20 breaths per minute. Temperature is 36.5 to 37.5 degrees Celsius. Oxygen saturation should be 95 to 100 percent.' },
    { id: 'ar-06', title: 'Oxygen Administration', text: 'Nasal cannula delivers 1 to 6 liters per minute, providing 24 to 44 percent oxygen. Simple face mask: 6 to 10 liters per minute, 40 to 60 percent. Non-rebreather mask: 10 to 15 liters per minute, 80 to 95 percent oxygen. Bag valve mask with oxygen: 10 to 15 liters per minute.' },
    ...acronyms.slice(0, 10).map(a => ({
      id: a.id, title: `Acronym: ${a.acronym}`, text: `${a.acronym} stands for ${a.fullForm}. ${a.definition}`
    })),
  ], [])

  const play = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.onend = () => { setPlaying(null); setPaused(false) }
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setPlaying(id)
      setPaused(false)
    }
  }

  const togglePause = () => {
    if (!playing) return
    if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    } else {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setPlaying(null)
    setPaused(false)
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('audio-reviewer', language)}</h2>
      <Alert className={darkMode ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'}>
        <AlertDescription className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          <Info className="w-4 h-4 inline mr-1" /> Uses Web Speech API for text-to-speech. Works best in Chrome.
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        {topics.map(topic => (
          <Card key={topic.id} className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{topic.title}</h3>
                  <p className={`text-xs mt-1 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{topic.text}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {playing === topic.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={togglePause}>
                        {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={stop}>
                        <VolumeX className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => play(topic.id, topic.text)}>
                      <Volume2 className="w-3 h-3 mr-1" /> Play
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── BOOKMARKS ─────────────────────────────────────────────────────
function BookmarksPage() {
  const { darkMode, language, bookmarkedItems, removeBookmarkedItem, setCurrentPage } = useAppStore()

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('bookmarks', language)}</h2>
      {bookmarkedItems.length === 0 ? (
        <Card className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
          <CardContent className="p-8 text-center">
            <Bookmark className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No bookmarks yet</p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bookmark questions in Study Review to see them here</p>
            <Button variant="outline" className="mt-3" onClick={() => setCurrentPage('study-review')}>
              Go to Study Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {bookmarkedItems.map(item => {
            const q = questions.find(q => q.id === item.id)
            return (
              <Card key={item.id} className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                      {q && (
                        <>
                          <Badge variant="outline" className="text-xs mt-1">{q.area}</Badge>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            Answer: {q.options[q.correctAnswer]}
                          </p>
                        </>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBookmarkedItem(item.id)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── SETTINGS ──────────────────────────────────────────────────────
function SettingsPage() {
  const { darkMode, language, setDarkMode, setLanguage, resetProgress, resetAll } = useAppStore()
  const [showResetDialog, setShowResetDialog] = useState(false)

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('settings', language)}</h2>

      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardContent className="p-4 space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{t('darkMode', language)}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Toggle dark/light theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <Separator className={darkMode ? 'bg-white/10' : ''} />

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{t('language', language)}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>English / Filipino</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={language === 'en' ? 'default' : 'outline'} size="sm"
                className={language === 'en' ? 'bg-red-600' : ''} onClick={() => setLanguage('en')}>
                {t('english', language)}
              </Button>
              <Button variant={language === 'fil' ? 'default' : 'outline'} size="sm"
                className={language === 'fil' ? 'bg-red-600' : ''} onClick={() => setLanguage('fil')}>
                {t('filipino', language)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-500" />
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>Reset Progress</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Clear all study data, scores, and bookmarks</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setShowResetDialog(true)}>
            Reset All Data
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-blue-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-bold ${darkMode ? 'text-white' : ''}`}>EMS NC II Reviewer</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Version 1.0.0</p>
            </div>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            A comprehensive study tool for Emergency Medical Services NC II certification.
            Covers Basic, Common, and Core competencies with interactive quizzes, scenarios, and study materials.
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Wifi className="w-3 h-3" /> Works Offline
          </div>
        </CardContent>
      </Card>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className={darkMode ? 'bg-[#1b2838] border-white/10' : ''}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : ''}>Reset All Data?</DialogTitle>
            <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
              This will permanently delete all your study progress, quiz scores, bookmarks, and settings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { resetAll(); setShowResetDialog(false) }}>
              Reset Everything
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function EMSReviewerApp() {
  const { currentPage, darkMode, sidebarOpen, toggleSidebar, language } = useAppStore()

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />
      case 'basic-competencies': return <CompetenciesPage category="basic" />
      case 'common-competencies': return <CompetenciesPage category="common" />
      case 'core-competencies': return <CompetenciesPage category="core" />
      case 'assessment': return <AssessmentPage />
      case 'practice-exam': return <PracticeExamPage />
      case 'scenarios': return <ScenariosPage />
      case 'simulations': return <SimulationsPage />
      case 'acronyms': return <AcronymsPage />
      case 'definitions': return <DefinitionsPage />
      case 'visualization': return <VisualizationPage />
      case 'assessment-scripts': return <AssessmentScriptsPage />
      case 'study-review': return <StudyReviewPage />
      case 'infographic': return <InfographicPage />
      case 'audio-reviewer': return <AudioReviewerPage />
      case 'bookmarks': return <BookmarksPage />
      case 'settings': return <SettingsPage />
      default: return <HomePage />
    }
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen flex ${darkMode ? 'bg-[#0d1b2a] text-[#e0e0e0]' : 'bg-[#f5f5f5] text-[#1a1a1a]'}`}>
        <Sidebar />
        <div className="flex-1 min-h-screen flex flex-col">
          {/* Top Bar */}
          <header className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b backdrop-blur-md ${
            darkMode ? 'bg-[#0d1b2a]/90 border-white/10' : 'bg-white/90 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-blue-800 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t(currentPage, language)}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs hidden sm:flex">
                <WifiOff className="w-3 h-3 mr-1" /> Offline
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => useAppStore.getState().toggleDarkMode()}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
            {renderPage()}
          </main>

          {/* Footer */}
          <footer className={`px-4 py-3 text-center text-xs border-t ${
            darkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            EMS NC II Reviewer • Study Hard, Save Lives • {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}
