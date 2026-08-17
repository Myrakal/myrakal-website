import type { Metadata } from "next"; import { UtilityPage } from "../UtilityPage";
export const metadata: Metadata = { title: "Terms — Myrakal", description: "Terms for use of the Myrakal marketing website." };
export default function Page(){return <UtilityPage label="LEGAL / TERMS" title="Website terms." intro="These terms govern use of the public Myrakal marketing website. Product access and commercial services require a separate written agreement.">
  <p className="legal-updated">Last updated: August 17, 2026 · Legal review required before commercial launch.</p>
  <section><h2>Using this website</h2><p>You may use this website for lawful informational and business purposes. Do not interfere with its operation, attempt unauthorized access, introduce malicious code, or misuse its content.</p></section>
  <section><h2>Not medical advice</h2><p>The website describes operational software concepts. It does not provide medical, clinical, legal, financial, or insurance advice and is not a substitute for professional judgment.</p></section>
  <section><h2>Product descriptions</h2><p>Conceptual demonstrations illustrate product direction and operating principles. Availability, functionality, permissions, integrations, and commercial terms are established only in applicable written agreements.</p></section>
  <section><h2>Intellectual property</h2><p>The website and its original content, visual system, marks, and software are owned by Myrakal or its licensors and are protected by applicable law. No license is granted except the limited right to view and use the site as intended.</p></section>
  <section><h2>Third-party resources</h2><p>Links to third-party resources are provided for convenience. Their services and practices are governed by their own terms.</p></section>
  <section><h2>Disclaimers and liability</h2><p>The website is provided for informational purposes and may change. Any warranty exclusions, liability limitations, governing law, venue, and dispute terms require final legal approval and will be added before these terms govern a commercial service.</p></section>
  <section><h2>Contact</h2><p>Questions about these terms may be sent to <a href="mailto:eshaanksood@gmail.com?subject=Myrakal%20terms%20inquiry">eshaanksood@gmail.com</a>.</p></section>
</UtilityPage>}
