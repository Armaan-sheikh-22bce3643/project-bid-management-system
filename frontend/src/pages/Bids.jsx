
import { useEffect, useState } from 'react'
import {
  Plus,
  Pencil,
  Archive,
  X,
  RefreshCw,
  Trophy,
  ThumbsDown,
} from 'lucide-react'

import {
  getBids,
  getArchivedBids,
  createBid,
  updateBid,
  archiveBid,
  awardBid,
  loseBid,
} from '../api/bids'

const emptyForm = {
  tenderNo: '',
  description: '',
  clientName: '',
  bidDecision: '',
  submissionDate: '',
  priority: 'High',
  finalReviewApprovalDate: '',
  tenderedValue: '',
  outcome: 'PENDING',
  remark: '',
  ownerId: '',
}

function Bids({ token, onDataChanged }) {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadBids(archived = showArchived) {
    setLoading(true)
    setError('')

    try {
      const data = archived
        ? await getArchivedBids(token)
        : await getBids(token)

      setBids(data)
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
          ? await getArchivedBids(token)
          : await getBids(token)

        if (!cancelled) {
          setBids(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [token, showArchived])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function openEditForm(bid) {
    setEditingId(bid.id)
    setForm({
      tenderNo: bid.tenderNo ?? '',
      description: bid.description ?? '',
      clientName: bid.clientName ?? '',
      bidDecision: bid.bidDecision ?? '',
      submissionDate: bid.submissionDate ?? '',
      priority: bid.priority ?? 'High',
      finalReviewApprovalDate: bid.finalReviewApprovalDate ?? '',
      tenderedValue: bid.tenderedValue ?? '',
      outcome: bid.outcome ?? 'PENDING',
      remark: bid.remark ?? '',
      ownerId: bid.owner?.id ?? '',
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
    setError('')
    setSaving(true)

    const data = {
      ...form,
      ownerId: Number(form.ownerId),
      tenderedValue:
        form.tenderedValue === ''
          ? null
          : Number(form.tenderedValue),
      submissionDate: form.submissionDate || null,
      finalReviewApprovalDate:
        form.finalReviewApprovalDate || null,
    }

    try {
      if (editingId !== null) {
        await updateBid(token, editingId, data)
      } else {
        await createBid(token, data)
      }

      setShowForm(false)
      setEditingId(null)
      await loadBids()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Archive this bid?')) return

    try {
      await archiveBid(token, id)
      await loadBids()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAward(id) {
    if (!window.confirm(
      'Award this bid? A new project will be created automatically.'
    )) return

    try {
      await awardBid(token, id)
      await loadBids()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLose(id) {
    if (!window.confirm('Mark this bid as lost?')) return

    try {
      await loseBid(token, id)
      await loadBids()
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
            Bid Management
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage tenders, submissions, and bid outcomes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
          >
            {showArchived ? 'View Active' : 'View Archived'}
          </button>

          <button
            onClick={() => loadBids()}
            className="rounded-lg border border-slate-300 bg-white p-2"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>

          {!showArchived && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Bid
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {showForm && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              {editingId !== null ? 'Edit Bid' : 'New Bid'}
            </h4>

            <button onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {[
              ['tenderNo', 'Tender Number'],
              ['clientName', 'Client Name'],
              ['bidDecision', 'Bid Decision'],
              ['priority', 'Priority'],
              ['outcome', 'Outcome'],
              ['tenderedValue', 'Tendered Value'],
              ['ownerId', 'Owner ID'],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm text-slate-700">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name === 'tenderNo' || name === 'ownerId'}
                  type={
                    name === 'tenderedValue' || name === 'ownerId'
                      ? 'number'
                      : 'text'
                  }
                  min={name === 'ownerId' ? '1' : undefined}
                  step={name === 'tenderedValue' ? '0.01' : undefined}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </label>
            ))}

            {[
              ['submissionDate', 'Submission Date'],
              ['finalReviewApprovalDate', 'Final Review Approval Date'],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm text-slate-700">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  type="date"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </label>
            ))}

            {[
              ['description', 'Description'],
              ['remark', 'Remarks'],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm text-slate-700 md:col-span-2">
                <span className="mb-1 block font-medium">{label}</span>
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </label>
            ))}

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Bid'}
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
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {[
                'ID',
                'Tender No.',
                'Client',
                'Priority',
                'Submission Date',
                'Value',
                'Outcome',
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
                <td colSpan={9} className="px-5 py-8 text-center text-slate-500">
                  Loading bids...
                </td>
              </tr>
            ) : bids.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-slate-500">
                  No bids found.
                </td>
              </tr>
            ) : (
              bids.map((bid) => (
                <tr key={bid.id}>
                  <td className="px-5 py-4">{bid.id}</td>
                  <td className="px-5 py-4 font-medium">{bid.tenderNo}</td>
                  <td className="px-5 py-4">{bid.clientName || '—'}</td>
                  <td className="px-5 py-4">{bid.priority || '—'}</td>
                  <td className="px-5 py-4">{bid.submissionDate || '—'}</td>
                  <td className="px-5 py-4">{bid.tenderedValue ?? '—'}</td>
                  <td className="px-5 py-4">{bid.outcome || '—'}</td>
                  <td className="px-5 py-4">{bid.owner?.fullName || '—'}</td>

                  <td className="px-5 py-4">
                    {!showArchived && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditForm(bid)}
                          title="Edit Bid"
                          className="text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleArchive(bid.id)}
                          title="Archive Bid"
                          className="text-red-500"
                        >
                          <Archive size={18} />
                        </button>

                        {bid.outcome !== 'WON' && (
                          <button
                            onClick={() => handleAward(bid.id)}
                            title="Award Bid"
                            className="text-green-600"
                          >
                            <Trophy size={18} />
                          </button>
                        )}

                        {bid.outcome !== 'LOST' && bid.outcome !== 'WON' && (
                          <button
                            onClick={() => handleLose(bid.id)}
                            title="Mark as Lost"
                            className="text-orange-500"
                          >
                            <ThumbsDown size={18} />
                          </button>
                        )}
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

export default Bids
