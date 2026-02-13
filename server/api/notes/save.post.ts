import { readFile, writeFile, mkdir } from 'node:fs/promises'
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

async function writeNotes(store: NotesStore): Promise<void> {
  await ensureDataDir()
  await writeFile(NOTES_FILE, JSON.stringify(store, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.lead_id || !body.note) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'lead_id and note are required',
      }
    }

    const store = await readNotes()

    const newNote: Note = {
      id: Date.now(),
      lead_id: Number(body.lead_id),
      note: String(body.note).trim(),
      created_at: new Date().toISOString(),
      user_id: body.user_id || undefined,
      user_name: body.user_name || 'Agent',
    }

    store.notes.unshift(newNote)
    await writeNotes(store)

    return {
      success: true,
      message: 'Note saved successfully',
      data: newNote,
    }
  }
  catch (error: any) {
    console.error('Error saving note:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: error.message || 'Failed to save note',
    }
  }
})
