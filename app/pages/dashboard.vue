<script setup>
const user = useUserStore()
user.loadFromCookie()
</script>

<template>
  <div class="container py-5">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4">
        <i class="fas fa-tachometer-alt"/> Dashboard
      </h2>
      <p class="lead">
        歡迎登入，{{ user.username || '使用者' }}！
      </p>

      <!-- 範例功能區塊 -->
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="card text-center p-3">
            <i class="fas fa-user fa-2x mb-2"/>
            <h5>個人資料</h5>
            <p>查看或編輯個人資訊</p>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="card text-center p-3">
            <i class="fas fa-cogs fa-2x mb-2"/>
            <h5>設定</h5>
            <p>系統或帳號設定</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
