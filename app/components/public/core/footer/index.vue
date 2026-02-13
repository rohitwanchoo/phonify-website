<script setup lang="ts">
import logo from '~/assets/svg/public/phonify.svg'

const productLinks = [
  { name: 'Platform Overview', link: '/product' },
  { name: 'AI Voice Agents', link: '/product#ai-voice' },
  { name: 'Call Automation', link: '/product#dialer' },
  { name: 'Omnichannel', link: '/product#omnichannel' },
  { name: 'Analytics', link: '/product#analytics' },
  { name: 'Integrations', link: '/product#integrations' },
]

const solutionLinks = [
  { name: 'Call Centers', link: '/solutions/call-centers' },
  { name: 'Sales Teams', link: '/solutions/sales-teams' },
  { name: 'Support Teams', link: '/solutions/support-teams' },
  { name: 'Agencies', link: '/solutions/agencies' },
]

const resourceLinks = [
  { name: 'Blog', link: '/blogs' },
  { name: 'Documentation', link: '#' },
  { name: 'API Reference', link: '#' },
  { name: 'System Status', link: '#' },
  { name: 'Security', link: '/security' },
]

const companyLinks = [
  { name: 'About Us', link: '#' },
  { name: 'Pricing', link: '/pricing' },
  { name: 'Enterprise', link: '/enterprise' },
  { name: 'Contact', link: '/contact-us' },
]

const legalLinks = [
  { name: 'Privacy Policy', link: '/privacy-policy' },
  { name: 'Terms of Service', link: '/terms-and-conditions' },
  { name: 'TCPA Compliance', link: '/terms-and-conditions#tcpa' },
]
</script>

<template>
  <footer class="w-full bg-stone-900 text-white">
    <div class="max-w-[1440px] mx-auto px-4 lg:px-8">
      <!-- Main Footer Content -->
      <div class="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
        <!-- Brand Column -->
        <div class="col-span-2 md:col-span-3 lg:col-span-2">
          <img :src="logo" alt="Phonify" class="h-8 mb-6 brightness-0 invert">
          <p class="text-stone-400 text-sm leading-relaxed mb-6 max-w-sm">
            AI voice agents that handle calls like your best rep. Automate inbound and outbound calls at scale.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors">
              <Icon name="lucide:linkedin" class="w-5 h-5 text-stone-400" />
            </a>
            <a href="#" class="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors">
              <Icon name="lucide:twitter" class="w-5 h-5 text-stone-400" />
            </a>
            <a href="#" class="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors">
              <Icon name="lucide:youtube" class="w-5 h-5 text-stone-400" />
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h4 class="text-sm font-semibold text-white mb-4">Product</h4>
          <ul class="space-y-3">
            <li v-for="link in productLinks" :key="link.link">
              <NuxtLink :to="link.link" class="text-sm text-stone-400 hover:text-white transition-colors">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Solutions Links -->
        <div>
          <h4 class="text-sm font-semibold text-white mb-4">Solutions</h4>
          <ul class="space-y-3">
            <li v-for="link in solutionLinks" :key="link.link">
              <NuxtLink :to="link.link" class="text-sm text-stone-400 hover:text-white transition-colors">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Resources Links -->
        <div>
          <h4 class="text-sm font-semibold text-white mb-4">Resources</h4>
          <ul class="space-y-3">
            <li v-for="link in resourceLinks" :key="link.link">
              <NuxtLink :to="link.link" class="text-sm text-stone-400 hover:text-white transition-colors">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h4 class="text-sm font-semibold text-white mb-4">Company</h4>
          <ul class="space-y-3">
            <li v-for="link in companyLinks" :key="link.link">
              <NuxtLink :to="link.link" class="text-sm text-stone-400 hover:text-white transition-colors">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="py-8 border-t border-stone-800">
        <div class="flex flex-wrap items-center justify-center gap-8">
          <div class="flex items-center gap-2 text-stone-400">
            <Icon name="lucide:shield-check" class="w-5 h-5 text-green-500" />
            <span class="text-sm">SOC 2 Type II</span>
          </div>
          <div class="flex items-center gap-2 text-stone-400">
            <Icon name="lucide:lock" class="w-5 h-5 text-blue-500" />
            <span class="text-sm">HIPAA Compliant</span>
          </div>
          <div class="flex items-center gap-2 text-stone-400">
            <Icon name="lucide:file-check" class="w-5 h-5 text-purple-500" />
            <span class="text-sm">TCPA Built-In</span>
          </div>
          <div class="flex items-center gap-2 text-stone-400">
            <Icon name="lucide:globe" class="w-5 h-5 text-orange-500" />
            <span class="text-sm">GDPR Ready</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="py-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-sm text-stone-500">
          &copy; 2025 Phonify Inc. All rights reserved.
        </div>
        <div class="flex flex-wrap items-center gap-6">
          <NuxtLink
            v-for="link in legalLinks"
            :key="link.link"
            :to="link.link"
            class="text-sm text-stone-500 hover:text-white transition-colors"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2 text-sm text-stone-500">
          <Icon name="lucide:mail" class="w-4 h-4" />
          <a href="mailto:info@phonify.app" class="hover:text-white transition-colors">info@phonify.app</a>
        </div>
      </div>
    </div>
  </footer>
</template>
