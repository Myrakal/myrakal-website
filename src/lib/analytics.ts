import posthog from 'posthog-js'

export function initAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: true,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
  })
}
