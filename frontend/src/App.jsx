
import Login from './pages/Login'
import Opportunities from './pages/Opportunities'
import Bids from './pages/Bids'
import Projects from './pages/Projects'
import Meetings from './pages/Meetings'
import IRF from './pages/IRF'

import { useState, useEffect } from 'react'

import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  CalendarDays,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react'

import {
  getDashboardSummary,
  getIrfSummary,
  getDashboardAnalytics,
  getDashboardRecent,
} from './api/dashboard'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Opportunities', icon: BriefcaseBusiness },
  { name: 'Bids', icon: FileText },
  { name: 'Projects', icon: FolderKanban },
  { name: 'Meetings', icon: CalendarDays },
  { name: 'IRF', icon: ClipboardCheck },
]

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [token, setToken] = useState(null)

  // Dashboard data
  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [irfSummary, setIrfSummary] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [recent, setRecent] = useState(null)

  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState('')
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0)

  function handleLogin(newToken) {
    setToken(newToken)
    setActivePage('Dashboard')
  }

  function handleLogout() {
    setToken(null)
    setDashboardSummary(null)
    setIrfSummary(null)
    setAnalytics(null)
    setRecent(null)
    setDashboardError('')
    setDashboardLoading(false)
    setActivePage('Dashboard')
    setSidebarOpen(false)
  }

  // Refresh dashboard whenever module data changes
  function handleDataChanged() {
    setDashboardRefreshKey((previous) => previous + 1)
  }

  // Load all dashboard endpoints
  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function loadDashboard() {
      setDashboardLoading(true)
      setDashboardError('')

      try {
        const [summaryData, irfData, analyticsData, recentData] =
          await Promise.all([
            getDashboardSummary(token),
            getIrfSummary(token),
            getDashboardAnalytics(token),
            getDashboardRecent(token),
          ])

        if (!cancelled) {
          setDashboardSummary(summaryData)
          setIrfSummary(irfData)
          setAnalytics(analyticsData)
          setRecent(recentData)
        }
      } catch (error) {
        if (!cancelled) {
          setDashboardError(
            error.message || 'Failed to load dashboard'
          )
        }
      } finally {
        if (!cancelled) {
          setDashboardLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [token, dashboardRefreshKey])

  // Show login page if not authenticated
  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  const summaryCards = [
    {
      title: 'Total Opportunities',
      value: dashboardSummary?.activeOpportunities,
      icon: BriefcaseBusiness,
    },
    {
      title: 'Total Bids',
      value: dashboardSummary?.activeBids,
      icon: FileText,
    },
    {
      title: 'Active Projects',
      value: dashboardSummary?.runningProjects,
      icon: FolderKanban,
    },
    {
      title: 'Pending IRFs',
      value: irfSummary?.pendingIrfs,
      icon: ClipboardCheck,
    },
  ]

  const bidAnalytics = [
    {
      title: 'Won Bids',
      value: analytics?.wonBids,
      icon: CheckCircle2,
      color: 'text-green-600',
      background: 'bg-green-50',
    },
    {
      title: 'Lost Bids',
      value: analytics?.lostBids,
      icon: XCircle,
      color: 'text-red-600',
      background: 'bg-red-50',
    },
    {
      title: 'Pending Bids',
      value: analytics?.pendingBids,
      icon: Clock3,
      color: 'text-amber-600',
      background: 'bg-amber-50',
    },
  ]

  const projectAnalytics = [
    {
      title: 'Planned',
      value: analytics?.plannedProjects,
    },
    {
      title: 'Active',
      value: analytics?.activeProjects,
    },
    {
      title: 'On Hold',
      value: analytics?.onHoldProjects,
    },
    {
      title: 'Completed',
      value: analytics?.completedProjects,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100 md:flex">

      {/* Mobile menu */}
      <div className="flex items-center justify-between bg-slate-900 p-4 text-white md:hidden">
        <span className="text-xl font-bold">PBMS</span>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 shrink-0 bg-slate-900 text-white md:flex md:min-h-screen md:flex-col ${
          sidebarOpen ? 'flex flex-col' : 'hidden'
        }`}
      >
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold">PBMS</h1>

          <p className="mt-1 text-xs text-slate-400">
            Project Bid Management System
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => {
                  setActivePage(item.name)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activePage === item.name
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            {activePage}
          </h2>

          <p className="mt-2 text-slate-500">
            Welcome to the Project Bid Management System
          </p>
        </div>

        {activePage === 'Dashboard' ? (
          <div className="space-y-8">

            {/* Dashboard heading and refresh */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Dashboard Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor opportunities, bids, projects and approvals.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDataChanged}
                disabled={dashboardLoading}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={17} />
                {dashboardLoading ? 'Refreshing...' : 'Refresh Dashboard'}
              </button>
            </div>

            {/* Dashboard error */}
            {dashboardError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600"
              >
                {dashboardError}
              </div>
            )}

            {/* Main statistics */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.title}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>

                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-3xl font-bold text-slate-800">
                      {dashboardLoading
                        ? 'Loading...'
                        : (card.value ?? '—')}
                    </h3>
                  </div>
                )
              })}
            </div>

            {/* Bid analytics */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={21} className="text-blue-600" />

                <h3 className="text-xl font-semibold text-slate-800">
                  Bid Analytics
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {bidAnalytics.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-xl bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-600">
                          {item.title}
                        </p>

                        <div className={`rounded-lg p-2 ${item.background} ${item.color}`}>
                          <Icon size={20} />
                        </div>
                      </div>

                      <p className="mt-4 text-3xl font-bold text-slate-800">
                        {dashboardLoading
                          ? 'Loading...'
                          : (item.value ?? '—')}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Project analytics */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-slate-800">
                Project Status Overview
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {projectAnalytics.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-slate-800">
                      {dashboardLoading
                        ? 'Loading...'
                        : (item.value ?? '—')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent activity */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-slate-800">
                Recent Activities
              </h3>

              <div className="grid gap-6 xl:grid-cols-3">

                {/* Recent opportunities */}
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <h4 className="mb-4 font-semibold text-slate-800">
                    Recent Opportunities
                  </h4>

                  {dashboardLoading ? (
                    <p className="text-sm text-slate-500">Loading...</p>
                  ) : !recent ? (
                    <p className="text-sm text-slate-500">
                      Data unavailable
                    </p>
                  ) : recent.recentOpportunities?.length ? (
                    <div className="space-y-3">
                      {recent.recentOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="border-b border-slate-100 pb-3 last:border-0"
                        >
                          <p className="text-sm font-medium text-slate-800">
                            {opportunity.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {opportunity.clientName || 'No client'}
                            {' • '}
                            {opportunity.status || 'No status'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No recent opportunities
                    </p>
                  )}
                </div>

                {/* Recent bids */}
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <h4 className="mb-4 font-semibold text-slate-800">
                    Recent Bids
                  </h4>

                  {dashboardLoading ? (
                    <p className="text-sm text-slate-500">Loading...</p>
                  ) : !recent ? (
                    <p className="text-sm text-slate-500">
                      Data unavailable
                    </p>
                  ) : recent.recentBids?.length ? (
                    <div className="space-y-3">
                      {recent.recentBids.map((bid) => (
                        <div
                          key={bid.id}
                          className="border-b border-slate-100 pb-3 last:border-0"
                        >
                          <p className="text-sm font-medium text-slate-800">
                            {bid.tenderNo}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {bid.clientName || 'No client'}
                            {' • '}
                            {bid.outcome || 'No outcome'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No recent bids
                    </p>
                  )}
                </div>

                {/* Recent meetings */}
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <h4 className="mb-4 font-semibold text-slate-800">
                    Recent Meetings
                  </h4>

                  {dashboardLoading ? (
                    <p className="text-sm text-slate-500">Loading...</p>
                  ) : !recent ? (
                    <p className="text-sm text-slate-500">
                      Data unavailable
                    </p>
                  ) : recent.recentMeetings?.length ? (
                    <div className="space-y-3">
                      {recent.recentMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="border-b border-slate-100 pb-3 last:border-0"
                        >
                          <p className="text-sm font-medium text-slate-800">
                            {meeting.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {meeting.decision || 'No decision'}
                            {' • '}
                            {meeting.meetingDateTime
                              ? String(meeting.meetingDateTime).replace('T', ' ')
                              : 'No date'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No recent meetings
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

        ) : activePage === 'Opportunities' ? (
          <Opportunities
            token={token}
            onDataChanged={handleDataChanged}
          />

        ) : activePage === 'Bids' ? (
          <Bids
            token={token}
            onDataChanged={handleDataChanged}
          />

        ) : activePage === 'Projects' ? (
          <Projects
            token={token}
            onDataChanged={handleDataChanged}
          />

        ) : activePage === 'Meetings' ? (
          <Meetings
            token={token}
            onDataChanged={handleDataChanged}
          />

        ) : activePage === 'IRF' ? (
          <IRF
            token={token}
            onDataChanged={handleDataChanged}
          />

        ) : (
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">
              {activePage} Management
            </h3>

            <p className="mt-3 text-slate-500">
              We will build this module in the next steps.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
