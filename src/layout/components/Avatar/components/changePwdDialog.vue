<template>
  <!-- 弹窗-修改登录密码 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="旧密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm.newPassword" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="rePassword">
        <el-input type="password" v-model="ruleForm.rePassword" placeholder="请再次输入新密码" />
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
import { changePassword } from "@/api/systemManage/user.js";
import { logout } from "@/api/login.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { removeAllLoginInfo } from "@/utils/index";

const router = useRouter();

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = reactive({
  password: "",
  newPassword: "",
  rePassword: "",
});
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== ruleForm.newPassword) {
    callback(new Error("两次密码不匹配"));
  } else {
    callback();
  }
};
const rules = reactive({
  password: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  rePassword: [{ required: true, validator: validatePass, trigger: "blur" }],
});

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // do something
      fn_changePwd();
    }
  });
};

// 修改密码
const fn_changePwd = () => {
  const params = {
    password: ruleForm.password,
    newPassword: ruleForm.newPassword,
  };
  changePassword(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: "密码修改成功，请重新登录！" });
        fn_logout();
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 退出登录
const fn_logout = () => {
  logout()
    .then(res => {
      if (res.code == 0) {
        dialogVisible.value = false;
        removeAllLoginInfo();
        router.replace({
          path: "/login",
        });
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
};
/** el-form END **/

/** dialog START **/
const emits = defineEmits(["opened", "closed"]);
const dialogVisible = defineModel();

// 弹窗开启
const opened = () => {
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
