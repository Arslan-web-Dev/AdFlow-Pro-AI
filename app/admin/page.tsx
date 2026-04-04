'use client'

import { BadgeDollarSign, Clock3, MousePointerClick, Wallet2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  {
    label: 'Total Revenue',
    value: '$4,281,940',
    chip: '+12.5%',
    icon: Wallet2,
    note: '',
    chipClass: 'bg-[#173f38] text-[#62eca1]',
  },
  {
    label: 'Active Ads',
    value: '12,842',
    chip: '+240 new',
    icon: MousePointerClick,
    note: 'Running across 48 countries',
    chipClass: 'bg-[#2b3171] text-[#aeb3ff]',
  },
  {
    label: 'Pending Verification',
    value: '$142,300',
    chip: 'Action Needed',
    icon: Clock3,
    note: '18 High-value transactions',
    chipClass: 'bg-[#4e2a39] text-[#ffb2b0]',
  },
]

const payments = [
  ['#TXN-94021-AD', 'Julianne Devis', 'julianne@metaflow.io', '$14,500.00', 'Pending Verification', 'Approve', 'Reject'],
  ['#TXN-88210-AD', 'Marcus Thorne', 'marcus@exus.com', '$2,840.00', 'Verified', '', ''],
  ['#TXN-77341-AD', 'Aria Kurosawa', 'aria@k-media.jp', '$58,200.00', 'Pending Verification', 'Approve', 'Reject'],
  ['#TXN-55102-AD', 'Elena Rodriguez', 'elena@adspark.es', '$1,200.00', 'Failed', '', ''],
]

const donut = [
  { label: 'Enterprise Elite', value: '45%', color: 'bg-[#5b4df7]' },
  { label: 'Growth Pro', value: '30%', color: 'bg-[#1aa0ed]' },
  { label: 'Starter Core', value: '15%', color: 'bg-[#bbbcff]' },
]

export default function AdminPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
          <p className="mt-2 text-xl text-slate-300">Welcome back. Here&apos;s what&apos;s happening with your marketplace today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="h-14 rounded-2xl border border-white/5 bg-white/10 px-6 text-lg font-semibold text-white hover:bg-white/15">Last 30 Days</Button>
          <Button className="h-14 rounded-2xl bg-[#12a4ef] px-6 text-lg font-semibold text-white hover:bg-[#0f97dd]">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {stats.map((stat) => (
          <section key={stat.label} className="af-panel p-7">
            <div className="flex items-start justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#212956] text-[#9ecbff]">
                <stat.icon className="h-7 w-7" />
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${stat.chipClass}`}>{stat.chip}</span>
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="mt-3 text-5xl font-extrabold tracking-tight text-white">{stat.value}</p>
            {stat.note ? <p className="mt-4 text-lg text-slate-400">{stat.note}</p> : <div className="mt-6 h-1 w-[72%] rounded-full bg-[#5b4df7]" />}
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <section className="af-panel min-h-[460px] p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-white">Revenue Growth</h2>
              <p className="mt-2 text-lg text-slate-400">Monthly performance tracking</p>
            </div>
            <div className="flex items-center gap-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#5b4df7]" /> Current</span>
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-white/20" /> Projected</span>
            </div>
          </div>
          <div className="mt-10 flex h-[320px] items-end justify-between gap-4 rounded-[24px] border border-white/5 bg-[#171f35] px-8 pb-10 pt-6">
            {[52, 74, 66, 90, 106, 121, 140].map((value, index) => (
              <div key={value} className="flex h-full flex-1 flex-col justify-end gap-4">
                <div className="rounded-t-[18px] bg-gradient-to-t from-[#5b4df7] to-[#1aa0ed]" style={{ height: `${value * 2}px` }} />
                <span className="text-center text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="af-panel p-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Ad Distribution</h2>
          <p className="mt-2 text-lg text-slate-400">By Package Category</p>
          <div className="mt-8 flex justify-center">
            <div className="relative grid h-56 w-56 place-items-center rounded-full" style={{ background: 'conic-gradient(#5b4df7 0 45%, #1aa0ed 45% 75%, #bbbcff 75% 90%, rgba(255,255,255,0.16) 90% 100%)' }}>
              <div className="grid h-32 w-32 place-items-center rounded-full bg-[#1a223b] text-center">
                <div>
                  <p className="text-5xl font-extrabold text-white">100%</p>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500">Coverage</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            {donut.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-3 text-slate-300"><span className={`h-3 w-3 rounded-full ${item.color}`} />{item.label}</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="af-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Recent Payment Verification</h2>
          <button type="button" className="text-lg font-semibold text-[#d7dbff] transition hover:text-white">View all history</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map(([id, name, email, amount, status, primary, secondary]) => (
                <tr key={id} className="text-lg text-slate-300">
                  <td className="px-8 py-6 font-semibold text-white">{id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#313854] text-sm font-bold text-slate-200">{name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <p className="font-semibold text-white">{name}</p>
                        <p className="text-sm text-slate-500">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-white">{amount}</td>
                  <td className="px-8 py-6">
                    <span className={`rounded-full px-4 py-2 text-sm font-bold ${status === 'Verified' ? 'bg-[#173f38] text-[#56e98a]' : status === 'Failed' ? 'bg-[#4e2a39] text-[#ffb2b0]' : 'bg-[#2b3171] text-[#bfc4ff]'}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      {primary ? <Button className="h-11 rounded-2xl bg-[#5b4df7] px-5 text-base font-semibold text-white hover:bg-[#5043ef]">{primary}</Button> : null}
                      {secondary ? <Button className="h-11 rounded-2xl bg-[#4b2434] px-5 text-base font-semibold text-white hover:bg-[#411f2d]">{secondary}</Button> : null}
                      {!primary && !secondary ? <BadgeDollarSign className="h-5 w-5 text-slate-500" /> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-white/5 px-1 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-extrabold uppercase text-white">AdFlow Pro</p>
          <p className="mt-2">© 2024 AdFlow Pro. The Digital Curator.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.18em]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Policy</span>
        </div>
      </footer>
    </div>
  )
}

