'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const LeftSection = () => {
  const [showVideo, setShowVideo] = useState(true)
  const [notes, setNotes] = useState<string[]>([])
  const [currentNote, setCurrentNote] = useState('')

  const addNote = () => {
    if (currentNote.trim()) {
      setNotes([...notes, currentNote.trim()])
      setCurrentNote('')
    }
  }

  return (
    <div className="h-full p-4">
      <Toggle
        pressed={showVideo}
        onPressedChange={setShowVideo}
        className="mb-4"
        aria-label="Toggle video player"
      >
        {showVideo ? 'Show Notes' : 'Show Video'}
      </Toggle>
      {showVideo ? (
        <div className="aspect-video bg-gray-200">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="h-full">
          <Textarea
            placeholder="Add a new note..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addNote}>Add Note</Button>
          <ScrollArea className="h-[calc(100%-100px)] mt-4">
            {notes.map((note, index) => (
              <Card key={index} className="mb-2">
                <CardContent className="p-2">{note}</CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default LeftSection

