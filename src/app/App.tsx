import Navigation from '../pages/Navigation/Navigation'
import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { ThemeProvider } from './provides/ThemeProvides'
import { initUserStore } from '../features/addUser/user.store'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Budget = lazy(() => import('../pages/Budget'))
const Transactions = lazy(() => import('../pages/Transactions'))
const AddTransaction = lazy(() => import('../pages/AddTransaction'))
const Settings = lazy(() => import('../pages/Settings'))

type Screen = "dashboard" | "budget" | "transactions" | "add" | "settings";

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  const contentRef = useRef<HTMLDivElement>(null);
  initUserStore();

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

  return (
    <ThemeProvider>
      <div className="flex flex-col min-w-full bg-white dark:bg-background">
        <div ref={contentRef} className='mb-16 overflow-auto'>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка...</div>}>
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