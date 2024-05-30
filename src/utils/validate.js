export const validateEmail = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else {
    if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      callback(new Error("邮箱格式不正确"));
      return
    }
    callback();
  }
};
