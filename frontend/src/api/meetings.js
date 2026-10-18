
const BASE_URL = '/api/meetings'

async function request(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      `Meeting request failed (${response.status}): ${message || 'Unknown error'}`
    )
  }

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function getMeetings(token, decision = '') {
  const params = decision
    ? `?decision=${encodeURIComponent(decision)}`
    : ''

  return request(`${BASE_URL}${params}`, token)
}

export function getArchivedMeetings(token) {
  return request(`${BASE_URL}/archived`, token)
}

export function createMeeting(token, data) {
  return request(BASE_URL, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateMeeting(token, id, data) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function archiveMeeting(token, id) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'DELETE',
  })
}
