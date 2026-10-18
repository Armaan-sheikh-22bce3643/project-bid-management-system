
const BASE_URL = '/api/irfs'

// Shared function for authenticated API requests
async function irfRequest(path, token, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      message || `Request failed (${response.status})`
    )
  }

  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// Get active IRFs
export function getIrfs(token) {
  return irfRequest('', token)
}

// Get archived IRFs
export function getArchivedIrfs(token) {
  return irfRequest('/archived', token)
}

// Get a single IRF
export function getIrfById(id, token) {
  return irfRequest(`/${id}`, token)
}

// Create an IRF
export function createIrf(data, token) {
  return irfRequest('', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Update an IRF
export function updateIrf(id, data, token) {
  return irfRequest(`/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Archive an IRF
export function archiveIrf(id, token) {
  return irfRequest(`/${id}`, token, {
    method: 'DELETE',
  })
}

// Approve an IRF
export function approveIrf(id, remarks, token) {
  return irfRequest(`/${id}/approve`, token, {
    method: 'POST',
    body: JSON.stringify({ remarks }),
  })
}

// Reject an IRF
export function rejectIrf(id, remarks, token) {
  return irfRequest(`/${id}/reject`, token, {
    method: 'POST',
    body: JSON.stringify({ remarks }),
  })
}

// Get approval history
export function getIrfHistory(id, token) {
  return irfRequest(`/${id}/history`, token)
}
