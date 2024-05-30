const Dict = () => import("@/views/system/dict/index.vue");
const DictData = () => import("@/views/system/dict/dictData/index.vue");
const Menu = () => import("@/views/system/menu/index.vue");
const Employee = () => import("@/views/system/employee/index.vue");
const User = () => import("@/views/system/user/index.vue");
const Role = () => import("@/views/system/role/index.vue");
const RoleUser = () => import("@/views/system/role/user/index.vue");
const LoginLog = () => import("@/views/system/loginLog/index.vue");

const route = [
  {
    path: "/system/dict",
    name: "Dict",
    component: Dict,
  },
  {
    path: "/system/dict/data",
    name: "DictData",
    component: DictData,
    meta: {
      targetMenuPath: "/system/dict",
    },
  },
  {
    path: "/system/menu",
    name: "Menu",
    component: Menu,
    meta: {
      wrapperType: "fullPage",
    },
  },
  {
    path: "/system/employee",
    name: "Employee",
    component: Employee,
  },
  {
    path: "/system/user",
    name: "User",
    component: User,
  },
  {
    path: "/system/role",
    name: "Role",
    component: Role,
  },
  {
    path: "/system/role/user",
    name: "RoleUser",
    component: RoleUser,
    meta: {
      targetMenuPath: "/system/role",
    },
  },
  {
    path: "/system/loginLog",
    name: "LoginLog",
    component: LoginLog,
  },
];

export default route;
