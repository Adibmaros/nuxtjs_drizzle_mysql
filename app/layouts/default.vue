<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-container">
        <div class="brand">
          <span class="logo-icon">⚡</span>
          <span class="brand-name">Nuxt Drizzle Admin</span>
        </div>
        <div class="nav-links">
          <NuxtLink to="/" class="nav-item" exact-active-class="active">
            👤 Users
          </NuxtLink>
          <NuxtLink to="/products" class="nav-item" exact-active-class="active">
            📦 Products
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style>
/* Global resets & styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #0f172a;
}

.logo-icon {
  font-size: 1.3rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.main-content {
  flex: 1;
}
</style>
