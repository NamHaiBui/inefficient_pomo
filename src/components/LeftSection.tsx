'use client'

import { Settings, ChevronUp, ChevronDown, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import type { TryHardLevel, VideoContent } from '@/types/settings'
import VideoPlayer from './smaller_components/VideoPlayer'
import { useSettings } from '@/context/SettingsContext' // Import useSettings
import { useState } from 'react'

// Add types
interface WorkNote {
  id: string
  content: string
  color: string
}

const LeftSection = () => {
  const {
    settings,
    setSettings,
    showSettings,
    setShowSettings,
    searchTerm,
    setSearchTerm,
    searchResults,
    customInterest,
    setCustomInterest,
    videoSources,
    addCustomInterest,
    toggleInterest,
    removeInterest,
    adjustTryHardLevel,
  } = useSettings()

  const [notes, setNotes] = useState<WorkNote[]>([])
  const [newNote, setNewNote] = useState("")

  const STICKY_COLORS = [
    "#fff740", // yellow
    "#ff7eb9", // pink
    "#7afcff", // blue
    "#98ff98", // green
  ]

  const addNote = () => {
    if (newNote.trim()) {
      const note: WorkNote = {
        id: Date.now().toString() + Math.random().toString(),
        content: newNote.trim(),
        color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)]
      }
      setNotes(prev => [...prev, note])
      setNewNote("")
    }
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Top Section */}
      <div className="mb-4 flex justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => adjustTryHardLevel('down')}
          disabled={settings.tryHardLevel === 'low'}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => adjustTryHardLevel('up')}
          disabled={settings.tryHardLevel === 'high'}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Middle Section */}
      {settings.tryHardLevel === 'high' ? (
        <Card className="flex-grow">
          <CardContent className="p-4">
            <h2 className="mb-4 text-xl font-bold">Work Notes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Work Notes</h3>
                <Badge variant="outline">{notes.length}</Badge>
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      addNote()
                    }
                  }}
                  className="min-h-[80px] resize-none"
                />
                <Button 
                  onClick={addNote}
                  className="w-full"
                  disabled={!newNote.trim()}
                >
                  Add Note
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-400px)]">
                <AnimatePresence mode="popLayout">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-3"
                    >
                      <div
                        className="relative rounded-lg p-4 shadow-lg"
                        style={{
                          backgroundColor: note.color,
                          transform: `rotate(${Math.random() * 3 - 1.5}deg)`
                        }}
                      >
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="absolute right-2 top-2 rounded-full p-1 
                                  hover:bg-black/10 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      ) : (
<div className="flex-grow relative">
  <VideoPlayer videoContent={settings.videoContent} />
</div>
      )}

      {/* Bottom Section - Video Source */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <a 
          href={videoSources[settings.videoContent]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Source: {videoSources[settings.videoContent]}
        </a>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl"  aria-description="Manage your preferences and interests">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6">
            {/* Settings content remains unchanged */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Try-hard Level</h3>
              <RadioGroup
                value={settings.tryHardLevel}
                onValueChange={(value: TryHardLevel) =>
                  setSettings(prev => ({ ...prev, tryHardLevel: value }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interests</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Search interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {settings.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest} 
                    </Badge>
                  ))}
                </div>
                {searchResults.length > 0 && (
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-2">
                      {searchResults.map((result) => (
                        <div
                          key={result}
                          className="cursor-pointer rounded-sm px-2 py-1 hover:bg-accent"
                          onClick={() => toggleInterest(result)}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom interest..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                  />
                  <Button onClick={addCustomInterest}>Add</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Video Content Type</h3>
              <RadioGroup
                value={settings.videoContent}
                onValueChange={(value: VideoContent) =>
                  setSettings(prev => ({ ...prev, videoContent: value }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="linkedin" id="linkedin" />
                  <Label htmlFor="linkedin">LinkedIn Influencer Reel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="questionable" id="questionable" />
                  <Label htmlFor="questionable">Questionable Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adhd" id="adhd" />
                  <Label htmlFor="adhd">ADHD Content</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LeftSection
