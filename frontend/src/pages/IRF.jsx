
import { useCallback, useEffect, useState } from 'react'
import {
  Plus,
  RefreshCw,
  Pencil,
  Archive,
  CheckCircle,
  XCircle,
  History,
  X,
} from 'lucide-react'

import {
  getIrfs,
  getArchivedIrfs,
  createIrf,
  updateIrf,
  archiveIrf,
  approveIrf,
  rejectIrf,
  getIrfHistory,
} from '../api/irfs'

const emptyForm = {
  amount: '',
  description: '',
  approvalLevel: 'MANAGER',
  remarks: '',
  projectId: '',
  requestedById: '',
}

function IRF({ token, onDataChanged }) {
  const [irfs, setIrfs] = useState([])
  const [archived, setArchived] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  const [statusFilter, setStatusFilter] = useState('ALL')
  const [historyId, setHistoryId] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const loadIrfs = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = archived
        ? await getArchivedIrfs(token)
        : await getIrfs(token)

      setIrfs(data)
    } catch (err) {
      setError(err.message || 'Failed to load IRFs')
    } finally {
      setLoading(false)
    }
  }, [token, archived])

  useEffect(() => {
    loadIrfs()
  }, [loadIrfs])

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function openCreateForm() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function openEditForm(irf) {
    setEditingId(irf.id)

    setForm({
      amount: irf.amount ?? '',
      description: irf.description ?? '',
      approvalLevel: irf.approvalLevel ?? 'MANAGER',
      remarks: irf.remarks ?? '',
      projectId: irf.projectId ?? '',
      requestedById: irf.requestedBy?.id ?? '',
    })

    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.projectId || !form.requestedById) {
      setError('Project ID and Requested By ID are required.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      amount: Number(form.amount),
      description: form.description,
      approvalLevel: form.approvalLevel,
      remarks: form.remarks,
      projectId: Number(form.projectId),
      requestedById: Number(form.requestedById),
    }

    try {
      if (editingId !== null) {
        await updateIrf(editingId, payload, token)
        setSuccess('IRF updated successfully.')
      } else {
        await createIrf(payload, token)
        setSuccess('IRF created successfully.')
      }

      closeForm()
      await loadIrfs()
      onDataChanged?.()
    } catch (err) {
      setError(err.message || 'Failed to save IRF')
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Are you sure you want to archive this IRF?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await archiveIrf(id, token)
      setSuccess('IRF archived successfully.')
      await loadIrfs()
      onDataChanged?.()
    } catch (err) {
      setError(err.message || 'Failed to archive IRF')
    }
  }

  async function handleApproval(id, action) {
    const remarks = window.prompt(
      `Enter remarks for ${action.toLowerCase()} (Cancel to abort):`,
      ''
    )

    if (remarks === null) return

    setError('')
    setSuccess('')

    try {
      if (action === 'APPROVE') {
        await approveIrf(id, remarks, token)
      } else {
        await rejectIrf(id, remarks, token)
      }

      setSuccess(
        action === 'APPROVE'
          ? 'IRF approval processed successfully.'
          : 'IRF rejected successfully.'
      )

      await loadIrfs()
      onDataChanged?.()
    } catch (err) {
      setError(err.message || 'Failed to process approval')
    }
  }

  async function handleViewHistory(id) {
    setHistoryId(id)
    setHistory([])
    setHistoryLoading(true)
    setError('')

    try {
      const data = await getIrfHistory(id, token)
      setHistory(data)
    } catch (err) {
      setError(err.message || 'Failed to load approval history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const filteredIrfs = irfs.filter((irf) => {
    return statusFilter === 'ALL' || irf.status === statusFilter
  })

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500'

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            IRF Management
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage internal requests and approval workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setArchived((previous) => !previous)
              setStatusFilter('ALL')
              closeForm()
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
          >
            {archived ? 'View Active' : 'View Archived'}
          </button>

          <button
            type="button"
            onClick={loadIrfs}
            title="Refresh"
            className="rounded-lg border border-slate-300 bg-white p-2"
          >
            <RefreshCw size={18} />
          </button>

          {!archived && (
            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add IRF
            </button>
          )}
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600" htmlFor="irf-status">
          Filter by status:
        </label>

        <select
          id="irf-status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && !archived && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">
              {editingId !== null ? 'Edit IRF' : 'Add IRF'}
            </h4>

            <button type="button" onClick={closeForm}>
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.amount}
                onChange={(event) =>
                  updateField('amount', event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Approval Level
              </label>
              <select
                value={form.approvalLevel}
                onChange={(event) =>
                  updateField('approvalLevel', event.target.value)
                }
                className={inputClass}
                disabled={editingId === null}
              >
                <option value="MANAGER">MANAGER</option>
                <option value="FINANCE">FINANCE</option>
              </select>
              {editingId === null && (
                <p className="mt-1 text-xs text-slate-500">
                  New IRFs start with manager approval.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Project ID
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.projectId}
                onChange={(event) =>
                  updateField('projectId', event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Requested By (User ID)
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.requestedById}
                onChange={(event) =>
                  updateField('requestedById', event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Remarks
              </label>
              <textarea
                rows={2}
                value={form.remarks}
                onChange={(event) =>
                  updateField('remarks', event.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save IRF'}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-slate-300 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* IRF table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {[
                'ID',
                'Project',
                'Amount',
                'Description',
                'Status',
                'Approval Level',
                'Requested By',
                'Actions',
              ].map((heading) => (
                <th key={heading} className="px-4 py-4 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  Loading IRFs...
                </td>
              </tr>
            ) : filteredIrfs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No IRFs found.
                </td>
              </tr>
            ) : (
              filteredIrfs.map((irf) => (
                <tr key={irf.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{irf.id}</td>

                  <td className="px-4 py-3">
                    {irf.projectName || irf.projectId || '—'}
                  </td>

                  <td className="px-4 py-3">
                    {irf.amount ?? '—'}
                  </td>

                  <td className="max-w-xs px-4 py-3">
                    {irf.description || '—'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        irf.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : irf.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {irf.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {irf.approvalLevel || '—'}
                  </td>

                  <td className="px-4 py-3">
                    {irf.requestedBy?.fullName || '—'}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {!archived && (
                        <>
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => openEditForm(irf)}
                            className="text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            title="Archive"
                            onClick={() => handleArchive(irf.id)}
                            className="text-red-500"
                          >
                            <Archive size={17} />
                          </button>

                          {irf.status === 'PENDING' && (
                            <>
                              <button
                                type="button"
                                title="Approve"
                                onClick={() =>
                                  handleApproval(irf.id, 'APPROVE')
                                }
                                className="text-green-600"
                              >
                                <CheckCircle size={18} />
                              </button>

                              <button
                                type="button"
                                title="Reject"
                                onClick={() =>
                                  handleApproval(irf.id, 'REJECT')
                                }
                                className="text-red-600"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </>
                      )}

                      <button
                        type="button"
                        title="Approval History"
                        onClick={() => handleViewHistory(irf.id)}
                        className="text-slate-600"
                      >
                        <History size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Approval history */}
      {historyId !== null && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">
              Approval History — IRF #{historyId}
            </h4>

            <button
              type="button"
              onClick={() => setHistoryId(null)}
            >
              <X size={20} />
            </button>
          </div>

          {historyLoading ? (
            <p className="text-sm text-slate-500">
              Loading approval history...
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-500">
              No approval actions recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-medium text-slate-800">
                      {entry.action} — {entry.stage}
                    </p>

                    <p className="text-xs text-slate-500">
                      {entry.actionAt
                        ? new Date(entry.actionAt).toLocaleString()
                        : '—'}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {entry.remarks || 'No remarks'}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    By: {entry.actedBy?.fullName || 'Unknown'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IRF
