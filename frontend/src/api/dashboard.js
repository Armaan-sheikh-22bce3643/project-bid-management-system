
async function getDashboardData(endpoint, token) {
  const response = await fetch(`/api/dashboard/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Dashboard request failed: ${response.status}`)
  }

  return response.json()
}

// Main dashboard statistics
export function getDashboardSummary(token) {
  return getDashboardData('summary', token)
}

// IRF statistics
export function getIrfSummary(token) {
  return getDashboardData('irf-summary', token)
}

// Bid and project analytics
export function getDashboardAnalytics(token) {
  return getDashboardData('analytics', token)
}

// Recent opportunities, bids, and meetings
export function getDashboardRecent(token) {
  return getDashboardData('recent', token)
}
