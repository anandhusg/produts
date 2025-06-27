<template>
  <form @submit.prevent="saveChanges" class="edit-form">
    <div>
      <label>Name*</label>
      <input class="full_w" v-model="formData.title" required />
    </div>

    <div>
      <label>Price (Net €)*</label>
      <input
        class="full_w"
        type="number"
        v-model.number="formData.price"
        min="0"
        required
      />
    </div>

    <div>
      <label>Tax Rate (%)</label>
      <select class="full_w" v-model.number="formData.taxRate">
        <option :value="0">0%</option>
        <option :value="7">7%</option>
        <option :value="19">19%</option>
      </select>
    </div>

    <div>
      <label>Category*</label>
      <input class="full_w" v-model="formData.category" required />
    </div>

    <div class="tax-breakdown">
      <p>Net: {{ formattedNet }}</p>
      <p>Tax: {{ formattedTax }}</p>
      <p>
        <strong>Gross: {{ formattedGross }}</strong>
      </p>
    </div>

    <div class="button_div">
      <button type="submit" style="background-color: #269900">Save</button>
      <button type="button" style="background-color: #ccc" @click="cancelEdit">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
// import { useRouter } from 'vue-router';
import { useCounterStore } from "../Store/counter";

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["update"]);

const counter = useCounterStore();
const router = useRouter();

const originalData = ref({ ...props.product, taxRate: 19 });
const formData = ref({ ...originalData.value });
const dirty = ref(false);

// Watch for unsaved changes
watch(
  formData,
  (newVal) => {
    dirty.value = JSON.stringify(newVal) !== JSON.stringify(originalData.value);
  },
  { deep: true }
);

// Computed values
const taxRateDecimal = computed(() => formData.value.taxRate / 100);
const taxAmount = computed(() => formData.value.price * taxRateDecimal.value);
const grossPrice = computed(() => formData.value.price + taxAmount.value);

// Formatters
const formatPrice = (value) => `${value.toFixed(2)} €`;
const formattedNet = computed(() => formatPrice(formData.value.price));
const formattedTax = computed(() => formatPrice(taxAmount.value));
const formattedGross = computed(() => formatPrice(grossPrice.value));

// Cancel with confirmation
function cancelEdit() {
  if (dirty.value && !confirm("Discard unsaved changes?")) return;
  formData.value = { ...originalData.value };
  dirty.value = false;
}

// Save logic
async function saveChanges() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API
  counter.selected_data = { ...formData.value };
  originalData.value = { ...formData.value };
  dirty.value = false;
  alert("Saved successfully!");
}


onBeforeRouteLeave((to, from, next) => {
  if (dirty.value && !confirm("You have unsaved changes. Leave anyway?")) {
    next(false);
  } else {
    next();
  }
});
</script>

<style scoped>
.edit-form {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tax-breakdown {
  background: black;
  padding: 10px;
  border-radius: 5px;
}
.button_div {
  display: flex;
  gap: 10px;
}
</style>
