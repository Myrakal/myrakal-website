import posthog from 'posthog-js'

export type AnalyticsEvent = 'waitlist_focus' | 'waitlist_type' | 'waitlist_submit' | 'waitlist_success'

let enabled = false

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  if (!key) return
  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: true,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
  })
  enabled = true
}

export function track(event: AnalyticsEvent) {
  if (enabled) posthog.capture(event)
}
