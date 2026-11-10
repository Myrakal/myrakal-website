import { GUIDES } from '@/lib/guides'
import { SITE } from '@/lib/site'
import { TREATMENTS } from '@/lib/treatments'

export const LLMS_TEXT = `# Myrakal

> Myrakal, based in Chicago, Illinois, finds, prices and books the expensive care insurance won't cover, starting with dental work (implants, All-on-4, full-mouth work) and cosmetic procedures, in the U.S. or abroad. Patients send their quote and get verified options with all-in prices up front. Comparing options is free. Myrakal is paid by patients and never takes money from clinics.

Myrakal is not a medical provider and does not diagnose or treat. Information on this website is not medical advice. In an emergency, call 911 or your local emergency number.

## How it works

- Send Myrakal the quote you were given, or describe the care you need
- Myrakal's team compares verified providers in the U.S. and abroad and checks what each price includes
- Pick an option and Myrakal books it, along with travel, paperwork and aftercare, for one coordination fee shown before they commit

## Pages

- [Home](${SITE}): overview
${Object.values(TREATMENTS).map(({ name, slug, description }) => `- [${name}](${SITE}/${slug}): ${description}`).join('\n')}
${Object.values(GUIDES).map(({ slug, headline }) => `- [${headline}](${SITE}/guides/${slug})`).join('\n')}
`
