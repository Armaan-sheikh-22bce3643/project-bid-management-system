
const BASE_URL = '/api/projects'

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
    throw new Error(`Project request failed: ${response.status}`)
  }

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function getProjects(token) {
  return request(BASE_URL, token)
}

export function getArchivedProjects(token) {
  return request(`${BASE_URL}/archived`, token)
}

export function updateProject(token, id, data) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function archiveProject(token, id) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'DELETE',
  })
}

export function activateProject(token, id) {
  return request(`${BASE_URL}/${id}/activate`, token, {
    method: 'POST',
  })
}

export function holdProject(token, id) {
  return request(`${BASE_URL}/${id}/hold`, token, {
    method: 'POST',
  })
}

export function completeProject(token, id) {
  return request(`${BASE_URL}/${id}/complete`, token, {
    method: 'POST',
  })
}
