const User = () => import("@/views/systemManage/user/index.vue");
const Role = () => import("@/views/systemManage/role/index.vue");
const RoleUser = () => import("@/views/systemManage/role/user/index.vue");
const Menu = () => import("@/views/systemManage/menu/index.vue");
const Dict = () => import("@/views/systemManage/dict/index.vue");
const DictData = () => import("@/views/systemManage/dict/dictData/index.vue");
const LoginLog = () => import("@/views/systemManage/loginLog/index.vue");

const route = [
  {
    path: "/systemManage/dict",
    name: "Dict",
    component: Dict,
  },
  {
    path: "/systemManage/dict/data",
    name: "DictData",
    component: DictData,
    meta: {
      targetMenuPath: "/systemManage/dict",
    },
  },
  {
    path: "/systemManage/menu",
    name: "Menu",
    component: Menu,
    meta: {
      wrapperType: "fullPage",
    },
  },
  {
    path: "/systemManage/user",
    name: "User",
    component: User,
  },
  {
    path: "/systemManage/role",
    name: "Role",
    component: Role,
  },
  {
    path: "/systemManage/role/user",
    name: "RoleUser",
    component: RoleUser,
    meta: {
      targetMenuPath: "/systemManage/role",
    },
  },
  {
    path: "/systemManage/loginLog",
    name: "LoginLog",
    component: LoginLog,
  },
];

export default route;
