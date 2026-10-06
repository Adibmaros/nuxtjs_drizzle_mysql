<template>
  <div class="page-container">
    <div class="header">
      <div>
        <h1 class="title">Manajemen Product</h1>
        <p class="subtitle">Kelola dan tambah daftar produk serta kaitkan dengan pemilik user.</p>
      </div>
      <button @click="refreshProducts" class="btn btn-secondary" :disabled="pending">
        <span v-if="pending" class="spinner"></span>
        <span v-else>↻ Refresh</span>
      </button>
    </div>

    <div class="grid-layout">
      <!-- Form Tambah / Edit Product -->
      <div class="card">
        <h2 class="card-title">{{ editingId ? 'Edit Product' : 'Tambah Product Baru' }}</h2>
        
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="name">Nama Product</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Masukkan nama produk"
              required
            />
          </div>

          <div class="form-group">
            <label for="userId">Pemilik (User)</label>
            <select id="userId" v-model.number="form.userId" required>
              <option value="" disabled>-- Pilih User --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
            <span v-if="!users || users.length === 0" class="hint">
              Belum ada user. Tambahkan user terlebih dahulu.
            </span>
          </div>

          <div class="btn-group">
            <button type="submit" class="btn btn-primary" :disabled="submitting || !form.userId">
              <span v-if="submitting" class="spinner"></span>
              <span v-else>{{ editingId ? 'Update Product' : 'Simpan Product' }}</span>
            </button>
            <button
              v-if="editingId"
              type="button"
              @click="cancelEdit"
              class="btn btn-ghost"
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      <!-- Tabel List Product -->
      <div class="card">
        <h2 class="card-title">Daftar Product ({{ products?.length || 0 }})</h2>

        <div v-if="pending && !products" class="loading-state">
          <div class="spinner large"></div>
          <p>Memuat data produk...</p>
        </div>

        <div v-else-if="fetchError" class="alert alert-error">
          Gagal mengambil data produk: {{ fetchError.message }}
        </div>

        <div v-else-if="!products || products.length === 0" class="empty-state">
          <p>Belum ada data produk.</p>
        </div>

        <div v-else class="table-container">
          <table class="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Pemilik (User)</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td class="font-mono">#{{ product.id }}</td>
                <td class="font-medium">{{ product.name }}</td>
                <td>
                  <div class="user-info" v-if="product.user">
                    <span class="user-name">{{ product.user.name }}</span>
                    <span class="user-email">{{ product.user.email }}</span>
                  </div>
                  <span v-else class="text-muted">N/A</span>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button @click="startEdit(product)" class="btn-icon btn-edit" title="Edit">
                      ✏️
                    </button>
                    <button @click="deleteProduct(product.id)" class="btn-icon btn-delete" title="Hapus">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Fetch products & users
const { data: products, pending, error: fetchError, refresh: refreshProducts } = await useFetch('/api/products');
const { data: users } = await useFetch('/api/users');

// Form state
const editingId = ref(null);
const form = reactive({
  name: '',
  userId: '',
});

const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const resetForm = () => {
  editingId.value = null;
  form.name = '';
  form.userId = '';
};

const startEdit = (product) => {
  editingId.value = product.id;
  form.name = product.name;
  form.userId = product.userId;
  successMessage.value = '';
  errorMessage.value = '';
};

const cancelEdit = () => {
  resetForm();
};

// Submit handler (POST / PUT)
const handleSubmit = async () => {
  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    if (editingId.value) {
      await $fetch(`/api/products/${editingId.value}`, {
        method: 'PUT',
        body: form,
      });
      successMessage.value = 'Product berhasil diperbarui!';
    } else {
      await $fetch('/api/products', {
        method: 'POST',
        body: form,
      });
      successMessage.value = 'Product berhasil ditambahkan!';
    }

    resetForm();
    await refreshProducts();
  } catch (err) {
    errorMessage.value = err.data?.message || err.message || 'Gagal menyimpan data product.';
  } finally {
    submitting.value = false;
  }
};

// Delete handler
const deleteProduct = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus product ini?')) return;

  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' });
    successMessage.value = 'Product berhasil dihapus!';
    await refreshProducts();
  } catch (err) {
    errorMessage.value = err.data?.message || err.message || 'Gagal menghapus product.';
  }
};
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 868px) {
  .grid-layout {
    grid-template-columns: 360px 1fr;
  }
}

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1.25rem;
  color: #1e293b;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.form-group input,
.form-group select {
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fff;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.hint {
  font-size: 0.775rem;
  color: #ef4444;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.btn-ghost {
  background-color: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.btn-ghost:hover {
  background-color: #f1f5f9;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.table-container {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.925rem;
}

.product-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.product-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.product-table tr:hover td {
  background-color: #f8fafc;
}

.text-right {
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #e2e8f0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #0f172a;
}

.user-email {
  font-size: 0.8rem;
  color: #64748b;
}

.text-muted {
  color: #94a3b8;
}

.font-mono {
  font-family: monospace;
  color: #64748b;
}

.font-medium {
  font-weight: 600;
  color: #0f172a;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner.large {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
