const DemoFile = () => import("@/views/demo/file/index.vue");
const DemoExcel = () => import("@/views/demo/excel/index.vue");

const route = [
  {
    path: "/demo/file",
    name: "DemoFile",
    component: DemoFile,
  },
  {
    path: "/demo/excel",
    name: "DemoExcel",
    component: DemoExcel,
  },
];

export default route;
