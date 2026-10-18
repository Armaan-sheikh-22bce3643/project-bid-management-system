
import { useEffect, useState } from 'react'
import {
  Plus,
  Pencil,
  Archive,
  RefreshCw,
  X,
} from 'lucide-react'

import {
  getMeetings,
  getArchivedMeetings,
  createMeeting,
  updateMeeting,
  archiveMeeting,
} from '../api/meetings'

const emptyForm = {
  title: '',
  meetingDateTime: '',
  attendees: '',
  agenda: '',
  notes: '',
  decision: '',
  nextAction: '',
  ownerId: '',
  opportunityId: '',
  bidId: '',
}

function Meetings({ token, onDataChanged }) {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [decisionFilter, setDecisionFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })

  async function loadMeetings() {
    setLoading(true)
    setError('')

    try {
      const data = showArchived
        ? await getArchivedMeetings(token)
        : await getMeetings(token, decisionFilter)

      setMeetings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')

      try {
        const data = showArchived
          ? await getArchivedMeetings(token)
          : await getMeetings(token, decisionFilter)

        if (!cancelled) setMeetings(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [token, showArchived, decisionFilter])

  function openCreateForm() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setError('')
    setShowForm(true)
  }

  function openEditForm(meeting) {
    setEditingId(meeting.id)

    setForm({
      title: meeting.title ?? '',
      meetingDateTime: meeting.meetingDateTime
        ? meeting.meetingDateTime.slice(0, 16)
        : '',
      attendees: meeting.attendees ?? '',
      agenda: meeting.agenda ?? '',
      notes: meeting.notes ?? '',
      decision: meeting.decision ?? '',
      nextAction: meeting.nextAction ?? '',
      ownerId: meeting.owner?.id ?? '',
      opportunityId: meeting.opportunityId ?? '',
      bidId: meeting.bidId ?? '',
    })

    setError('')
    setShowForm(true)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const data = {
      ...form,
      meetingDateTime: form.meetingDateTime || null,
      ownerId: Number(form.ownerId),
      opportunityId: form.opportunityId
        ? Number(form.opportunityId)
        : null,
      bidId: form.bidId ? Number(form.bidId) : null,
    }

    try {
      if (editingId === null) {
        await createMeeting(token, data)
      } else {
        await updateMeeting(token, editingId, data)
      }

      setShowForm(false)
      setEditingId(null)
      await loadMeetings()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Archive this meeting?')) return

    setError('')

    try {
      await archiveMeeting(token, id)
      await loadMeetings()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Meeting Management
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Schedule meetings, record decisions, and track follow-up actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
          >
            {showArchived ? 'View Active' : 'View Archived'}
          </button>

          <button
            type="button"
            onClick={loadMeetings}
            title="Refresh"
            className="rounded-lg border border-slate-300 bg-white p-2"
          >
            <RefreshCw size={18} />
          </button>

          {!showArchived && (
            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Meeting
            </button>
          )}
        </div>
      </div>

      {!showArchived && (
        <div className="flex items-center gap-3">
          <label htmlFor="decisionFilter" className="text-sm text-slate-600">
            Filter by decision:
          </label>

          <select
            id="decisionFilter"
            value={decisionFilter}
            onChange={(event) => setDecisionFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Decisions</option>
            <option value="PROCEED">PROCEED</option>
            <option value="HOLD">HOLD</option>
            <option value="REJECT">REJECT</option>
          </select>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {showForm && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              {editingId === null ? 'Add Meeting' : 'Edit Meeting'}
            </h4>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Meeting Title</span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Meeting Date & Time</span>
              <input
                type="datetime-local"
                name="meetingDateTime"
                value={form.meetingDateTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            {[
              ['attendees', 'Attendees'],
              ['agenda', 'Agenda'],
              ['notes', 'Meeting Notes'],
              ['nextAction', 'Next Action'],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm text-slate-700">
                <span className="mb-1 block font-medium">{label}</span>
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            ))}

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Decision</span>
              <select
                name="decision"
                value={form.decision}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Select Decision</option>
                <option value="PROCEED">PROCEED</option>
                <option value="HOLD">HOLD</option>
                <option value="REJECT">REJECT</option>
              </select>
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Owner ID</span>
              <input
                type="number"
                name="ownerId"
                value={form.ownerId}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">
                Opportunity ID (optional)
              </span>
              <input
                type="number"
                name="opportunityId"
                value={form.opportunityId}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">
                Bid ID (optional)
              </span>
              <input
                type="number"
                name="bidId"
                value={form.bidId}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Meeting'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-5 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {[
                'ID',
                'Title',
                'Date & Time',
                'Attendees',
                'Decision',
                'Next Action',
                'Opportunity',
                'Bid',
                'Owner',
                'Actions',
              ].map((heading) => (
                <th key={heading} className="px-5 py-4 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-5 py-8 text-center text-slate-500">
                  Loading meetings...
                </td>
              </tr>
            ) : meetings.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-5 py-8 text-center text-slate-500">
                  No meetings found.
                </td>
              </tr>
            ) : (
              meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="px-5 py-4">{meeting.id}</td>
                  <td className="px-5 py-4 font-medium">{meeting.title}</td>
                  <td className="px-5 py-4">
                    {meeting.meetingDateTime
                      ? meeting.meetingDateTime.replace('T', ' ').slice(0, 16)
                      : '—'}
                  </td>
                  <td className="px-5 py-4">{meeting.attendees || '—'}</td>
                  <td className="px-5 py-4">{meeting.decision || '—'}</td>
                  <td className="px-5 py-4">{meeting.nextAction || '—'}</td>
                  <td className="px-5 py-4">{meeting.opportunityId ?? '—'}</td>
                  <td className="px-5 py-4">{meeting.bidId ?? '—'}</td>
                  <td className="px-5 py-4">
                    {meeting.owner?.fullName || '—'}
                  </td>

                  <td className="px-5 py-4">
                    {!showArchived && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(meeting)}
                          title="Edit Meeting"
                          className="text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleArchive(meeting.id)}
                          title="Archive Meeting"
                          className="text-red-500"
                        >
                          <Archive size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Meetings
