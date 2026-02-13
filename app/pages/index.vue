<script setup lang="ts">
useHead({
  title: 'Phonify - AI Voice Agents That Handle Calls Like Your Best Rep',
  meta: [
    {
      name: 'description',
      content: 'Phonify automates inbound and outbound calls with AI that qualifies leads, books appointments, and resolves support tickets—24/7, at scale.',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

onMounted(() => {
  if (location.hash) {
    setTimeout(() => {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)
  }
})
</script>

<template>
  <div>
    <!-- Hero Section with Announcement Bar, CTAs, Social Proof -->
    <PublicSectionsHomeHero />

    <!-- Problem → Solution Section -->
    <PublicSectionsHomeProblemSolution />

    <!-- Features Section -->
    <PublicSectionsHomeFeatures />

    <!-- Use Cases by Segment -->
    <PublicSectionsHomeUseCases />

    <!-- How It Works -->
    <PublicSectionsHomeHowItWorks />

    <!-- Testimonials & Trust -->
    <PublicSectionsHomeTestimonials />

    <!-- FAQ Section -->
    <PublicSectionsHomeFaq />

    <!-- Final CTA -->
    <PublicSectionsHomeFinalCta />
  </div>
</template>
