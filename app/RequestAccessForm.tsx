"use client";

import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "eshaanksood@gmail.com";

export function RequestAccessForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("loading");
    const data = new FormData(event.currentTarget);
    if (data.get("website")) { setState("success"); return; }
    const required = ["name", "email", "organization", "role"];
    if (required.some((key) => !String(data.get(key) || "").trim())) { setState("error"); return; }
    const body = ["MYRAKAL ACCESS REQUEST", "", ...["name", "email", "organization", "role", "locations", "pms", "note"].map((key) => `${key.toUpperCase()}: ${String(data.get(key) || "—")}`)].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Myrakal — Request access")}&body=${encodeURIComponent(body)}`;
    setState("success");
  }
  if (state === "success") return <div className="form-success" role="status"><p className="utility-label">REQUEST / READY</p><h2>Your email client is open.</h2><p>Send the prepared message and we&rsquo;ll be in touch. If it did not open, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p></div>;
  return <form className="access-form" onSubmit={submit} noValidate>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <label>Name<input name="name" autoComplete="name" required /></label><label>Work email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Organization / practice<input name="organization" autoComplete="organization" required /></label><label>Role<input name="role" autoComplete="organization-title" required /></label>
    <label>Number of locations<select name="locations" defaultValue=""><option value="">Select</option><option>1</option><option>2–5</option><option>6–20</option><option>21+</option></select></label>
    <label>Practice management system<input name="pms" /></label><label className="form-wide">Anything we should know? <span>Do not include patient information.</span><textarea name="note" rows={5} /></label>
    {state === "error" && <p className="form-error" role="alert">Complete the required fields and try again.</p>}
    <button className="button-dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "PREPARING…" : "PREPARE REQUEST →"}</button>
  </form>;
}
