<template>
  <v-dialog :model-value="modelValue" max-width="600" persistent
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
        {{ isEditing ? 'Edit Employee' : 'Add New Employee' }}
      </v-card-title>

      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.name" label="First Name" variant="outlined" density="comfortable"
                :rules="formValidation.employee.name" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.lastName" label="Last Name" variant="outlined" density="comfortable"
                :rules="formValidation.employee.lastName" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="formData.email" label="Email" type="email" variant="outlined" density="comfortable"
                :rules="formValidation.employee.email" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="formData.phone" label="Phone" type="tel" variant="outlined" density="comfortable"
                :rules="formValidation.employee.phone" />
            </v-col>
          </v-row>

        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn variant="text" color="grey" @click="handleCancel" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn type="submit" color="primary" variant="elevated" :loading="loading">
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useCreateEmployee, useUpdateEmployee } from '@/composables/useEmployees'
import { formValidation, type FormValidationResult } from '@/utils/validation'
import { useErrorHandler } from '@/utils/errorHandling'
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types'

interface Props {
  modelValue: boolean
  employee?: Employee | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  employee: null
})

const emit = defineEmits<Emits>()

const createEmployeeMutation = useCreateEmployee()
const updateEmployeeMutation = useUpdateEmployee()
const { handleError } = useErrorHandler('EmployeeForm')

const form = ref()
const formData = reactive({
  name: '',
  lastName: '',
  email: '',
  phone: ''
})

const isEditing = computed(() => !!props.employee)
const loading = computed(() =>
  createEmployeeMutation.isPending.value || updateEmployeeMutation.isPending.value
)

const resetForm = () => {
  formData.name = ''
  formData.lastName = ''
  formData.email = ''
  formData.phone = ''

  nextTick(() => {
    form.value?.resetValidation()
  })
}

const populateForm = (employee: Employee) => {
  formData.name = employee.name
  formData.lastName = employee.lastName
  formData.email = employee.email
  formData.phone = employee.phone
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate() as FormValidationResult;
  if (!valid) return

  try {
    if (isEditing.value && props.employee) {
      await updateEmployeeMutation.mutateAsync({
        id: props.employee.id,
        data: formData as UpdateEmployeeDto
      })
    } else {
      await createEmployeeMutation.mutateAsync(formData as CreateEmployeeDto)
    }

    emit('saved')
    resetForm()
  } catch (error) {
    handleError(error, { showNotifications: true, logLevel: 'warn' })
  }
}

const handleCancel = () => {
  emit('update:modelValue', false)
  resetForm()
}

watch(() => props.employee, (newEmployee) => {
  if (newEmployee) {
    populateForm(newEmployee)
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.employee) {
    populateForm(props.employee)
  } else if (!isOpen) {
    resetForm()
  }
})
</script>
