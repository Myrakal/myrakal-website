export type Message = { role: 'assistant' | 'user'; text: string }

export function summarize(transcript: Message[]) {
  const summary = { history: [] as string[], tests: '', insurance: '' }
  transcript.forEach((m, i) => {
    if (m.role !== 'user') return
    const question = transcript[i - 1]?.text ?? ''
    if (/\blabs?\b|imaging|\btests?\b|scans?/i.test(question)) summary.tests = m.text
    else if (/insurance|coverage|\bplan\b/i.test(question)) summary.insurance = m.text
    else if (!/your name|email/i.test(question)) summary.history.push(m.text)
  })
  return summary
}
