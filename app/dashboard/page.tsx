'use client'

import { motion } from 'framer-motion'
import { MoreVertical, ArrowUpRight, CheckCircle2, Clock3, CalendarX2, Layers3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { 
    label: 'Total Ads', 
    value: '1,284', 
    chip: '+12%', 
    icon: Layers3, 
    color: 'bg-[hsl(var(--primary))] text-white',
    chipClass: 'bg-[hsl(var(--success))] text-white',
    borderColor: 'border-[hsl(var(--primary))]/20'
  },
  { 
    label: 'Active', 
    value: '842', 
    chip: 'Active', 
    icon: CheckCircle2, 
    color: 'bg-[hsl(var(--success))] text-white',
    chipClass: 'bg-[hsl(var(--success))] text-white',
    borderColor: 'border-[hsl(var(--success))]/20'
  },
  { 
    label: 'Pending', 
    value: '156', 
    chip: 'Wait', 
    icon: Clock3, 
    color: 'bg-[hsl(var(--warning))] text-white',
    chipClass: 'bg-[hsl(var(--warning))] text-white',
    borderColor: 'border-[hsl(var(--warning))]/20'
  },
  { 
    label: 'Expired', 
    value: '286', 
    chip: '-3%', 
    icon: CalendarX2, 
    color: 'bg-[hsl(var(--danger))] text-white',
    chipClass: 'bg-[hsl(var(--danger))] text-white',
    borderColor: 'border-[hsl(var(--danger))]/20'
  },
]

const campaigns = [
  {
    image: 'SG',
    title: 'Summer Glow Campaign',
    category: 'Retail / Lifestyle',
    status: 'Approved',
    statusClass: 'bg-[hsl(var(--success))] text-white',
    performance: '75% Conversion',
    note: 'Target',
    created: 'May 12, 2024',
    expiry: 'Aug 12, 2024',
    progress: '75%',
    barClass: 'bg-[hsl(var(--primary))]',
  },
  {
    image: 'SR',
    title: 'Skyline Real Estate',
    category: 'B2B / PropTech',
    status: 'Pending',
    statusClass: 'bg-[hsl(var(--warning))] text-white',
    performance: 'Under Review',
    note: '',
    created: 'May 24, 2024',
    expiry: 'Dec 24, 2024',
    progress: '18%',
    barClass: 'bg-[hsl(var(--primary))]',
  },
  {
    image: 'RT',
    title: 'Retro Tech Revival',
    category: 'Collectibles',
    status: 'Rejected',
    statusClass: 'bg-[hsl(var(--danger))] text-white',
    performance: 'Compliance Issue',
    note: '',
    created: 'Apr 30, 2024',
    expiry: '--',
    progress: '10%',
    barClass: 'bg-[hsl(var(--primary))]',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    }
  },
}

export default function DashboardOverview() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 lg:space-y-8"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <motion.div 
                key={stat.label} 
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className={`af-panel p-7 border ${stat.borderColor} hover:shadow-lg hover:shadow-[hsl(var(--primary))]/10 transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${stat.color} shadow-md`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${stat.chipClass} shadow-sm`}>{stat.chip}</span>
                </div>
                <p className="mt-6 text-[1.1rem] text-muted-foreground font-medium">{stat.label}</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.section variants={itemVariants} className="af-panel overflow-hidden border-border/10">
            <div className="flex flex-col gap-4 border-b border-border/10 px-7 py-6 sm:flex-row sm:items-center sm:justify-between bg-muted/30">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">My Active Campaigns</h1>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-2xl border-border/50 px-6 text-base font-semibold hover:bg-muted">Filter</Button>
                <Button className="btn-primary rounded-2xl px-6 text-base font-semibold">Export CSV</Button>
              </div>
            </div>

            <div className="hidden grid-cols-[2.2fr_1.1fr_1.5fr_1.1fr_1fr_40px] gap-4 border-b border-border/10 px-7 py-5 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground lg:grid">
              <span>Campaign Name</span>
              <span>Status</span>
              <span>Performance</span>
              <span>Created</span>
              <span>Expiry</span>
              <span />
            </div>

            <div className="divide-y divide-border/10">
              {campaigns.map((campaign, idx) => (
                <motion.div 
                  key={campaign.title} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="grid gap-5 px-7 py-6 lg:grid-cols-[2.2fr_1.1fr_1.5fr_1.1fr_1fr_40px] lg:items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-sm font-black text-muted-foreground shadow-inner group hover:bg-muted/70 transition-colors">
                      {campaign.image}
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-tight text-foreground">{campaign.title}</p>
                      <p className="mt-1 text-lg text-muted-foreground">{campaign.category}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-4 py-2 text-lg font-bold ${campaign.statusClass}`}>{campaign.status}</span>
                  </div>
                  <div>
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: campaign.progress }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className={`h-full rounded-full ${campaign.barClass}`} 
                      />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">{campaign.performance}</p>
                    {campaign.note ? <p className="text-sm text-muted-foreground">{campaign.note}</p> : null}
                  </div>
                  <p className="text-lg text-muted-foreground">{campaign.created}</p>
                  <p className="text-lg text-muted-foreground">{campaign.expiry}</p>
                  <button type="button" className="text-muted-foreground transition hover:text-foreground" aria-label={`More actions for ${campaign.title}`}>
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-border/10 px-7 py-5 text-center">
              <button type="button" className="text-xl font-semibold text-primary transition hover:text-primary/80">View All Campaigns</button>
            </div>
          </motion.section>
        </div>

        <aside className="space-y-6">
          <motion.section variants={itemVariants} className="af-panel p-7 border-border/10">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Recent Activity</h2>
            <div className="mt-8 space-y-8">
              {activity.map((item, idx) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex gap-4 group"
                >
                  <span className={`mt-2 h-3 w-3 flex-none rounded-full bg-primary ring-4 ring-transparent group-hover:ring-primary/20 transition-all`} />
                  <div>
                    <p className="text-[1.7rem] font-bold leading-tight text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="mt-2 text-lg leading-8 text-muted-foreground">{item.text}</p>
                    <p className="mt-3 text-base text-muted-foreground">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" className="mt-10 h-14 w-full rounded-2xl border-border/50 text-lg font-bold uppercase tracking-[0.1em] hover:bg-muted transition-all">View Full History</Button>
          </motion.section>

          <motion.section 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-[28px] border border-primary/20 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] p-7 shadow-lg shadow-primary/20 relative group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <h3 className="text-4xl font-extrabold tracking-tight text-white">Upgrade to Enterprise</h3>
            <p className="mt-4 text-lg leading-8 text-white/90">Unlock advanced analytics and direct support.</p>
            <Button className="mt-10 h-14 rounded-2xl bg-white/90 px-8 text-xl font-bold text-primary hover:bg-white shadow-xl shadow-black/10">Upgrade Now <ArrowUpRight className="ml-2 h-5 w-5" /></Button>
          </motion.section>
        </aside>
      </div>

      <motion.footer 
        variants={itemVariants}
        className="flex flex-col gap-4 border-t border-border/10 px-1 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-2xl font-extrabold uppercase text-foreground tracking-wider">AdFlow <span className="text-primary">Pro</span></p>
          <p className="mt-2">© 2024 AdFlow Pro. The Digital Curator.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">Cookie Policy</span>
        </div>
      </motion.footer>
    </motion.div>
  )
}


