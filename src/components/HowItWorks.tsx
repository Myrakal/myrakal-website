import {
  BadgeCheck,
  Bone,
  CalendarCheck,
  Check,
  FileText,
  HeartPulse,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  Smile,
  Star,
  Stamp,
  Stethoscope,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { IN, MX, TH, TR } from 'country-flag-icons/react/3x2'
import aeromexico from '@/assets/airlines/AM.png'
import american from '@/assets/airlines/AA.png'
import delta from '@/assets/airlines/DL.png'
import casaVida from '@/assets/hotels/casa-vida.jpg'
import grandPlaza from '@/assets/hotels/grand-plaza.jpg'
import palmaCentro from '@/assets/hotels/palma-centro.jpg'

import { MockCard } from '@/components/MockCard'
import { ScrollSteps, type ScrollStep } from '@/components/ScrollSteps'

const COUNTRIES = [
  { name: 'Mexico', code: 'MX', Flag: MX },
  { name: 'Turkey', code: 'TR', Flag: TR },
  { name: 'India', code: 'IN', Flag: IN },
  { name: 'Thailand', code: 'TH', Flag: TH },
]

const SPECIALTIES = [
  { name: 'Orthopedic surgery', icon: Bone, rating: '4.9' },
  { name: 'Cardiology', icon: HeartPulse, rating: '4.8' },
  { name: 'Dental care', icon: Smile, rating: '5.0' },
]

function CountryPicker() {
  return (
    <MockCard label="Where to?">
      <ul className="flex flex-col gap-3">
        {COUNTRIES.map((country, i) => {
          const selected = i === 0
          return (
            <li
              key={country.code}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
                selected ? 'border-primary bg-secondary' : 'border-border'
              }`}
            >
              <country.Flag
                aria-hidden="true"
                className="h-7 w-auto shrink-0 rounded-sm shadow-sm ring-1 ring-black/10"
              />
              <span className="flex-1 text-lg font-medium">{country.name}</span>
              {selected ? (
                <Check className="size-5 text-primary" aria-label="Selected" />
              ) : null}
            </li>
          )
        })}
      </ul>
    </MockCard>
  )
}

function DoctorPicker() {
  return (
    <MockCard label="Specialties">
      <ul className="flex flex-col gap-3">
        {SPECIALTIES.map((specialty, i) => {
          const selected = i === 0
          return (
            <li
              key={specialty.name}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
                selected ? 'border-primary bg-secondary' : 'border-border'
              }`}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <specialty.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-lg font-medium">{specialty.name}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                  <span className="font-medium text-foreground">{specialty.rating}</span>
                  rated by locals
                </span>
              </div>
              {selected ? (
                <Check className="size-5 text-primary" aria-label="Selected" />
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-primary">
        <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          Board-certified doctors
        </span>
        <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Accredited hospitals
        </span>
      </div>
    </MockCard>
  )
}

const DOCUMENTS: { name: string; icon: LucideIcon; status: string; done: boolean }[] = [
  { name: 'Passport check', icon: FileText, status: 'Verified', done: true },
  { name: 'Medical visa', icon: Stamp, status: 'In review', done: false },
  { name: 'Flight itinerary', icon: Plane, status: 'Pending', done: false },
]

const FOLLOW_UPS: { when: string; name: string; icon: LucideIcon }[] = [
  { when: 'Day 3', name: 'Recovery check-in', icon: MessageCircle },
  { when: 'Week 2', name: 'Surgeon video call', icon: Stethoscope },
  { when: 'Month 3', name: 'Local follow-up visit', icon: CalendarCheck },
]

function TravelDocuments() {
  return (
    <MockCard label="Travel documents" ghost>
      <ul className="flex flex-col gap-3">
        {DOCUMENTS.map((doc) => (
          <li
            key={doc.name}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
              doc.done ? 'border-primary bg-secondary' : 'border-border'
            }`}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <doc.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1 text-lg font-medium">{doc.name}</span>
            <span className="text-sm text-muted-foreground">{doc.status}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

function FollowUps() {
  return (
    <MockCard label="Follow-ups" ghost>
      <ul className="flex flex-col gap-3">
        {FOLLOW_UPS.map((item, i) => (
          <li
            key={item.name}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
              i === 0 ? 'border-primary bg-secondary' : 'border-border'
            }`}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1 text-lg font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">{item.when}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

const HOTELS = [
  { name: 'Hotel Palma Centro', photo: palmaCentro, detail: '5 min from hospital', price: '$85' },
  { name: 'Casa Vida Suites', photo: casaVida, detail: 'Recovery-friendly rooms', price: '$110' },
  { name: 'Grand Plaza', photo: grandPlaza, detail: 'Airport shuttle included', price: '$140' },
]

const FLIGHTS = [
  { airline: 'Aeroméxico', logo: aeromexico, detail: 'JFK → MEX · Nonstop · 5h 20m', price: '$310' },
  { airline: 'Delta', logo: delta, detail: 'JFK → MEX · 1 stop · 8h 05m', price: '$245' },
  { airline: 'American', logo: american, detail: 'JFK → MEX · Nonstop · 5h 45m', price: '$365' },
]

function SearchBar({ query, budget }: { query: string; budget: string }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
      <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border px-4 py-3 text-muted-foreground">
        <Search className="size-5" aria-hidden="true" />
        <span className="text-base">{query}</span>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-primary">
        <Wallet className="size-4" aria-hidden="true" />
        {budget}
      </div>
    </div>
  )
}

function Hotels() {
  return (
    <MockCard label="Hotels" ghost>
      <SearchBar query="Search hotels" budget="Under $150/night" />
      <ul className="flex flex-col gap-3">
        {HOTELS.map((hotel, i) => (
          <li
            key={hotel.name}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
              i === 0 ? 'border-primary bg-secondary' : 'border-border'
            }`}
          >
            <img
              src={hotel.photo}
              alt=""
              className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-black/10"
            />
            <div className="flex flex-1 flex-col">
              <span className="text-lg font-medium">{hotel.name}</span>
              <span className="text-sm text-muted-foreground">{hotel.detail}</span>
            </div>
            <span className="text-lg font-medium">{hotel.price}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

function Flights() {
  return (
    <MockCard label="Flights" ghost>
      <SearchBar query="Search flights" budget="Under $400" />
      <ul className="flex flex-col gap-3">
        {FLIGHTS.map((flight, i) => (
          <li
            key={flight.detail}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
              i === 0 ? 'border-primary bg-secondary' : 'border-border'
            }`}
          >
            <img
              src={flight.logo}
              alt=""
              className="size-10 shrink-0 rounded-xl bg-white object-contain p-1.5 ring-1 ring-black/10"
            />
            <div className="flex flex-1 flex-col">
              <span className="text-lg font-medium">{flight.airline}</span>
              <span className="text-sm text-muted-foreground">{flight.detail}</span>
            </div>
            <span className="text-lg font-medium">{flight.price}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

const STEPS: ScrollStep[] = [
  {
    title: 'Select your country',
    description:
      "Choose where you'd like to receive care, based on where you're eligible to go.",
    Mock: CountryPicker,
  },
  {
    title: 'Select your doctor',
    description: "Browse vetted specialists and pick who's right for you.",
    Mock: DoctorPicker,
  },
  {
    title: 'Travel documents',
    description: 'Visas, records, and paperwork sorted before you fly.',
    Mock: TravelDocuments,
    ghost: true,
  },
  {
    title: 'Hotels',
    description: 'Search stays near your hospital, all within your budget.',
    Mock: Hotels,
    ghost: true,
  },
  {
    title: 'Flights',
    description: 'Search flights that fit your budget and your dates.',
    Mock: Flights,
    ghost: true,
  },
  {
    title: 'Follow-ups',
    description: 'Aftercare and check-ins once you are back home.',
    Mock: FollowUps,
    ghost: true,
  },
]

function Heading() {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-base font-medium tracking-[0.2em] text-muted-foreground uppercase">
        How it works
      </span>
      <h2 className="text-4xl whitespace-nowrap sm:text-5xl lg:text-[2.75rem] xl:text-6xl 2xl:text-7xl">
        We make it simple.
      </h2>
      <p className="max-w-lg text-xl text-muted-foreground sm:text-2xl">
        We prioritize reputation and safety, all while staying in your budget.
      </p>
    </div>
  )
}

export function HowItWorks() {
  return <ScrollSteps heading={<Heading />} steps={STEPS} />
}
