/**
 * Finds the longest common prefix string amongst an array of strings.
 * If there is no common prefix, returns an empty string "".
 *
 * @param {string[]} strs - Array of strings
 * @returns {string} - Longest common prefix
 */
export function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) return "";
  
    let prefix = strs[0];
  
    for (let i = 1; i < strs.length; i++) {
      while (strs[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === "") return "";
      }
    }
  
    return prefix;
  }
  
  // ทดสอบฟังก์ชัน
  const test1 = ["flower", "flow", "flight"];
  const test2 = ["dog", "racecar", "car"];
  console.log(longestCommonPrefix(test1)); // "fl"
  console.log(longestCommonPrefix(test2)); // ""  