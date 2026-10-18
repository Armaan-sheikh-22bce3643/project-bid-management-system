
import { useEffect, useState } from 'react'
import {
  Pencil,
  Archive,
  X,
  RefreshCw,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react'

import {
  getProjects,
  getArchivedProjects,
  updateProject,
  archiveProject,
  activateProject,
  holdProject,
  completeProject,
} from '../api/projects'

function Projects({ token, onDataChanged }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    projectValue: '',
    startDate: '',
    status: 'PLANNED',
    ownerId: '',
  })

  async function loadProjects(archived = showArchived) {
    setLoading(true)
    setError('')

    try {
      const data = archived
        ? await getArchivedProjects(token)
        : await getProjects(token)

      setProjects(data)
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
          ? await getArchivedProjects(token)
          : await getProjects(token)

        if (!cancelled) {
          setProjects(data)
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

  function openEditForm(project) {
    setEditingId(project.id)
    setForm({
      projectName: project.projectName ?? '',
      clientName: project.clientName ?? '',
      projectValue: project.projectValue ?? '',
      startDate: project.startDate ?? '',
      status: project.status ?? 'PLANNED',
      ownerId: project.owner?.id ?? '',
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
      ownerId: Number(form.ownerId),
      projectValue:
        form.projectValue === ''
          ? null
          : Number(form.projectValue),
      startDate: form.startDate || null,
    }

    try {
      await updateProject(token, editingId, data)
      setShowForm(false)
      setEditingId(null)
      await loadProjects()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Archive this project?')) return

    try {
      await archiveProject(token, id)
      await loadProjects()
      onDataChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleStatusChange(id, action) {
    const actions = {
      activate: activateProject,
      hold: holdProject,
      complete: completeProject,
    }

    const messages = {
      activate: 'Activate this project?',
      hold: 'Put this project on hold?',
      complete: 'Mark this project as completed?',
    }

    if (!window.confirm(messages[action])) return

    try {
      await actions[action](token, id)
      await loadProjects()
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
            Project Management
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Track awarded bids and manage project progress.
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
            onClick={() => loadProjects()}
            className="rounded-lg border border-slate-300 bg-white p-2"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
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
            <h4 className="text-lg font-semibold">Edit Project</h4>

            <button onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {[
              ['projectName', 'Project Name'],
              ['clientName', 'Client Name'],
              ['projectValue', 'Project Value'],
              ['ownerId', 'Owner ID'],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm text-slate-700">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name === 'projectName' || name === 'ownerId'}
                  type={
                    name === 'projectValue' || name === 'ownerId'
                      ? 'number'
                      : 'text'
                  }
                  min={name === 'ownerId' ? '1' : undefined}
                  step={name === 'projectValue' ? '0.01' : undefined}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </label>
            ))}

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Start Date</span>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="PLANNED">PLANNED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {[
                'ID',
                'Project Name',
                'Client',
                'Value',
                'Start Date',
                'Status',
                'Bid ID',
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
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-slate-500">
                  No projects found. Award a bid to create a project.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-5 py-4">{project.id}</td>
                  <td className="px-5 py-4 font-medium">{project.projectName}</td>
                  <td className="px-5 py-4">{project.clientName || '—'}</td>
                  <td className="px-5 py-4">{project.projectValue ?? '—'}</td>
                  <td className="px-5 py-4">{project.startDate || '—'}</td>
                  <td className="px-5 py-4">{project.status || '—'}</td>
                  <td className="px-5 py-4">{project.bidId ?? '—'}</td>
                  <td className="px-5 py-4">{project.owner?.fullName || '—'}</td>

                  <td className="px-5 py-4">
                    {!showArchived && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditForm(project)}
                          title="Edit Project"
                          className="text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleArchive(project.id)}
                          title="Archive Project"
                          className="text-red-500"
                        >
                          <Archive size={18} />
                        </button>

                        {project.status !== 'ACTIVE' && (
                          <button
                            onClick={() => handleStatusChange(project.id, 'activate')}
                            title="Activate Project"
                            className="text-green-600"
                          >
                            <Play size={18} />
                          </button>
                        )}

                        {project.status !== 'ON_HOLD' && (
                          <button
                            onClick={() => handleStatusChange(project.id, 'hold')}
                            title="Put On Hold"
                            className="text-orange-500"
                          >
                            <Pause size={18} />
                          </button>
                        )}

                        {project.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(project.id, 'complete')}
                            title="Complete Project"
                            className="text-purple-600"
                          >
                            <CheckCircle2 size={18} />
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

export default Projects
