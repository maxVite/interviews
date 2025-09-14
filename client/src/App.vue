<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      color="primary"
      prominent
      elevation="4"
    >
      <v-app-bar-title class="d-flex align-center">
        <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
        <span class="text-h5 font-weight-bold">Employee Manager</span>
      </v-app-bar-title>

      <template #append>
        <v-btn
          icon="mdi-account-plus"
          variant="text"
          size="large"
          @click="navigateToEmployees"
        />
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Global Loading Overlay -->
    <v-overlay
      v-model="appStore.globalLoading"
      class="d-flex align-center justify-center"
    >
      <v-progress-circular
        size="64"
        color="primary"
        indeterminate
      />
    </v-overlay>

    <!-- Notifications -->
    <NotificationContainer />
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import NotificationContainer from '@/components/NotificationContainer.vue'

const router = useRouter()
const appStore = useAppStore()

const navigateToEmployees = () => {
  router.push('/employees')
}
</script>
