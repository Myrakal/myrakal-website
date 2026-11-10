import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalLayout, MailLink, Section } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms of Service | Myrakal',
  description: 'The terms for using the Myrakal website, comparing care options and booking care through Myrakal.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" eyebrow="Legal / Terms" updated="November 10, 2026" lede="These terms govern your use of the Myrakal website and the comparison and booking services we offer through it.">
      <Section title="Acceptance">
        <p>These terms are an agreement between you and Myrakal Inc., based in Chicago, Illinois. By using this website or our services, you agree to them. If you do not agree, do not use the website. You must be at least 18 years old to use our services.</p>
      </Section>
      <Section title="Our service">
        <p>You can send us a quote you received for care that insurance will not cover, such as dental implants, All-on-4, full-mouth work, veneers, rhinoplasty, eyelid surgery or a facelift. We compare verified options near you, elsewhere in the U.S. and abroad, with all-in prices. Comparing is free.</p>
        <p>If you choose an option and want us to book it, we coordinate your care, travel, paperwork and aftercare for one coordination fee. We never take money from clinics, so our comparison is not shaped by what a clinic pays us.</p>
      </Section>
      <Section title="Not medical advice or emergency service" callout>
        <p>Myrakal is not a healthcare provider. We do not diagnose, treat or give medical advice. Decisions about your care should be made with a qualified dentist, surgeon or doctor. Do not use this website for emergencies. If you may be having a medical emergency, contact local emergency services.</p>
      </Section>
      <Section title="Myrakal’s role and independent providers">
        <p>Clinics, dentists and surgeons we compare or book are independent. They are responsible for their own advice, treatment, licensing, conduct and outcomes. Information we share about credentials or accreditation is a starting point, and you should verify it yourself before care. Our guide on <Link href="/guides/verify-a-dentist-or-surgeon" className="text-champagne underline decoration-champagne/50 underline-offset-4 hover:decoration-champagne">verifying a dentist or surgeon</Link> explains how.</p>
      </Section>
      <Section title="Coordination fee, provider payments, cancellations and refunds">
        <p>We show our coordination fee before you commit, and you pay it only if you ask us to book. The provider’s price, payment terms, cancellation rules and any refund policy are also shown before you commit. Those terms apply to that booking if they conflict with these terms.</p>
        <p>You remain responsible for your travel documents, such as passports and visas, for any travel or health insurance, and for follow-up care after you return home.</p>
      </Section>
      <Section title="Guides and calculator">
        <p>Our free guides and dental insurance calculator are informational. Prices, savings and coverage figures are estimates and may differ from what a provider or insurer charges or pays.</p>
      </Section>
      <Section title="Permitted use">
        <p>You may use the website for lawful purposes. You may not interfere with its operation, attempt unauthorized access, introduce malicious code, impersonate another person, scrape it in a way that burdens the service, or use its content unlawfully. Information you send through our quote form should be accurate and yours to share.</p>
      </Section>
      <Section title="Intellectual property">
        <p>The website, brand, design, text, graphics and software are owned by Myrakal or its licensors and are protected by law. These terms give you only a limited, revocable right to use the website as intended.</p>
      </Section>
      <Section title="Third-party services">
        <p>The website relies on and links to third-party services, such as Formspree for our quote form. Their products, content, availability, terms and privacy practices are their responsibility. A link or reference is not a guarantee or endorsement.</p>
      </Section>
      <Section title="Disclaimers and limitation of liability">
        <p>The website and our services are provided “as is” and “as available.” To the fullest extent permitted by law, Myrakal disclaims implied warranties and does not guarantee uninterrupted access, complete accuracy, provider availability, travel eligibility, or any medical or financial outcome.</p>
        <p>To the fullest extent permitted by law, Myrakal is not liable for indirect, incidental, special, consequential or punitive damages arising from your use of the website or our services. Nothing in these terms limits rights or remedies that cannot legally be limited.</p>
      </Section>
      <Section title="Disputes and governing law">
        <p>Please contact us first at <MailLink subject="Terms or dispute question" /> so we can try to resolve a concern. These terms are governed by Illinois law, without regard to conflict-of-law rules. Unless consumer law requires otherwise, disputes will be brought in the state or federal courts serving Chicago, Illinois.</p>
      </Section>
      <Section title="Changes and contact">
        <p>We may update these terms as Myrakal grows. Changes apply when posted unless law requires otherwise. The date above shows the current version. Questions may be sent to <MailLink subject="Terms question" />.</p>
      </Section>
    </LegalLayout>
  )
}
