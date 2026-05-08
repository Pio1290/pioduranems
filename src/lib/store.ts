import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/** Valid page names for navigation */
export type PageName =
  | 'home'
  | 'basic-competencies'
  | 'common-competencies'
  | 'core-competencies'
  | 'assessment'
  | 'practice-exam'
  | 'scenarios'
  | 'simulations'
  | 'acronyms'
  | 'definitions'
  | 'visualization'
  | 'assessment-scripts'
  | 'study-review'
  | 'infographic'
  | 'audio-reviewer'
  | 'bookmarks'
  | 'settings';

/** Supported languages */
export type Language = 'en' | 'fil';

/** A single study history entry */
export interface StudyHistoryEntry {
  date: string;
  page: string;
  topic: string;
}

/** A single completed quiz record */
export interface CompletedQuiz {
  quizId: string;
  score: number;
  date: string;
}

/** A single bookmarked item */
export interface BookmarkedItem {
  id: string;
  type: string;
  title: string;
}

/** A single assessment question */
export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  area: string;
  explanation?: string;
}

/** Current active assessment state */
export interface CurrentAssessment {
  questions: AssessmentQuestion[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  startTime: number;
  timeLimit: number;
  mode: 'practice' | 'timed' | 'review';
}

/** A single assessment result record */
export interface AssessmentResult {
  id: string;
  score: number;
  total: number;
  date: string;
  area: string;
  timeTaken: number;
  answers: (number | null)[];
}

/** Current active scenario state */
export interface CurrentScenario {
  scenarioId: string;
  currentNode: string;
  decisions: string[];
  score: number;
}

// ---------------------------------------------------------------------------
// Store State & Actions Interface
// ---------------------------------------------------------------------------

export interface AppStoreState {
  // --- Navigation ---
  currentPage: PageName;
  sidebarOpen: boolean;

  // --- Language ---
  language: Language;

  // --- Theme ---
  darkMode: boolean;

  // --- User Progress ---
  studyHistory: StudyHistoryEntry[];
  completedQuizzes: CompletedQuiz[];
  completedModules: string[];
  bookmarkedItems: BookmarkedItem[];
  weakAreas: string[];

  // --- Assessment ---
  currentAssessment: CurrentAssessment | null;
  assessmentResults: AssessmentResult[];

  // --- Scenario ---
  currentScenario: CurrentScenario | null;

  // --- Flashcard ---
  currentDeck: string | null;
  currentCardIndex: number;
  isFlipped: boolean;
}

export interface AppStoreActions {
  // --- Navigation actions ---
  setCurrentPage: (page: PageName) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // --- Language actions ---
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;

  // --- Theme actions ---
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;

  // --- User Progress actions ---
  addStudyHistoryEntry: (entry: StudyHistoryEntry) => void;
  clearStudyHistory: () => void;

  addCompletedQuiz: (quiz: CompletedQuiz) => void;
  removeCompletedQuiz: (quizId: string) => void;
  clearCompletedQuizzes: () => void;

  addCompletedModule: (moduleId: string) => void;
  removeCompletedModule: (moduleId: string) => void;
  clearCompletedModules: () => void;

  addBookmarkedItem: (item: BookmarkedItem) => void;
  removeBookmarkedItem: (id: string) => void;
  clearBookmarkedItems: () => void;

  addWeakArea: (area: string) => void;
  removeWeakArea: (area: string) => void;
  clearWeakAreas: () => void;

  // --- Assessment actions ---
  startAssessment: (assessment: CurrentAssessment) => void;
  answerQuestion: (questionIndex: number, answer: number | null) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishAssessment: (result: AssessmentResult) => void;
  clearCurrentAssessment: () => void;
  removeAssessmentResult: (id: string) => void;
  clearAssessmentResults: () => void;

  // --- Scenario actions ---
  startScenario: (scenario: CurrentScenario) => void;
  setCurrentScenarioNode: (node: string) => void;
  addScenarioDecision: (decision: string) => void;
  setScenarioScore: (score: number) => void;
  clearCurrentScenario: () => void;

  // --- Flashcard actions ---
  setCurrentDeck: (deckId: string | null) => void;
  setCurrentCardIndex: (index: number) => void;
  nextCard: () => void;
  previousCard: () => void;
  setIsFlipped: (flipped: boolean) => void;
  toggleFlip: () => void;
  resetFlashcard: () => void;

