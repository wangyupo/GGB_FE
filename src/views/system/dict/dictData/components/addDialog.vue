<template>
  <!-- 弹窗-添加数据字典 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="字典键" prop="key">
        <el-input v-model="ruleForm.key" placeholder="请输入字典键" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="ruleForm.value" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="字典描述" prop="description">
        <el-input v-model="ruleForm.description" placeholder="请输入字典描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { postDictData, putDictData } from "@/api/dictData.js";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = reactive({
  categoryID: route.query.id,
  key: "",
  value: "",
  description: "",
});
const rules = reactive({
  key: [{ required: true, message: "请输入字典键", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
  // description: [{ required: true, message: "请输入字典描述", trigger: "blur" }],
});

// 提交表单
const submitForm = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // do something
      if (props.data.id) {
        fn_putDict();
        return;
      }
      fn_postDict();
    }
  });
};

// 添加字典
const fn_postDict = () => {
  const params = ruleForm;
  postDictData(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑字典
const fn_putDict = () => {
  const params = ruleForm;
  putDictData(props.data.id, params)
    .then(res => {
      if (res.code == 200) {
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
