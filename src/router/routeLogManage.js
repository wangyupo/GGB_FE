const LogLogin = () => import("@/views/logManage/loginLog/index.vue");
const LogOperate = () => import("@/views/logManage/operateLog/index.vue");

const route = [
  {
    path: "/logManage/loginLog",
    name: "LogLogin",
    component: LogLogin,
  },
  {
    path: "/logManage/operateLog",
    name: "LogOperate",
    component: LogOperate,
  },
];

export default route;
