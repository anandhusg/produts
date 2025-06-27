<template>
  <div style="width: 100%" class="product_item" v-if="productExists">
    <img
      class="image_class"
      :src="counter.selected_data.image || fallbackImage"
      alt=""
    />
    <div >
      <div class="single-line-text">
        <b>{{ counter.selected_data.title }}</b>
      </div>
      <br />
      <div>{{ counter.selected_data.price }} €</div>
      <div>{{ counter.selected_data.category }}</div>
    </div>

    <ProductEditForm :product="counter.selected_data" />
  </div>
  <div v-else>
    <p>Product not found. <router-link to="/">Go back to home</router-link>.</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCounterStore } from "../Store/counter";
import ProductEditForm from "../components/ProductEditForm.vue";

const counter = useCounterStore();

const fallbackImage =
  "https://thumbs.dreamstime.com/b/no-image-vector-symbol-missing-available-icon-gallery-moment-placeholder-248305496.jpg";

const productExists = computed(() => {
  return counter.selected_data && counter.selected_data.id;
});
</script>
