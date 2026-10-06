<template>
  <div class="page-container">
    <div class="header">
      <div>
        <h1 class="title">Manajemen User</h1>
        <p class="subtitle">Kelola dan tambah daftar pengguna aplikasi dengan gampang.</p>
      </div>
      <button @click="refreshUsers" class="btn btn-secondary" :disabled="pending">
        <span v-if="pending" class="spinner"></span>
        <span v-else>↻ Refresh</span>
      </button>
    </div>

    <div class="grid-layout">
      <!-- Form Tambah / Edit User -->
      <div class="card">
        <h2 class="card-title">{{ editingId ? 'Edit User' : 'Tambah User Baru' }}</h2>
        
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Masukkan nama"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">
              Password {{ editingId ? '(Kosongkan jika tidak diubah)' : '' }}
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Minimal 6 karakter"
              :required="!editingId"
              minlength="6"
            />
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" v-model="form.role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="btn-group">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner"></span>
              <span v-else>{{ editingId ? 'Update User' : 'Simpan User' }}</span>
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

      <!-- Tabel List User -->
      <div class="card">
        <h2 class="card-title">Daftar User ({{ users?.length || 0 }})</h2>

        <div v-if="pending && !users" class="loading-state">
          <div class="spinner large"></div>
          <p>Memuat data user...</p>
        </div>

        <div v-else-if="fetchError" class="alert alert-error">
          Gagal mengambil data user: {{ fetchError.message }}
        </div>

        <div v-else-if="!users || users.length === 0" class="empty-state">
          <p>Belum ada data user.</p>
        </div>

        <div v-else class="table-container">
          <table class="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="font-mono">#{{ user.id }}</td>
                <td class="font-medium">{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span
                    class="badge"
                    :class="user.role === 'admin' ? 'badge-admin' : 'badge-user'"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button @click="startEdit(user)" class="btn-icon btn-edit" title="Edit">
                      ✏️
                    </button>
                    <button @click="deleteUser(user.id)" class="btn-icon btn-delete" title="Hapus">
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

// Fetch daftar user (GET /api/users)
const { data: users, pending, error: fetchError, refresh: refreshUsers } = await useFetch('/api/users');

// Form state
const editingId = ref(null);
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});

const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const resetForm = () => {
  editingId.value = null;
  form.name = '';
  form.email = '';
  form.password = '';
  form.role = 'user';
};

const startEdit = (user) => {
  editingId.value = user.id;
  form.name = user.name;
  form.email = user.email;
  form.password = ''; // Jangan tampilkan password
  form.role = user.role;
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
      // UPDATE
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      await $fetch(`/api/users/${editingId.value}`, {
        method: 'PUT',
        body: payload,
      });
      successMessage.value = 'User berhasil diperbarui!';
    } else {
      // CREATE
      await $fetch('/api/users', {
        method: 'POST',
        body: form,
      });
      successMessage.value = 'User berhasil ditambahkan!';
    }

    resetForm();
    await refreshUsers();
  } catch (err) {
    errorMessage.value = err.data?.message || err.message || 'Gagal menyimpan data user.';
  } finally {
    submitting.value = false;
  }
};

// Delete handler
const deleteUser = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' });
    successMessage.value = 'User berhasil dihapus!';
    await refreshUsers();
  } catch (err) {
    errorMessage.value = err.data?.message || err.message || 'Gagal menghapus user.';
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

.user-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.925rem;
}

.user-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.user-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.user-table tr:hover td {
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

.font-mono {
  font-family: monospace;
  color: #64748b;
}

.font-medium {
  font-weight: 600;
  color: #0f172a;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-admin {
  background-color: #fef3c7;
  color: #b45309;
}

.badge-user {
  background-color: #e0f2fe;
  color: #0369a1;
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
