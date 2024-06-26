// 纳秒转微秒
export const nsToUs = nanoseconds => {
  return nanoseconds / 1e3; // 1微秒=1000纳秒
};

// 纳秒转毫秒
export const nsToMs = nanoseconds => {
  return nanoseconds / 1e6; // 1毫秒=1,000,000纳秒
};
