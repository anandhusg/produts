<script setup>
import { onMounted, ref } from "vue";
const product_list = ref(null);
const cat_name = ref(null);
const showModal = ref(false);
const AddModal = ref(false);

const selectedProduct = ref({});
const newProduct = ref({
  title: "",
  price: 0,
  category: "",
});

// const showModal = ref(false)

selectedProduct;

onMounted(() => {
  fetch("https://fakestoreapi.com/products/")
    .then((res) => res.json())
    .then((data) => (product_list.value = data))
    .catch((err) => console.log(err));
});

function delete_record(id) {
  fetch("https://fakestoreapi.com/products/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      product_list.value = product_list.value.filter((item) => item.id !== id);
    })
    .catch((err) => console.error("Error:", err));
}

function getFilterResult(category) {
  fetch("https://fakestoreapi.com/products/category/" + category)
    .then((res) => res.json())
    .then((data) => (product_list.value = data))
    .catch((err) => console.error("Error:", err));
}
function openEditModal(product) {
  selectedProduct.value = { ...product };
  showModal.value = true;
}

async function saveProductEdits() {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${selectedProduct.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedProduct.value.title,
          price: selectedProduct.value.price,
          category: selectedProduct.value.category,
        }),
      }
    );

    const updatedProduct = await response.json();

    const index = product_list.value.findIndex(
      (p) => p.id === updatedProduct.id
    );
    if (index !== -1) {
      product_list.value.splice(index, 1, updatedProduct);
    }

    showModal.value = false;
  } catch (error) {
    console.error("Failed to update product:", error);
  }
}

async function saveNewProduct(newProducts) {
  console.log(newProduct);

  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProducts),
    });

    const createdProduct = await response.json();

    console.log(createdProduct);
    console.log(newProduct);
    newProduct.value.id = createdProduct.id;
    product_list.value.push(newProduct.value);

    console.log(product_list.value);
    AddModal.value = false;
    alert("Item Successfully added");
  } catch (error) {
    console.error("Failed to add product:", error);
  }
}
</script>
<template>
  <div class="main_div">
    <div class="heading">
      <h2>PRODUCT LIST</h2>
      <button
        @click="AddModal = true"
        style="background-color: #269900;height:'20px"
      >
        Add new product +
      </button>
    </div>

    <div class="search_bar">
      <input
        style="height: 40px; width: 300px"
        v-model="cat_name"
        type="text"
        @change="getFilterResult(cat_name)"
        placeholder="Type your category"
      />
      <button>Search</button>
    </div>
    <div class="product_lists">
      <div class="product_item" v-for="(item, i) in product_list" :key="i">
        <img class="image_class" :src="item.image" alt="" v-if="item.image" />
        <img
          class="image_class"
          :src="'https://thumbs.dreamstime.com/b/no-image-vector-symbol-missing-available-icon-gallery-moment-placeholder-248305496.jpg'"
          alt=""
          v-else
        />
        <div class="item_details">
          <div class="single-line-text">
            <b> {{ item.title }}</b>
          </div>
          <br />
          <div>{{ item.price }}</div>
          <div>{{ item.category }}</div>
        </div>

        <div class="button_div">
          <button
            @click="openEditModal(item)"
            style="background-color: #269900"
          >
            EDIT
          </button>
          <button
            style="background-color: #ff6666"
            @click="delete_record(item.id)"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal_overlay">
    <div class="modal_content">
      <h4>Edit Product</h4>
      <input placeholder="Title" v-model="selectedProduct.title" />

      <input placeholder="Price" v-model="selectedProduct.price" />

      <input placeholder="category" v-model="selectedProduct.category" />

      <br /><br />

      <div>
        <button @click="saveProductEdits" style="background-color: #269900">
          Save
        </button>
        <button style="background-color: #ff6666" @click="showModal = false">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div v-if="AddModal" class="modal_overlay">
    <div class="modal_content">
      <h4>Edit Product</h4>
      <input placeholder="Title" v-model="newProduct.title" />

      <input placeholder="Price" v-model="newProduct.price" />

      <input placeholder="category" v-model="newProduct.category" />

      <br /><br />

      <div>
        <button @click="saveNewProduct()" style="background-color: #269900">
          Save
        </button>
        <button style="background-color: #ff6666" @click="AddModal = false">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.single-line-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* optional: adds "..." if text is too long */
}

.main_div {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}
.product_lists {
  display: flex;
  width: 100%;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  gap: 1rem;
}
.product_item {
  width: 24%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.image_class {
  height: 300px;
  object-fit: cover;
}
.item_details {
  padding-top: 1rem;
  padding-bottom: 1rem;

  text-align: left;
  font-size: 14px;
}
.button_div {
  display: flex;
  justify-content: space-between;
  padding-bottom: 2rem;
}
.heading {
  display: flex;
  justify-content: space-between;
}
.search_bar {
  display: flex;
  justify-content: flex-end;
  margin: 2rem 0;
}

.modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal_content {
  display: flex;
  flex-direction: column;

  background-color: grey;

  padding: 20px;
  margin: 100px auto;
  width: 600px;
  border-radius: 10px;
}
.modal_content input {
  height: 40px;
  margin-top: 1rem;
}

.modal_content div {
  display: flex;
  justify-content: space-around;
}

@media (max-width: 600px) {
  .product_item {
    display: flex;
    width: 100%;
  }
}
@media (min-width: 601px) and (max-width: 1020px) {
  .product_item {
    display: flex;
    width: 45%;
  }
}
</style>
