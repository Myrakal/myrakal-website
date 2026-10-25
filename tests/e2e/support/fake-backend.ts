import type { Page, Route } from '@playwright/test'

type Role = 'user' | 'assistant'
type Message = { id: string; role: Role; text: string; createdAt: string }
type Comment = { id: string; text: string; createdAt: string }

const TOTAL = 7
const COLLECTED = [2, 4, 7]

export class FakeBackend {
  readonly id = '3f1c2b4a-0000-4000-8000-000000000001'
  readonly patientLines = [
    'I need a knee replacement. The pain started two years ago.',
    'Nothing feels like an emergency. Call me Ada, and my date of birth is December 10, 1815.',
    'I have not had treatment yet. I take no medication, have no allergies or other conditions, and I have recent X-rays.',
  ]
  readonly assistantLines = [
    'Before we continue, does anything feel like an emergency right now?',
    'Have you already tried any treatments, procedures, or surgery for this?',
  ]

  private created = false
  private status = 'intake'
  private messages: Message[] = []
  private comments: Comment[] = []
  private turns = 0

  progressAfter(index: number) {
    return COLLECTED[index]
  }

  setStatus(status: string) {
    this.status = status
  }

  async install(page: Page) {
    await page.route('**/api/chats**', (route) => this.handle(route))
    await page.route('**/mock-plan.html', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<h1>Myrakal care plan</h1><p>Knee replacement, 12 days.</p>' }),
    )
    await page.route('**/mock-stripe', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<h1>Stripe Checkout</h1><p>Pay $150.00 to Myrakal.</p>' }),
    )
  }

  private json(route: Route, body: unknown, status = 200) {
    return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  }

  private message(role: Role, text: string): Message {
    const message = { id: `m${this.messages.length + 1}`, role, text, createdAt: new Date().toISOString() }
    this.messages.push(message)
    return message
  }

  private progress() {
    return { collected: this.turns === 0 ? 0 : COLLECTED[this.turns - 1], total: TOTAL }
  }

  private handle(route: Route) {
    const request = route.request()
    const { pathname, origin } = new URL(request.url())
    const method = request.method()
    const path = pathname.replace(/^\/api\/chats/, '')

    if (path === '' || path === '/') {
      if (method === 'POST') {
        this.created = true
        return this.json(route, { id: this.id }, 201)
      }
      const list = this.created ? [{ id: this.id, status: this.status, createdAt: new Date().toISOString(), summary: 'Knee replacement' }] : []
      return this.json(route, list)
    }
    if (path === `/${this.id}` && method === 'GET') {
      return this.json(route, {
        id: this.id,
        status: this.status,
        createdAt: new Date().toISOString(),
        priceCents: 15000,
        paid: ['reservations', 'booked'].includes(this.status),
        progress: this.progress(),
        messages: this.messages,
        comments: this.comments,
      })
    }
    if (path === `/${this.id}/messages` && method === 'POST') return this.reply(route, request.postDataJSON().text)
    if (path === `/${this.id}/plan`) return this.json(route, { url: `${origin}/mock-plan.html` })
    if (path === `/${this.id}/comments` && method === 'POST') {
      this.comments.push({ id: `k${this.comments.length + 1}`, text: request.postDataJSON().text, createdAt: new Date().toISOString() })
      this.status = 'clarification_review'
      return this.json(route, { status: this.status }, 201)
    }
    if (path === `/${this.id}/approve` && method === 'POST') {
      this.status = 'awaiting_payment'
      return this.json(route, { status: this.status })
    }
    if (path === `/${this.id}/checkout` && method === 'POST') return this.json(route, { url: `${origin}/mock-stripe` })
    return this.json(route, { error: 'not found' }, 404)
  }

  private reply(route: Route, text: string) {
    this.message('user', text)
    this.turns += 1
    const done = this.turns >= this.patientLines.length
    if (done) this.status = 'doctor_review'
    const reply = this.message(
      'assistant',
      done ? 'Thank you, that is everything we need. A doctor will review your transcript.' : this.assistantLines[this.turns - 1],
    )
    return this.json(route, { reply, status: this.status, progress: this.progress() })
  }
}
