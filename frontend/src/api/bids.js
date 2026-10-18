
const BASE_URL = '/api/bids'

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
    throw new Error(`Bid request failed: ${response.status}`)
  }

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function getBids(token) {
  return request(BASE_URL, token)
}

export function getArchivedBids(token) {
  return request(`${BASE_URL}/archived`, token)
}

export function createBid(token, data) {
  return request(BASE_URL, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateBid(token, id, data) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function archiveBid(token, id) {
  return request(`${BASE_URL}/${id}`, token, {
    method: 'DELETE',
  })
}

export function awardBid(token, id) {
  return request(`${BASE_URL}/${id}/award`, token, {
    method: 'POST',
  })
}

export function loseBid(token, id) {
  return request(`${BASE_URL}/${id}/lose`, token, {
    method: 'POST',
  })
}
