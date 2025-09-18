<template>
  <v-dialog :model-value="modelValue" max-width="600" persistent
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-calendar-plus</v-icon>
        Schedule Interview
      </v-card-title>

      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="formData.position" label="Position" variant="outlined" density="comfortable"
                :rules="formValidation.interview.position" placeholder="e.g. Frontend Developer, Marketing Manager" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.date" label="Date" type="date" variant="outlined" density="comfortable"
                :rules="formValidation.interview.date" :min="today" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="formData.time" label="Time" type="time" variant="outlined" density="comfortable"
                :rules="formValidation.interview.time" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="formData.notes" label="Notes (Optional)" variant="outlined" density="comfortable"
                rows="3" placeholder="Additional information about the interview..."
                :rules="formValidation.interview.notes" />
            </v-col>
          </v-row>

        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn variant="text" color="grey" @click="handleCancel" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn type="submit" color="success" variant="elevated" :loading="loading">
            Schedule Interview
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useCreateInterview } from '@/composables/useInterviews'
import { formValidation, type FormValidationResult } from '@/utils/validation'
import { useErrorHandler } from '@/utils/errorHandling'
import { getTodayInput } from '@/utils/date'
import type { CreateInterviewDto } from '@/types'

interface Props {
  modelValue: boolean
  employeeId?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  employeeId: undefined
})

const emit = defineEmits<Emits>()

const createInterviewMutation = useCreateInterview()
const { handleError } = useErrorHandler('InterviewForm')

const form = ref<{ resetValidation: () => void; validate: () => Promise<{ valid: boolean }> }>()

const formData = reactive({
  position: '',
  date: '',
  time: '',
  notes: ''
})

const today = computed(() => getTodayInput())
const loading = computed(() => createInterviewMutation.isPending.value)

const resetForm = () => {
  Object.assign(formData, {
    position: '',
    date: '',
    time: '',
    notes: ''
  })

  nextTick(() => {
    form.value?.resetValidation()
  })
}

const handleSubmit = async () => {
  if (!form.value) return

  const { valid } = await form.value.validate() as FormValidationResult;
  if (!valid) return

  try {
    const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString()

    const createData: CreateInterviewDto = {
      userId: props.employeeId || '',
      position: formData.position.trim(),
      scheduledAt,
      notes: formData.notes.trim() || undefined
    }

    await createInterviewMutation.mutateAsync(createData)

    emit('saved')
  } catch (error) {
    handleError(error, { showNotifications: true, logLevel: 'warn' })
  }
}

const handleCancel = () => {
  emit('update:modelValue', false)
  resetForm()
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>
