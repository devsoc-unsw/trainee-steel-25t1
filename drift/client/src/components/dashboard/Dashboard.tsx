import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Target,
  Users,
} from "lucide-react";
import DriftLogo from "../../assets/drift_logo.svg";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";

import Goals from "./Goals";
import CalendarPage from "./CalendarPage";
import SettingsPage from "./SettingsPage";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const name = localStorage.getItem("userName");
    if (!token) {
      navigate("/login");
      return;
    }
    setUsername(name || "User");
    const savedSidebarState = localStorage.getItem("sidebarCollapsed");
    if (savedSidebarState) setSidebarCollapsed(savedSidebarState === "true");
    else setSidebarCollapsed(window.innerWidth < 768);

    const handleResize = () => {
      if (window.innerWidth < 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Goals", icon: Target, path: "/dashboard/goals" },
    { name: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { name: "Placeholder", icon: BarChart3, path: "" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-drift-blue transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-20" : "w-64"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className={`flex h-16 items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} border-b border-drift-purple/30 px-4`}>
          <div className="flex items-center space-x-3">
            <img src={DriftLogo} alt="Drift logo" className="h-12 w-12" />
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
              className={`group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all ${location.pathname === item.path ? "bg-drift-purple text-white" : "text-white/80 hover:bg-drift-purple/40 hover:text-white"} ${sidebarCollapsed ? "justify-center" : ""}`}
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
                <button onClick={handleLogout} className="mt-1 flex items-center text-xs text-gray-300 hover:text-white">
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
                <button onClick={handleLogout} className="mt-1 flex items-center text-xs text-gray-300 hover:text-white">
                  <LogOut className="mr-1 h-3 w-3" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <button onClick={toggleMobileMenu} className="mr-2 rounded-md p-2 text-drift-blue hover:bg-gray-100 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="flex items-center rounded-lg bg-drift-orange px-3 py-2 text-sm font-medium text-white shadow-md hover:bg-drift-orange/90 transition-all hover:shadow-lg">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>New Goal</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<div><h2 className="text-2xl font-bold text-drift-purple">Hello, {username}!</h2><p className="text-gray-600">Welcome to your Drift dashboard.</p></div>} />
            <Route path="goals" element={<Goals />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      {mobileMenuOpen && <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" onClick={toggleMobileMenu}></div>}
    </div>
  );
};

export default Dashboard;
