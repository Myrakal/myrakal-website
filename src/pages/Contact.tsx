import { LegalLayout, MailLink, Section } from './LegalLayout'

export default function Contact() {
  return (
    <LegalLayout
      title="Contact Myrakal"
      documentTitle="Contact: Myrakal"
      description="Contact Myrakal for general, privacy, security, and accessibility questions."
      eyebrow="Company / Contact"
      lede="Myrakal Inc. is based in Chicago, Illinois, United States."
    >
      <Section title="General inquiries">
        <p>
          Email <MailLink subject="Myrakal inquiry" /> for questions about Myrakal, the waitlist,
          partnerships, or this website.
        </p>
      </Section>

      <Section title="Privacy and data requests">
        <p>
          Email <MailLink subject="Privacy request" /> with “Privacy request” in the subject line. Please
          do not include medical records or other sensitive health information.
        </p>
      </Section>

      <Section title="Accessibility support">
        <p>
          If something prevents you from using this website, email <MailLink subject="Accessibility support" />{' '}
          with the page address and a description of the issue. We will work with you to provide the
          information in another format where reasonably possible.
        </p>
      </Section>

      <Section title="Security concerns">
        <p>
          Email <MailLink subject="Security concern" /> with a concise description of the concern. Do not
          include passwords, medical information, or exploit code in an initial message.
        </p>
      </Section>

      <Section title="Medical emergencies and clinical questions" callout>
        <p>
          This contact address is not monitored as an emergency or clinical service. Contact local
          emergency services for emergencies and a licensed healthcare professional for medical advice.
        </p>
      </Section>
    </LegalLayout>
  )
}