  // --- Global actions ---
  resetProgress: () => void;
  resetAll: () => void;
}

// ---------------------------------------------------------------------------
// Default State
// ---------------------------------------------------------------------------

const defaultState: AppStoreState = {
  // Navigation
  currentPage: 'home',
  sidebarOpen: false,

  // Language
  language: 'en',

  // Theme
  darkMode: false,

  // User Progress
  studyHistory: [],
  completedQuizzes: [],
  completedModules: [],
  bookmarkedItems: [],
  weakAreas: [],

  // Assessment
  currentAssessment: null,
  assessmentResults: [],

  // Scenario
  currentScenario: null,

  // Flashcard
  currentDeck: null,
  currentCardIndex: 0,
  isFlipped: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppStoreState & AppStoreActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // -----------------------------------------------------------------------
      // Navigation actions
      // -----------------------------------------------------------------------
      setCurrentPage: (page) =>
        set({ currentPage: page }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      // -----------------------------------------------------------------------
      // Language actions
      // -----------------------------------------------------------------------
      setLanguage: (language) =>
        set({ language }),

      toggleLanguage: () =>
        set((state) => ({
          language: state.language === 'en' ? 'fil' : 'en',
        })),

      // -----------------------------------------------------------------------
      // Theme actions
      // -----------------------------------------------------------------------
      setDarkMode: (darkMode) =>
        set({ darkMode }),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      // -----------------------------------------------------------------------
      // User Progress – Study History
      // -----------------------------------------------------------------------
      addStudyHistoryEntry: (entry) =>
        set((state) => ({
          studyHistory: [...state.studyHistory, entry],
        })),

      clearStudyHistory: () =>
        set({ studyHistory: [] }),

      // -----------------------------------------------------------------------
      // User Progress – Completed Quizzes
      // -----------------------------------------------------------------------
      addCompletedQuiz: (quiz) =>
        set((state) => ({
          completedQuizzes: [...state.completedQuizzes, quiz],
        })),

      removeCompletedQuiz: (quizId) =>
        set((state) => ({
          completedQuizzes: state.completedQuizzes.filter(
            (q) => q.quizId !== quizId
          ),
        })),

      clearCompletedQuizzes: () =>
        set({ completedQuizzes: [] }),

      // -----------------------------------------------------------------------
      // User Progress – Completed Modules
      // -----------------------------------------------------------------------
      addCompletedModule: (moduleId) =>
        set((state) => {
          if (state.completedModules.includes(moduleId)) return state;
          return {
            completedModules: [...state.completedModules, moduleId],
          };
        }),

      removeCompletedModule: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.filter(
            (id) => id !== moduleId
          ),
        })),

      clearCompletedModules: () =>
        set({ completedModules: [] }),

      // -----------------------------------------------------------------------
      // User Progress – Bookmarked Items
      // -----------------------------------------------------------------------
      addBookmarkedItem: (item) =>
        set((state) => {
          if (state.bookmarkedItems.some((b) => b.id === item.id)) return state;
          return {
            bookmarkedItems: [...state.bookmarkedItems, item],
          };
        }),

      removeBookmarkedItem: (id) =>
        set((state) => ({
          bookmarkedItems: state.bookmarkedItems.filter((b) => b.id !== id),
        })),

      clearBookmarkedItems: () =>
        set({ bookmarkedItems: [] }),

      // -----------------------------------------------------------------------
      // User Progress – Weak Areas
      // -----------------------------------------------------------------------
      addWeakArea: (area) =>
        set((state) => {
          if (state.weakAreas.includes(area)) return state;
          return {
            weakAreas: [...state.weakAreas, area],
          };
        }),

      removeWeakArea: (area) =>
        set((state) => ({
          weakAreas: state.weakAreas.filter((a) => a !== area),
        })),

      clearWeakAreas: () =>
        set({ weakAreas: [] }),

      // -----------------------------------------------------------------------
      // Assessment actions
      // -----------------------------------------------------------------------
      startAssessment: (assessment) =>
        set({ currentAssessment: assessment }),

      answerQuestion: (questionIndex, answer) =>
        set((state) => {
          if (!state.currentAssessment) return state;
          const updatedAnswers = [...state.currentAssessment.answers];
          updatedAnswers[questionIndex] = answer;
          return {
            currentAssessment: {
              ...state.currentAssessment,
              answers: updatedAnswers,
            },
          };
        }),

      goToQuestion: (index) =>
        set((state) => {
          if (!state.currentAssessment) return state;
          return {
            currentAssessment: {
              ...state.currentAssessment,
              currentQuestionIndex: index,
            },
          };
        }),

      nextQuestion: () =>
        set((state) => {
          if (!state.currentAssessment) return state;
          const nextIndex = Math.min(
            state.currentAssessment.currentQuestionIndex + 1,
            state.currentAssessment.questions.length - 1
          );
          return {
            currentAssessment: {
              ...state.currentAssessment,
              currentQuestionIndex: nextIndex,
            },
          };
        }),

      previousQuestion: () =>
        set((state) => {
          if (!state.currentAssessment) return state;
          const prevIndex = Math.max(
            state.currentAssessment.currentQuestionIndex - 1,
            0
          );
          return {
            currentAssessment: {
              ...state.currentAssessment,
              currentQuestionIndex: prevIndex,
            },
          };
        }),

      finishAssessment: (result) =>
        set((state) => ({
          currentAssessment: null,
          assessmentResults: [...state.assessmentResults, result],
        })),

      clearCurrentAssessment: () =>
        set({ currentAssessment: null }),

      removeAssessmentResult: (id) =>
        set((state) => ({
          assessmentResults: state.assessmentResults.filter((r) => r.id !== id),
        })),

      clearAssessmentResults: () =>
        set({ assessmentResults: [] }),

      // -----------------------------------------------------------------------
      // Scenario actions
      // -----------------------------------------------------------------------
      startScenario: (scenario) =>
        set({ currentScenario: scenario }),

      setCurrentScenarioNode: (node) =>
        set((state) => {
          if (!state.currentScenario) return state;
          return {
            currentScenario: {
              ...state.currentScenario,
              currentNode: node,
            },
          };
        }),

      addScenarioDecision: (decision) =>
        set((state) => {
          if (!state.currentScenario) return state;
          return {
            currentScenario: {
              ...state.currentScenario,
              decisions: [...state.currentScenario.decisions, decision],
            },
          };
        }),

      setScenarioScore: (score) =>
        set((state) => {
          if (!state.currentScenario) return state;
          return {
            currentScenario: {
              ...state.currentScenario,
              score,
            },
          };
        }),

      clearCurrentScenario: () =>
        set({ currentScenario: null }),

      // -----------------------------------------------------------------------
      // Flashcard actions
      // -----------------------------------------------------------------------
      setCurrentDeck: (deckId) =>
        set({ currentDeck: deckId, currentCardIndex: 0, isFlipped: false }),

      setCurrentCardIndex: (index) =>
        set({ currentCardIndex: index }),

      nextCard: () =>
        set((state) => ({
          currentCardIndex: state.currentCardIndex + 1,
          isFlipped: false,
        })),

      previousCard: () =>
        set((state) => ({
          currentCardIndex: Math.max(state.currentCardIndex - 1, 0),
          isFlipped: false,
        })),

      setIsFlipped: (flipped) =>
        set({ isFlipped: flipped }),

      toggleFlip: () =>
        set((state) => ({ isFlipped: !state.isFlipped })),

      resetFlashcard: () =>
        set({
          currentDeck: null,
          currentCardIndex: 0,
          isFlipped: false,
        }),

      // -----------------------------------------------------------------------
      // Global actions
      // -----------------------------------------------------------------------

      /** Reset all user progress data while preserving navigation & preferences */
      resetProgress: () =>
        set({
          studyHistory: [],
          completedQuizzes: [],
          completedModules: [],
          bookmarkedItems: [],
          weakAreas: [],
          currentAssessment: null,
          assessmentResults: [],
          currentScenario: null,
          currentDeck: null,
          currentCardIndex: 0,
          isFlipped: false,
        }),

      /** Reset the entire store back to defaults */
      resetAll: () => set(defaultState),
    }),
    {
      name: 'ems-nc2-reviewer-storage',
      version: 1,
      partialize: (state) => ({
        // Persist all state except transient session data
        currentPage: state.currentPage,
        language: state.language,
        darkMode: state.darkMode,
        studyHistory: state.studyHistory,
        completedQuizzes: state.completedQuizzes,
        completedModules: state.completedModules,
        bookmarkedItems: state.bookmarkedItems,
        weakAreas: state.weakAreas,
        assessmentResults: state.assessmentResults,
        // Do NOT persist: sidebarOpen, currentAssessment, currentScenario, flashcard state
        // These are transient session state that should reset on reload
      }),
    }
  )
);
