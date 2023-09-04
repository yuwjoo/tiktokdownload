/**
 * @description: 提取http链接
 * @param {String} text 原始文本
 * @return {String} 链接地址
 */
export function extractHref(text) {
  const match = text.match(
    /(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_]*)?(\?[0-9a-z=&%_\-]*)?(\#[0-9a-z=&%_\-]*)?/gi
  );
  return (match || [])[0] || "";
}
