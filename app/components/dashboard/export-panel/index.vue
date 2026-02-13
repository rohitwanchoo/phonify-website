<script setup lang="ts">
import { Calendar, Download, FileSpreadsheet, FileText, Loader2, Mail, Share2 } from 'lucide-vue-next'
import moment from 'moment'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const isExporting = ref(false)
const exportFormat = ref<'pdf' | 'csv' | 'excel' | null>(null)

async function exportDashboard(format: 'pdf' | 'csv' | 'excel') {
  isExporting.value = true
  exportFormat.value = format

  try {
    // Collect dashboard data
    const dashboardData = await collectDashboardData()

    switch (format) {
      case 'csv':
        downloadCSV(dashboardData)
        break
      case 'excel':
        downloadExcel(dashboardData)
        break
      case 'pdf':
        await generatePDF(dashboardData)
        break
    }

    toast.success(`Dashboard exported as ${format.toUpperCase()}`)
  }
  catch (error) {
    toast.error('Failed to export dashboard')
    console.error('Export error:', error)
  }
  finally {
    isExporting.value = false
    exportFormat.value = null
  }
}

async function collectDashboardData() {
  // Collect data from various dashboard endpoints
  const [dashboard, callCount, dispositions] = await Promise.all([
    useApi().post('/dashboard', {}),
    useApi().post('/cdr-call-count', {
      startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    }),
    useApi().post('/disposition-wise-call', {}),
  ])

  return {
    generatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    summary: {
      totalUsers: dashboard.data?.totalUsers || 0,
      totalCampaigns: dashboard.data?.totalCampaigns || 0,
      totalLeads: dashboard.data?.totalLeads || 0,
      totalLists: dashboard.data?.totalList || 0,
    },
    calls: {
      outbound: callCount.data?.OUT || 0,
      inbound: callCount.data?.IN || 0,
      answered: callCount.data?.answered || 0,
    },
    dispositions: dispositions.data || [],
  }
}

function downloadCSV(data: any) {
  const rows = [
    ['Dashboard Report', ''],
    ['Generated', data.generatedAt],
    [''],
    ['Summary Metrics', ''],
    ['Total Users', data.summary.totalUsers],
    ['Total Campaigns', data.summary.totalCampaigns],
    ['Total Leads', data.summary.totalLeads],
    ['Total Lists', data.summary.totalLists],
    [''],
    ['Call Statistics', ''],
    ['Outbound Calls', data.calls.outbound],
    ['Inbound Calls', data.calls.inbound],
    ['Answered Calls', data.calls.answered],
    [''],
    ['Dispositions', ''],
    ...data.dispositions.map((d: any) => [d.title || 'Unknown', d.rowCount || 0]),
  ]

  const csvContent = rows.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  downloadBlob(blob, `dashboard-report-${moment().format('YYYY-MM-DD')}.csv`)
}

function downloadExcel(data: any) {
  // For a simple implementation, we'll create a CSV that Excel can open
  // In production, you'd want to use a library like SheetJS (xlsx)
  downloadCSV(data)
}

async function generatePDF(data: any) {
  // Create a simple HTML representation and open print dialog
  const printWindow = window.open('', '_blank')
  if (!printWindow)
    return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dashboard Report - ${moment().format('YYYY-MM-DD')}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
        h2 { color: #374151; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
        th { background-color: #f3f4f6; }
        .meta { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>Dashboard Report</h1>
      <p class="meta">Generated: ${data.generatedAt}</p>

      <h2>Summary Metrics</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Users</td><td>${data.summary.totalUsers}</td></tr>
        <tr><td>Total Campaigns</td><td>${data.summary.totalCampaigns}</td></tr>
        <tr><td>Total Leads</td><td>${data.summary.totalLeads}</td></tr>
        <tr><td>Total Lists</td><td>${data.summary.totalLists}</td></tr>
      </table>

      <h2>Call Statistics</h2>
      <table>
        <tr><th>Type</th><th>Count</th></tr>
        <tr><td>Outbound Calls</td><td>${data.calls.outbound}</td></tr>
        <tr><td>Inbound Calls</td><td>${data.calls.inbound}</td></tr>
        <tr><td>Answered Calls</td><td>${data.calls.answered}</td></tr>
      </table>

      <h2>Dispositions</h2>
      <table>
        <tr><th>Disposition</th><th>Count</th></tr>
        ${data.dispositions.map((d: any) => `<tr><td>${d.title || 'Unknown'}</td><td>${d.rowCount || 0}</td></tr>`).join('')}
      </table>

      <scr` + `ipt>window.onload = function() { window.print(); }</scr` + `ipt>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function copyShareLink() {
  const url = new URL(window.location.href)
  url.searchParams.set('date', moment().format('YYYY-MM-DD'))

  navigator.clipboard.writeText(url.toString())
  toast.success('Dashboard link copied to clipboard')
}

async function emailReport() {
  toast.info('Opening email client...')
  const subject = encodeURIComponent(`Dashboard Report - ${moment().format('YYYY-MM-DD')}`)
  const body = encodeURIComponent(`Here is the dashboard report for ${moment().format('MMMM D, YYYY')}.\n\nView online: ${window.location.href}`)
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Export Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="sm" :disabled="isExporting">
          <template v-if="isExporting">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </template>
          <template v-else>
            <Download class="w-4 h-4 mr-2" />
            Export
          </template>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48">
        <DropdownMenuLabel>Export Dashboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="cursor-pointer" @click="exportDashboard('pdf')">
          <FileText class="w-4 h-4 mr-2" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="exportDashboard('csv')">
          <FileSpreadsheet class="w-4 h-4 mr-2" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="exportDashboard('excel')">
          <FileSpreadsheet class="w-4 h-4 mr-2" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="cursor-pointer" @click="emailReport">
          <Mail class="w-4 h-4 mr-2" />
          <span>Email Report</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="copyShareLink">
          <Share2 class="w-4 h-4 mr-2" />
          <span>Copy Share Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Date Indicator -->
    <Badge variant="secondary" class="hidden md:flex items-center gap-1 text-xs">
      <Calendar class="w-3 h-3" />
      {{ moment().format('MMM D, YYYY') }}
    </Badge>
  </div>
</template>
