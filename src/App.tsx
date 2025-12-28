import Navigation from './components/Navigation/Navigation'
import { lazy, Suspense,useState } from 'react'
import type { Screen } from './shared/types/types'
import { ThemeProvider } from './shared/context/ThemeContext'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Budget = lazy(() => import('./pages/Budget'))
const Transactions = lazy(() => import('./pages/Transactions'))
const AddTransaction = lazy(() => import('./pages/AddTransaction'))
const Settings = lazy(() => import('./pages/Settings'))


function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col min-w-full bg-white dark:bg-background">
        {/* Content Area */}
        <Suspense fallback={null}>
          {activeScreen === "dashboard" && <Dashboard/>}
          {activeScreen === "budget" && <Budget />}
          {activeScreen === "transactions" && <Transactions />}
          {activeScreen === "add" && <AddTransaction onClose={() => setActiveScreen("dashboard")} />}
          {activeScreen === "settings" && <Settings />}
        </Suspense>

        {/* Bottom Navigation */}
        {activeScreen !== "add" && (
          <Navigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
