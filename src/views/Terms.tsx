import { LegalLayout, MailLink, Section } from './LegalLayout'

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      eyebrow="Legal / Terms"
      lede="These terms govern your use of the public Myrakal website and the intake and consult services offered through it."
    >
      <Section title="Acceptance">
        <p>
          By using this website, you agree to these Terms of Service. If you do not agree, do not use the
          website. You must be at least 18 years old to use the services.
        </p>
      </Section>

      <Section title="Our service">
        <p>
          Myrakal helps you evaluate care options through two steps. In intake, you can come to us with or
          without a current diagnosis or case. Our AI tools help gather, or suggest that you obtain,
          information such as lab results, imaging, other tests, and your insurance plan. In consult, a
          licensed doctor reviews your case and either approves it or recommends changes.
        </p>
        <p>
          Myrakal does not currently accept bookings or payments through the website. A
          patient-provider relationship with a doctor is formed only as described at the time of a
          consult.
        </p>
      </Section>

      <Section title="AI-assisted intake">
        <p>
          AI tools may be inaccurate or incomplete. They help organize information and suggest next
          steps, but they do not diagnose, treat, or replace a doctor. A licensed doctor reviews your
          case before any approval or change is communicated to you. You are responsible for the accuracy
          and completeness of the information you provide.
        </p>
      </Section>

      <Section title="Not medical advice or emergency service" callout>
        <p>
          Myrakal is not itself a healthcare provider. Clinical advice comes only from the licensed doctor
          who reviews your case. Website content and AI-generated suggestions are informational and are
          not medical advice, diagnosis, or treatment. Do not use the website
          for emergencies. Contact local emergency services if you may be experiencing a medical
          emergency.
        </p>
      </Section>

      <Section title="Myrakal’s role">
        <p>
          Myrakal may provide information and coordination tools that help users evaluate international
          care options. Healthcare professionals and facilities are independent third parties responsible
          for their own clinical advice, treatment, licensing, conduct, and outcomes. References to
          credentials or accreditation are informational and should be independently verified before care.
        </p>
      </Section>

      <Section title="Bookings, payments, cancellations, and refunds">
        <p>
          The website does not currently accept bookings or payments. If Myrakal offers a transaction,
          the applicable price, payment terms, provider terms, cancellation rules, and refund policy will
          be presented before you authorize payment. Those transaction-specific terms will control if they
          conflict with these website terms.
        </p>
        <p>
          You remain responsible for understanding provider charges, travel costs, insurance coverage,
          visa and passport requirements, and any follow-up care.
        </p>
      </Section>

      <Section title="Permitted use">
        <p>
          You may use the website for lawful personal or business purposes. You may not interfere with its
          operation, attempt unauthorized access, introduce malicious code, impersonate another person,
          scrape the website in a manner that burdens the service, or use its content unlawfully.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          The website, brand, visual design, text, graphics, and software are owned by Myrakal or its
          licensors and are protected by applicable law. These terms grant only a limited, revocable right
          to use the website as intended.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          The website may rely on or link to third-party services. Their products, content, availability,
          terms, and privacy practices are their responsibility. A link or reference does not constitute a
          guarantee or endorsement.
        </p>
      </Section>

      <Section title="Disclaimers and limitation of liability">
        <p>
          The website is provided “as is” and “as available.” To the fullest extent permitted by law,
          Myrakal disclaims implied warranties and does not guarantee uninterrupted access, complete
          accuracy, provider availability, travel eligibility, or any medical or financial outcome.
        </p>
        <p>
          To the fullest extent permitted by law, Myrakal will not be liable for indirect, incidental,
          special, consequential, or punitive damages arising from use of this website. Nothing in these
          terms limits rights or remedies that cannot legally be limited.
        </p>
      </Section>

      <Section title="Disputes and governing law">
        <p>
          Please contact us first at <MailLink subject="Terms or dispute question" /> so we can try to
          resolve a concern. These terms are governed by Illinois law, without regard to conflict-of-law
          rules. Unless applicable consumer law requires otherwise, disputes concerning this website will
          be brought in the state or federal courts serving Chicago, Illinois.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          We may update these terms as the website and services develop. Changes apply when posted, unless
          law requires otherwise. Questions may be sent to <MailLink subject="Terms question" />.
        </p>
      </Section>
    </LegalLayout>
  )
}
