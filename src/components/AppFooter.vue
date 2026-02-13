<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="py-8 text-center text-sm text-white">
    &copy; 2020 - {{ currentYear }} My Portfolio. {{ t('footer.rights') }}
  </footer>
</template>
