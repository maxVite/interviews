<template>
  <v-container class="notification-container">
    <transition-group name="notification" tag="div">
      <v-alert
        v-for="notification in appStore.notifications"
        :key="notification.id"
        :type="notification.type"
        variant="elevated"
        class="notification-item mb-2"
        closable
        @click:close="appStore.removeNotification(notification.id)"
      >
        <template #text>
          {{ notification.message }}
        </template>
      </v-alert>
    </transition-group>
  </v-container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  pointer-events: none;
}

.notification-item {
  pointer-events: all;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
