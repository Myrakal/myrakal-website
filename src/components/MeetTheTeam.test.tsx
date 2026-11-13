import { render, screen } from '@testing-library/react'

import { MeetTheTeam } from './MeetTheTeam'

describe('MeetTheTeam', () => {
  it('autoplays silently with a poster and user controls', () => {
    render(<MeetTheTeam />)
    const video = screen.getByLabelText('Meet the Myrakal team') as HTMLVideoElement

    expect(video.autoplay).toBe(true)
    expect(video.muted).toBe(true)
    expect(video.controls).toBe(true)
    expect(video.playsInline).toBe(true)
    expect(video.preload).toBe('auto')
    expect(video).toHaveAttribute('poster', '/video-poster.jpg')
    expect(video).toHaveAttribute('src', '/video.mp4')
  })
})
