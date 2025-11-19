<script setup lang="ts">
definePageMeta({
  layout: 'website',
})

const termsAndConditions = [
  {
    title: 'Eligibility',
    content: `
      <p class="mb-2">You must be at least 18 years old and legally able to enter into a binding contract under U.S. law.</p>
      <p>You represent and warrant that all information you provide to Phonify is accurate and complete.</p>
    `,
  },
  {
    title: 'Your Account',
    content: `
      <p class="mb-2">You are responsible for:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>maintaining the confidentiality of your login credentials,</li>
        <li>all activity under your account, and</li>
        <li>ensuring your use complies with all applicable laws.</li>
      </ul>
      <p>Phonify may suspend or terminate accounts that violate these Terms, applicable laws, or pose security risks.</p>
    `,
  },
  {
    title: 'Use of the Services',
    content: `
      <p class="mb-2">You may use the Services only for lawful business purposes.</p>
      <p class="mb-2">You agree not to:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>send unlawful, harmful, deceptive, or harassing communications;</li>
        <li>transmit unsolicited marketing messages without proper consent (including under TCPA and CAN-SPAM);</li>
        <li>upload malware or harmful code;</li>
        <li>attempt to access other users' data;</li>
        <li>interfere with or disrupt the platform;</li>
        <li>use automated systems to harvest numbers or contacts.</li>
      </ul>
      <p>Phonify reserves the right to monitor usage for compliance and system integrity.</p>
    `,
  },
  {
    title: 'Compliance With U.S. Laws',
    content: `
      <p class="mb-2">By using Phonify, you agree to comply with all applicable U.S. federal and state laws, including:</p>
      <h4 class="text-lg font-medium mb-1">TCPA (Telephone Consumer Protection Act)</h4>
      <p class=mb-2>You are solely responsible for obtaining prior express consent from recipients before sending SMS or making automated calls.</p>
      <h4 class="text-lg font-medium mb-1">CAN-SPAM Act</h4>
      <p class=mb-2>Marketing emails must include required disclosures and unsubscribe options.</p>
      <h4 class="text-lg font-medium mb-1">CTIA Guidelines</h4>
      <p class=mb-2>Application-to-person messaging must follow industry standards.</p>
      <h4 class="text-lg font-medium mb-1">State Privacy Laws</h4>
      <p class=mb-2>Where applicable (e.g., CPRA/California), you must honor privacy rights and data handling obligations.</p>
      <p>Phonify is not liable for your non-compliance with messaging, telemarketing, or privacy laws.</p>
    `,
  },
  {
    title: 'Messaging Content and Customer Data',
    content: `
      <p class="mb-2">You retain all rights to the content you send through Phonify.</p>
      <p class="mb-2">You grant Phonify a non-exclusive, worldwide license to store, process, and transmit this content solely for operating the Services.</p>
      <p class="mb-2">You are fully responsible for:</p>
      <ul class="list-disc ml-6 nb-2">
        <li>the accuracy of your data,</li>
        <li>the content of your communications,</li>
        <li>securing appropriate permissions,</li>
        <li>complying with all data protection requirements.</li>
      </ul>
      <p>Phony numbers, purchased lists, or scraped contacts are prohibited.</p>
    `,
  },
  {
    title: 'Prohibited Activities',
    content: `
      <p class="mb-2">You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. </p>
      <p class="mb-2">As a user of the Services, you agree not to:</p>
      <p class="mb-2">Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</p>
      <p class="mb-2">Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</p>
      <p class="mb-2">Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</p>
      <p class="mb-2">Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</p>
      <p class="mb-2">Use any information obtained from the Services in order to harass, abuse, or harm another person.</p>
      <p class="mb-2">Make improper use of our support services or submit false reports of abuse or misconduct.</p>
      <p class="mb-2">Use the Services in a manner inconsistent with any applicable laws or regulations.</p>
      <p class="mb-2">Engage in unauthorized framing of or linking to the Services.</p>
      <p class="mb-2">Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</p>
      <p class="mb-2">Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</p>
      <p class="mb-2">Delete the copyright or other proprietary rights notice from any Content.</p>
      <p class="mb-2">Attempt to impersonate another user or person or use the username of another user.</p>
      <p class="mb-2">Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1*1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").</p>
      <p class="mb-2">Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</p>
      <p class="mb-2">Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</p>
      <p class="mb-2">Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</p>
      <p class="mb-2">Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</p>
      <p class="mb-2">Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.</p>
      <p class="mb-2">Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorized script or other software.</p>
      <p class="mb-2">Use a buying agent or purchasing agent to make purchases on the Services.</p>
      <p class="mb-2">Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</p>
      <p class="mb-2">Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.</p>
      <p>Sell or otherwise transfer your profile.</p>
    `,
  },
  {
    title: 'Acceptable Use for Phone, SMS, Email & Automation',
    content: `
      <p class="mb-2">Specific restrictions apply:</p>
      <h4 class="text-lg font-medium mb-1">SMS & Voice</h4>
      <p class="mb-2">You may not use Phonify to:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>send mass unsolicited texts,</li>
        <li>use spoofed or misleading caller IDs,</li>
        <li>perform robocalls without consent,</li>
        <li>send emergency or medical alerts without authorization.</li>
      </ul>
      <h4 class="text-lg font-medium mb-1">Email</h4>
      <p class="mb-2">You may not send:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>emails without valid opt-in,</li>
        <li>deceptive subject lines,</li>
        <li>emails lacking a physical business address or unsubscribe link.</li>
      </ul>
      <h4 class="text-lg font-medium mb-1">Automation Tools</h4>
      <p>Automation must follow consent requirements and cannot be used for spam or harassment.</p>
    `,
  },
  {
    title: 'Subscriptions, Billing & Payment',
    content: `
      <p class="mb-2">Phonify operates on a subscription or usage-based billing model.</p>
      <p class="mb-2">You agree to:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>pay all applicable fees,</li>
        <li>maintain valid payment information,</li>
        <li>allow automatic renewal unless canceled.</li>
      </ul>
      <p class="mb-2">All fees are non-refundable except where required by U.S. law.</p>
      <p>Phonify may update pricing with prior notice.</p>
    `,
  },
  {
    title: 'Termination',
    content: `
      <p class="mb-2">You may cancel your account at any time.</p>
      <p class="mb-2">Phonify may suspend or terminate access if:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>you violate these Terms or U.S. laws,</li>
        <li>your usage impacts system stability,</li>
        <li>payments are overdue.</li>
      </ul>
      <p>Upon termination, access ends and data may be retained or deleted per legal requirements.</p>
    `,
  },
  {
    title: 'Intellectual Property',
    content: `
      <p class="mb-2">Phonify owns all rights to the platform, software, trademarks, and designs.</p>
      <p>You may not copy, reverse engineer, decompile, or attempt to derive source code from the Services.</p>
    `,
  },
  {
    title: 'Third-Party Integrations',
    content: `
      <p class="mb-2">Phonify may integrate with, or provide access to, third-party services, applications, or platforms (“Third-Party Services”). Your use of any Third-Party Services is subject to the terms, conditions, and policies of the respective third-party providers.</p>
      <p class="mb-2">Phonify does not control, endorse, or assume any responsibility for Third-Party Services and shall not be liable for any loss, damage, downtime, or service interruptions arising from, or related to, such Third-Party Services.</p>
      <p>It is your sole responsibility to review and comply with all applicable third-party terms before using such integrations. Your continued use of Phonify constitutes acknowledgment and acceptance of this clause.</p>
    `,
  },
  {
    title: 'Service Availability & Changes',
    content: `
      <p class="mb-2">Phonify aims to maintain high availability but does not guarantee uninterrupted or error-free service.</p>
      <p>We may update, suspend, or modify features at any time.</p>
    `,
  },
  {
    title: 'Data Security',
    content: `
      <p class="mb-2">Phonify uses reasonable administrative, technical, and physical safeguards consistent with U.S. standards to protect your data.</p>
      <p>However, no system is completely secure, and Phonify cannot guarantee absolute protection.</p>
    `,
  },
  {
    title: 'DMCA Compliance',
    content: `
      <p class="mb-2">If you believe content on our platform infringes copyright, you may submit a DMCA takedown request to our designated agent:</p>
      <p class="mb-2"><strong>DMCA Agent</strong></p>
      <p class="mb-2"><strong>Email:</strong> info@phoify.app</p>
      <p><strong>Address:</strong> 75467 Poplar Avenue, Spring Hill 62595</p>
    `,
  },
  {
    title: 'Disclaimer of Warranties',
    content: `
      <p class="mb-2">To the maximum extent permitted by U.S. law:</p>
      <p>The Services are provided “as is” and “as available” without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement.</p>
    `,
  },
  {
    title: 'Limitation of Liability',
    content: `
      <p class="mb-2">To the fullest extent permitted by U.S. law, Phonify is not liable for:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>indirect, incidental, or consequential damages,</li>
        <li>loss of profits or business interruption,</li>
        <li>damages resulting from user misuse or non-compliance with laws.</li>
      </ul>
      <p>Phonify's total liability is limited to the amount you paid in the 3 months preceding the claim.</p>
    `,
  },
  {
    title: 'Indemnification',
    content: `
      <p class="mb-2">You agree to indemnify and hold harmless Phonify, its employees, and partners from any claims arising out of:</p>
      <ul class="list-disc ml-6 mb-2">
        <li>your misuse of the Services,</li>
        <li>your violation of laws (including TCPA),</li>
        <li>your breach of these Terms,</li>
        <li>your content or communications.</li>
      </ul>
    `,
  },
  {
    title: 'Governing Law & Jurisdiction',
    content: `
      <p class="mb-2">These Terms are governed by the laws of the State of Delaware, USA.</p>
      <p>Any disputes shall be resolved exclusively in the state or federal courts of Delaware.</p>
    `,
  },
  {
    title: 'Changes to These Terms',
    content: `
      <p class="mb-2">Phonify may update these Terms from time to time.</p>
      <p>Continued use of the Services after changes constitutes acceptance of the updated Terms.</p>
    `,
  },
  {
    title: 'Contact Us',
    content: `
      <p class="mb-2">For questions regarding these Terms, contact:</p>
      <p class="mb-2"><strong>Phonify, Inc.</strong></p>
      <p class="mb-2">Email: info@phoify.app</p>
      <p class="mb-2">Address: 75467 Poplar Avenue, Spring Hill 62595</p>
      <p>Phone: +1 (341) 882-7279</p>
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
  termsAndConditions.forEach((_, index) => {
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
          Phonify - Terms of Service
        </h1>
        <p class="lg:max-w-[800px] w-full text-start lg:text-center text-stone-700 text-base lg:text-xl font-extralight">
          These Terms of Service (“Terms”) govern your access to and use of Phonify's communication platform, websites, mobile applications, APIs,
          and related services (collectively, the “Services”). By creating an account or using the Services, you agree to be bound by these Terms and our Privacy Policy.
          <br>
          If you do not agree, you may not access or use Phonify.
        </p>
      </div>
      <hr class="hidden lg:block w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
      <div class="flex items-start justify-between">
        <div class="min-w-[280px] max-w-md px-6 pt-8 sticky top-[120px] h-fit hidden lg:block">
          <h6 class="pt-4 pb-3 text-zinc-800">
            Terms & Conditions
          </h6>
          <div class="flex flex-col">
            <NuxtLink
              v-for="(item, index) in termsAndConditions" :key="index"
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
            v-for="(item, index) in termsAndConditions"
            :id="`section-${index}`"
            :key="index"
            class="pb-4 inline-flex flex-col justify-start items-start gap-4"
          >
            <h2 class="text-zinc-800 text-xl lg:text-2xl">
              {{ index + 1 }}. {{ item.title }}
            </h2>
            <div class="text-stone-600" v-html="item.content" />
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
