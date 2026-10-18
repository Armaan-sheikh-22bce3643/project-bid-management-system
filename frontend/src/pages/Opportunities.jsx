
import { useEffect, useState } from 'react'
import { Plus, Pencil, Archive, X, RefreshCw } from 'lucide-react'
import {
  getOpportunities,
  getArchivedOpportunities,
  createOpportunity,
  updateOpportunity,
  archiveOpportunity,
} from '../api/opportunities'

const emptyForm = {
  title: '',
  description: '',
  category: '',
  clientName: '',
  bidRoute: '',
  estimatedCost: '',
  priority: 'MEDIUM',
  status: 'Open',
  remarks: '',
  miscellaneous: '',
  ownerId: '',
}

function Opportunities({ token, onDataChanged }) {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadOpportunities(archived = showArchived) {
    setLoading(true)
    setError('')

    try {
      const data = archived
        ? await getArchivedOpportunities(token)
        : await getOpportunities(token)

      setOpportunities(data)
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
          ? await getArchivedOpportunities(token)
          : await getOpportunities(token)

        if (!cancelled) setOpportunities(data)
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
  }, [token, showArchived])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function openEditForm(opportunity) {
    setEditingId(opportunity.id)
    setForm({
      title: opportunity.title ?? '',
      description: opportunity.description ?? '',
      category: opportunity.category ?? '',
      clientName: opportunity.clientName ?? '',
      bidRoute: opportunity.bidRoute ?? '',
      estimatedCost: opportunity.estimatedCost ?? '',
      priority: opportunity.priority ?? 'MEDIUM',
      status: opportunity.status ?? 'Open',
      remarks: opportunity.remarks ?? '',
      miscellaneous: opportunity.miscellaneous ?? '',
      ownerId: opportunity.owner?.id ?? '',
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
      estimatedCost:
        form.estimatedCost === ''
          ? null
          : Number(form.estimatedCost),
    }

    try {
      if (editingId !== null) {
        await updateOpportunity(token, editingId, data)
      } else {
        await createOpportunity(token, data)
      }

      setShowForm(false)
      setEditingId(null)
      await loadOpportunities()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Archive this opportunity?')) return

    try {
      await archiveOpportunity(token, id)
      await loadOpportunities()
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
            Opportunity Management
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage potential projects and business opportunities.
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
            onClick={() => loadOpportunities()}
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
              Add Opportunity
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
              {editingId !== null ? 'Edit Opportunity' : 'New Opportunity'}
            </h4>

            <button onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {[
              ['title', 'Title'],
              ['clientName', 'Client Name'],
              ['category', 'Category'],
              ['bidRoute', 'Bid Route'],
              ['priority', 'Priority'],
              ['status', 'Status'],
              ['estimatedCost', 'Estimated Cost'],
              ['ownerId', 'Owner ID'],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm text-slate-700">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name === 'title' || name === 'ownerId'}
                  type={
                    name === 'estimatedCost' || name === 'ownerId'
                      ? 'number'
                      : 'text'
                  }
                  min={name === 'ownerId' ? '1' : undefined}
                  step={name === 'estimatedCost' ? '0.01' : undefined}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </label>
            ))}

            {[
              ['description', 'Description'],
              ['remarks', 'Remarks'],
              ['miscellaneous', 'Miscellaneous'],
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
                {saving ? 'Saving...' : 'Save Opportunity'}
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
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {['ID', 'Title', 'Client', 'Category', 'Priority', 'Status', 'Owner', 'Actions'].map(
                (heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                  Loading opportunities...
                </td>
              </tr>
            ) : opportunities.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                  No opportunities found.
                </td>
              </tr>
            ) : (
              opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td className="px-5 py-4">{opportunity.id}</td>
                  <td className="px-5 py-4 font-medium">{opportunity.title}</td>
                  <td className="px-5 py-4">{opportunity.clientName || '—'}</td>
                  <td className="px-5 py-4">{opportunity.category || '—'}</td>
                  <td className="px-5 py-4">{opportunity.priority || '—'}</td>
                  <td className="px-5 py-4">{opportunity.status || '—'}</td>
                  <td className="px-5 py-4">{opportunity.owner?.fullName || '—'}</td>
                  <td className="px-5 py-4">
                    {!showArchived && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditForm(opportunity)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleArchive(opportunity.id)}
                          title="Archive"
                          className="text-red-500 hover:text-red-700"
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

export default Opportunities
