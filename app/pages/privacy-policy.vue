<script setup lang="ts">
import { sanitizeHtml } from '~/utils'

definePageMeta({
  layout: 'website',
})

const privacyPolicySections = [
  {
    title: 'Summary of Key Points',
    content: `
      <p class="mb-4">These highlights summarize the Privacy Notice. You can read full details in the sections below.</p>
      
      <h4 class="text-lg font-medium mb-2">What personal information do we collect?</h4>
      <p class="mb-4">We collect the information you provide (such as name, email, phone number, payment data, business details), data generated when using Phonify (such as call logs, call recordings, SMS activity, device info), and data from integrations you authorize.</p>
      
      <h4 class="text-lg font-medium mb-2">Do we process sensitive personal information?</h4>
      <p class="mb-4">We do not process sensitive personal information (e.g., racial/ethnic data, religion, health data).</p>
      
      <h4 class="text-lg font-medium mb-2">Do we collect information from third parties?</h4>
      <p class="mb-4">Yes — only when you connect integrations (Google, CRM systems). <br>We do not purchase or scrape personal information from third parties.</p>
      
      <h4 class="text-lg font-medium mb-2">Do we share personal information?</h4>
      <p class="mb-4">We do not sell your information. We share data only with service providers necessary to operate Phonify (e.g., Stripe for payments, cloud hosting, AI processing providers like OpenAI). We never share or sell mobile numbers for marketing.</p>
      
      <h4 class="text-lg font-medium mb-2">Do we use AI?</h4>
      <p class="mb-4">Yes. Phonify uses AI to power features like call speech synthesis, summaries, insights, and script generation. Your input/output may be processed by AI service providers under strict confidentiality and security obligations.</p>
      
      <h4 class="text-lg font-medium mb-2">How do we keep information safe?</h4>
      <p class="mb-4">We use industry-standard security controls, but no system can guarantee 100% protection.</p>
      
      <h4 class="text-lg font-medium mb-2">What are your rights?</h4>
      <p>U.S. residents may request access, deletion, corrections, or opt-outs, depending on state law.</p>
    `,
  },
  {
    title: 'What Information Do We Collect?',
    content: `
      <h4 class="text-lg font-medium mb-2">1. Personal Information You Provide</h4>
      <p class="mb-2">We collect information you voluntarily provide, such as:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Name</li>
        <li>Email</li>
        <li>Phone number</li>
        <li>Business name, role, and other professional details</li>
        <li>Payment data (handled securely by Stripe)</li>
        <li>Login credentials</li>
        <li>SMS content and metadata</li>
        <li>Call log details (made through Phonify only)</li>
        <li>Call recording data (recorded through Phonify only)</li>
      </ul>
      
      <p class="mb-2">If you connect external services (Google, CRM apps), we may collect authorized data such as:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Contacts</li>
        <li>Calendar events</li>
        <li>CRM records</li>
        <li>Activity sync data</li>
      </ul>
      
      <h4 class="text-lg font-medium mb-2">2. Mobile App Permissions</h4>
      <p class="mb-2">When using the Phonify mobile app, we may request permission to access:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Microphone (for calls)</li>
        <li>Contacts (optional syncing for calling/texting)</li>
        <li>Camera (profile photo, attachments)</li>
        <li>Device storage/media</li>
        <li>Call management</li>
        <li>Push notifications</li>
        <li>Bluetooth (if applicable)</li>
      </ul>
      <p class="mb-4">You may disable permissions in your device settings.</p>
      
      <h4 class="text-lg font-medium mb-2">3. Information Automatically Collected</h4>
      <p class="mb-2">We collect technical data such as:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>IP address</li>
        <li>Device type, OS version, hardware model</li>
        <li>Browser type</li>
        <li>Device identifiers</li>
        <li>App activity logs</li>
        <li>Location (approximate or precise, depending on settings)</li>
        <li>Crash logs</li>
        <li>Usage metrics</li>
        <li>Interaction data</li>
      </ul>
      <p>We use cookies, pixels, and similar technologies for security, analytics, and product optimization.</p>
    `,
  },
  {
    title: 'How Do We Process Your Information?',
    content: `
      <p class="mb-2">We process your data to:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>Provide and operate Phonify's calling, VoIP, SMS, and communication services</li>
        <li>Create and manage your user account</li>
        <li>Enable AI-generated call summaries, insights, and scripts</li>
        <li>Support integrations (Google, CRM, etc.)</li>
        <li>Process payments via Stripe</li>
        <li>Provide customer support</li>
        <li>Respond to inquiries</li>
        <li>Send service, security, and administrative communications</li>
        <li>Improve and optimize Phonify's performance</li>
        <li>Detect and prevent fraud or misuse</li>
        <li>Comply with legal obligations</li>
      </ul>
    `,
  },
  {
    title: 'Legal Basis (U.S. Applicable Laws)',
    content: `
      <p class="mb-2">We process your information because it is necessary to:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Provide the services you signed up for</li>
        <li>Operate our business</li>
        <li>Comply with U.S. laws</li>
        <li>Improve and secure our platform</li>
        <li>Process your requests</li>
        <li>Manage billing and account administration</li>
        <li>Operate integrations you authorize</li>
      </ul>
      <p>We do not engage in automated decision-making that produces legal effects.</p>
    `,
  },
  {
    title: 'When and With Whom Do We Share Your Personal Information?',
    content: `
      <p class="mb-4">We do not sell or trade personal data.</p>
      <p class="mb-2">We may share your information with service providers, including:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Cloud hosting providers (AWS, similar)</li>
        <li>Payment processors (Stripe)</li>
        <li>AI service providers (e.g., OpenAI)</li>
        <li>Analytics tools</li>
        <li>SMS carriers / telecom providers</li>
        <li>CRM or integration partners (only when you connect them)</li>
      </ul>
      <p class="mb-2">These vendors are contractually required to protect your data and use it only to perform their services.</p>
      <p>We do not share SMS or mobile numbers with any third parties for marketing.</p>
    `,
  },
  {
    title: 'Do We Use Cookies and Tracking Technologies?',
    content: `
      <p class="mb-2">Yes — for security, analytics, and improving the user experience.</p>
      <p>You may control cookies through your browser preferences.</p>
    `,
  },
  {
    title: 'AI Features and Data Processing',
    content: `
      <p class="mb-2">Phonify provides AI features such as:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Call summaries</li>
        <li>Message suggestions</li>
        <li>Insights and analytics</li>
        <li>Script generation</li>
        <li>Speech synthesis</li>
      </ul>
      <p class="mb-2">Your inputs and outputs may be processed by trusted AI service providers. We enforce strict limits on use, retention, and confidentiality in line with our agreements.</p>
      <p>You may opt out of AI features at any time by contacting support.</p>
    `,
  },
  {
    title: 'How Long Do We Keep Your Information?',
    content: `
      <p class="mb-2">We retain data only as long as necessary to:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Provide services</li>
        <li>Comply with legal, accounting, or regulatory obligations</li>
        <li>Resolve disputes</li>
        <li>Enforce agreements</li>
      </ul>
      <p>Call recordings, call logs, and SMS history may have configurable retention settings inside Phonify.</p>
    `,
  },
  {
    title: 'How Do We Keep Your Information Safe?',
    content: `
      <p class="mb-2">We implement technical and organizational safeguards, including:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Encryption</li>
        <li>Access controls</li>
        <li>Secure hosting environment</li>
        <li>Regular audits and monitoring</li>
        <li>Internal policies and incident response plans</li>
      </ul>
      <p>However, no online system is 100% secure.</p>
    `,
  },
  {
    title: 'Minors',
    content: `
      <p class="mb-2">Phonify is not intended for anyone under 18.</p>
      <p>We do not knowingly collect information from minors.</p>
    `,
  },
  {
    title: 'Your Privacy Rights (U.S. Residents)',
    content: `
      <p class="mb-2">Depending on your state, you may have the right to:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Know whether we process your information</li>
        <li>Access your personal data</li>
        <li>Request corrections</li>
        <li>Request deletion</li>
        <li>Obtain a copy of your data</li>
        <li>Opt out of targeted advertising or tracking</li>
        <li>Opt out of profiling (if applicable)</li>
        <li>Not face discrimination for exercising your rights</li>
      </ul>
      <p class="mb-2">To submit a request, email info@phonify.app.</p>
      <p class="mb-2">Verification may be required.</p>
      <p>Authorized agents may act on your behalf with written permission.</p>
    `,
  },
  {
    title: 'Do Not Track (DNT)',
    content: `
      <p>We currently do not respond to DNT browser signals due to lack of standards.</p>
    `,
  },
  {
    title: 'Shine the Light (California Residents)',
    content: `
      <p>Phonify does not disclose personal information to third parties for their direct marketing.</p>
    `,
  },
  {
    title: 'Updates to This Privacy Notice',
    content: `
      <p class="mb-2">We may update this Privacy Notice periodically.</p>
      <p>A revised date will indicate the latest version.</p>
    `,
  },
  {
    title: 'How to Contact Us',
    content: `
      <p class="mb-2"><strong>Fintech Holdings LLC</strong></p>
      <p class="mb-2">1010 Broadway</p>
      <p class="mb-2">Woodmere, NY 11598</p>
      <p class="mb-2">United States</p>
      <p class="mb-2"><strong>Email:</strong> info@phonify.app</p>
    `,
  },
  {
    title: 'How to Review or Delete Your Information',
    content: `
      <p>To request access, updates, or deletion of your personal data, contact: <strong>info@phonify.app<i/strong></p>
    `,
  },
]

