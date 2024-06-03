<template>
  <!-- 弹窗-添加角色 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="ruleForm.roleName" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="角色标识" prop="roleCode">
        <el-input v-model="ruleForm.roleCode" placeholder="请输入角色标识" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="ruleForm.description" placeholder="请输入角色描述" />
      </el-form-item>
      <el-form-item label="菜单" prop="">
        <el-tree
          show-checkbox
          default-expand-all
          node-key="id"
          check-strictly
          ref="treeRef"
          :data="menu"
          @check="handleCheckMenu"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="closed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { addRole, updateRole } from "@/api/system/role.js";
import { ElMessage } from "element-plus";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  menu: {
    type: Array,
    default: () => [],
  },
});

const treeRef = ref();

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = reactive({
  roleName: "",
  roleCode: "",
  description: "",
  status: true,
});
const rules = reactive({
  roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
  roleCode: [{ required: true, message: "请输入角色标识", trigger: "blur" }],
});
const menu_ids = ref([]);

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // do something
      if (props.data.id) {
        fn_putRole();
        return;
      }
      fn_postRole();
    }
  });
};

// 重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
};

// 选择菜单
const handleCheckMenu = () => {
  menu_ids.value = treeRef.value.getCheckedKeys();
};

// 添加角色
const fn_postRole = () => {
  const params = {
    role: ruleForm,
    menu_ids: menu_ids.value,
  };
  addRole(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑角色
const fn_putRole = () => {
  const params = {
    role: Object.assign({ id: props.data.id }, ruleForm),
    menu_ids: menu_ids.value,
  };
  updateRole(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "编辑成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};
/** el-form END **/

/** dialog START **/
const emits = defineEmits(["opened", "closed"]);
const dialogVisible = defineModel();

// 弹窗开启
const opened = () => {
  if (props.data.id) {
    for (const key in ruleForm) {
      if (Object.hasOwnProperty.call(ruleForm, key)) {
        ruleForm[key] = props.data[key];
      }
    }
    menu_ids.value = props.data.menu_ids;
    treeRef.value.setCheckedKeys(props.data.menu_ids);
  }
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
  resetForm(ruleFormRef.value);
  menu_ids.value = [];
  treeRef.value.setCheckedKeys([]);
};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
