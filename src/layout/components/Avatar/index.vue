<template>
  <!-- 个人信息 -->
  <el-dropdown trigger="click" class="h-full">
    <div class="avatar flex items-center cursor-pointer flex-shrink-0 px-3 h-full hover:bg-[--el-color-primary-dark-2]">
      <el-avatar :size="30" />
      <div class="ml-2 text-white">{{ userInfo.userName }}</div>
    </div>
    <template #dropdown>
      <div class="menu">
        <div class="menu-item flex items-center" @click="showDialog">
          <el-icon size="16" class="mr-1"><Lock /></el-icon>
          修改密码
        </div>
        <div class="menu-item flex items-center" @click="handleLoginOut">
          <el-icon size="16" class="mr-1"><SwitchButton /></el-icon>
          退出登录
        </div>
      </div>
    </template>
  </el-dropdown>
  <ChangePwdDialog v-model="dialogVisible" title="修改密码" width="700px" />
</template>

<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { removeAllLoginInfo } from "@/utils/index";
import { logout } from "@/api/login.js";
import ChangePwdDialog from "./components/changePwdDialog.vue";
import { useUserStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = () => {
  dialogVisible.value = true;
};
/** 弹窗 END **/

const router = useRouter();

// 退出登录
const handleLoginOut = params => {
  ElMessageBox.confirm("确认退出系统吗?", "提示", {
    type: "warning",
  }).then(() => {
    logout()
      .then(res => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "登出成功！",
          });
          router.replace({
            path: "/login",
          });
          removeAllLoginInfo();
        }
      })
      .catch(() => {})
      .finally(() => {});
  });
};
</script>

<style lang="scss" scoped>
@import "@/layout/types/common.scss";
$itemHeight: 40px;

.avatar {
  height: 100%;
}

.menu {
  overflow: hidden;
  &-item {
    padding: 0 8px;
    height: $itemHeight;
    line-height: $itemHeight;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
    &:last-child {
      border-top: 1px solid var(--el-color-primary-light-9);
    }
  }
}
</style>
