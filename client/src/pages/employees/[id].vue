<template>
  <v-container>
    <!-- Back Navigation -->
    <v-btn variant="text" color="primary" class="mb-4" @click="$router.push('/employees')">
      <v-icon start>mdi-arrow-left</v-icon>
      Back to Employees
    </v-btn>

    <!-- Loading State -->
    <div v-if="employeeLoading" class="text-center py-8">
      <v-progress-circular size="64" color="primary" indeterminate />
      <p class="text-h6 mt-4">Loading employee...</p>
    </div>

    <!-- Error State -->
    <v-alert v-else-if="employeeError" type="error" variant="outlined" class="mb-6" :text="employeeError.message"
      closable />

    <!-- Employee Not Found -->
    <v-card v-else-if="!employee && !employeeLoading" class="text-center py-12" elevation="2">
      <v-card-text>
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-account-alert-outline
        </v-icon>
        <h3 class="text-h5 mb-2">Employee not found</h3>
        <p class="text-body-1 text-grey mb-4">
          The employee you're looking for doesn't exist or has been deleted.
        </p>
        <v-btn color="primary" variant="elevated" @click="$router.push('/employees')">
          Go back to employees
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Employee Details -->
    <div v-else-if="employee">
      <!-- Header -->
      <v-card elevation="2" class="mb-6">
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="80" class="mr-4">
                <span class="text-h4 font-weight-bold">
                  {{ getInitials(employee.firstName, employee.lastNames) }}
                </span>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">
                  {{ employee.firstName }} {{ employee.lastNames }}
                </h1>
                <p class="text-h6 text-grey mb-0">{{ employee.email }}</p>
              </div>
            </div>
            <div class="d-flex">
              <v-btn color="primary" variant="elevated" @click="editEmployee" class="mr-4">
                <v-icon start>mdi-pencil</v-icon>
                Edit Employee
              </v-btn>
              <v-btn color="success" variant="elevated" @click="showInterviewDialog = true">
                <v-icon start>mdi-calendar-plus</v-icon>
                Schedule Interview
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Employee Information -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="h-100">
            <v-card-title class="bg-primary text-white">
              <v-icon start>mdi-account-details</v-icon>
              Employee Information
            </v-card-title>
            <v-card-text class="pt-4">
              <div class="employee-info">
                <div class="info-item mb-4">
                  <label class="text-subtitle-2 text-grey-darken-1 mb-1">Full Name</label>
                  <p class="text-h6 mb-0">{{ employee.firstName }} {{ employee.lastNames }}</p>
                </div>
                <div class="info-item mb-4">
                  <label class="text-subtitle-2 text-grey-darken-1 mb-1">Email</label>
                  <p class="text-h6 mb-0">
                    <a :href="`mailto:${employee.email}`" class="text-decoration-none">
                      {{ employee.email }}
                    </a>
                  </p>
                </div>
                <div class="info-item mb-4">
                  <label class="text-subtitle-2 text-grey-darken-1 mb-1">Phone</label>
                  <p class="text-h6 mb-0">
                    <a :href="`tel:${employee.phone}`" class="text-decoration-none">
                      {{ employee.phone }}
                    </a>
                  </p>
                </div>
                <div class="info-item mb-4">
                  <label class="text-subtitle-2 text-grey-darken-1 mb-1">Joined Date</label>
                  <p class="text-h6 mb-0">{{ formatDate.long(employee.createdAt) }}</p>
                </div>
                <div class="info-item">
                  <label class="text-subtitle-2 text-grey-darken-1 mb-1">Last Updated</label>
                  <p class="text-h6 mb-0">{{ formatDate.long(employee.updatedAt) }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2" class="h-100">
            <v-card-title class="bg-success text-white">
              <v-icon start>mdi-calendar-account</v-icon>
              Interviews
            </v-card-title>
            <v-card-text class="pt-4">
              <!-- Loading Interviews -->
              <div v-if="interviewsLoading" class="text-center py-4">
                <v-progress-circular size="32" color="primary" indeterminate />
                <p class="text-body-2 mt-2">Loading interviews...</p>
              </div>

              <!-- No Interviews -->
              <div v-else-if="employeeInterviews.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">
                  mdi-calendar-blank-outline
                </v-icon>
                <h4 class="text-h6 mb-2">No interviews scheduled</h4>
                <p class="text-body-2 text-grey mb-6">This employee doesn't have any interviews yet.</p>
                <v-btn color="success" variant="elevated" @click="showInterviewDialog = true">
                  <v-icon start>mdi-calendar-plus</v-icon>
                  Schedule First Interview
                </v-btn>
              </div>

              <!-- Interviews List -->
              <div v-else class="interviews-list">
                <v-card v-for="interview in employeeInterviews" :key="interview.id" variant="outlined" class="mb-3">
                  <v-card-text class="pb-2">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <h4 class="text-h6 font-weight-bold">{{ interview.position }}</h4>
                      <v-chip :color="getStatusColor(interview.status)" size="small" variant="elevated">
                        {{ interview.status }}
                      </v-chip>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <v-icon size="16" color="grey" class="mr-2">mdi-calendar</v-icon>
                      <span class="text-body-2">{{ formatDate.dateTime(interview.scheduledAt) }}</span>
                    </div>
                    <div v-if="interview.notes" class="d-flex align-start">
                      <v-icon size="16" color="grey" class="mr-2 mt-1">mdi-note-text</v-icon>
                      <span class="text-body-2">{{ interview.notes }}</span>
                    </div>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-spacer />
                    <span class="text-caption text-grey">
                      Created {{ formatDate.short(interview.createdAt) }}
                    </span>
                  </v-card-actions>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Edit Employee Dialog -->
    <EmployeeForm v-model="showEditDialog" :employee="employee" @saved="handleEmployeeSaved" />

    <!-- Schedule Interview Dialog -->
    <InterviewForm v-model="showInterviewDialog" :employee-id="employeeId" @saved="handleInterviewSaved" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEmployee } from '@/composables/useEmployees'
import { formatDate } from '@/utils/date'
import EmployeeForm from '@/components/EmployeeForm.vue'
import InterviewForm from '@/components/InterviewForm.vue'

const route = useRoute()
const employeeId = computed(() => (route.params as { id: string }).id)

const { data: employee, isLoading: employeeLoading, error: employeeError } = useEmployee(employeeId.value)

const showEditDialog = ref(false)
const showInterviewDialog = ref(false)

const employeeInterviews = computed(() => {
  if (!employee.value?.interviews) return []
  return [...employee.value.interviews].sort((a, b) =>
    new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  )
})

const interviewsLoading = computed(() => employeeLoading.value)

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'primary'
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    default: return 'grey'
  }
}

const editEmployee = () => {
  showEditDialog.value = true
}

const handleEmployeeSaved = () => {
  showEditDialog.value = false
}

const handleInterviewSaved = () => {
  showInterviewDialog.value = false
}

</script>

<style scoped>
.employee-info .info-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
}

.employee-info .info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.interviews-list {
  max-height: 400px;
  overflow-y: auto;
}

label {
  display: block;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
