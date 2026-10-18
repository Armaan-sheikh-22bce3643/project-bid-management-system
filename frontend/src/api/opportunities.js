
const BASE_URL = '/api/opportunities'

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
    throw new Error(`Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function getOpportunities(token) {
  return request(BASE_URL, token)
}

export function getArchivedOpportunities(token) {
  return request(`${BASE_URL}/archived`, token)
}

export function createOpportunity(token, data) {
  return request(BASE_URL, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateOpportunity(token, id, data) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function archiveOpportunity(token, id) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'DELETE',
  })
}
