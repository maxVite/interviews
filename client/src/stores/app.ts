import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    globalLoading: false,
    notifications: [] as Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      message: string;
      timeout?: number;
    }>,
  }),

  actions: {
    setGlobalLoading(loading: boolean) {
      this.globalLoading = loading;
    },

    addNotification(notification: {
      type: "success" | "error" | "warning" | "info";
      message: string;
      timeout?: number;
    }) {
      const id = Date.now().toString();
      this.notifications.push({
        id,
        ...notification,
        timeout: notification.timeout ?? 5000,
      });

      if (notification.timeout !== 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, notification.timeout ?? 5000);
      }
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    showSuccess(message: string, timeout?: number) {
      this.addNotification({ type: "success", message, timeout });
    },

    showError(message: string, timeout?: number) {
      this.addNotification({ type: "error", message, timeout });
    },

    showWarning(message: string, timeout?: number) {
      this.addNotification({ type: "warning", message, timeout });
    },

    showInfo(message: string, timeout?: number) {
      this.addNotification({ type: "info", message, timeout });
    },
  },
});
