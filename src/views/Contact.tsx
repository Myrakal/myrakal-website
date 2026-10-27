import { LegalLayout, MailLink, Section } from './LegalLayout'

export default function Contact() {
  return (
    <LegalLayout
      title="Contact Myrakal"
      eyebrow="Company / Contact"
      lede="Myrakal Inc. is based in Chicago, Illinois, United States."
    >
      <Section title="Email us">
        <p>
          Email <MailLink subject="Myrakal inquiry" /> for questions about Myrakal, our services,
          partnerships, or this website. For a privacy request, accessibility problem, or security
          concern, put “Privacy request”, “Accessibility support”, or “Security concern” in the subject
          line.
        </p>
        <p>
          For accessibility problems, include the page address and a description of the issue. For
          security concerns, describe the concern concisely. Please do not include health information,
          passwords, or exploit code in a first message; we will tell you how to share anything needed
          securely.
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
