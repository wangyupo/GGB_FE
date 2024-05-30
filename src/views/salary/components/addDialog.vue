<template>
  <!-- 弹窗-添加工资条 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
      <RhTitle title="基本信息" />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="发薪日" prop="payday">
            <el-date-picker
              v-model="ruleForm.payday"
              value-format="YYYY-MM-DD"
              placeholder="清选择发薪日"
              class="!w-full"
              ref="paydayRef"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工" prop="employee_id">
            <el-select v-model="ruleForm.employee_id" class="!w-full" placeholder="请选择员工" filterable>
              <el-option v-for="item in employeesList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <RhTitle title="工资构成" />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="基本工资" prop="base_salary">
            <el-input
              v-model="ruleForm.base_salary"
              placeholder="请输入基本工资"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'base_salary')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="岗位工资" prop="job_salary">
            <el-input
              v-model="ruleForm.job_salary"
              placeholder="请输入岗位工资"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'job_salary')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="绩效奖金" prop="performance">
            <el-input
              v-model="ruleForm.performance"
              placeholder="请输入绩效奖金"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'performance')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="岗位津贴" prop="subsidy">
            <el-input
              v-model="ruleForm.subsidy"
              placeholder="请输入岗位津贴"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'subsidy')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="项目奖励" prop="project_reward">
            <el-input
              v-model="ruleForm.project_reward"
              placeholder="请输入项目奖励"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'project_reward')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="加班工资" prop="overtime_pay">
            <el-input
              v-model="ruleForm.overtime_pay"
              placeholder="请输入加班工资"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'overtime_pay')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="餐补" prop="meal_sup">
            <el-input
              v-model="ruleForm.meal_sup"
              placeholder="请输入餐补"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'meal_sup')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交通补" prop="transport_sup">
            <el-input
              v-model="ruleForm.transport_sup"
              placeholder="请输入交通补"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'transport_sup')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <RhTitle title="应发/实发" />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="应发金额" prop="salary_payable">
            <el-input
              v-model="ruleForm.salary_payable"
              placeholder="请输入应发金额"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'salary_payable')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实发金额" prop="salary_actual">
            <el-input
              v-model="ruleForm.salary_actual"
              placeholder="请输入实发金额"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'salary_actual')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <RhTitle title="保险/公积金/个税" />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="养老保险" prop="pension_ins">
            <el-input
              v-model="ruleForm.pension_ins"
              placeholder="请输入养老保险"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'pension_ins')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="失业保险" prop="unemployment_ins">
            <el-input
              v-model="ruleForm.unemployment_ins"
              placeholder="请输入失业保险"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'unemployment_ins')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="医疗保险" prop="medical_ins">
            <el-input
              v-model="ruleForm.medical_ins"
              placeholder="请输入医疗保险"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'medical_ins')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="住房公积金" prop="housing_fund">
            <el-input
              v-model="ruleForm.housing_fund"
              placeholder="请输入住房公积金"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'housing_fund')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="个人所得税" prop="personal_tax">
            <el-input
              v-model="ruleForm.personal_tax"
              placeholder="请输入个人所得税"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'personal_tax')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <RhTitle title="其它" />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="其它收入" prop="other_income">
            <el-input
              v-model="ruleForm.other_income"
              placeholder="请输入其它收入"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'other_income')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年终奖" prop="year_end_bonus">
            <el-input
              v-model="ruleForm.year_end_bonus"
              placeholder="请输入年终奖"
              :formatter="inputSalaryFormatter"
              :parser="inputSalaryParser"
              @blur="onSalaryBlur(ruleForm, 'year_end_bonus')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明" prop="remark">
            <el-input v-model="ruleForm.remark" placeholder="请输入说明" type="textarea" />
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
import { postSalary, putSalary } from "@/api/salary.js";
import { ElMessage } from "element-plus";
import { inputSalaryFormatter, inputSalaryParser, onSalaryBlur } from "@/utils/index.js";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  employeesList: {
    type: Array,
    default: () => [],
  },
});

const paydayRef = ref();

/** el-form START **/
const ruleFormRef = ref();
const ruleForm = ref({
  payday: "",
  employee_id: "",
  base_salary: "9375.00",
  job_salary: "9375.00",
  performance: "6250.00",
  subsidy: "",
  project_reward: "",
  overtime_pay: "",
  meal_sup: "",
  transport_sup: "",
  salary_payable: "",
  salary_actual: "",
  pension_ins: "2158.80",
  unemployment_ins: "134.93",
  medical_ins: "542.70",
  housing_fund: "3238.00",
  year_end_bonus: "",
  other_income: "",
  personal_tax: "",
  remark: "",
});
const rules = ref({
  payday: [{ required: true, message: "请选择发薪日", trigger: "blur" }],
  employee_id: [{ required: true, message: "请选择员工", trigger: "blur" }],
  base_salary: [{ required: true, message: "请输入基本工资", trigger: "blur" }],
  job_salary: [{ required: true, message: "请输入岗位工资", trigger: "blur" }],
  performance: [{ required: true, message: "请输入绩效奖金", trigger: "blur" }],
  meal_sup: [{ required: true, message: "请输入餐补", trigger: "blur" }],
  transport_sup: [{ required: true, message: "请输入交通补", trigger: "blur" }],
  salary_payable: [{ required: true, message: "请输入应发金额", trigger: "blur" }],
  salary_actual: [{ required: true, message: "请输入实发金额", trigger: "blur" }],
  pension_ins: [{ required: true, message: "请输入养老保险", trigger: "blur" }],
  unemployment_ins: [{ required: true, message: "请输入失业保险", trigger: "blur" }],
  medical_ins: [{ required: true, message: "请输入医疗保险", trigger: "blur" }],
  housing_fund: [{ required: true, message: "请输入住房公积金", trigger: "blur" }],
  personal_tax: [{ required: true, message: "请输入个人所得税", trigger: "blur" }],
});

// 提交表单
const submitForm = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // do something
      if (props.data.id) {
        fn_putSalary();
        return;
      }
      fn_postSalary();
    }
  });
};

// 添加工资条
const fn_postSalary = () => {
  const params = ruleForm.value;
  postSalary(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 编辑工资条
const fn_putSalary = () => {
  const params = ruleForm.value;
  putSalary(props.data.id, params)
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
    for (let key in ruleForm.value) {
      if (ruleForm.value.hasOwnProperty(key)) {
        ruleForm.value[key] = props.data[key];
      }
    }
  } else {
    paydayRef.value.focus();
  }
  emits("opened");
};

// 弹窗关闭
const closed = () => {
  resetData();
  resetForm();
  dialogVisible.value = false;
  emits("closed");
};

// 重置数据
const resetData = () => {};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
