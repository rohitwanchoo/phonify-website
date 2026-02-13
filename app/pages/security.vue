<script setup lang="ts">
import { Button } from '~/components/ui/button'

useHead({
  title: 'Security & Compliance - Enterprise-Grade Protection | Phonify',
  meta: [
    {
      name: 'description',
      content: 'Phonify security: SOC 2 Type II certified, HIPAA compliant, TCPA built-in, GDPR ready. Enterprise-grade protection for your voice data.',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

const certifications = [
  {
    icon: 'lucide:shield-check',
    name: 'SOC 2 Type II',
    description: 'Annual third-party audits verify our security controls across all trust service criteria.',
    color: 'green',
  },
  {
    icon: 'lucide:lock',
    name: 'HIPAA Compliant',
    description: 'BAA available for healthcare organizations. PHI handled according to HIPAA requirements.',
    color: 'blue',
  },
  {
    icon: 'lucide:file-check',
    name: 'TCPA Built-In',
    description: 'Automated compliance tools prevent violations. DNC scrubbing, calling hours, and consent tracking.',
    color: 'purple',
  },
  {
    icon: 'lucide:globe',
    name: 'GDPR Ready',
    description: 'Data processing agreements, right to deletion, and EU data residency options available.',
    color: 'orange',
  },
]

const securityFeatures = [
  {
    category: 'Data Protection',
    features: [
      'AES-256 encryption at rest',
      'TLS 1.3 encryption in transit',
      'Automatic data backups with point-in-time recovery',
      'Data residency options (US, EU, custom)',
      'Secure key management with HSM',
    ],
  },
  {
    category: 'Access Control',
    features: [
      'SAML 2.0 and OIDC SSO integration',
      'Role-based access control (RBAC)',
      'Multi-factor authentication (MFA)',
      'IP allowlisting',
      'Session management and timeout controls',
    ],
  },
  {
    category: 'Monitoring & Audit',
    features: [
      'Comprehensive audit logs',
      'Real-time security monitoring',
      'Anomaly detection and alerting',
      'Activity exports for SIEM integration',
      '90-day log retention (custom available)',
    ],
  },
  {
    category: 'Infrastructure',
    features: [
      'SOC 2 certified cloud infrastructure',
      'Multi-region redundancy',
      '99.99% uptime SLA',
      'DDoS protection',
      'Regular penetration testing',
    ],
  },
]

const faqs = [
  {
    question: 'Where is my data stored?',
    answer: 'By default, data is stored in SOC 2 certified data centers in the United States. Enterprise customers can request EU data residency or custom data location requirements.',
  },
  {
    question: 'How are call recordings secured?',
    answer: 'Call recordings are encrypted with AES-256 at rest and TLS 1.3 in transit. Access is controlled via RBAC and all access is logged. Recordings can be automatically deleted based on your retention policy.',
  },
  {
    question: 'Do you have a BAA for HIPAA compliance?',
    answer: 'Yes, we provide Business Associate Agreements (BAAs) for healthcare organizations and any business handling protected health information (PHI).',
  },
  {
    question: 'How do you handle TCPA compliance?',
    answer: 'Phonify includes built-in TCPA compliance tools: automatic DNC list scrubbing, calling hour restrictions by timezone, consent tracking, and opt-out management. All compliance actions are logged for audit purposes.',
  },
  {
    question: 'Can I integrate with my existing SSO?',
    answer: 'Yes, we support SAML 2.0 and OIDC for enterprise SSO. We integrate with Okta, Azure AD, Google Workspace, and other identity providers.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="w-full bg-gradient-to-b from-stone-900 to-stone-800 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto text-center">
        <p class="text-[#D11E28] font-medium text-sm mb-4">SECURITY & COMPLIANCE</p>
        <h1 class="text-4xl lg:text-5xl font-semibold text-white mb-6">
          Enterprise-grade security, built in
        </h1>
        <p class="text-xl text-stone-300 max-w-2xl mx-auto mb-10">
          Your data protected. Your compliance handled. Pass your security review on day one with certifications and controls that meet enterprise requirements.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/contact-us">
            <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
              Request Security Documentation
            </Button>
          </NuxtLink>
          <NuxtLink to="/enterprise">
            <Button variant="outline" class="h-12 px-8 border-stone-600 text-white hover:bg-stone-700 rounded-lg font-medium">
              Enterprise Plans
            </Button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="w-full bg-white py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            Certifications & Compliance
          </h2>
          <p class="text-lg text-stone-600 max-w-2xl mx-auto">
            Third-party verified security and compliance standards.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="cert in certifications"
            :key="cert.name"
            class="bg-stone-50 rounded-xl p-6 border border-stone-100"
          >
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              :class="{
                'bg-green-50': cert.color === 'green',
                'bg-blue-50': cert.color === 'blue',
                'bg-purple-50': cert.color === 'purple',
                'bg-orange-50': cert.color === 'orange',
              }"
            >
              <Icon
                :name="cert.icon"
                class="w-8 h-8"
                :class="{
                  'text-green-600': cert.color === 'green',
                  'text-blue-600': cert.color === 'blue',
                  'text-purple-600': cert.color === 'purple',
                  'text-orange-600': cert.color === 'orange',
                }"
              />
            </div>
            <h3 class="text-xl font-semibold text-stone-900 mb-2">{{ cert.name }}</h3>
            <p class="text-stone-600">{{ cert.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Features -->
    <section class="w-full bg-stone-50 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            Security Features
          </h2>
          <p class="text-lg text-stone-600 max-w-2xl mx-auto">
            Comprehensive security controls across every layer of the platform.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="section in securityFeatures"
            :key="section.category"
            class="bg-white rounded-xl p-6 border border-stone-200"
          >
            <h3 class="text-lg font-semibold text-stone-900 mb-4">{{ section.category }}</h3>
            <ul class="space-y-3">
              <li v-for="feature in section.features" :key="feature" class="flex items-start gap-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="lucide:check" class="w-3 h-3 text-green-600" />
                </div>
                <span class="text-stone-600 text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Statement -->
    <section class="w-full bg-stone-900 py-16 lg:py-24 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <Icon name="lucide:shield" class="w-16 h-16 text-[#D11E28] mx-auto mb-6" />
        <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-6">
          Security is not an afterthought
        </h2>
        <p class="text-lg text-stone-400 leading-relaxed">
          We built Phonify with security at the core. Every feature, every integration, every data flow is designed with protection in mind. Our security team monitors threats 24/7, and we conduct regular penetration tests and security audits to stay ahead of emerging risks.
        </p>
      </div>
    </section>

    <!-- FAQs -->
    <section class="w-full bg-white py-16 lg:py-24 px-4">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            Security FAQ
          </h2>
        </div>

        <div class="space-y-6">
          <div
            v-for="faq in faqs"
            :key="faq.question"
            class="bg-stone-50 rounded-xl p-6 border border-stone-100"
          >
            <h3 class="text-lg font-semibold text-stone-900 mb-3">{{ faq.question }}</h3>
            <p class="text-stone-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full bg-stone-50 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-8 lg:p-12 text-center">
          <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-4">
            Need more security details?
          </h2>
          <p class="text-lg text-stone-400 mb-8 max-w-xl mx-auto">
            Request our security whitepaper, SOC 2 report, or schedule a call with our security team.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink to="/contact-us">
              <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
                Request Documentation
              </Button>
            </NuxtLink>
            <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
              <Button variant="outline" class="h-12 px-8 border-stone-600 text-white hover:bg-stone-700 rounded-lg font-medium">
                Talk to Security Team
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
