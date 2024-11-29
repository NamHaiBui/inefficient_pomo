import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react'
import type { TryHardLevel, UserSettings } from '@/types/settings'
import { Trie } from '@/utils/trie'

interface SettingsContextProps {
  settings: UserSettings
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>
  showSettings: boolean
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  searchResults: string[]
  customInterest: string
  setCustomInterest: React.Dispatch<React.SetStateAction<string>>
  predefinedInterests: string[]
  videoSources: { [key: string]: string }
  addCustomInterest: () => void
  toggleInterest: (interest: string) => void
  removeInterest: (interest: string) => void
  adjustTryHardLevel: (direction: 'up' | 'down') => void
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    tryHardLevel: 'medium',
    interests: [],
    videoContent: 'linkedin',
  })

  const [showSettings, setShowSettings] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')

  const predefinedInterests = useMemo(
    () => [
      'Programming',
      'Reading',
      'Gaming',
      'Cooking',
      'Fitness',
      'Music',
      'Art',
      'Photography',
      'Writing',
      'Meditation',
      'Yoga',
      'Dancing',
      'Hiking',
      'Travel',
      'Languages',
    ],
    []
  )

  const videoSources = {
    linkedin: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    questionable: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    adhd: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }

  const trie = useMemo(() => {
    const t = new Trie()
    predefinedInterests.forEach((interest) => t.insert(interest))
    return t
  }, [predefinedInterests])

  useEffect(() => {
    if (searchTerm) {
      const results = trie.search(searchTerm)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, trie])

  const addCustomInterest = useCallback(() => {
    if (customInterest && !settings.interests.includes(customInterest)) {
      setSettings((prev) => ({
        ...prev,
        interests: [...prev.interests, customInterest],
      }))
      trie.insert(customInterest)
      setCustomInterest('')
    }
  }, [customInterest, settings.interests, trie])

  const toggleInterest = useCallback(
    (interest: string) => {
      setSettings((prev) => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      }))
    },
    [settings.interests]
  )

  const removeInterest = useCallback(
    (interest: string) => {
      setSettings((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== interest),
      }))
    },
    [settings.interests]
  )

  const adjustTryHardLevel = useCallback(
    (direction: 'up' | 'down') => {
      const levels: TryHardLevel[] = ['low', 'medium', 'high']
      const currentIndex = levels.indexOf(settings.tryHardLevel)
      const newIndex =
        direction === 'up'
          ? Math.min(currentIndex + 1, levels.length - 1)
          : Math.max(currentIndex - 1, 0)

      setSettings((prev) => ({
        ...prev,
        tryHardLevel: levels[newIndex],
      }))
    },
    [settings.tryHardLevel]
  )

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        showSettings,
        setShowSettings,
        searchTerm,
        setSearchTerm,
        searchResults,
        customInterest,
        setCustomInterest,
        predefinedInterests,
        videoSources,
        addCustomInterest,
        toggleInterest,
        removeInterest,
        adjustTryHardLevel,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}