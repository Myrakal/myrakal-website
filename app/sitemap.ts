import type { MetadataRoute } from "next";
const routes=["","/about","/contact","/request-access","/security","/privacy","/terms","/accessibility"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route)=>({url:`https://myrakal-website.eshaanksood.chatgpt.site${route}`,lastModified:new Date("2026-08-16"),changeFrequency:route ? "monthly" : "weekly",priority:route ? .7 : 1})); }
