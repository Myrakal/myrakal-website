import { act, render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { PhoneMockup } from '@/components/PhoneMockup'
import { Hero } from '@/components/Hero'

const setMotion = (reduce: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reduce,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
}

const chatOf = (phone: HTMLElement) =>
  Array.from(phone.querySelectorAll<HTMLElement>('[data-chat] > li')).filter((li) => li.dataset.testid !== 'receipt')
const receiptsOf = (phone: HTMLElement) => Array.from(phone.querySelectorAll<HTMLElement>('[data-testid="receipt"]'))
const chatText = (phone: HTMLElement) => phone.querySelector('[data-chat]')!.textContent ?? ''

describe('hero', () => {
  beforeEach(() => setMotion(true))

  it('puts the logo and text on the left and the iPhone on the right', () => {
    const { container } = render(<Hero />)
    const left = container.querySelector('[data-hero-copy]')
    const right = container.querySelector('[data-hero-phone]')
    expect(left).not.toBeNull()
    expect(right).not.toBeNull()
    expect(left!.compareDocumentPosition(right!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(left!.querySelector('img[src*="wordmark"]')).not.toBeNull()
    expect(within(left as HTMLElement).getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(within(left as HTMLElement).getByRole('link', { name: 'Email us' })).toBeInTheDocument()
    expect(right!.contains(screen.getByRole('figure'))).toBe(true)
  })

  it('shows an iPhone mockup with a text conversation that starts with a blue message', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const messages = chatOf(phone)
    expect(messages[0].className).toContain('bg-imessage')
    expect(messages[0].textContent).toContain('My dentist quoted me $12,000 for 8 porcelain veneers. Is that normal?')
    expect(chatText(phone)).toContain("No, that doesn't sound right. Let me get back to you, I'll talk to the team.")
    expect(chatText(phone)).toContain(
      "Definitely not right. We ran your stuff against our data system and found 2 options closer to you. There's one in Chicago, and another in Naperville. Here's the prices and links:",
    )
  })

  it('is sized with real iPhone proportions', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const width = Number(phone.className.match(/w-\[calc\((\d+)px/)?.[1])
    const height = Number(phone.className.match(/h-\[calc\((\d+)px/)?.[1])
    expect(width / height).toBeGreaterThan(0.465)
    expect(width / height).toBeLessThan(0.495)
  })

  it('marks only your latest message as Read when motion is reduced', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const receipts = receiptsOf(phone)
    expect(receipts).toHaveLength(1)
    expect(receipts[0].textContent).toBe('Read')
    expect(receipts[0].previousElementSibling).toHaveTextContent('Can you book the one closest to me?')
  })

  it('has a realistic status bar with a carrier, signal, wifi and battery', () => {
    const { container } = render(<Hero />)
    const bar = container.querySelector('[data-status-bar]')
    expect(bar).not.toBeNull()
    expect(bar!.textContent).toBe('Halcyon')
    expect(bar!.querySelectorAll('svg')).toHaveLength(3)
  })

  it('lists a Chicago and a Naperville option with prices and links', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const options = within(phone).getAllByTestId('option')
    expect(options).toHaveLength(2)
    expect(options[0].textContent).toMatch(/Brightwell Dental Studio/)
    expect(options[1].textContent).toMatch(/Fernhollow Dentistry/)
    expect(options[0].textContent).toMatch(/Chicago/)
    expect(options[1].textContent).toMatch(/Naperville/)
    for (const option of options) {
      expect(option.textContent).toMatch(/\$\d/)
      expect(option.textContent).toMatch(/\.com\//)
      expect(option.textContent).toMatch(/veneers/i)
    }
  })

  it('has the user ask to book the closest one, then shows Myrakal typing', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const items = chatOf(phone)
    const booking = items[items.length - 2]
    expect(booking.className).toContain('bg-imessage')
    expect(booking.textContent).toContain('Can you book the one closest to me?')
    const typing = items[items.length - 1]
    expect(typing).toHaveAttribute('data-testid', 'typing')
    expect(typing.textContent).toBe('Myrakal is typing')
    expect(typing.querySelectorAll('[data-dot]')).toHaveLength(3)
  })

  it('keeps the headline and white text on mobile but hides the CTA', () => {
    const { container } = render(<Hero />)
    const copy = container.querySelector('[data-hero-copy]') as HTMLElement
    expect(within(copy).getByRole('heading', { level: 1 }).className).not.toMatch(/max-sm:(sr-only|hidden)/)
    expect(copy.querySelector('p')!.className).not.toContain('max-sm:hidden')
    expect(within(copy).getByRole('link', { name: 'Email us' }).className).toContain('max-sm:hidden')
  })

  it('invites visitors to email for early access', () => {
    render(<Hero />)
    expect(screen.getByText('Email us for early access')).toBeInTheDocument()
  })
})

const setVisibility = (visible: boolean) => {
  globalThis.IntersectionObserver = class {
    callback: IntersectionObserverCallback
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback
    }
    observe(target: Element) {
      if (visible) this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
}

describe('hero background and animated chat', () => {
  beforeEach(() => {
    setMotion(false)
    setVisibility(true)
    jest.useFakeTimers()
  })
  afterEach(() => jest.useRealTimers())

  const phoneOf = () => screen.getByRole('figure', { name: /iphone/i })
  const advanceUntil = async (done: () => boolean) => {
    for (let i = 0; i < 2000 && !done(); i++) await act(async () => void jest.advanceTimersByTime(50))
    expect(done()).toBe(true)
  }
  const bubbles = () => chatOf(phoneOf()).filter((li) => li.dataset.testid !== 'typing')
  const chatNow = () => chatText(phoneOf())
  const typing = () => within(phoneOf()).queryByTestId('typing')

  it('keeps the liquid background static with no video', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img[alt^="A ribbon"]')).not.toBeNull()
  })

  it('lets screen readers read the whole conversation while the chat plays', () => {
    render(<Hero />)
    const readable = within(phoneOf()).getAllByRole('listitem')
    expect(readable).toHaveLength(6)
    expect(readable[0]).toHaveTextContent('You: My dentist quoted me $12,000')
    expect(readable[5]).toHaveTextContent('You: Can you book the one closest to me?')
    expect(phoneOf().querySelector('[data-chat]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('walks your sent message through Sending, Delivered and Read before Myrakal types', async () => {
    render(<Hero />)
    const receipt = () => receiptsOf(phoneOf()).map((r) => r.textContent)
    await advanceUntil(() => bubbles().length === 1)
    expect(receipt()).toEqual(['Sending…'])
    await advanceUntil(() => receipt()[0] === 'Delivered')
    expect(typing()).toBeNull()
    await advanceUntil(() => receipt()[0] === 'Read')
    expect(typing()).toBeNull()
    await advanceUntil(() => typing() !== null)
    expect(receipt()).toEqual(['Read'])
  })

  it('moves the receipt to your newest message and ends on Read', async () => {
    render(<Hero />)
    await advanceUntil(() => bubbles().length === 6)
    expect(receiptsOf(phoneOf()).map((r) => r.textContent)).toEqual(['Sending…'])
    await advanceUntil(() => typing() !== null && receiptsOf(phoneOf())[0]?.textContent === 'Read')
    const [receipt] = receiptsOf(phoneOf())
    expect(receipt.previousElementSibling).toHaveTextContent('Can you book the one closest to me?')
  })

  it('server-renders the empty start state so the chat never flashes full', () => {
    const html = renderToString(<PhoneMockup />)
    const chat = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-chat]')!
    expect(chat.querySelectorAll('li')).toHaveLength(0)
  })

  it('waits for the input bar to scroll into view before playing', async () => {
    setVisibility(false)
    render(<Hero />)
    await act(async () => void jest.advanceTimersByTime(30000))
    expect(bubbles()).toHaveLength(0)
    expect(within(phoneOf()).getByTestId('draft').textContent).toBe('')
  })

  it('starts with an empty chat and types the first message into the input', async () => {
    render(<Hero />)
    expect(bubbles()).toHaveLength(0)
    await advanceUntil(() => (within(phoneOf()).getByTestId('draft').textContent ?? '').length > 12)
    expect(bubbles()).toHaveLength(0)
    expect(within(phoneOf()).getByTestId('draft').textContent).toMatch(/^My dentist/)
  })

  it('sends the first message, shows typing, then the reply', async () => {
    render(<Hero />)
    await advanceUntil(() => bubbles().length === 1)
    expect(bubbles()[0].className).toContain('bg-imessage')
    expect(within(phoneOf()).getByTestId('draft').textContent).toBe('')
    await advanceUntil(() => typing() !== null)
    expect(chatNow()).not.toContain("No, that doesn't sound right")
    await advanceUntil(() => chatNow().includes("No, that doesn't sound right"))
    expect(typing()).toBeNull()
  })

  it('ends on the full conversation with the typing dots', async () => {
    render(<Hero />)
    await advanceUntil(() => typing() !== null && bubbles().length === 6)
    expect(chatNow()).toContain('Can you book the one closest to me?')
    expect(within(phoneOf()).getAllByTestId('option')).toHaveLength(2)
  })

  it('shows the whole conversation at once when motion is reduced', () => {
    setMotion(true)
    render(<Hero />)
    expect(bubbles()).toHaveLength(6)
    expect(typing()).not.toBeNull()
    expect(within(phoneOf()).getByTestId('draft').textContent).toBe('')
  })
})
