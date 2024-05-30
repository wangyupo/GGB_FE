<template>
  <!-- 弹窗-添加用户 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!data.id">
        <el-input v-model="ruleForm.password" placeholder="请输入密码" />
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
import { postUser, putUser } from "@/api/user.js";
import { ElMessage } from "element-plus";
import { validateEmail } from "@/utils/index.js";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = reactive({
  userName: "",
  email: "",
  password: "",
});
const rules = reactive({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // do something
      if (props.data.id) {
        fn_putUser();
        return;
      }
      fn_postUser();
    }
  });
};

// 重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
};

// 添加用户
const fn_postUser = () => {
  const params = ruleForm;
  postUser(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑用户
const fn_putUser = () => {
  const params = ruleForm;
  putUser(props.data.id, params)
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
