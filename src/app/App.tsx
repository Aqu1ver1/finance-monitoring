import Navigation from '../pages/Navigation/Navigation'
import { lazy, Suspense,useState } from 'react'
import { ThemeProvider } from './provides/ThemeProvides'
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Budget = lazy(() => import('../pages/Budget'))
const Transactions = lazy(() => import('../pages/Transactions'))
const AddTransaction = lazy(() => import('../pages/AddTransaction'))
const Settings = lazy(() => import('../pages/Settings'))
type Screen = "dashboard" | "budget" | "transactions" | "add" | "settings";

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  return (
    <ThemeProvider>
      <div className="flex flex-col min-w-full bg-white dark:bg-background">
        {/* Content Area */}
        <div className='mb-16'>
        <Suspense fallback={null}>
          {activeScreen === "dashboard" && <Dashboard/>}
          {activeScreen === "budget" && <Budget />}
          {activeScreen === "transactions" && <Transactions />}
          {activeScreen === "add" && <AddTransaction onClose={() => setActiveScreen("dashboard")} />}
          {activeScreen === "settings" && <Settings />}
        </Suspense>
        </div>
        {/* Bottom Navigation */}
        {activeScreen !== "add" && (
          <Navigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
