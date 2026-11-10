import type { Metadata } from 'next'

import { LegalLayout, List, MailLink, Section } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | Myrakal',
  description: 'How Myrakal collects, uses and protects the information you share through its website and quote form.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" eyebrow="Legal / Privacy" lede="This policy explains how Myrakal handles information collected through this website, our quote form and the care we help you compare and book.">
      <Section title="Health information you share" callout>
        <p>Your quote and messages may include details about treatment you need. Share only what is needed to compare options. We use it to find and book care for you and do not use it for advertising.</p>
      </Section>
      <Section title="Information we collect">
        <p>We collect what you choose to give us: your name, email address, phone number, the treatment you are looking for, your quote or message, and how you heard about us. If you book with us, we also collect the details needed to arrange your care and travel.</p>
        <p>Our hosting, form, analytics and font providers may process technical information needed to run and protect the website, such as your IP address, browser and device details, pages visited and timestamps.</p>
      </Section>
      <Section title="How we use information">
        <List>
          <li>Reply to your quote request and compare care options for you.</li>
          <li>Share the details a provider needs to give you a price or book your care, only for providers you ask us to contact or choose.</li>
          <li>Arrange travel, paperwork and aftercare when you book with us.</li>
          <li>Operate, secure and improve the website.</li>
          <li>Comply with law and protect our rights, users and services.</li>
        </List>
      </Section>
      <Section title="Service providers and disclosures">
        <p>We use service providers for hosting, form processing, email, analytics and web fonts. They currently include Vercel, Formspree, PostHog and Google Fonts, and they process information under their own terms and privacy commitments.</p>
        <p>We may disclose information when required by law, to protect rights or safety, or as part of a merger, financing, acquisition or similar transaction. We do not sell personal information or share it for cross-context behavioral advertising.</p>
      </Section>
      <Section title="Cookies and similar technologies">
        <p>Hosting and security providers may use cookies or similar technologies needed to deliver and protect the website. Our analytics provider may use cookies or local storage to understand how the website is used. We do not use advertising cookies.</p>
      </Section>
      <Section title="Retention and security">
        <p>We keep information only as long as reasonably needed for the purposes above, including helping with your care, meeting legal obligations and resolving disputes. We use safeguards suited to the information, but no method of transmission or storage is completely secure.</p>
      </Section>
      <Section title="Your choices and privacy rights">
        <p>Depending on where you live, you may have rights to access, correct, delete or get a copy of your personal information, or to object to or limit certain uses. California residents may have rights to know, delete, correct and limit certain uses of personal information and to equal service when using those rights. To make a request, email <MailLink subject="Privacy request" />. We may need to verify your identity first.</p>
      </Section>
      <Section title="Children">
        <p>This website is not directed to children under 18, and we do not knowingly collect personal information from children.</p>
      </Section>
      <Section title="International processing">
        <p>If you compare or book care abroad, your information may be shared with providers in that country and processed where our service providers operate. Those countries may have different data-protection laws than yours.</p>
      </Section>
      <Section title="Changes and contact">
        <p>We may update this policy as Myrakal grows. The date above shows the current version. Questions may be sent to <MailLink subject="Privacy question" />.</p>
      </Section>
    </LegalLayout>
  )
}
