<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <NuxtLink to="/" class="navbar-brand">
        <i class="fas fa-building me-1"/> {{ route.meta.headerTitle || '證券帳務' }}
      </NuxtLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
      >
        <span class="navbar-toggler-icon"/>
      </button>

      <!-- 導覽選單 -->
      <div v-if="user.isLoggedIn" id="mainNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/dashboard">儀表板</NuxtLink>
          </li>

          <!-- Menu -->
          <li v-if="filteredMenuGroups.length" class="nav-item dropdown position-static">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              功能選單
            </a>
            <div class="dropdown-menu w-100 mt-0 p-3 border-0 shadow">
              <div class="container">
                <div class="row">
                  <div v-for="(group, gIndex) in filteredMenuGroups" :key="gIndex" class="col-md-3">
                    <h6 class="text-uppercase">{{ group.title }}</h6>
                    <ul class="list-unstyled">
                      <li v-for="(item, iIndex) in group.items" :key="iIndex">
                        <NuxtLink class="dropdown-item" :to="item.to">{{ item.label }}</NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- 右側 -->
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item me-2"><NuxtLink class="nav-link" to="/profile">個人資料</NuxtLink></li>
          <li class="nav-item me-2">
            <span class="navbar-text">{{ user.username }}</span>
          </li>
          <li class="nav-item me-2">
            <span class="navbar-text" style="font-family: monospace;">{{ clock }}</span>
          </li>
          <li class="nav-item">
            <button ref="logoutBtn" class="btn btn-link nav-link" title="登出" @click="handleLogout"><i class="fas fa-sign-out-alt me-1"/></button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const { $api, $bootstrap } = useNuxtApp();

const route = useRoute();
const router = useRouter();
const user = useUserStore();

const logoutBtn = ref(null);
let tooltipInstance = null;

/**------+---------+---------+---------+---------+---------+---------+----------
 * Menu
---------+---------+---------+---------+---------+---------+---------+--------*/

// 假設登入者有多角色（實務上應該從登入 API 或 Pinia/Vuex state 拿）
const currentUserRoles = ['admin'];

// 從 API 抓選單做初始化
const { data: menuGroups } = await useAPI('/api/menu');

// 判斷是否允許顯示某個項目
function canAccess(itemRoles, userRoles) {
  return itemRoles.some(role => userRoles.includes(role));
}

// 根據角色過濾
const filteredMenuGroups = computed(() => {
  if (!menuGroups.value) return [];
  return menuGroups.value
    .map(group => ({
      ...group,
      items: group.items.filter(item => canAccess(item.roles, currentUserRoles))
    }))
    .filter(group => group.items.length > 0);
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * 時鐘
---------+---------+---------+---------+---------+---------+---------+--------*/

const clock = ref('');
let timer = null;
function updateClock() {
  const now = new Date()
  clock.value = now.toLocaleTimeString('zh-TW', { hour12: true })
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events - Cookie
---------+---------+---------+---------+---------+---------+---------+--------*/

const userCookie = useCookie('user')
watch(userCookie, async(cookie) => {
  // 監聽`登入/登出`時的cookie變化來更新選單
  if (cookie) {
    menuGroups.value = await $api('/api/menu');
  }
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

function handleLogout() {
  user.logout();
  router.push('/');
}

watch(logoutBtn, (el) => {
  if (el) {
    // 初始化Tooltip實例
    tooltipInstance = new $bootstrap.Tooltip(el)
  } else {
    // 元素消失時清掉Tooltip實例
    if (tooltipInstance) {
      tooltipInstance.dispose()
      tooltipInstance = null
    }
  }
});

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 500)
});

onUnmounted(() => {
  clearInterval(timer)
});

</script>

<style scoped>
header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
