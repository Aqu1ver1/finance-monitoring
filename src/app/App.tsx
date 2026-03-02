import Navigation from '../pages/Navigation/Navigation'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ThemeProvider } from './provides/ThemeProvides'
import { useTransactionsStore } from '../entities/transactions/transactions.store'
import { useAuthStore } from '../store/authStore'
import { useTransactionsFromApi } from '../shared/api/hooks'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Budget = lazy(() => import('../pages/Budget'))
const Transactions = lazy(() => import('../pages/Transactions'))
const AddTransaction = lazy(() => import('../pages/AddTransaction'))
const Settings = lazy(() => import('../pages/Settings'))

type Screen = "dashboard" | "budget" | "transactions" | "add" | "settings";



function App() {

  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  const contentRef = useRef<HTMLDivElement>(null);
  const archivePastMonths = useTransactionsStore((state) => state.archivePastMonths);
  const setTransactions = useTransactionsStore((state) => state.setTransactions);
  const token = useAuthStore((state) => state.token);
  const { rehydrate, isLoading } = useAuthStore();
  const { data: transactionsFromApi } = useTransactionsFromApi();

  useEffect(() => {
    // Скролл наверх при смене экрана
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    
    // Для iOS Safari
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [activeScreen]);

  // Prefetch страниц
  useEffect(() => {
    const timer = setTimeout(() => {
      import('../pages/Budget')
      import('../pages/Transactions')
      import('../pages/AddTransaction')
      import('../pages/Settings')
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    archivePastMonths(new Date());
  }, [archivePastMonths]);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    if (!token || !transactionsFromApi) return;

    setTransactions(transactionsFromApi);
    archivePastMonths(new Date());
  }, [token, transactionsFromApi, setTransactions, archivePastMonths]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <ThemeProvider>
      <div className="flex flex-col min-w-full bg-white dark:bg-background">
        <div ref={contentRef} className='mb-16 overflow-auto'>
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background text-primary">Загрузка...</div>}>
          {activeScreen === "dashboard" && <Dashboard/>}
          {activeScreen === "budget" && <Budget />}
          {activeScreen === "transactions" && <Transactions />}
          {activeScreen === "add" && <AddTransaction onClose={() => setActiveScreen("dashboard")} />}
          {activeScreen === "settings" && <Settings />}
        </Suspense>
        </div>
        {activeScreen !== "add" && (
          <Navigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App