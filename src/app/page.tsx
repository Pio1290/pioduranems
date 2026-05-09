'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react'
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
  Move, AlignCenter, PhoneCall, Car, UsersRound, Bandage, HeartPulse, Image as ImageIcon, Compass, MapPin, Crosshair, CircleDot, Hexagon, Navigation
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
          <img src="/logo.png" alt="PIO DURAN EMS NCII" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>PIO DURAN</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>EMS NC II Reviewer</p>
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
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Offline Ready</span>
          <span className="ml-auto">v2.0</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 border-r overflow-y-auto ${
        darkMode ? 'bg-[#0d1b2a] border-white/10' : 'bg-white border-gray-200'
      }`}>
        {sidebarContent}
      </aside>
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className={`w-72 p-0 h-full overflow-y-auto ${darkMode ? 'bg-[#0d1b2a]' : 'bg-white'}`}>
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
  const [quoteIdx, setQuoteIdx] = useState(0)
  const quote = quotes[quoteIdx]

  useEffect(() => {
    setQuoteIdx(Math.floor(Math.random() * quotes.length))
  }, [])
  const totalQ = questions.length
  const avgScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((s, q) => s + q.score, 0) / completedQuizzes.length)
    : 0

  const quickAccess = [
    { page: 'assessment' as PageName, icon: Target, label: t('startAssessment', language), color: 'from-red-500 to-red-700', desc: 'Test your knowledge' },
    { page: 'practice-exam' as PageName, icon: ClipboardList, label: t('practiceExam', language), color: 'from-blue-500 to-blue-700', desc: 'TESDA-style exam' },
    { page: 'acronyms' as PageName, icon: Zap, label: t('flashcards', language), color: 'from-emerald-500 to-emerald-700', desc: 'Quick reference' },
    { page: 'scenarios' as PageName, icon: Siren, label: t('scenarios', language), color: 'from-amber-500 to-amber-700', desc: 'Emergency sims' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#e53935] p-6 md:p-8">
        <ECGLine />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1" />
            <div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">PIO DURAN EMS NCII</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">{t('welcome', language)}</h1>
            </div>
          </div>
          <p className="text-white/80 text-sm md:text-base max-w-lg italic">"{quote.text}"</p>
          <p className="text-white/50 text-xs mt-1">— {quote.author}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <Zap className="w-5 h-5 text-red-500" /> {t('quickAccess', language)}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickAccess.map(item => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className="group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="relative z-10">
                <item.icon className="w-8 h-8 text-white mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`backdrop-blur-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-[#1b2838]/80 border-white/10 text-white' : 'bg-white shadow-sm'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('completed', language)} Modules</span>
              <Award className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
            </div>
            <p className="text-2xl font-bold">{completedModules.length}<span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/{competencies.length}</span></p>
            <Progress value={(completedModules.length / competencies.length) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className={`backdrop-blur-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-[#1b2838]/80 border-white/10 text-white' : 'bg-white shadow-sm'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg {t('score', language)}</span>
              <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            </div>
            <p className="text-2xl font-bold">{avgScore}%</p>
            <Progress value={avgScore} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className={`backdrop-blur-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-[#1b2838]/80 border-white/10 text-white' : 'bg-white shadow-sm'}`}>
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
        <Card className={`backdrop-blur-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : 'bg-white shadow-sm'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Weak Areas
              <Badge variant="secondary" className="text-xs ml-auto">{weakAreas.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {weakAreas.map(area => (
                <Badge key={area} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 transition-colors cursor-default">
                  <AlertTriangle className="w-3 h-3 mr-1" />{area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {studyHistory.length > 0 && (
        <Card className={`backdrop-blur-sm transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : 'bg-white shadow-sm'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
              <Clock className="w-4 h-4 text-blue-500" /> {t('recentActivity', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {studyHistory.slice(-5).reverse().map((entry, i) => (
                <div key={i} className={`flex items-center justify-between text-sm p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {entry.topic}
                  </span>
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
  const [showConfirmFinish, setShowConfirmFinish] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewIdx, setReviewIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [lastQuestions, setLastQuestions] = useState<AssessmentQuestion[]>([])
  const [lastAnswers, setLastAnswers] = useState<(number | null)[]>([])

  const areas = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.area)))], [])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

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
    // Save questions and answers for review before finishing
    setLastQuestions([...currentAssessment.questions])
    setLastAnswers([...currentAssessment.answers])
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
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Final Score</span>
                    <span className={`text-lg font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{latest.score}%</span>
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time Taken</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(latest.timeTaken / 60)} min {latest.timeTaken % 60}s</span>
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Questions Answered</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{latest.answers.filter(a => a !== null).length}/{latest.total}</span>
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Passing Score</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>70%</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => { setShowResults(false); setAnsweredCurrent(false) }} className="bg-red-600 hover:bg-red-700">
            <RotateCcw className="w-4 h-4 mr-2" /> {t('takeNewExam', language)}
          </Button>
          {lastQuestions.length > 0 && (
            <Button variant="outline" onClick={() => { setReviewMode(true); setReviewIdx(0) }} className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <Eye className="w-4 h-4 mr-2" /> Review Answers
            </Button>
          )}
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
            <Button onClick={() => setShowConfirmFinish(true)} className="bg-emerald-600 hover:bg-emerald-700">
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

        {/* Confirm Finish Dialog */}
        <Dialog open={showConfirmFinish} onOpenChange={setShowConfirmFinish}>
          <DialogContent className={darkMode ? 'bg-[#1b2838] border-white/10' : ''}>
            <DialogHeader>
              <DialogTitle className={darkMode ? 'text-white' : ''}>Finish Assessment?</DialogTitle>
              <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                {currentAssessment && (
                  <>
                    You have answered {currentAssessment.answers.filter(a => a !== null).length} out of {currentAssessment.questions.length} questions.
                    {currentAssessment.answers.filter(a => a === null).length > 0 && (
                      <span className="block mt-1 text-amber-600 font-medium">
                        Warning: {currentAssessment.answers.filter(a => a === null).length} question(s) are unanswered!
                      </span>
                    )}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmFinish(false)}>Continue Exam</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setShowConfirmFinish(false); handleFinish() }}>
                Submit Answers
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Review Mode - shows correct/incorrect answers after exam
  if (reviewMode && lastQuestions.length > 0) {
    const rq = lastQuestions[reviewIdx]
    const userAns = lastAnswers[reviewIdx]
    const isCorrect = userAns === rq.correctAnswer
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setReviewMode(false)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Results
          </Button>
          <Badge variant="outline" className="text-xs">
            {reviewIdx + 1} / {lastQuestions.length}
          </Badge>
        </div>
        <Progress value={((reviewIdx + 1) / lastQuestions.length) * 100} className="h-2" />
        <Card className={`overflow-hidden ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''} ${isCorrect ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={isCorrect ? 'bg-emerald-600' : 'bg-red-600'}>
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Badge>
              <Badge variant="outline" className="text-xs">{rq.area}</Badge>
            </div>
            <p className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rq.question}</p>
            <div className="space-y-2">
              {rq.options.map((opt, idx) => {
                let optClass = darkMode ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-700'
                if (idx === rq.correctAnswer) optClass = 'border-emerald-500 bg-emerald-50 text-emerald-700'
                else if (idx === userAns && !isCorrect) optClass = 'border-red-500 bg-red-50 text-red-700'
                return (
                  <div key={idx} className={`p-3 rounded-lg border-2 ${optClass}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        idx === rq.correctAnswer ? 'border-emerald-500 bg-emerald-500 text-white' :
                        idx === userAns && !isCorrect ? 'border-red-500 bg-red-500 text-white' : 'border-current'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                      {idx === rq.correctAnswer && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                      {idx === userAns && !isCorrect && <X className="w-4 h-4 text-red-500 ml-auto" />}
                    </div>
                  </div>
                )
              })}
            </div>
            {rq.explanation && (
              <Alert className={`mt-4 ${isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'}`}>
                <AlertDescription className={`text-sm ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  {rq.explanation}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setReviewIdx(Math.max(0, reviewIdx - 1))} disabled={reviewIdx === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button onClick={() => setReviewIdx(Math.min(lastQuestions.length - 1, reviewIdx + 1))} disabled={reviewIdx >= lastQuestions.length - 1} className="bg-red-600 hover:bg-red-700">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {lastQuestions.map((_, idx) => {
            const ans = lastAnswers[idx]
            const correct = lastQuestions[idx].correctAnswer
            return (
              <button key={idx} onClick={() => setReviewIdx(idx)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  idx === reviewIdx ? 'bg-red-600 text-white scale-110' :
                  ans === correct ? 'bg-emerald-500 text-white' :
                  ans !== null ? 'bg-red-500 text-white' :
                  darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                {idx + 1}
              </button>
            )
          })}
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
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState('all')
  const [urgencyPulse, setUrgencyPulse] = useState(false)

  const scenarioCategories = useMemo(() => ['all', ...Array.from(new Set(scenarios.map(s => s.category)))], [])
  const filteredScenarios = useMemo(() => scenarios.filter(s => catFilter === 'all' || s.category === catFilter), [catFilter])

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
  }
  const categoryIcons: Record<string, React.ElementType> = {
    cardiac: HeartPulse, trauma: Car, medical: Stethoscope, respiratory: Wind, pediatric: Baby
  }

  const startScen = (scenId: string) => {
    const scen = scenarios.find(s => s.id === scenId)
    if (!scen) return
    startScenario({ scenarioId: scenId, currentNode: scen.initialNode, decisions: [], score: 0 })
    setSelectedScenario(scenId)
    setUrgencyPulse(true)
    setTimeout(() => setUrgencyPulse(false), 2000)
  }

  if (currentScenario) {
    const scen = scenarios.find(s => s.id === currentScenario.scenarioId)
    if (!scen) return null
    const node = scen.nodes[currentScenario.currentNode]
    if (!node) return null

    if (node.isEndNode) {
      const result = node.endResult || 'partial'
      const resultConfig = {
        success: { emoji: '🎉', title: 'Mission Accomplished!', colors: 'bg-emerald-50 border-emerald-200 text-emerald-700', gradient: 'from-emerald-500 to-emerald-700', icon: ShieldCheck },
        partial: { emoji: '⚠️', title: 'Partial Success', colors: 'bg-amber-50 border-amber-200 text-amber-700', gradient: 'from-amber-500 to-amber-700', icon: AlertTriangle },
        failure: { emoji: '❌', title: 'Mission Failed', colors: 'bg-red-50 border-red-200 text-red-700', gradient: 'from-red-500 to-red-700', icon: X },
      }
      const cfg = resultConfig[result]
      const ResultIcon = cfg.icon
      const maxScore = 50
      const scorePercent = Math.min(100, Math.round((currentScenario.score / maxScore) * 100))

      return (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Result Header */}
          <div className={`text-center p-8 rounded-2xl border-2 ${cfg.colors} relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-5`} />
            <div className="relative z-10">
              <div className="text-5xl mb-3">{cfg.emoji}</div>
              <ResultIcon className={`w-10 h-10 mx-auto mb-2 ${result === 'success' ? 'text-emerald-600' : result === 'partial' ? 'text-amber-600' : 'text-red-600'}`} />
              <h2 className="text-2xl font-bold">{cfg.title}</h2>
              <p className="mt-3 text-sm max-w-md mx-auto">{language === 'fil' && node.endFeedbackFil ? node.endFeedbackFil : node.endFeedback}</p>
            </div>
          </div>
          {/* Score Card */}
          <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance Score</span>
                <span className="text-2xl font-bold text-red-600">{currentScenario.score}</span>
              </div>
              <Progress value={scorePercent} className="h-3 mb-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 pts</span>
                <span>{maxScore} pts max</span>
              </div>
            </CardContent>
          </Card>
          {/* Decisions Log */}
          {currentScenario.decisions.length > 0 && (
            <Card className={darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                  <ClipboardList className="w-4 h-4 text-blue-500" /> Decision Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {currentScenario.decisions.map((dec, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                      <span>{dec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <Button onClick={() => { clearCurrentScenario(); setSelectedScenario(null) }} className="bg-red-600 hover:bg-red-700 w-full">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Another Scenario
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Header with scenario info */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => { clearCurrentScenario(); setSelectedScenario(null) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Exit
          </Button>
          <Badge className="bg-red-600">{scen.title}</Badge>
          <Badge variant="outline" className={`ml-auto ${darkMode ? 'text-amber-400 border-amber-500/50' : 'text-amber-600 border-amber-300'}`}>
            <Star className="w-3 h-3 mr-1" /> {currentScenario.score} pts
          </Badge>
        </div>

        {/* Urgency Indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
          urgencyPulse
            ? 'bg-red-100 text-red-700 animate-pulse border border-red-300'
            : darkMode ? 'bg-red-900/20 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <Siren className="w-4 h-4" />
          <span>EMERGENCY RESPONSE IN PROGRESS</span>
          <Badge variant="outline" className={`text-xs ml-auto ${difficultyColors[scen.difficulty]}`}>{scen.difficulty}</Badge>
        </div>

        {/* Vital Signs Monitor */}
        {node.vitalSigns && (
          <Card className={`overflow-hidden ${darkMode ? 'bg-[#0d1b2a] border-white/10' : 'bg-gray-900 text-white'}`}>
            <div className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-white animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wider">VITAL SIGNS MONITOR</span>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'HR', value: node.vitalSigns.hr, icon: Heart, unit: 'bpm', warn: node.vitalSigns.hr > 100 || node.vitalSigns.hr < 60 },
                  { label: 'BP', value: node.vitalSigns.bp, icon: Gauge, unit: 'mmHg', warn: false },
                  { label: 'RR', value: node.vitalSigns.rr, icon: Wind, unit: '/min', warn: node.vitalSigns.rr > 20 || node.vitalSigns.rr < 12 },
                  { label: 'SpO2', value: node.vitalSigns.spo2, icon: Droplets, unit: '%', warn: node.vitalSigns.spo2 < 94 },
                ].map(vs => (
                  <div key={vs.label} className="text-center">
                    <vs.icon className={`w-4 h-4 mx-auto mb-1 ${vs.warn ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                    <p className="text-xs text-gray-400">{vs.label}</p>
                    <p className={`text-lg font-bold font-mono ${vs.warn ? 'text-red-400' : 'text-emerald-400'}`}>{vs.value}</p>
                    <p className="text-xs text-gray-500">{vs.unit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scenario Narration */}
        <Card className={`${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''} relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-amber-500`} />
          <CardContent className="p-6 pl-5">
            <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {language === 'fil' && node.narrationFil ? node.narrationFil : node.narration}
            </p>
          </CardContent>
        </Card>

        {/* Feedback Toast */}
        {showFeedback && (
          <Alert className={`border-2 ${darkMode ? 'bg-blue-900/30 border-blue-500/50' : 'bg-blue-50 border-blue-300'} animate-in slide-in-from-bottom-2`}>
            <Info className="w-4 h-4 text-blue-500" />
            <AlertDescription className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {showFeedback}
            </AlertDescription>
          </Alert>
        )}

        {/* Decision Options */}
        <div className="space-y-2">
          <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            What do you do?
          </p>
          {node.options.map((opt, idx) => (
            <Button key={idx} variant="outline"
              className={`w-full text-left justify-start h-auto py-4 px-5 transition-all duration-200 ${
                darkMode
                  ? 'border-white/10 text-gray-300 hover:bg-red-900/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-900/10'
                  : 'border-gray-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md'
              }`}
              onClick={() => {
                addScenarioDecision(opt.text)
                setScenarioScore(currentScenario.score + opt.scoreChange)
                setCurrentScenarioNode(opt.nextNodeId)
                setShowFeedback(opt.feedback)
                setUrgencyPulse(opt.scoreChange < 0)
                setTimeout(() => { setShowFeedback(null); setUrgencyPulse(false) }, 3000)
              }}>
              <span className="w-8 h-8 rounded-lg bg-red-600 text-white text-sm flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm">
                {language === 'fil' && opt.textFil ? opt.textFil : opt.text}
              </span>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-red-900/30 to-amber-900/30 border border-white/10' : 'bg-gradient-to-br from-red-50 to-amber-50 border border-red-100'}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center">
            <Siren className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('scenarios', language)}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Immersive pre-hospital emergency simulations</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {scenarioCategories.map(c => (
          <Button key={c} variant={catFilter === c ? 'default' : 'outline'} size="sm"
            className={catFilter === c ? 'bg-red-600 hover:bg-red-700' : ''}
            onClick={() => setCatFilter(c)}>
            {c === 'all' ? t('all', language) : c.charAt(0).toUpperCase() + c.slice(1)}
          </Button>
        ))}
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScenarios.map(scen => {
          const CatIcon = categoryIcons[scen.category] || Siren
          return (
            <Card key={scen.id} className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${darkMode ? 'bg-[#1b2838]/80 border-white/10 hover:border-red-500/50' : 'border-gray-200 hover:border-red-300'}`}
              onClick={() => startScen(scen.id)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CatIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'fil' && scen.titleFil ? scen.titleFil : scen.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {language === 'fil' && scen.descriptionFil ? scen.descriptionFil : scen.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs capitalize">{scen.category}</Badge>
                      <Badge className={`text-xs ${difficultyColors[scen.difficulty]}`}>{scen.difficulty}</Badge>
                    </div>
                  </div>
                  <Play className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'} group-hover:text-red-500 transition-colors`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── PROCEDURE SIMULATIONS ─────────────────────────────────────────
function SimulationsPage() {
  const { darkMode, language } = useAppStore()
  const [selectedSim, setSelectedSim] = useState<string | null>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [showMistakes, setShowMistakes] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set)
  const [catFilter, setCatFilter] = useState('all')

  const simCategories = useMemo(() => ['all', ...Array.from(new Set(simulations.map(s => s.category)))], [])
  const filteredSims = useMemo(() => simulations.filter(s => catFilter === 'all' || s.category === catFilter), [catFilter])

  const sim = selectedSim ? simulations.find(s => s.id === selectedSim) : null

  const toggleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      return next
    })
  }

  if (sim) {
    const step = sim.steps[stepIdx]
    const isStepComplete = completedSteps.has(step.id)
    const allComplete = completedSteps.size === sim.steps.length
    const completionPct = Math.round((completedSteps.size / sim.steps.length) * 100)

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedSim(null); setStepIdx(0); setCompletedSteps(new Set()) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Badge className={sim.category === 'assessment-day' ? 'bg-gradient-to-r from-red-600 to-blue-600' : 'bg-blue-600'}>{sim.category === 'assessment-day' ? 'TESDA Assessment Day' : sim.title}</Badge>
          <Badge variant="outline" className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {stepIdx + 1}/{sim.steps.length} steps
          </Badge>
          {allComplete && (
            <Badge className="bg-emerald-600 animate-pulse">
              <Check className="w-3 h-3 mr-1" /> Complete!
            </Badge>
          )}
        </div>

        {/* Overall Progress */}
        <div className="flex items-center gap-3">
          <Progress value={completionPct} className="h-2 flex-1" />
          <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{completionPct}%</span>
        </div>

        {/* Step Timeline */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {sim.steps.map((s, i) => (
            <button key={s.id} onClick={() => setStepIdx(i)}
              className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 ${
                i === stepIdx
                  ? 'bg-red-600 text-white scale-110 shadow-lg'
                  : completedSteps.has(s.id)
                    ? 'bg-emerald-500 text-white'
                    : s.criticalStep
                      ? darkMode ? 'bg-red-900/30 text-red-400 border border-red-500/50' : 'bg-red-50 text-red-600 border border-red-300'
                      : darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
              {completedSteps.has(s.id) ? <Check className="w-4 h-4 mx-auto" /> : i + 1}
            </button>
          ))}
        </div>

        {/* Roles Display */}
        {sim.roles && sim.roles.length > 0 && (
          <Card className={`${darkMode ? 'bg-[#1b2838]/60 border-white/10' : 'bg-gradient-to-r from-red-50 to-blue-50 border-red-200'}`}>
            <CardContent className="p-4">
              <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Users className="w-4 h-4 text-red-500" /> Team Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {sim.roles.map((role, ri) => {
                  const roleColorMap: Record<number, string> = {
                    0: 'bg-purple-600', 1: 'bg-red-600', 2: 'bg-amber-600',
                    3: 'bg-blue-600', 4: 'bg-emerald-600', 5: 'bg-cyan-600'
                  }
                  return (
                    <div key={ri} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'} shadow-sm`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${roleColorMap[ri] || 'bg-gray-500'}`}>
                        {ri + 1}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {language === 'fil' && role.nameFil ? role.nameFil : role.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {language === 'fil' && role.descriptionFil ? role.descriptionFil : role.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Card */}
        <Card className={`overflow-hidden ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''} ${step.criticalStep ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${step.criticalStep ? 'bg-red-600' : 'bg-blue-600'}`}>
                {stepIdx + 1}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'fil' && step.instructionFil ? step.instructionFil : step.instruction}
                </h3>
              </div>
              {step.criticalStep && <Badge variant="destructive" className="text-xs"><AlertTriangle className="w-3 h-3 mr-1" /> Critical</Badge>}
            </div>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'fil' && step.descriptionFil ? step.descriptionFil : step.description}
            </p>

            {/* Dialog / Script */}
            {step.dialog && step.dialog.length > 0 && (
              <div className="mb-4">
                <p className={`text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Team Script
                </p>
                <div className="space-y-2">
                  {step.dialog.map((d, di) => {
                    const speakerColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
                      'Assessor': { bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-50', border: 'border-purple-500/30', text: darkMode ? 'text-purple-300' : 'text-purple-800', badge: 'bg-purple-600' },
                      'Team Leader': { bg: darkMode ? 'bg-red-900/20' : 'bg-red-50', border: 'border-red-500/30', text: darkMode ? 'text-red-300' : 'text-red-800', badge: 'bg-red-600' },
                      'Driver': { bg: darkMode ? 'bg-amber-900/20' : 'bg-amber-50', border: 'border-amber-500/30', text: darkMode ? 'text-amber-300' : 'text-amber-800', badge: 'bg-amber-600' },
                      'Responder 1': { bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50', border: 'border-blue-500/30', text: darkMode ? 'text-blue-300' : 'text-blue-800', badge: 'bg-blue-600' },
                      'Responder 2': { bg: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50', border: 'border-emerald-500/30', text: darkMode ? 'text-emerald-300' : 'text-emerald-800', badge: 'bg-emerald-600' },
                      'Responder 3': { bg: darkMode ? 'bg-cyan-900/20' : 'bg-cyan-50', border: 'border-cyan-500/30', text: darkMode ? 'text-cyan-300' : 'text-cyan-800', badge: 'bg-cyan-600' },
                      'Patient': { bg: darkMode ? 'bg-gray-800/40' : 'bg-gray-100', border: 'border-gray-400/30', text: darkMode ? 'text-gray-300' : 'text-gray-700', badge: 'bg-gray-600' },
                      'Med Base': { bg: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50', border: 'border-indigo-500/30', text: darkMode ? 'text-indigo-300' : 'text-indigo-800', badge: 'bg-indigo-600' },
                      'ER Nurse': { bg: darkMode ? 'bg-pink-900/20' : 'bg-pink-50', border: 'border-pink-500/30', text: darkMode ? 'text-pink-300' : 'text-pink-800', badge: 'bg-pink-600' },
                      'Radio': { bg: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50', border: 'border-indigo-500/30', text: darkMode ? 'text-indigo-300' : 'text-indigo-800', badge: 'bg-indigo-600' },
                      'All Responders': { bg: darkMode ? 'bg-sky-900/20' : 'bg-sky-50', border: 'border-sky-500/30', text: darkMode ? 'text-sky-300' : 'text-sky-800', badge: 'bg-sky-600' },
                    }
                    const colors = speakerColors[d.speaker] || { bg: darkMode ? 'bg-white/5' : 'bg-gray-50', border: 'border-gray-300', text: darkMode ? 'text-gray-300' : 'text-gray-700', badge: 'bg-gray-500' }
                    const isRadio = d.isRadio
                    return (
                      <div key={di} className={`rounded-lg p-3 border ${isRadio ? `${darkMode ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500/20' : 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'}` : `${colors.bg} ${colors.border}`}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isRadio && <Radio className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />}
                          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${colors.badge}`}>
                            {d.speaker}
                          </span>
                          {d.role && d.role !== d.speaker && (
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>({d.role})</span>
                          )}
                          {isRadio && (
                            <span className="text-xs font-medium text-indigo-500 ml-auto flex items-center gap-1">
                              <Radio className="w-3 h-3" /> RADIO
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${colors.text} ${isRadio ? 'italic' : ''}`}>
                          "{language === 'fil' && d.lineFil ? d.lineFil : d.line}"
                        </p>
                        {d.note && (
                          <p className={`text-xs mt-1.5 flex items-start gap-1 ${darkMode ? 'text-amber-400/70' : 'text-amber-600'}`}>
                            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            {language === 'fil' && d.noteFil ? d.noteFil : d.note}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Correct Action */}
            <div className={`p-4 rounded-xl mb-3 ${darkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <Check className="w-4 h-4 inline mr-2" /> Correct Action
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>{step.correctAction}</p>
            </div>

            {/* Common Mistakes (toggle) */}
            {step.commonMistakes.length > 0 && (
              <div>
                <button onClick={() => setShowMistakes(!showMistakes)}
                  className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'} hover:underline`}>
                  <AlertTriangle className="w-4 h-4" />
                  {t('commonMistakes', language)} ({step.commonMistakes.length})
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMistakes ? 'rotate-180' : ''}`} />
                </button>
                {showMistakes && (
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                    <ul className="space-y-1.5">
                      {step.commonMistakes.map((m, i) => (
                        <li key={i} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                          <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Mark Step Complete */}
            <div className="mt-4 flex justify-end">
              <Button
                variant={isStepComplete ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleStepComplete(step.id)}
                className={isStepComplete ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                {isStepComplete ? <><Check className="w-4 h-4 mr-1" /> Completed</> : <><CircleDot className="w-4 h-4 mr-1" /> Mark Complete</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => { setStepIdx(Math.max(0, stepIdx - 1)); setShowMistakes(false) }} disabled={stepIdx === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('previous', language)}
          </Button>
          <Button onClick={() => { setStepIdx(Math.min(sim.steps.length - 1, stepIdx + 1)); setShowMistakes(false) }} disabled={stepIdx >= sim.steps.length - 1}
            className="bg-red-600 hover:bg-red-700">
            {t('next', language)} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Equipment & Precautions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className={`${darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''} border-l-4 border-l-blue-500`}>
            <CardContent className="p-4">
              <p className={`font-semibold text-sm mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                <Bandage className="w-4 h-4 text-blue-500" /> {t('equipment', language)}
              </p>
              <ul className="space-y-2">
                {(language === 'fil' && sim.equipmentFil ? sim.equipmentFil : sim.equipment).map((e, i) => (
                  <li key={i} className={`text-xs flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Plus className="w-3 h-3 text-blue-500 flex-shrink-0" /> {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className={`${darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''} border-l-4 border-l-amber-500`}>
            <CardContent className="p-4">
              <p className={`font-semibold text-sm mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                <AlertTriangle className="w-4 h-4 text-amber-500" /> {t('precautions', language)}
              </p>
              <ul className="space-y-2">
                {(language === 'fil' && sim.precautionsFil ? sim.precautionsFil : sim.precautions).map((p, i) => (
                  <li key={i} className={`text-xs flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* All Steps Overview */}
        <Card className={darkMode ? 'bg-[#1b2838]/60 border-white/10' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
              <ClipboardList className="w-4 h-4 text-purple-500" /> All Steps Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {sim.steps.map((s, i) => (
                <button key={s.id} onClick={() => { setStepIdx(i); setShowMistakes(false) }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all text-xs ${
                    i === stepIdx
                      ? darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'
                      : darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    completedSteps.has(s.id) ? 'bg-emerald-500 text-white' : s.criticalStep ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {completedSteps.has(s.id) ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{s.instruction}</span>
                  {s.criticalStep && <AlertTriangle className="w-3 h-3 text-red-500 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-white/10' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100'}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('simulations', language)}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Step-by-step procedure training</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {simCategories.map(c => (
          <Button key={c} variant={catFilter === c ? 'default' : 'outline'} size="sm"
            className={catFilter === c ? 'bg-blue-600 hover:bg-blue-700' : ''}
            onClick={() => setCatFilter(c)}>
            {c === 'all' ? t('all', language) : c === 'assessment-day' ? 'Assessment Day' : c.charAt(0).toUpperCase() + c.slice(1)}
          </Button>
        ))}
      </div>

      {/* Simulation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSims.map(s => (
          <Card key={s.id} className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
            s.category === 'assessment-day'
              ? darkMode ? 'bg-gradient-to-br from-red-900/30 to-blue-900/30 border-red-500/30 hover:border-red-400/50' : 'bg-gradient-to-br from-red-50 to-blue-50 border-red-200 hover:border-red-300'
              : darkMode ? 'bg-[#1b2838]/80 border-white/10 hover:border-blue-500/50' : 'border-gray-200 hover:border-blue-300'
          }`}
            onClick={() => { setSelectedSim(s.id); setStepIdx(0); setCompletedSteps(new Set()) }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                  s.category === 'assessment-day' ? 'bg-gradient-to-br from-red-500 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                  {s.category === 'assessment-day' ? <Users className="w-6 h-6 text-white" /> : <Layers className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'fil' && s.titleFil ? s.titleFil : s.title}
                  </h3>
                  {s.roles && s.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.roles.slice(0, 4).map((r, ri) => (
                        <span key={ri} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'}`}>
                          {r.name}
                        </span>
                      ))}
                      {s.roles.length > 4 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          +{s.roles.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs capitalize">{s.category}</Badge>
                    <Badge variant="outline" className="text-xs">{s.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{s.steps.length} steps</Badge>
                    {s.steps.some(st => st.dialog && st.dialog.length > 0) && (
                      <Badge className="text-xs bg-indigo-600"><Radio className="w-3 h-3 mr-1" /> Radio</Badge>
                    )}
                  </div>
                  {/* Mini step preview */}
                  <div className="flex gap-1 mt-2">
                    {s.steps.slice(0, 8).map((st, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${st.criticalStep ? 'bg-red-400' : 'bg-blue-300'}`} />
                    ))}
                    {s.steps.length > 8 && <span className="text-xs text-gray-400">+{s.steps.length - 8}</span>}
                  </div>
                </div>
                <Play className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'} group-hover:text-blue-500 transition-colors`} />
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
  const [activeLabel, setActiveLabel] = useState<number | null>(null)
  const [showLabels, setShowLabels] = useState(true)

  const categories = useMemo(() => ['all', ...Array.from(new Set(visualizations.map(v => v.category)))], [])
  const filtered = useMemo(() => visualizations.filter(v => catFilter === 'all' || v.category === catFilter), [catFilter])
  const viz = selectedViz ? visualizations.find(v => v.id === selectedViz) : null

  // SVG diagram renderers for each visualization type
  const renderSVGDiagram = (vizId: string) => {
    const labelColors = ['#e53935', '#0d47a1', '#2e7d32', '#f57c00', '#7b1fa2', '#00838f', '#c62828', '#1565c0']

    switch (vizId) {
      case 'viz-01': // Star of Life
        return (
          <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d47a1" />
                <stop offset="100%" stopColor="#1565c0" />
              </linearGradient>
              <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" />
              </filter>
            </defs>
            <circle cx="200" cy="200" r="180" fill="none" stroke={darkMode ? '#ffffff20' : '#e0e0e0'} strokeWidth="2" strokeDasharray="8 4" />
            {/* Six-pointed star */}
            <polygon
              points="200,40 230,140 330,140 250,200 280,300 200,240 120,300 150,200 70,140 170,140"
              fill="url(#starGrad)" stroke="#0d47a1" strokeWidth="2"
              filter="url(#starShadow)"
              className="transition-all duration-300"
            />
            {/* Rod of Asclepius in center */}
            <line x1="200" y1="120" x2="200" y2="280" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M200,150 Q220,160 215,175 Q210,185 200,180 Q190,170 195,160 Q200,155 200,150" fill="white" />
            <path d="M200,180 Q220,190 215,205 Q210,215 200,210 Q190,200 195,190 Q200,185 200,180" fill="white" />
            {/* Label points */}
            {viz?.labels.map((label, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180)
              const x = 200 + Math.cos(angle) * 155
              const y = 200 + Math.sin(angle) * 155
              const tx = 200 + Math.cos(angle) * 185
              const ty = 200 + Math.sin(angle) * 185
              return (
                <g key={i} className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === i ? null : i)}>
                  <circle cx={x} cy={y} r="8" fill={labelColors[i]} stroke="white" strokeWidth="2"
                    className="transition-all duration-200" style={{ transform: activeLabel === i ? 'scale(1.3)' : 'scale(1)', transformOrigin: `${x}px ${y}px` }} />
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fill={darkMode ? '#e0e0e0' : '#333'} fontSize="10" fontWeight="bold"
                    className="pointer-events-none select-none">
                    {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                  </text>
                  {activeLabel === i && (
                    <rect x={tx - 60} y={ty + 10} width="120" height="32" rx="6" fill={darkMode ? '#1b2838' : 'white'} stroke={labelColors[i]} strokeWidth="1.5" />
                  )}
                  {activeLabel === i && (
                    <text x={tx} y={ty + 30} textAnchor="middle" dominantBaseline="middle"
                      fill={darkMode ? '#aaa' : '#666'} fontSize="7" className="pointer-events-none select-none">
                      {label.description.substring(0, 25)}...
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        )
      case 'viz-02': // Human Heart
        return (
          <svg viewBox="0 0 400 420" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c62828" />
                <stop offset="100%" stopColor="#e53935" />
              </linearGradient>
              <filter id="heartGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Heart shape */}
            <path d="M200,380 Q60,280 60,160 Q60,60 140,60 Q180,60 200,100 Q220,60 260,60 Q340,60 340,160 Q340,280 200,380Z"
              fill="url(#heartGrad)" stroke="#b71c1c" strokeWidth="2" filter="url(#heartGlow)" />
            {/* Septum */}
            <line x1="200" y1="80" x2="200" y2="320" stroke="#8e0000" strokeWidth="3" />
            {/* Right Atrium */}
            <ellipse cx="155" cy="130" rx="35" ry="40" fill="#ef5350" stroke="#b71c1c" strokeWidth="1.5"
              className="cursor-pointer transition-all duration-200" style={{ opacity: activeLabel === 0 ? 1 : 0.8 }}
              onClick={() => setActiveLabel(activeLabel === 0 ? null : 0)} />
            {/* Right Ventricle */}
            <ellipse cx="165" cy="230" rx="30" ry="50" fill="#f44336" stroke="#b71c1c" strokeWidth="1.5"
              className="cursor-pointer transition-all duration-200" style={{ opacity: activeLabel === 1 ? 1 : 0.8 }}
              onClick={() => setActiveLabel(activeLabel === 1 ? null : 1)} />
            {/* Left Atrium */}
            <ellipse cx="245" cy="130" rx="35" ry="40" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1.5"
              className="cursor-pointer transition-all duration-200" style={{ opacity: activeLabel === 2 ? 1 : 0.8 }}
              onClick={() => setActiveLabel(activeLabel === 2 ? null : 2)} />
            {/* Left Ventricle */}
            <ellipse cx="235" cy="240" rx="30" ry="55" fill="#c62828" stroke="#b71c1c" strokeWidth="1.5"
              className="cursor-pointer transition-all duration-200" style={{ opacity: activeLabel === 3 ? 1 : 0.8 }}
              onClick={() => setActiveLabel(activeLabel === 3 ? null : 3)} />
            {/* Aorta */}
            <path d="M230,90 Q240,50 270,40 Q300,30 310,50 Q320,70 300,80" fill="none" stroke="#b71c1c" strokeWidth="4" strokeLinecap="round"
              className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 4 ? null : 4)} />
            {/* Pulmonary Artery */}
            <path d="M170,90 Q160,50 130,40 Q100,30 90,50" fill="none" stroke="#0d47a1" strokeWidth="4" strokeLinecap="round"
              className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 5 ? null : 5)} />
            {/* Blood flow arrows */}
            <path d="M155,170 L155,190" stroke="#0d47a1" strokeWidth="2" fill="none" markerEnd="url(#arrowBlue)" />
            <path d="M245,170 L245,195" stroke="#e53935" strokeWidth="2" fill="none" />
            <defs>
              <marker id="arrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#0d47a1" />
              </marker>
            </defs>
            {/* Labels */}
            {viz?.labels.map((label, i) => {
              const positions = [
                { x: 75, y: 130 }, { x: 75, y: 230 }, { x: 325, y: 130 }, { x: 325, y: 240 },
                { x: 330, y: 55 }, { x: 70, y: 55 }
              ]
              const pos = positions[i] || { x: 200, y: 200 }
              return (
                <g key={i} className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === i ? null : i)}>
                  <rect x={pos.x - 45} y={pos.y - 10} width="90" height="20" rx="10"
                    fill={activeLabel === i ? labelColors[i] : (darkMode ? '#1b2838' : 'white')}
                    stroke={labelColors[i]} strokeWidth="1.5" className="transition-all duration-200" />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" dominantBaseline="middle"
                    fill={activeLabel === i ? 'white' : (darkMode ? '#e0e0e0' : '#333')}
                    fontSize="9" fontWeight="600" className="pointer-events-none select-none">
                    {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                  </text>
                </g>
              )
            })}
          </svg>
        )
      case 'viz-03': // CPR Hand Placement
        return (
          <svg viewBox="0 0 400 440" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8d5c4" />
                <stop offset="100%" stopColor="#d4b896" />
              </linearGradient>
            </defs>
            {/* Torso outline */}
            <ellipse cx="200" cy="260" rx="110" ry="160" fill="url(#bodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Neck */}
            <rect x="175" y="85" width="50" height="30" rx="10" fill="url(#bodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Head */}
            <ellipse cx="200" cy="60" rx="40" ry="40" fill="url(#bodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Sternum line */}
            <line x1="200" y1="120" x2="200" y2="380" stroke="#90a4ae" strokeWidth="2" strokeDasharray="6 3" />
            {/* Ribs */}
            <path d="M140,160 Q200,150 260,160" fill="none" stroke="#bcaaa4" strokeWidth="1.5" />
            <path d="M130,190 Q200,178 270,190" fill="none" stroke="#bcaaa4" strokeWidth="1.5" />
            <path d="M128,220 Q200,206 272,220" fill="none" stroke="#bcaaa4" strokeWidth="1.5" />
            <path d="M130,250 Q200,234 270,250" fill="none" stroke="#bcaaa4" strokeWidth="1.5" />
            <path d="M135,280 Q200,262 265,280" fill="none" stroke="#bcaaa4" strokeWidth="1.5" />
            {/* Xiphoid process marker */}
            <path d="M200,310 L195,330 L205,330 Z" fill="#e53935" stroke="#b71c1c" strokeWidth="1"
              className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 3 ? null : 3)} />
            {/* Compression zone highlight */}
            <rect x="170" y="200" width="60" height="80" rx="8"
              fill="#e5393520" stroke="#e53935" strokeWidth="2" strokeDasharray="8 4"
              className="cursor-pointer animate-pulse" onClick={() => setActiveLabel(activeLabel === 2 ? null : 2)} />
            {/* Hand placement */}
            <g className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 0 ? null : 0)}>
              <ellipse cx="200" cy="230" rx="22" ry="28" fill="#0d47a180" stroke="#0d47a1" strokeWidth="2"
                style={{ opacity: activeLabel === 0 ? 1 : 0.7 }} className="transition-all duration-200" />
              <ellipse cx="200" cy="220" rx="18" ry="10" fill="#1565c0" stroke="#0d47a1" strokeWidth="1" />
              {/* Interlocked fingers indicator */}
              <path d="M178,230 Q175,240 180,250" fill="none" stroke="white" strokeWidth="2" />
              <path d="M222,230 Q225,240 220,250" fill="none" stroke="white" strokeWidth="2" />
            </g>
            {/* Labels */}
            {viz?.labels.map((label, i) => {
              const positions = [{ x: 320, y: 230 }, { x: 320, y: 270 }, { x: 200, y: 195 }, { x: 200, y: 345 }]
              const pos = positions[i] || { x: 200, y: 400 }
              return (
                <g key={i} onClick={() => setActiveLabel(activeLabel === i ? null : i)} className="cursor-pointer">
                  <line x1={pos.x < 200 ? 170 : pos.x > 200 ? 230 : 200} y1={pos.y} x2={pos.x} y2={pos.y}
                    stroke={labelColors[i]} strokeWidth="1" strokeDasharray="4 2" />
                  <rect x={pos.x - 48} y={pos.y - 10} width="96" height="20" rx="10"
                    fill={activeLabel === i ? labelColors[i] : (darkMode ? '#1b2838' : 'white')}
                    stroke={labelColors[i]} strokeWidth="1.5" className="transition-all duration-200" />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" dominantBaseline="middle"
                    fill={activeLabel === i ? 'white' : (darkMode ? '#e0e0e0' : '#333')}
                    fontSize="8" fontWeight="600" className="pointer-events-none select-none">
                    {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                  </text>
                </g>
              )
            })}
            {/* Depth indicator */}
            <g>
              <line x1="290" y1="200" x2="290" y2="280" stroke="#e53935" strokeWidth="2" />
              <line x1="285" y1="200" x2="295" y2="200" stroke="#e53935" strokeWidth="2" />
              <line x1="285" y1="280" x2="295" y2="280" stroke="#e53935" strokeWidth="2" />
              <text x="298" y="245" fill="#e53935" fontSize="9" fontWeight="bold" className="select-none">&gt;2 in</text>
            </g>
          </svg>
        )
      case 'viz-04': // AED Pad Placement
        return (
          <svg viewBox="0 0 400 440" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="aedBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8d5c4" />
                <stop offset="100%" stopColor="#d4b896" />
              </linearGradient>
              <linearGradient id="padGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e0e0e0" />
              </linearGradient>
            </defs>
            {/* Torso */}
            <ellipse cx="200" cy="260" rx="110" ry="160" fill="url(#aedBodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Neck */}
            <rect x="175" y="85" width="50" height="30" rx="10" fill="url(#aedBodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Head */}
            <ellipse cx="200" cy="60" rx="40" ry="40" fill="url(#aedBodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Collarbone */}
            <line x1="130" y1="130" x2="270" y2="130" stroke="#bcaaa4" strokeWidth="1.5" />
            {/* Sternum */}
            <line x1="200" y1="130" x2="200" y2="380" stroke="#90a4ae" strokeWidth="2" strokeDasharray="6 3" />
            {/* Upper Right Pad */}
            <g className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 0 ? null : 0)}>
              <rect x="130" y="140" width="55" height="70" rx="10"
                fill={activeLabel === 0 ? '#e5393580' : 'url(#padGrad)'} stroke="#e53935" strokeWidth="2"
                className="transition-all duration-200" />
              <text x="157" y="180" textAnchor="middle" fill="#e53935" fontSize="9" fontWeight="bold" className="pointer-events-none select-none">R1</text>
              {/* Electrode lines */}
              <line x1="157" y1="155" x2="157" y2="170" stroke="#e53935" strokeWidth="1" />
              <circle cx="157" cy="153" r="3" fill="#e53935" />
            </g>
            {/* Lower Left Pad */}
            <g className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 1 ? null : 1)}>
              <rect x="215" y="270" width="55" height="70" rx="10"
                fill={activeLabel === 1 ? '#0d47a180' : 'url(#padGrad)'} stroke="#0d47a1" strokeWidth="2"
                className="transition-all duration-200" />
              <text x="242" y="310" textAnchor="middle" fill="#0d47a1" fontSize="9" fontWeight="bold" className="pointer-events-none select-none">L2</text>
              <line x1="242" y1="285" x2="242" y2="300" stroke="#0d47a1" strokeWidth="1" />
              <circle cx="242" cy="283" r="3" fill="#0d47a1" />
            </g>
            {/* Current path through heart */}
            <path d="M157,210 Q180,240 242,270" fill="none" stroke="#ff9800" strokeWidth="2" strokeDasharray="6 3"
              className="animate-pulse" />
            {/* Heart center marker */}
            <g className="cursor-pointer" onClick={() => setActiveLabel(activeLabel === 2 ? null : 2)}>
              <circle cx="195" cy="230" r="15" fill="#ff980020" stroke="#ff9800" strokeWidth="1.5" className="animate-pulse" />
              <text x="195" y="234" textAnchor="middle" fill="#ff9800" fontSize="7" fontWeight="bold" className="pointer-events-none select-none">♥</text>
            </g>
            {/* Labels */}
            {viz?.labels.map((label, i) => {
              const positions = [{ x: 80, y: 175 }, { x: 320, y: 305 }, { x: 320, y: 230 }]
              const pos = positions[i] || { x: 200, y: 400 }
              return (
                <g key={i} onClick={() => setActiveLabel(activeLabel === i ? null : i)} className="cursor-pointer">
                  <rect x={pos.x - 48} y={pos.y - 10} width="96" height="20" rx="10"
                    fill={activeLabel === i ? labelColors[i] : (darkMode ? '#1b2838' : 'white')}
                    stroke={labelColors[i]} strokeWidth="1.5" className="transition-all duration-200" />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" dominantBaseline="middle"
                    fill={activeLabel === i ? 'white' : (darkMode ? '#e0e0e0' : '#333')}
                    fontSize="8" fontWeight="600" className="pointer-events-none select-none">
                    {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                  </text>
                </g>
              )
            })}
          </svg>
        )
      case 'viz-05': // Pulse Points
        return (
          <svg viewBox="0 0 400 500" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="pulseBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8d5c4" />
                <stop offset="100%" stopColor="#d4b896" />
              </linearGradient>
            </defs>
            {/* Body outline */}
            <ellipse cx="200" cy="60" rx="30" ry="35" fill="url(#pulseBodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            <rect x="185" y="90" width="30" height="20" rx="5" fill="url(#pulseBodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            <rect x="150" y="110" width="100" height="140" rx="15" fill="url(#pulseBodyGrad)" stroke="#bcaaa4" strokeWidth="2" />
            {/* Arms */}
            <path d="M150,130 L70,220 L65,240" fill="none" stroke="#bcaaa4" strokeWidth="2" strokeLinecap="round" />
            <path d="M250,130 L330,220 L335,240" fill="none" stroke="#bcaaa4" strokeWidth="2" strokeLinecap="round" />
            {/* Legs */}
            <path d="M175,250 L165,400 L160,460" fill="none" stroke="#bcaaa4" strokeWidth="2" strokeLinecap="round" />
            <path d="M225,250 L235,400 L240,460" fill="none" stroke="#bcaaa4" strokeWidth="2" strokeLinecap="round" />
            {/* Pulse point markers */}
            {viz?.labels.map((label, i) => {
              const points = [
                { x: 215, y: 80, label: 'Carotid' },   // Neck
                { x: 75, y: 230, label: 'Radial' },     // Wrist
                { x: 110, y: 170, label: 'Brachial' },  // Upper arm
                { x: 190, y: 270, label: 'Femoral' },   // Groin
                { x: 170, y: 430, label: 'Post.Tib.' }, // Ankle
                { x: 175, y: 460, label: 'Dor.Ped.' },  // Foot
              ]
              const pt = points[i] || { x: 200, y: 300 }
              const isActive = activeLabel === i
              return (
                <g key={i} className="cursor-pointer" onClick={() => setActiveLabel(isActive ? null : i)}>
                  {/* Pulse ring animation */}
                  {isActive && <circle cx={pt.x} cy={pt.y} r="16" fill="none" stroke={labelColors[i]} strokeWidth="1.5" className="animate-ping" style={{ animationDuration: '1s' }} />}
                  <circle cx={pt.x} cy={pt.y} r="10" fill={isActive ? labelColors[i] : labelColors[i] + '40'} stroke={labelColors[i]} strokeWidth="2"
                    className="transition-all duration-200" />
                  <text x={pt.x} y={pt.y + 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" className="pointer-events-none select-none">{i + 1}</text>
                  {/* Label text */}
                  <rect x={pt.x + 16} y={pt.y - 8} width="80" height="16" rx="8"
                    fill={isActive ? labelColors[i] : (darkMode ? '#1b2838' : 'white')}
                    stroke={labelColors[i]} strokeWidth="1" className="transition-all duration-200" />
                  <text x={pt.x + 56} y={pt.y + 3} textAnchor="middle" dominantBaseline="middle"
                    fill={isActive ? 'white' : (darkMode ? '#e0e0e0' : '#333')}
                    fontSize="7" fontWeight="600" className="pointer-events-none select-none">
                    {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                  </text>
                </g>
              )
            })}
          </svg>
        )
      default: // Generic visualization
        return (
          <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
            <circle cx="200" cy="200" r="150" fill={darkMode ? '#1b2838' : '#f5f5f5'} stroke={darkMode ? '#ffffff20' : '#e0e0e0'} strokeWidth="2" />
            {viz?.labels.map((label, i) => {
              const angle = (i * (360 / viz.labels.length) - 90) * (Math.PI / 180)
              const x = 200 + Math.cos(angle) * 120
              const y = 200 + Math.sin(angle) * 120
              const isActive = activeLabel === i
              return (
                <g key={i} className="cursor-pointer" onClick={() => setActiveLabel(isActive ? null : i)}>
                  <circle cx={x} cy={y} r="12" fill={labelColors[i] + (isActive ? '' : '60')} stroke={labelColors[i]} strokeWidth="2" className="transition-all duration-200" />
                  <text x={x} y={y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" className="pointer-events-none select-none">{i + 1}</text>
                  <text x={200 + Math.cos(angle) * 170} y={200 + Math.sin(angle) * 170 + 4} textAnchor="middle"
                    fill={darkMode ? '#e0e0e0' : '#333'} fontSize="9" fontWeight="500" className="pointer-events-none select-none">
                    {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                  </text>
                </g>
              )
            })}
          </svg>
        )
    }
  }

  if (viz) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedViz(null); setActiveLabel(null) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Badge className="bg-purple-600">{viz.category}</Badge>
        </div>
        <Card className={`overflow-hidden ${darkMode ? 'bg-[#1b2838]/80 border-white/10' : ''}`}>
          <CardHeader className={`pb-2 ${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={darkMode ? 'text-white' : ''}>
                  {language === 'fil' && viz.titleFil ? viz.titleFil : viz.title}
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                  {language === 'fil' && viz.descriptionFil ? viz.descriptionFil : viz.description}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)}>
                {showLabels ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Interactive SVG Diagram */}
            <div className={`rounded-xl p-4 mb-4 ${darkMode ? 'bg-[#0d1b2a]/50' : 'bg-gray-50'}`}>
              {renderSVGDiagram(viz.id)}
            </div>
            {/* Detailed Labels */}
            {showLabels && (
              <div className="space-y-2">
                <h4 className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Crosshair className="w-4 h-4 text-purple-500" /> Key Structures
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viz.labels.map((label, i) => {
                    const labelColors = ['#e53935', '#0d47a1', '#2e7d32', '#f57c00', '#7b1fa2', '#00838f', '#c62828', '#1565c0']
                    return (
                      <button key={i}
                        onClick={() => setActiveLabel(activeLabel === i ? null : i)}
                        className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                          activeLabel === i
                            ? `${darkMode ? 'bg-purple-900/40 border-purple-500/50' : 'bg-purple-50 border-purple-300'} border-2`
                            : `${darkMode ? 'bg-black/20 border-white/5 hover:bg-black/30' : 'bg-white border-gray-100 hover:border-gray-300'} border`
                        }`}>
                        <div className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold"
                          style={{ backgroundColor: labelColors[i] || '#666' }}>
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'fil' && label.nameFil ? label.nameFil : label.name}
                          </p>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10' : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100'}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('visualization', language)}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interactive diagrams and anatomical references</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <Button key={c} variant={catFilter === c ? 'default' : 'outline'} size="sm"
            className={catFilter === c ? 'bg-purple-600 hover:bg-purple-700' : ''}
            onClick={() => setCatFilter(c)}>
            {c === 'all' ? t('all', language) : c}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(v => (
          <Card key={v.id} className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${darkMode ? 'bg-[#1b2838]/80 border-white/10 hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-300'}`}
            onClick={() => { setSelectedViz(v.id); setActiveLabel(null) }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'fil' && v.titleFil ? v.titleFil : v.title}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {language === 'fil' && v.descriptionFil ? v.descriptionFil : v.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{v.category}</Badge>
                    <Badge variant="outline" className="text-xs">{v.labels.length} labels</Badge>
                  </div>
                </div>
                <ArrowUpRight className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'} group-hover:text-purple-500 transition-colors`} />
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
            <img src="/logo.png" alt="PIO DURAN EMS NCII" className="w-12 h-12 rounded-xl object-contain" />
            <div>
              <p className={`font-bold ${darkMode ? 'text-white' : ''}`}>PIO DURAN EMS NCII Reviewer</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Version 2.0.0</p>
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
                <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded object-contain" />
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
            PIO DURAN EMS NCII Reviewer • Study Hard, Save Lives • 2026
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}
