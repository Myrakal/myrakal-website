type Section = { heading: string; steps?: string[]; points?: string[]; body?: string }

export type Guide = { slug: string; title: string; description: string; headline: string; answer: string; updated: string; sections: Section[]; sources: [string, string][] }
