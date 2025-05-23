"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BarChart3, Calendar, ChevronLeft, ChevronRight, Home, LogOut, Menu, Settings, Target } from "lucide-react"
import DriftLogo from "../../assets/drift_logo.svg"
import MakeItHappenFloat from "../../assets/makeithappen_float.svg"
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom"

import Goals from "./Goals"
import CalendarPage from "./CalendarPage"
import SettingsPage from "./SettingsPage"

// Simple FloatingBoat component
const FloatingBoat = () => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Wind effects */}
      <div className="absolute z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-1/4 w-16 h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-windGust1"></div>
        <div className="absolute right-5 top-1/3 w-12 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-windGust2"></div>
        <div className="absolute left-10 top-2/3 w-14 h-[1px] bg-gradient-to-r from-white/0 via-white/25 to-white/0 animate-windGust3"></div>
      </div>
      
      {/* Boat with wind-drift animation */}
      <div className="relative animate-windDrift">
        <img src={DriftLogo || "/placeholder.svg"} alt="Drift logo" className="h-40 w-40" />
      </div>
      
      {/* Natural water with curved edges - moved closer to boat */}
      <div className="w-full -mt-4 overflow-visible">
        {/* Organic water surface with irregular edges */}
        <div className="relative h-3 overflow-visible">
          {/* Main water curve - reduced height */}
          <div className="absolute left-1/2 -translate-x-1/2 w-48 h-3 overflow-hidden">
            <div className="w-48 h-6 rounded-[100%] bg-gradient-to-b from-white/10 to-transparent"></div>
          </div>
          
          {/* Irregular ripple effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-[100%] animate-ripple transform-gpu"></div>
          </div>
          
          {/* Smaller natural waves */}
          <div className="absolute top-1 left-[40%] w-16 h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-tinyWave1"></div>
          </div>
          <div className="absolute top-1 right-[42%] w-14 h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full animate-tinyWave2"></div>
          </div>
          
          {/* Small glistening highlights */}
          <div className="absolute top-0 left-[30%] w-1 h-1 bg-white/40 rounded-full animate-glisten1"></div>
          <div className="absolute top-1 right-[35%] w-[2px] h-[2px] bg-white/50 rounded-full animate-glisten2"></div>
        </div>
        
        {/* Boat reflection with natural water distortion - moved up */}
        <div className="relative flex justify-center -mt-11">
          {/* The reflection itself */}
          <div className="animate-reflectionWind">
            <img 
              src={DriftLogo || "/placeholder.svg"} 
              alt="Reflection" 
              className="h-40 w-40 scale-y-[-1] opacity-40 blur-[1px]" 
            />
          </div>
          
          {/* Water movement lines */}
          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full animate-waveSlowA"></div>
            <div className="h-[1px] w-3/4 mx-auto bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-full animate-waveSlowB"></div>
            <div className="h-[1px] w-4/5 ml-auto bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-waveFast"></div>
            <div className="h-[1px] w-2/3 mr-auto bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full animate-waveMed"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Magical Make It Happen Button component
interface MagicalButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled: boolean;
}

const MagicalButton: React.FC<MagicalButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="relative">
      {/* Floating magical elements */}
      <div className="absolute inset-0 -top-8 -left-6 -right-6 -bottom-8 pointer-events-none">
        <img 
          src={MakeItHappenFloat} 
          alt="Magical elements" 
          className="w-full h-full object-contain animate-magicalFloat opacity-80"
        />
      </div>
      
      {/* Glowing effects */}
      <div className="absolute inset-0 rounded-full bg-white/10 blur-md animate-glow"></div>
      
      {/* Sparkles */}
      <div className="absolute -top-2 left-1/4 w-1 h-1 bg-white rounded-full animate-sparkle1"></div>
      <div className="absolute -top-3 left-2/3 w-2 h-2 bg-white rounded-full animate-sparkle2"></div>
      <div className="absolute -bottom-2 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-sparkle3"></div>
      
      {/* Button itself */}
      <button
        onClick={onClick}
        disabled={disabled}
        className="relative px-8 py-5 bg-white/20 backdrop-blur-md text-white rounded-full text-xl font-medium 
                  hover:bg-white/30 transition-all duration-300 w-72 shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed
                  border border-white/30 z-10
                  group"
      >
        <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
          Make It Happen
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-drift-pink/40 via-drift-purple/30 to-drift-orange/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </button>
    </div>
  );
};

interface GoalFormData {
  objective: string
  startDate: string
  endDate: string
  hoursPerDay: string
}

