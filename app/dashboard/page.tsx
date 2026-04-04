import { MoreVertical, ArrowUpRight, CheckCircle2, Clock3, CalendarX2, Layers3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { label: 'Total Ads', value: '1,284', chip: '+12%', icon: Layers3, tone: 'from-[#252d5b] to-[#1b2148]', chipClass: 'bg-[#2d355f] text-[#d3d8ff]' },
  { label: 'Active', value: '842', chip: 'Active', icon: CheckCircle2, tone: 'from-[#163552] to-[#1a2748]', chipClass: 'bg-[#213b5d] text-[#9fd8ff]' },
  { label: 'Pending', value: '156', chip: 'Wait', icon: Clock3, tone: 'from-[#242b55] to-[#1d2448]', chipClass: 'bg-[#353c67] text-[#d9ddff]' },
  { label: 'Expired', value: '286', chip: '-3%', icon: CalendarX2, tone: 'from-[#40253a] to-[#241e35]', chipClass: 'bg-[#523143] text-[#ffb5b3]' },
]

const campaigns = [
  {
    image: 'SG',
    title: 'Summer Glow Campaign',
    category: 'Retail / Lifestyle',
    status: 'Approved',
    statusClass: 'bg-[#173f38] text-[#56e98a]',
    performance: '75% Conversion',
    note: 'Target',
    created: 'May 12, 2024',
    expiry: 'Aug 12, 2024',
    progress: '75%',
    barClass: 'bg-[#b9b8ff]',
  },
  {
    image: 'SR',
    title: 'Skyline Real Estate',
    category: 'B2B / PropTech',
    status: 'Pending',
    statusClass: 'bg-[#32316b] text-[#c5c0ff]',
    performance: 'Under Review',
    note: '',
    created: 'May 24, 2024',
    expiry: 'Dec 24, 2024',
    progress: '18%',
    barClass: 'bg-[#c7c7ff]',
  },
  {
    image: 'RT',
    title: 'Retro Tech Revival',
    category: 'Collectibles',
    status: 'Rejected',
    statusClass: 'bg-[#492738] text-[#ffb2b0]',
    performance: 'Compliance Issue',
    note: '',
    created: 'Apr 30, 2024',
    expiry: '--',
    progress: '10%',
    barClass: 'bg-[#6f4255]',
  },
]

const activity = [
  {
    title: 'Campaign Approved',
    text: 'Your "Summer Glow" campaign has been cleared for launch.',
    time: '2 minutes ago',
    dot: 'bg-[#bdb7ff]',
  },
  {
    title: 'New Payment Received',
    text: 'Payment for Invoice #AF-9283 was successful.',
    time: '1 hour ago',
    dot: 'bg-[#73c7ff]',
  },
  {
    title: 'Action Required',
    text: 'Compliance check failed for "Retro Tech" ad group.',
    time: '3 hours ago',
    dot: 'bg-[#ffb4aa]',
  },
  {
    title: 'System Update',
    text: 'Dashboard version 2.4.0 is now live with improvements.',
    time: 'Yesterday',
    dot: 'bg-white/20',
  },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="af-panel p-7">
                <div className="flex items-start justify-between">
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${stat.tone}`}>
                    <stat.icon className="h-7 w-7 text-[#b8beff]" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${stat.chipClass}`}>{stat.chip}</span>
                </div>
                <p className="mt-6 text-[1.1rem] text-slate-300">{stat.label}</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="af-panel overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-white/5 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">My Active Campaigns</h1>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="rounded-2xl border border-white/5 bg-white/10 px-6 text-base font-semibold text-white hover:bg-white/15">Filter</Button>
                <Button className="rounded-2xl bg-[#12a4ef] px-6 text-base font-semibold text-white hover:bg-[#0f97dd]">Export CSV</Button>
              </div>
            </div>

            <div className="hidden grid-cols-[2.2fr_1.1fr_1.5fr_1.1fr_1fr_40px] gap-4 border-b border-white/5 px-7 py-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 lg:grid">
              <span>Campaign Name</span>
              <span>Status</span>
              <span>Performance</span>
              <span>Created</span>
              <span>Expiry</span>
              <span />
            </div>

            <div className="divide-y divide-white/5">
              {campaigns.map((campaign) => (
                <div key={campaign.title} className="grid gap-5 px-7 py-6 lg:grid-cols-[2.2fr_1.1fr_1.5fr_1.1fr_1fr_40px] lg:items-center">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#101724] text-sm font-black text-slate-300 shadow-inner shadow-black/20">
                      {campaign.image}
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-tight text-white">{campaign.title}</p>
                      <p className="mt-1 text-lg text-slate-400">{campaign.category}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-4 py-2 text-lg font-bold ${campaign.statusClass}`}>{campaign.status}</span>
                  </div>
                  <div>
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-[#0c1328]">
                      <div className={`h-full rounded-full ${campaign.barClass}`} style={{ width: campaign.progress }} />
                    </div>
                    <p className="text-lg font-semibold text-slate-300">{campaign.performance}</p>
                    {campaign.note ? <p className="text-sm text-slate-500">{campaign.note}</p> : null}
                  </div>
                  <p className="text-lg text-slate-300">{campaign.created}</p>
                  <p className="text-lg text-slate-300">{campaign.expiry}</p>
                  <button type="button" className="text-slate-400 transition hover:text-white" aria-label={`More actions for ${campaign.title}`}>
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 px-7 py-5 text-center">
              <button type="button" className="text-xl font-semibold text-[#d7dbff] transition hover:text-white">View All Campaigns</button>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="af-panel p-7">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">Recent Activity</h2>
            <div className="mt-8 space-y-8">
              {activity.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className={`mt-2 h-3 w-3 flex-none rounded-full ${item.dot}`} />
                  <div>
                    <p className="text-[1.7rem] font-bold leading-tight text-white">{item.title}</p>
                    <p className="mt-2 text-lg leading-8 text-slate-300">{item.text}</p>
                    <p className="mt-3 text-base text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-10 h-14 w-full rounded-2xl border border-white/5 bg-white/10 text-lg font-bold uppercase tracking-[0.1em] text-white hover:bg-white/15">View Full History</Button>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-cyan-400/10 bg-gradient-to-br from-[#5a4cf6] to-[#179aea] p-7 shadow-[0_25px_70px_rgba(20,157,233,0.2)]">
            <h3 className="text-4xl font-extrabold tracking-tight text-white">Upgrade to Enterprise</h3>
            <p className="mt-4 text-lg leading-8 text-blue-50/90">Unlock advanced analytics and direct support.</p>
            <Button className="mt-10 h-14 rounded-2xl bg-white/90 px-8 text-xl font-bold text-[#544ef5] hover:bg-white">Upgrade Now <ArrowUpRight className="ml-2 h-5 w-5" /></Button>
          </section>
        </aside>
      </div>

      <footer className="flex flex-col gap-4 border-t border-white/5 px-1 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-extrabold uppercase text-white">AdFlowPro</p>
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


