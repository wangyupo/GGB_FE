const DemoFile = () => import("@/views/demo/file/index.vue");

const route = [
  {
    path: "/demo/file",
    name: "DemoFile",
    component: DemoFile,
  },
];

export default route;
