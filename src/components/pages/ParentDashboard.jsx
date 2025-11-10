import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Chart from "react-apexcharts"
import { format, subDays, isToday } from "date-fns"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import ApperIcon from "@/components/ApperIcon"
import { setProfiles } from "@/store/slices/childProfileSlice"
import { setSettings } from "@/store/slices/parentSettingsSlice"
import childProfileService from "@/services/api/childProfileService"
import gameProgressService from "@/services/api/gameProgressService"
import achievementService from "@/services/api/achievementService"
import dailyGoalService from "@/services/api/dailyGoalService"
import parentSettingsService from "@/services/api/parentSettingsService"

const ParentDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { profiles } = useSelector(state => state.childProfile)
  const { settings } = useSelector(state => state.parentSettings)
  
  const [selectedChild, setSelectedChild] = useState(null)
  const [dashboardData, setDashboardData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load profiles
      const profilesData = await childProfileService.getAll()
      dispatch(setProfiles(profilesData))
      
      // Load parent settings
      const settingsData = await parentSettingsService.get()
      dispatch(setSettings(settingsData))
      
      // Set first child as selected if none selected
      if (!selectedChild && profilesData.length > 0) {
        setSelectedChild(profilesData[0])
      }
      
      // Load dashboard data for selected child
      if (selectedChild || profilesData.length > 0) {
        const child = selectedChild || profilesData[0]
        await loadChildData(child)
      }
      
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }
  
  const loadChildData = async (child) => {
    try {
      // Load game progress
      const progressData = await gameProgressService.getByProfileId(child.Id)
      
      // Load achievements
      const achievementsData = await achievementService.getByProfileId(child.Id)
      
      // Load weekly goals
      const weeklyGoals = await dailyGoalService.getWeeklyProgress(child.Id)
      
      // Process data for charts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i)
        return format(date, 'yyyy-MM-dd')
      })
      
      const dailyActivity = last7Days.map(date => {
        const dayProgress = progressData.filter(p => {
          const playedDate = format(new Date(p.lastPlayedAt), 'yyyy-MM-dd')
          return playedDate === date
        })
        return {
          date,
          games: dayProgress.length,
          accuracy: dayProgress.length > 0 
            ? dayProgress.reduce((sum, p) => sum + p.averageAccuracy, 0) / dayProgress.length
            : 0
        }
      })
      
      const worldStats = {
        math: progressData.filter(p => p.worldId === "math"),
        reading: progressData.filter(p => p.worldId === "reading")
      }
      
      setDashboardData({
        totalGamesSessions: progressData.reduce((sum, p) => sum + p.attemptsCount, 0),
        averageAccuracy: progressData.length > 0 
          ? progressData.reduce((sum, p) => sum + p.averageAccuracy, 0) / progressData.length
          : 0,
        totalTimeSpent: progressData.length * 8, // Estimate 8 minutes per game
        recentAchievements: achievementsData.slice(-3),
        dailyActivity,
        worldStats,
        weeklyGoals: weeklyGoals.slice(-7),
        streakDays: weeklyGoals.filter(g => g.isComplete).length
      })
      
    } catch (err) {
      console.error("Failed to load child data:", err)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  useEffect(() => {
    if (selectedChild) {
      loadChildData(selectedChild)
    }
  }, [selectedChild])
  
  const handleLogout = () => {
    toast.info("Logged out of parent dashboard")
    navigate("/parent")
  }
  
  const handleChildSelect = (child) => {
    setSelectedChild(child)
  }
  
  if (!settings) {
    navigate("/parent")
    return null
  }
  
  if (loading) {
    return <Loading message="Loading parent dashboard..." />
  }
  
  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }
  
  const tabs = [
    { id: "overview", label: "Overview", icon: "BarChart3" },
    { id: "progress", label: "Progress", icon: "TrendingUp" },
    { id: "settings", label: "Settings", icon: "Settings" }
  ]
  
  // Chart configurations
  const activityChartOptions = {
    chart: { type: 'line', toolbar: { show: false }, sparkline: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#FF6B9D', '#4ECDC4'],
    xaxis: {
      categories: dashboardData.dailyActivity?.map(d => format(new Date(d.date), 'MMM dd')) || [],
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: { labels: { style: { fontSize: '12px' } } },
    grid: { strokeDashArray: 3 },
    legend: { position: 'top' }
  }
  
  const activityChartSeries = [
    {
      name: 'Games Played',
      data: dashboardData.dailyActivity?.map(d => d.games) || []
    },
    {
      name: 'Avg Accuracy %',
      data: dashboardData.dailyActivity?.map(d => Math.round(d.accuracy)) || []
    }
  ]
  
  const worldProgressOptions = {
    chart: { type: 'donut' },
    colors: ['#FF6B9D', '#4ECDC4'],
    labels: ['Math World', 'Reading Land'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%` }
  }
  
  const worldProgressSeries = [
    dashboardData.worldStats?.math?.length || 0,
    dashboardData.worldStats?.reading?.length || 0
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
                <p className="text-sm text-gray-600">Monitor your child's learning progress</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")} icon="Home">
                Kids Area
              </Button>
              <Button variant="secondary" onClick={handleLogout} icon="LogOut">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Child Selector */}
        {profiles.length > 1 && (
          <Card className="p-6 mb-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Viewing progress for:</h3>
              <div className="flex space-x-3">
                {profiles.map((child) => (
                  <button
                    key={child.Id}
                    onClick={() => handleChildSelect(child)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      selectedChild?.Id === child.Id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Avatar avatarId={child.avatarId} size="sm" showBorder={false} />
                    <span className="font-medium">{child.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}
        
        {selectedChild && (
          <>
            {/* Child Header */}
            <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-6">
                <Avatar avatarId={selectedChild.avatarId} size="xl" />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedChild.name}</h2>
                  <p className="text-gray-600 mb-4">Age {selectedChild.age}</p>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedChild.totalStars}</div>
                      <div className="text-sm text-gray-600">Stars Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{selectedChild.totalCoins}</div>
                      <div className="text-sm text-gray-600">Coins Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{dashboardData.streakDays || 0}</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ApperIcon name={tab.icon} className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Play" className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Game Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.totalGamesSessions || 0}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Target" className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(dashboardData.averageAccuracy || 0)}%</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Clock" className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Time Spent</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round((dashboardData.totalTimeSpent || 0) / 60)}h</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Award" className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Achievements</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.recentAchievements?.length || 0}</p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Activity</h3>
                    {dashboardData.dailyActivity && (
                      <Chart
                        options={activityChartOptions}
                        series={activityChartSeries}
                        type="line"
                        height={300}
                      />
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Worlds</h3>
                    {worldProgressSeries.some(s => s > 0) ? (
                      <Chart
                        options={worldProgressOptions}
                        series={worldProgressSeries}
                        type="donut"
                        height={300}
                      />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No games played yet
                      </div>
                    )}
                  </Card>
                </div>
                
                {/* Recent Achievements */}
                {dashboardData.recentAchievements && dashboardData.recentAchievements.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {dashboardData.recentAchievements.map((achievement) => (
                        <div key={achievement.Id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: achievement.badge?.color || "#FFD93D" }}
                          >
                            <ApperIcon 
                              name={achievement.badge?.icon || "Star"} 
                              className="w-6 h-6 text-white"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{achievement.badge?.name}</h4>
                            <p className="text-sm text-gray-600">{achievement.badge?.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
            
            {activeTab === "progress" && (
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Goals Progress</h3>
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = subDays(new Date(), 6 - i)
                      const dayGoal = dashboardData.weeklyGoals?.find(g => g.date === format(date, 'yyyy-MM-dd'))
                      return (
                        <div key={i} className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-2">
                            {format(date, 'EEE')}
                          </div>
                          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                            dayGoal?.isComplete 
                              ? 'bg-green-100 text-green-600'
                              : isToday(date)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <ApperIcon 
                              name={dayGoal?.isComplete ? "Check" : isToday(date) ? "Clock" : "Calendar"} 
                              className="w-5 h-5" 
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {format(date, 'MMM dd')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Math World Progress</h3>
                    {dashboardData.worldStats?.math?.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.worldStats.math.slice(0, 5).map((progress) => (
                          <div key={progress.gameId} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium capitalize">{progress.gameId.replace('-', ' ')}</div>
                              <div className="text-sm text-gray-600">Level {progress.difficultyLevel}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant="primary">{progress.starsEarned}★</Badge>
                              <div className="text-sm text-gray-600">{progress.highScore}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No math games played yet</p>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Reading Land Progress</h3>
                    {dashboardData.worldStats?.reading?.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.worldStats.reading.slice(0, 5).map((progress) => (
                          <div key={progress.gameId} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium capitalize">{progress.gameId.replace('-', ' ')}</div>
                              <div className="text-sm text-gray-600">Level {progress.difficultyLevel}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{progress.starsEarned}★</Badge>
                              <div className="text-sm text-gray-600">{progress.highScore}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reading games played yet</p>
                    )}
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Parental Controls</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Time Limit (minutes)
                      </label>
                      <div className="text-2xl font-bold text-gray-900">{settings.sessionTimeLimit}</div>
                      <p className="text-sm text-gray-600">Maximum playtime per session</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed Learning Worlds
                      </label>
                      <div className="flex space-x-4">
                        {settings.allowedWorlds.map((world) => (
                          <Badge key={world} variant="success" className="capitalize">
                            {world} World
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notifications
                      </label>
                      <Badge variant={settings.notificationsEnabled ? "success" : "secondary"}>
                        {settings.notificationsEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Safety Information</h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Shield" className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">COPPA Compliant</p>
                        <p>This app follows strict privacy guidelines for children under 13.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Lock" className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">No External Communication</p>
                        <p>Children cannot communicate with strangers or access external content.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Eye" className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Safe Learning Environment</p>
                        <p>All content is age-appropriate and educationally focused.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ParentDashboard