const activeSection = ref(0)

// Scroll to section
function scrollToSection(ind: number) {
  const target = document.getElementById(`section-${ind}`)
  if (target) {
    const navbarHeight = 113
    const y = target.getBoundingClientRect().top + window.scrollY - navbarHeight
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

// Observe sections for active state
function observeSections() {
  const navbarHeight = 113
  const offset = 20
  const observerOptions = {
    root: null,
    rootMargin: `-${navbarHeight + offset}px 0px -80% 0px`,
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        const sectionIndex = Number.parseInt(id.replace('section-', ''))
        if (!Number.isNaN(sectionIndex)) {
          activeSection.value = sectionIndex
        }
      }
    })
  }, observerOptions)

  // Observe all sections
  privacyPolicySections.forEach((_, index) => {
    const section = document.getElementById(`section-${index}`)
    if (section) {
      observer.observe(section)
    }
  })

  // Cleanup observer on unmount
  onUnmounted(() => {
    observer.disconnect()
  })
}

onMounted(() => {
  // Wait for DOM to render
  nextTick(() => {
    setTimeout(() => {
      observeSections()
    }, 100)
  })
})
</script>

<template>
  <div class="w-full px-4 lg:px-28 py-8 lg:py-16 bg-white">
    <div class="max-w-[1440px] mx-auto space-y-8 lg:space-y-10">
      <div class="flex flex-col gap-3 lg:gap-5 items-start lg:items-center">
        <h1 class="text-stone-900 text-2xl lg:text-5xl font-medium">
          Phonify - Privacy Policy
        </h1>
        <p class="text-stone-600 text-sm lg:text-base mb-2">
          Last Updated: October 21, 2024
        </p>
        <p class="lg:max-w-[800px] w-full text-start lg:text-center text-stone-700 text-base lg:text-xl font-extralight">
          This Privacy Notice for Fintech Holdings LLC, doing business as Phonify ("we," "us," or "our"), explains how and why we collect, use, store, and share your personal information when you use our Services, including when you:
        </p>
        <ul class="lg:max-w-[800px] w-full text-stone-700 text-sm lg:text-lg font-extralight space-y-1">
          <li class="list-disc ml-6">
            Visit <NuxtLink to="/" class="font-medium hover:underline">
              www.phonify.app
            </NuxtLink>, any subdomain, or any website that links to this Privacy Notice
          </li>
          <li class="list-disc ml-6">
            Use our mobile application (Phonify)
          </li>
          <li class="list-disc ml-6">
            Use our cloud calling, VoIP, autodialer, SMS, ringless voicemail, and AI-powered tools
          </li>
          <li class="list-disc ml-6">
            Integrate your CRM, Google Workspace, or any connected system with Phonify
          </li>
          <li class="list-disc ml-6">
            Engage with us in sales, support, or events
          </li>
        </ul>
        <p class="lg:max-w-[800px] w-full text-start lg:text-center text-stone-700 text-sm lg:text-base font-extralight mt-4">
          If you do not agree with this Privacy Notice, please do not use our Services. For questions, contact <a href="mailto:info@phonify.app" class="font-medium hover:underline">info@phonify.app</a>.
        </p>
      </div>
      <hr class="hidden lg:block w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
      <div class="flex items-start justify-between">
        <div class="min-w-[280px] max-w-md px-6 pt-8 sticky top-[120px] h-fit hidden lg:block">
          <h6 class="pt-4 pb-3 text-zinc-800 font-medium">
            Privacy Policy
          </h6>
          <div class="flex flex-col">
            <NuxtLink
              v-for="(item, index) in privacyPolicySections" :key="index"
              class="w-full pl-4 py-2 text-stone-600 text-sm font-normal border-l border-zinc-300 bg-white hover:underline cursor-pointer transition-all"
              :class="{ 'bg-gradient-to-r from-red-600/10 to-red-600/0 border-l-2 !border-[#D11E28] text-stone-800 font-medium': activeSection === index }"
              @click="scrollToSection(index)"
            >
              {{ index + 1 }}. {{ item.title }}
            </NuxtLink>
          </div>
        </div>
        <ul class="px-0 lg:px-6 py-8 border-0 lg:border-l border-zinc-300 w-full flex flex-col gap-6">
          <li
            v-for="(item, index) in privacyPolicySections"
            :id="`section-${index}`"
            :key="index"
            class="pb-4 inline-flex flex-col justify-start items-start gap-4"
          >
            <h2 class="text-zinc-800 text-xl lg:text-2xl font-medium">
              {{ index + 1 }}. {{ item.title }}
            </h2>
            <div class="text-stone-600 text-sm lg:text-base" v-html="sanitizeHtml(item.content)" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
