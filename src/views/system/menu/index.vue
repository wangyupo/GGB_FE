<template>
  <!-- 菜单管理 -->
  <div class="flex h-full" v-loading="loading">
    <RhWrapper title="菜单管理" class="w-[300px] h-full">
      <template #title-right>
        <el-button type="primary" @click="handleMenuAdd">添加菜单</el-button>
        <el-button
          type="danger"
          :disabled="!selectedMenu.id || (selectedMenu.id && selectedMenu.children)"
          @click="handleDel"
        >
          删除菜单
        </el-button>
      </template>
      <RhTree
        default-expand-all
        ref="treeRef"
        node-key="id"
        highlight-current
        draggable
        :expand-on-click-node="false"
        :data="menu"
        @node-click="handleNodeClick"
        @node-drop="handleNodeDrop"
      />
    </RhWrapper>

    <RhWrapper
      :title="`菜单${isEdit ? '编辑' : '添加'}（${selectedMenu.id ? selectedMenu.label : '根节点'}）`"
      class="ml-3 flex-1"
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">业务页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级菜单" v-if="!isEdit && selectedMenu.id">
          <el-input v-model="selectedMenu.label" placeholder="请输入父级菜单" disabled />
        </el-form-item>
        <el-form-item label="菜单名称" prop="label">
          <el-input v-model="ruleForm.label" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="ruleForm.path" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="ruleForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="ruleForm.sort" placeholder="请输入排序号（越小越靠前）" />
        </el-form-item>
      </el-form>

      <div class="flex items-center justify-center mt-6">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </RhWrapper>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { getMenu, postMenu, putMenu, deleteMenu, moveMenu } from "@/api/menu.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { cloneDeep } from "lodash-es";

const loading = ref(false);
const treeRef = ref();
const isEdit = ref(false);
const menu = ref([]);
const selectedMenu = ref({});
const ruleFormRef = ref();
const ruleForm = reactive({
  label: "",
  path: "",
  icon: "",
  parentId: 0, // 默认为0，代表根节点
  sort: "1",
  type: "1", // 页面类型：1-菜单；2-业务页面
});
const rules = reactive({
  label: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  // path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
});

onMounted(() => {
  fn_getMenu();
});

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // do something
      if (isEdit.value) {
        fn_putMenu();
        return;
      }
      fn_postMenu();
    }
  });
};

// 重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
  ruleForm.parentId = 0;
};

// 自动计算sort
const autoCalcSort = () => {
  if (selectedMenu.value.id) {
    // 在节点下添加节点，排序值默认为该children内菜单最后一个的sort值+1
    ruleForm.sort = selectedMenu.value.children
      ? parseInt(selectedMenu.value.children[selectedMenu.value.children.length - 1].sort) + 1
      : 1;
  } else {
    // 添加一级节点，排序值默认为菜单最后一个的sort的值+1
    ruleForm.sort = parseInt(menu.value[menu.value.length - 1].sort) + 1;
  }
  ruleForm.sort += "";
};

/**
 * 退出编辑模式
 * @param {Boolean} isResetTreeNodeSelected 是否清空选中树节点、选中树节点数据，默认清空
 * （添加节点时，因为有可能在选中节点下添加子节点，这时往往传false）
 */
const exitEditMode = (isResetTreeNodeSelected = true) => {
  isEdit.value = false;
  resetForm(); // 重置表单
  if (isResetTreeNodeSelected) {
    selectedMenu.value = {}; // 重置选中树节点的值为空
    treeRef.value.rhTreeRef.setCurrentKey(null); // 取消选中树节点
  }
};

// 添加菜单
const handleMenuAdd = () => {
  exitEditMode(false);
  autoCalcSort();
};

// 点击菜单节点
const handleNodeClick = obj => {
  if (obj.id == selectedMenu.value.id) {
    exitEditMode();
    autoCalcSort();
    return;
  }
  for (const key in ruleForm) {
    if (Object.hasOwnProperty.call(ruleForm, key)) {
      ruleForm[key] = obj[key];
    }
  }
  selectedMenu.value = obj;
  isEdit.value = true;
};

// 拖动菜单节点
const handleNodeDrop = (draggingNode, dropNode, dropType, ev) => {
  // console.log(draggingNode, dropNode, dropType, ev);
  exitEditMode();
  const params = {
    origin_id: draggingNode.data.id,
    target_id: dropNode.data.id,
    drop_type: dropType,
  };
  moveMenu(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "菜单位置修改成功！" });
        fn_getMenu();
      }
    })
    .catch(() => {})
    .finally(() => {});
};

/**
 * 获取菜单
 * @param {Boolean} isReset 是否重置表单、计算排序。（编辑成功后保留，无需重置）
 */
const fn_getMenu = (isReset = true) => {
  loading.value = true;
  const params = {};
  getMenu(params)
    .then(res => {
      if (res.code == 200) {
        menu.value = res.data;
        if (isReset) {
          resetForm();
          autoCalcSort();
        }
        if (selectedMenu.value.id) {
          nextTick(() => {
            treeRef.value.rhTreeRef.setCurrentKey(selectedMenu.value.id);
            selectedMenu.value = treeRef.value.rhTreeRef.getCurrentNode();
            if (isReset) autoCalcSort();
          });
        }
      }
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};

// 创建菜单
const fn_postMenu = () => {
  loading.value = true;
  const params = ruleForm;
  if (selectedMenu.value.id) params.parentId = selectedMenu.value.id;
  postMenu(params)
    .then(res => {
      if (res.code == 200) {
        fn_getMenu();
        ElMessage({ type: "success", message: "菜单添加成功！" });
        handleMenuAdd();
      }
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};

// 修改菜单
const fn_putMenu = () => {
  loading.value = true;
  const params = ruleForm;
  putMenu(selectedMenu.value.id, params)
    .then(res => {
      if (res.code == 200) {
        fn_getMenu(false);
        ElMessage({ type: "success", message: "菜单编辑成功！" });
      }
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};

// 删除菜单
const handleDel = () => {
  ElMessageBox.confirm(`确认删除菜单${selectedMenu.value.label}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      loading.value = true;
      deleteMenu(selectedMenu.value.id)
        .then(res => {
          if (res.code == 200) {
            exitEditMode();
            fn_getMenu();
            ElMessage({ type: "success", message: "删除成功！" });
          }
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
