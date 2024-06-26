/**
 * 生成随机字符串（默认范围：5-50位）
 * @returns String
 */
export function generateRandomString(minLength = 5, maxLength = 50) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

/**
 * 生成随机数字（默认范围：1-50000）
 * @returns Number
 */
export function generateRandomNumber(minNumber = 1, maxNumber = 50000) {
  const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  return randomNumber;
}

/**
 * 生成指定长度和范围的随机数数组。
 * @param {number} length - 数组的长度。
 * @param {number} min - 随机数范围的最小值（包含）。
 * @param {number} max - 随机数范围的最大值（不包含）。
 * @returns {number[]} 包含随机数的数组。
 */
export function generateRandomArray(length = 7, min = 130, max = 550) {
  const randomArray = Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
  return randomArray;
}

/**
 * 生成随机email地址
 * @returns String email地址
 */
export function generateRandomEmail() {
  const emailLength = Math.floor(Math.random() * 10) + 5; // Random length between 5 and 14
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const domain = "example.com";

  let email = "";

  for (let i = 0; i < emailLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    email += characters.charAt(randomIndex);
  }

  email += "@" + domain;

  return email;
}

/**
 * 生成随机日期（默认生成：当前年随机日期）
 * @returns String YYYYMMDD
 */
export function getRandomDate(startDate, endDate) {
  if (!startDate || !endDate) {
    const date = new Date();
    const year = date.getFullYear();
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${year}-12-31`);
  }
  // Calculate the range of days
  const startMillis = startDate.getTime();
  const endMillis = endDate.getTime();
  const range = endMillis - startMillis;

  // Generate a random number within the range
  const randomMillis = Math.floor(Math.random() * range) + startMillis;

  // Create a new Date object using the random milliseconds
  const randomDate = new Date(randomMillis);

  // Format the date as "YYYYMMDD"
  const formattedDate = randomDate.toISOString().slice(0, 10).replace(/-/g, "");

  return formattedDate;
}
