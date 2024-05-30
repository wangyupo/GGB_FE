<template>
  <!-- 弹窗-添加员工 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" ref="nameRef" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话号码" prop="telephone">
            <el-input v-model="ruleForm.telephone" placeholder="请输入电话号码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="生日" prop="birthDate">
            <el-date-picker
              v-model="ruleForm.birthDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择员工生日"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否在职" prop="isWorking">
            <el-switch v-model="ruleForm.isWorking" active-text="在职" inactive-text="离职" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      <el-button @click="closed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { postEmployee, putEmployee } from "@/api/employee.js";
import { ElMessage } from "element-plus";

const props = defineProps({
  employee: {
    type: Object,
    default: () => {},
  },
});
const nameRef = ref();

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = ref({
  name: "",
  email: "",
  telephone: "",
  birthDate: "",
  isWorking: false,
});
const rules = ref({
  name: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  telephone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
  birthDate: [{ required: true, message: "请输入员工生日", trigger: "blur" }],
  // isWorking: [{ required: true, message: "请选择是否在职", trigger: "blur" }],
});

// 提交表单
const submitForm = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // do something
      if (props.employee.id) {
        fn_putEmployee();
        return;
      }
      fn_postEmployee();
    }
  });
};

// 添加员工
const fn_postEmployee = () => {
  const params = ruleForm.value;
  postEmployee(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "添加员工成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑员工
const fn_putEmployee = () => {
  const params = ruleForm.value;
  putEmployee(props.employee.id, params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "编辑员工成功！" });
        dialogVisible.value = false;
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
  nameRef.value.focus();
  if (props.employee.id) {
    for (const key in ruleForm.value) {
      if (Object.hasOwnProperty.call(ruleForm.value, key)) {
        ruleForm.value[key] = props.employee[key];
      }
    }
  }
  emits("opened");
};

// 弹窗关闭
const closed = () => {
  resetData();
  resetForm(ruleFormRef.value);
  emits("closed");
  dialogVisible.value = false;
};

// 重置数据
const resetData = () => {};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
