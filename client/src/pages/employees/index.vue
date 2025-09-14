<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Employees</h1>
      <v-btn color="primary" variant="elevated" size="large" @click="showCreateDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Add Employee
      </v-btn>
    </div>

    <!-- Search Bar -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-text-field v-model="employeesStore.searchQuery" placeholder="Search by name or email..."
          prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" clearable hide-details
          @update:model-value="handleSearch" />
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular size="64" color="primary" indeterminate />
      <p class="text-h6 mt-4">Loading employees...</p>
    </div>

    <!-- Error State -->
    <v-alert v-else-if="error" type="error" variant="outlined" class="mb-6" :text="error.message" closable
      @click:close="() => refetch()" />

    <!-- Empty State -->
    <v-card v-else-if="filteredEmployees.length === 0" class="text-center py-12" elevation="2">
      <v-card-text>
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-account-group-outline
        </v-icon>
        <h3 class="text-h5 mb-2">No employees found</h3>
        <p class="text-body-1 text-grey">
          {{ employeesStore.searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first employee'
          }}
        </p>
        <v-btn v-if="!employeesStore.searchQuery" color="primary" variant="elevated" class="mt-4"
          @click="showCreateDialog = true">
          <v-icon start>mdi-plus</v-icon>
          Add Employee
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Employees List -->
    <div v-else class="employees-grid">
      <v-card v-for="employee in filteredEmployees" :key="employee.id" elevation="2" hover class="employee-card"
        @click="navigateToEmployee(employee.id)">
        <v-card-text>
          <div class="d-flex align-center mb-3">
            <v-avatar color="primary" size="48" class="mr-4">
              <span class="text-h6 font-weight-bold">
                {{ getInitials(employee.name, employee.lastName) }}
              </span>
            </v-avatar>
            <div class="flex-grow-1">
              <h3 class="text-h6 font-weight-bold">
                {{ employee.name }} {{ employee.lastName }}
              </h3>
              <p class="text-body-2 text-grey mb-0">
                {{ employee.email }}
              </p>
            </div>
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" @click.stop />
              </template>
              <v-list>
                <v-list-item @click="editEmployee(employee)">
                  <v-list-item-title>
                    <v-icon start>mdi-pencil</v-icon>
                    Edit
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteEmployee(employee)">
                  <v-list-item-title class="text-error">
                    <v-icon start>mdi-delete</v-icon>
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div class="employee-details">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="grey" class="mr-2">mdi-phone</v-icon>
              <span class="text-body-2">{{ employee.phone }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="16" color="grey" class="mr-2">mdi-calendar</v-icon>
              <span class="text-body-2">
                Joined {{ formatDate.short(employee.createdAt) }}
              </span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn variant="text" color="primary" size="small" @click.stop="navigateToEmployee(employee.id)">
            View Details
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- Create/Edit Employee Dialog -->
    <EmployeeForm v-model="showCreateDialog" :employee="selectedEmployee" @saved="handleEmployeeSaved" />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Delete Employee
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ employeeToDelete?.name }} {{ employeeToDelete?.lastName }}?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" :loading="deleteEmployeeMutation.isPending.value"
            @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { useEmployees, useDeleteEmployee, useFilteredEmployees } from '@/composables/useEmployees'
import { formatDate } from '@/utils/date'
import type { Employee } from '@/types'
import EmployeeForm from '@/components/EmployeeForm.vue'

const router = useRouter()
const employeesStore = useEmployeesStore()


const { data: employees, isLoading, error, refetch } = useEmployees()
const deleteEmployeeMutation = useDeleteEmployee()

const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const employeeToDelete = ref<Employee | null>(null)

const filteredEmployees = computed(() => {
  if (!employees.value) return []
  return useFilteredEmployees(employees.value, employeesStore.searchQuery).value
})

const handleSearch = (value: string) => {
  employeesStore.setSearchQuery(value)
}

const navigateToEmployee = (id: string) => {
  router.push(`/employees/${id}`)
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const editEmployee = (employee: Employee) => {
  selectedEmployee.value = employee
  showCreateDialog.value = true
}

const deleteEmployee = (employee: Employee) => {
  employeeToDelete.value = employee
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (employeeToDelete.value) {
    await deleteEmployeeMutation.mutateAsync(employeeToDelete.value.id)
    showDeleteDialog.value = false
    employeeToDelete.value = null
  }
}

const handleEmployeeSaved = () => {
  showCreateDialog.value = false
  selectedEmployee.value = null
}
</script>

<style scoped>
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.employee-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.employee-card:hover {
  transform: translateY(-2px);
}

.employee-details {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
}

@media (max-width: 600px) {
  .employees-grid {
    grid-template-columns: 1fr;
  }
}
</style>
