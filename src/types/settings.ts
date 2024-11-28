export type TryHardLevel = 'low' | 'medium' | 'high'
export type VideoContent = 'linkedin' | 'questionable' | 'adhd'

export interface UserSettings {
  tryHardLevel: TryHardLevel
  interests: string[]
  videoContent: VideoContent
}

