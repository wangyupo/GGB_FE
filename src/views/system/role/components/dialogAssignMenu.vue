<template>
  <!-- 弹窗-分配菜单 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <RhTree
      v-loading="loading"
      element-loading-text="加载中..."
      class="w-full"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="treeRef"
      :data="menu"
      @check="handleCheckMenu"
    />
    <template #footer>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { menuList } from "@/api/system/menu.js";
import { assignMenu, getMenuByRole } from "@/api/system/role.js";
import { arr2tree } from "@/utils/index.js";
import { ElMessage } from "element-plus";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

/** 分配菜单 START **/
const treeRef = ref();
const menu = ref([]);
const menuIds = ref([]);
const loading = ref(false); // 加载状态

// 选择菜单
const handleCheckMenu = () => {
  menuIds.value = treeRef.value.rhTreeRef.getCheckedKeys().concat(treeRef.value.rhTreeRef.getHalfCheckedKeys());
};

// 获取所有菜单
const fn_menuList = async () => {
  const params = {
    pageNumber: 1,
    pageSize: 999,
  };
  await menuList(params)
    .then(res => {
      if (res.code == 0) {
        menu.value = arr2tree(res.data.list);
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 获取角色绑定的菜单
const fn_getMenuByRole = async () => {
  const params = props.data.id;
  await getMenuByRole(params)
    .then(res => {
      if (res.code == 0) {
        menuIds.value = res.data.map(i => i.id);
        console.log(menuIds.value, res.data);
        for (let index = 0; index < menuIds.value.length; index++) {
          const menuId = menuIds.value[index];
          const node = treeRef.value.rhTreeRef.getNode(menuId);
          if (node.isLeaf) treeRef.value.rhTreeRef.setChecked(menuId, true, false);
        }
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 确定
const handleConfirm = () => {
  loading.value = true;
  const params = {
    roleId: props.data.id,
    menuIds: menuIds.value,
  };
  assignMenu(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: `菜单绑定成功！` });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};
/** 分配菜单 END **/

/** dialog START **/
const emits = defineEmits(["opened", "closed"]);
const dialogVisible = defineModel();

// 弹窗开启
const opened = async () => {
  loading.value = true;
  await fn_menuList();
  await fn_getMenuByRole();
  loading.value = false;
  emits("opened");
};

// 弹窗关闭
const closed = () => {
  resetData();
  emits("closed");
  dialogVisible.value = false;
};

// 重置数据
const resetData = () => {
  menuIds.value = [];
  treeRef.value.rhTreeRef.setCheckedKeys([]);
};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
