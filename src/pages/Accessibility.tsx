import { LegalLayout, List, MailLink, Section } from './LegalLayout'

export default function Accessibility() {
  return (
    <LegalLayout
      title="Accessibility"
      documentTitle="Accessibility: Myrakal"
      description="Myrakal’s accessibility approach and contact information for access issues."
      eyebrow="Company / Accessibility"
      lede="We want the Myrakal website to be usable across devices, input methods, and assistive technologies."
    >
      <Section title="Our approach">
        <p>
          We are working to provide clear structure, keyboard-accessible controls, visible focus, readable
          contrast, responsive layouts, text enlargement, descriptive labels, and support for
          reduced-motion preferences. Accessibility is an ongoing part of maintaining the website.
        </p>
      </Section>

      <Section title="Feedback and assistance">
        <p>
          If you encounter an accessibility barrier, email <MailLink subject="Accessibility support" />.
          Please include:
        </p>
        <List>
          <li>The page or feature you were trying to use.</li>
          <li>A short description of what happened.</li>
          <li>Your browser, device, or assistive technology, if you are comfortable sharing it.</li>
          <li>The best way to contact you.</li>
        </List>
        <p>
          Please do not include medical records or sensitive health information. We will work with you to
          provide the information in another format where reasonably possible.
        </p>
      </Section>

      <Section title="Third-party content">
        <p>
          Some website functions may rely on third-party services. We cannot control every aspect of those
          services, but we welcome reports about barriers so we can identify an appropriate alternative or
          raise the issue with the provider.
        </p>
      </Section>
    </LegalLayout>
  )
}
