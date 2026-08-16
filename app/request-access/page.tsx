import type { Metadata } from "next";
import { RequestAccessForm } from "../RequestAccessForm";
import { UtilityPage } from "../UtilityPage";
export const metadata: Metadata = { title: "Request access — Myrakal", description: "Request early access to Myrakal for your healthcare practice." };
export default function Page(){return <UtilityPage label="REQUEST / ACCESS" title="Put Myrakal to work." intro="Tell us about your practice. We will use this information only to understand fit and respond to your request."><RequestAccessForm /></UtilityPage>}
