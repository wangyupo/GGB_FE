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
      <el-form-item label="角色状态" prop="status">
        <el-switch
          v-model="ruleForm.status"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="2"
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
import { addRole, updateRole } from "@/api/systemManage/role.js";
import { ElMessage } from "element-plus";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = reactive({
  roleName: "",
  roleCode: "",
  description: "",
  status: 1,
});
const rules = reactive({
  roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
  roleCode: [{ required: true, message: "请输入角色标识", trigger: "blur" }],
});

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

// 添加角色
const fn_postRole = () => {
  const params = ruleForm;
  addRole(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑角色
const fn_putRole = () => {
  const params = ruleForm;
  updateRole(props.data.id, params)
    .then(res => {
      if (res.code == 0) {
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
const opened = async () => {
  if (props.data.id) {
    for (const key in ruleForm) {
      if (Object.hasOwnProperty.call(ruleForm, key)) {
        ruleForm[key] = props.data[key];
      }
    }
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
};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
