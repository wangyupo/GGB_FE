<template>
  <!-- 登录页 -->
  <div class="relative w-full h-full bg-[#f5f5f5]">
    <div class="login-form text-center">
      <div class="login-form-title text-3xl mb-4 tracking-wider">请登录</div>
      <div class="w-[300px] bg-white border border-[var(--el-border-color-light)] rounded-lg">
        <div class="relative border-b border-b-[var(--el-border-color-light)]">
          <input
            v-model="form.userName"
            id="login_username"
            type="text"
            class="w-full px-3 rounded-t-lg focus:ring-4 focus:ring-[#bbd3f7] relative focus:z-10 transition-all"
            :class="[nameInputFocus || form.userName ? 'pt-6 pb-2' : 'py-4']"
            @focus="inputFocus('login_username')"
            @blur="inputBlur('login_username')"
          />
          <label
            for="login_username"
            class="absolute left-3 z-10 transition-all"
            :class="[nameInputFocus || form.userName ? 'top-1 text-sm text-gray-500' : 'top-1/2 -translate-y-1/2']"
          >
            邮箱
          </label>
        </div>
        <div class="relative">
          <input
            v-model="form.password"
            id="login_password"
            type="password"
            class="w-full px-3 rounded-b-lg focus:ring-4 focus:ring-[#bbd3f7] relative focus:z-10 transition-all"
            :class="[passwordInputFocus || form.password ? 'pt-6 pb-2' : 'py-4']"
            @focus="inputFocus('login_password')"
            @blur="inputBlur('login_password')"
          />
          <label
            for="login_password"
            class="absolute left-3 z-10 transition-all"
            :class="[passwordInputFocus || form.password ? 'top-1 text-sm text-gray-500' : 'top-1/2 -translate-y-1/2']"
          >
            密码
          </label>
        </div>
      </div>
      <div class="mt-4">
        <el-checkbox v-model="checked" label="记住我" class="h-auto" />
      </div>
      <el-button
        type="primary"
        class="mt-4 w-[300px] h-[48px] text-xl rounded-lg tracking-wider"
        :loading="isNavigating"
        @click="handleLogin"
      >
        登录
      </el-button>
      <div class="mt-3">
        <el-icon class="arrow"><Top /></el-icon>
      </div>
      <div class="mt-1 text-gray-500 text-sm">点击登录即可，示例版本没做登录校验</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";
import { getMenuByRole } from "@/api/system/menu.js";
import { login } from "@/api/login.js";
import { useLayoutStore } from "@/stores/layout.js";
import { arr2tree } from "@/utils/index.js";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const layoutStore = useLayoutStore();
const { userInfo } = storeToRefs(userStore);
const { isNavigating } = storeToRefs(layoutStore);
const router = useRouter();
const nameInputFocus = ref(false);
const passwordInputFocus = ref(false);
const checked = ref(false);
const form = reactive({
  userName: "",
  password: "",
});

const inputFocus = params => {
  if (params === "login_username") {
    nameInputFocus.value = true;
  } else if (params === "login_password") {
    passwordInputFocus.value = true;
  }
};
const inputBlur = params => {
  if (params === "login_username") {
    if (!form.userName) nameInputFocus.value = false;
  } else if (params === "login_password") {
    if (!form.password) passwordInputFocus.value = false;
  }
};

// 登录
const handleLogin = () => {
  const params = form;
  login(params)
    .then(res => {
      if (res.code == 0) {
        userStore.$patch(state => {
          state.userInfo = res.data.user;
        });
        userStore.$patch(state => {
          state.menu = arr2tree(res.data.menu);
        });
        router.replace({ path: "/" });
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 获取菜单
const fn_getMenu = () => {
  const params = {
    roleId: userInfo.value.roleId,
  };
  getMenuByRole(params)
    .then(res => {
      if (res.code == 200) {
        userStore.$patch(state => {
          state.menu = res.data;
        });
        if (res.data.length) {
          router.replace({
            path: "/",
          });
          ElMessage({ type: "success", message: "登录成功！" });
        } else {
          ElMessage({ type: "error", message: "未分配角色！" });
        }
      }
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped>
.login {
  &-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.arrow {
  animation: arrow 1.6s infinite linear;
}
@keyframes arrow {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
