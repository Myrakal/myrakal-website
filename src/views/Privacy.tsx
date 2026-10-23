import { LegalLayout, List, MailLink, Section } from './LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      eyebrow="Legal / Privacy"
      lede="This policy explains how Myrakal handles information collected through this public website and our intake and consult services."
    >
      <Section title="Health information you share" callout>
        <p>
          Our intake and consult services ask for health information, which can include your diagnosis or
          case, lab results, imaging, other tests, and insurance plan details. Share it only through the
          Myrakal intake and consult experience, not through general email or the website contact form.
        </p>
      </Section>

      <Section title="Information we collect">
        <p>
          We collect information you choose to provide, including your name, email address, messages you
          send us, and the health and insurance information you submit during intake and consult.
        </p>
        <p>
          Our hosting, security, analytics, font, and form providers may also process technical
          information needed to deliver and protect the website, such as your IP address, browser and
          device information, requested pages, timestamps, and security events.
        </p>
      </Section>

      <Section title="How we use information">
        <List>
          <li>Run intake, including using artificial intelligence (AI) tools to organize your information and suggest labs, imaging, tests, or insurance details to gather.</li>
          <li>Share your case with a licensed doctor so they can review it, approve it, or recommend changes.</li>
          <li>Contact you about Myrakal and respond to questions and requests.</li>
          <li>Operate, secure, troubleshoot, and improve the website and services.</li>
          <li>Comply with law and protect our rights, users, and services.</li>
        </List>
      </Section>

      <Section title="Service providers and disclosures">
        <p>
          We use service providers to support website hosting and security, form processing, email,
          analytics, AI processing, and web fonts. These providers currently include Vercel, Formspree, PostHog, Fontshare, and Google Fonts. They may process information on our behalf under their own terms
          and privacy commitments. Licensed doctors who review your case also receive the information
          needed for that review.
        </p>
        <p>
          We may disclose information when required by law, to protect rights or safety, or as part of a
          merger, financing, acquisition, or similar business transaction. We do not sell personal
          information or share it for cross-context behavioral advertising.
        </p>
      </Section>

      <Section title="Cookies and similar technologies">
        <p>
          Hosting and security providers may use cookies or similar technologies that are necessary to
          deliver and protect the website. Our analytics provider may use cookies, local storage, or similar technologies to understand
          how the website is used. We do not knowingly enable advertising cookies.
        </p>
      </Section>

      <Section title="Retention and security">
        <p>
          We retain information only as long as reasonably necessary for the purposes described above,
          including providing intake and consult services, responding to you, meeting legal obligations, and resolving
          disputes. We use safeguards appropriate to the nature of the information, but no method of
          transmission or storage is completely secure.
        </p>
      </Section>

      <Section title="Your choices and privacy rights">
        <p>
          You may unsubscribe from non-transactional email through the instructions in the message or by
          contacting us. Depending on where you live and applicable law, you may also have rights to
          request access, correction, deletion, or a copy of your personal information, or to object to or
          limit certain uses.
        </p>
        <p>
          California residents may have rights to know, delete, correct, and limit certain uses of
          personal information and to receive equal service when exercising those rights. Because we do
          not sell or share personal information for cross-context behavioral advertising, we do not offer
          a sale or sharing opt-out. To make a request, email <MailLink subject="Privacy request" />. We
          may need to verify your identity before completing a request.
        </p>
      </Section>

      <Section title="Children">
        <p>
          This website is not directed to children under 18, and we do not knowingly collect personal
          information from children.
        </p>
      </Section>

      <Section title="International processing">
        <p>
          Your information may be processed in the United States and other countries where our providers
          operate. Those countries may have different data-protection laws than your home country.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          We may update this policy as the website and our practices develop. The date above identifies
          the current version. Questions or privacy requests may be sent to{' '}
          <MailLink subject="Privacy question" />.
        </p>
      </Section>
    </LegalLayout>
  )
}
