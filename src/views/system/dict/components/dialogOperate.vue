<template>
  <!-- 弹窗-添加数据字典 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="字典名称" prop="label">
        <el-input v-model="ruleForm.label" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典编码" prop="labelCode">
        <el-input v-model="ruleForm.labelCode" placeholder="请输入字典编码" />
      </el-form-item>
      <el-form-item label="字典描述" prop="description">
        <el-input v-model="ruleForm.description" placeholder="请输入字典描述" />
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
import { addDictCategoryList, updateDictCategoryList } from "@/api/system/dictCategory.js";
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
  label: "",
  labelCode: "",
  description: "",
});
const rules = reactive({
  label: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  labelCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
});

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // do something
      if (props.data.id) {
        fn_updateDictCategoryList();
        return;
      }
      fn_addDictCategoryList();
    }
  });
};

// 添加字典
const fn_addDictCategoryList = () => {
  const params = ruleForm;
  addDictCategoryList(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑字典
const fn_updateDictCategoryList = () => {
  const params = ruleForm;
  updateDictCategoryList(props.data.id, params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: "编辑成功！" });
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
