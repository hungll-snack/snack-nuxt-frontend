import vuetify from 'vite-plugin-vuetify'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src',

  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    plugins: [vuetify()],
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap',
        },
      ],
      meta: [
        // ✅ OG 메타태그 추가
        { property: 'og:title', content: 'HUNGLL - 인증 맛집 & 밥친구 찾기 서비스' },
        { property: 'og:description', content: '취향을 기억하는 AI 추천! 서울 맛집과 밥친구를 연결해드립니다.' },
        { property: 'og:image', content: 'https://hungll.com/og/hungle_hgl.png' },
        { property: 'og:url', content: 'https://hungll.com/' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }, // (선택) 트위터용 카드
      ],
    },
  },

  runtimeConfig: {
    public: {
      MAIN_API_URL: process.env.NUXT_PUBLIC_MAIN_API_URL,
      AI_BASE_URL: process.env.NUXT_PUBLIC_AI_BASE_URL,
      KAKAO_JAVASCRIPT_KEY: process.env.KAKAO_JAVASCRIPT_APP_KEY,
    },
  },

  compatibilityDate: '2025-04-04',
})
