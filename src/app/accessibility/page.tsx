import type { Metadata } from 'next'

import { LegalLayout, List, MailLink, Section } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Accessibility | Myrakal',
  description: 'Our commitment to an accessible Myrakal website, its known limits and how to report a barrier.',
  alternates: { canonical: '/accessibility' },
}

export default function AccessibilityPage() {
  return (
    <LegalLayout title="Accessibility" eyebrow="Legal / Accessibility" updated="November 10, 2026" lede="We want everyone to be able to compare care options with Myrakal, whatever device, input method or assistive technology they use.">
      <Section title="Our commitment">
        <p>We aim to meet the Web Content Accessibility Guidelines, WCAG 2.2 Level AA. We work toward clear structure, keyboard-accessible controls, visible focus, readable contrast, layouts that work at any size, text that can be enlarged, descriptive labels and support for reduced-motion preferences.</p>
      </Section>
      <Section title="Known limits">
        <p>Accessibility is ongoing work, and some parts of the website may not yet fully meet our target. Our quote form is processed by Formspree, a third-party service, and some content such as fonts and analytics comes from other providers we do not fully control. If something gets in your way, contact us and we will help you compare and book by email or another way that works for you.</p>
      </Section>
      <Section title="Report a problem">
        <p>If you run into a barrier, email <MailLink subject="Accessibility support" /> or send a note through the quote form and tell us how you would like us to reply. It helps to include:</p>
        <List>
          <li>The page or feature you were trying to use.</li>
          <li>A short description of what happened.</li>
          <li>Your browser, device or assistive technology, if you are comfortable sharing it.</li>
          <li>The best way to reach you.</li>
        </List>
        <p>Please do not include medical records in your report. Where we reasonably can, we will send you the information in another format or help you send us your quote by email.</p>
      </Section>
    </LegalLayout>
  )
}
