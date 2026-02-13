import { readFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

interface Note {
  id: number
  lead_id: number
  note: string
  created_at: string
  user_id?: number
  user_name?: string
}

interface NotesStore {
  notes: Note[]
}

const DATA_DIR = join(process.cwd(), '.data')
const NOTES_FILE = join(DATA_DIR, 'notes.json')

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

async function readNotes(): Promise<NotesStore> {
  try {
    await ensureDataDir()
    if (!existsSync(NOTES_FILE)) {
      return { notes: [] }
    }
    const data = await readFile(NOTES_FILE, 'utf-8')
    return JSON.parse(data)
  }
  catch {
    return { notes: [] }
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.lead_id) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'lead_id is required',
        data: [],
      }
    }

    const store = await readNotes()
    const leadId = Number(body.lead_id)

    // Filter notes for the specific lead and sort by created_at (newest first)
    const leadNotes = store.notes
      .filter(note => note.lead_id === leadId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return {
      success: true,
      data: leadNotes,
    }
  }
  catch (error: any) {
    console.error('Error fetching notes:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: error.message || 'Failed to fetch notes',
      data: [],
    }
  }
})