const Dashboard = () => {
  const [username, setUsername] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState<GoalFormData>({
    objective: "",
    startDate: "",
    endDate: "",
    hoursPerDay: "",
  })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    const name = localStorage.getItem("userName")
    if (!token) {
      navigate("/login")
      return
    }
    setUsername(name || "User")
    const savedSidebarState = localStorage.getItem("sidebarCollapsed")
    if (savedSidebarState) setSidebarCollapsed(savedSidebarState === "true")
    else setSidebarCollapsed(window.innerWidth < 768)

    const handleResize = () => {
      if (window.innerWidth < 768) setMobileMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.objective || !formData.startDate || !formData.endDate || !formData.hoursPerDay) {
      return // Don't submit if missing required fields
    }

    // Store form data in localStorage temporarily
    localStorage.setItem("goalData", JSON.stringify(formData))

    // Navigate to schedule page
    navigate("/schedule")
  }

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Goals", icon: Target, path: "/dashboard/goals" },
    { name: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { name: "Placeholder", icon: BarChart3, path: "" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue">
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-drift-blue transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div
          className={`flex h-16 items-center ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          } border-b border-drift-purple/30 px-4`}
        >
          <div className="flex items-center space-x-3">
            <img src={DriftLogo || "/placeholder.svg"} alt="Drift logo" className="h-12 w-12" />
            {!sidebarCollapsed && <span className="text-xl font-bold text-white">Drift</span>}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white hover:bg-drift-purple/30 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-drift-orange text-white shadow-md hover:bg-drift-pink transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-drift-purple text-white"
                  : "text-white/80 hover:bg-drift-purple/40 hover:text-white"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className={`border-t border-drift-purple/30 p-4 ${sidebarCollapsed ? "flex justify-center" : ""}`}>
          {sidebarCollapsed ? (
            <div className="group relative">
              <div className="h-10 w-10 cursor-pointer rounded-full bg-drift-mauve flex items-center justify-center text-white font-medium shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded-md bg-drift-purple px-3 py-2 text-xs text-white shadow-md group-hover:block">
                <p>{username}</p>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex items-center text-xs text-gray-300 hover:text-white"
                >
                  <LogOut className="mr-1 h-3 w-3" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-drift-mauve flex items-center justify-center text-white font-medium shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{username}</p>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex items-center text-xs text-gray-300 hover:text-white"
                >
                  <LogOut className="mr-1 h-3 w-3" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <header className="sticky top-0 z-10 bg-transparent">
          <div className="flex h-12 items-center px-4 md:px-6">
            <button onClick={toggleMobileMenu} className="rounded-md p-2 text-white hover:bg-white/10 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-0 md:pt-2">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center min-h-[80vh]">
                  <div className="w-full md:w-1/2 p-6 pt-2">
                    <div className="space-y-8 text-white">
                      <div className="space-y-5">
                        <h2 className="text-3xl font-bold">What do you want to acheive?</h2>
                        <input
                          type="text"
                          name="objective"
                          value={formData.objective}
                          onChange={handleChange}
                          placeholder="describe your goal"
                          className="w-full px-5 py-4 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                        />
                      </div>

                      <div className="space-y-5">
                        <h2 className="text-2xl font-medium">When do you want to achieve this by?</h2>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex flex-col space-y-1 flex-grow">
                            <label htmlFor="startDate" className="text-sm opacity-80">
                              Start date
                            </label>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              className="px-6 py-3 bg-drift-blue/40 text-white rounded-md hover:bg-drift-blue/60 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-white/50 border-none"
                            />
                          </div>

                          <div className="flex flex-col space-y-1 flex-grow">
                            <label htmlFor="endDate" className="text-sm opacity-80">
                              End date
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              className="px-6 py-3 bg-drift-blue/40 text-white rounded-md hover:bg-drift-blue/60 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-white/50 border-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <h2 className="text-2xl font-medium">How dedicated are you?</h2>
                        <input
                          type="text"
                          name="hoursPerDay"
                          value={formData.hoursPerDay}
                          onChange={handleChange}
                          placeholder="number of hours per day"
                          className="w-full px-5 py-4 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative py-8">
                    <div className="mb-10">
                      {/* Replace static logo with animated floating boat */}
                      <FloatingBoat />
                    </div>

                    <MagicalButton
                      onClick={handleSubmit}
                      disabled={
                        !formData.objective || !formData.startDate || !formData.endDate || !formData.hoursPerDay
                      }
                    />
                  </div>
                </div>
              }
            />
            <Route path="goals" element={<Goals />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" onClick={toggleMobileMenu}></div>
      )}
    </div>
  )
}

export default Dashboard
