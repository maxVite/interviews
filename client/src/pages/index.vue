<template>
  <v-container>
    <div class="text-center py-12">
      <v-progress-circular
        size="64"
        color="primary"
        indeterminate
      />
      <p class="text-h6 mt-4">Redirecting to employees...</p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/employees')
})
</script>
