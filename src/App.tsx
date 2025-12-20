
import Budget from './pages/Budget'
import Dashboard from './pages/Dashboard'
import Navigation from './components/Navigation/Navigation'
import AddTransaction from './pages/AddTransactions'
import Transactions from './pages/Transactions'
import { useState } from 'react'
import Settings from './pages/Settings'
import type { Screen } from './shared/types/index'
import { ThemeProvider } from './shared/context/ThemeContext'


function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col min-w-full bg-white dark:bg-background">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-background">
          {activeScreen === "dashboard" && <Dashboard/>}
          {activeScreen === "budget" && <Budget />}
          {activeScreen === "transactions" && <Transactions />}
          {activeScreen === "add" && <AddTransaction onClose={() => setActiveScreen("dashboard")} />}
          {activeScreen === "settings" && <Settings />}
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
