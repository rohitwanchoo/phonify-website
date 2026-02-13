<script setup lang="ts">
useHead({
  title: 'Phonify - Design System Showcase',
  meta: [
    {
      name: 'description',
      content: 'Complete design system and component showcase for Phonify template',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

const sections = [
  { id: 'hero', name: 'Hero Section', component: 'PublicSectionsHomeHero' },
  { id: 'problem-solution', name: 'Problem → Solution', component: 'PublicSectionsHomeProblemSolution' },
  { id: 'features', name: 'Features', component: 'PublicSectionsHomeFeatures' },
  { id: 'use-cases', name: 'Use Cases', component: 'PublicSectionsHomeUseCases' },
  { id: 'how-it-works', name: 'How It Works', component: 'PublicSectionsHomeHowItWorks' },
  { id: 'testimonials', name: 'Testimonials', component: 'PublicSectionsHomeTestimonials' },
  { id: 'faq', name: 'FAQ', component: 'PublicSectionsHomeFaq' },
  { id: 'final-cta', name: 'Final CTA', component: 'PublicSectionsHomeFinalCta' },
  { id: 'about-us', name: 'About Us', component: 'PublicSectionsHomeAboutUs' },
  { id: 'solutions', name: 'Solutions', component: 'PublicSectionsHomeSolutions' },
  { id: 'blogs', name: 'Blogs', component: 'PublicSectionsHomeBlogs' },
]

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Design System Header -->
    <div class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Phonify Design System - Website
            </h1>
            <p class="text-sm text-gray-600">
              Public website component showcase for template reuse
            </p>
          </div>
          <div class="flex gap-3">
            <a
              href="/design/app"
              class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Internal App Components
            </a>
            <a
              href="/"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="sticky top-[73px] z-40 bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span class="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
            Jump to:
          </span>
          <button
            v-for="section in sections"
            :key="section.id"
            @click="scrollToSection(section.id)"
            class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            {{ section.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sections Showcase -->
    <div class="py-8">
      <!-- Hero Section -->
      <section id="hero" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Hero Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Main landing section with announcement bar, CTAs, and social proof
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeHero /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeHero />
      </section>

      <!-- Problem Solution -->
      <section id="problem-solution" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Problem → Solution Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Highlights problems and presents solutions
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeProblemSolution /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeProblemSolution />
      </section>

      <!-- Features -->
      <section id="features" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Features Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Showcase of key features and capabilities
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeFeatures /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeFeatures />
      </section>

      <!-- Use Cases -->
      <section id="use-cases" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Use Cases Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Different use cases by customer segment
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeUseCases /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeUseCases />
      </section>

      <!-- How It Works -->
      <section id="how-it-works" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              How It Works Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Step-by-step process explanation
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeHowItWorks /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeHowItWorks />
      </section>

      <!-- Testimonials -->
      <section id="testimonials" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Testimonials Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Customer testimonials and trust indicators
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeTestimonials /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeTestimonials />
      </section>

      <!-- FAQ -->
      <section id="faq" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              FAQ Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Frequently asked questions with accordion
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeFaq /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeFaq />
      </section>

      <!-- Final CTA -->
      <section id="final-cta" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Final CTA Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Final call-to-action at the end of the page
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeFinalCta /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeFinalCta />
      </section>

      <!-- About Us -->
      <section id="about-us" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              About Us Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Company information and team showcase
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeAboutUs /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeAboutUs />
      </section>

      <!-- Solutions -->
      <section id="solutions" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Solutions Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Solution categories and offerings
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeSolutions /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeSolutions />
      </section>

      <!-- Blogs -->
      <section id="blogs" class="mb-8">
        <div class="container mx-auto px-4 mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">
              Blogs Section
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Latest blog posts and articles
            </p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              &lt;PublicSectionsHomeBlogs /&gt;
            </code>
          </div>
        </div>
        <PublicSectionsHomeBlogs />
      </section>
    </div>

    <!-- Footer Note -->
    <div class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-lg font-semibold mb-2">
          Design System Ready for Reuse
        </h3>
        <p class="text-gray-400 text-sm">
          Copy any section component code above and use it in your project. All components are built with Vue 3, Nuxt 3, and Tailwind CSS 4.
        </p>
        <div class="mt-4 flex items-center justify-center gap-4">
          <a
            href="https://github.com/rohitwanchoo/phonify-website"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 hover:text-blue-300 text-sm"
          >
            View Source Code
          </a>
          <span class="text-gray-600">•</span>
          <a
            href="/"
            class="text-blue-400 hover:text-blue-300 text-sm"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
