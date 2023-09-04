const URL = plus.android.importClass("java.net.URL");
const BufferedReader = plus.android.importClass("java.io.BufferedReader");
const InputStreamReader = plus.android.importClass("java.io.InputStreamReader");

plus.android.importClass("java.net.HttpURLConnection");

/**
 * @description: 发送http请求
 * @param {Object} options 配置项
 * @return {Promise} 请求实例
 */
export function request(options) {
  return new Promise((resolve, reject) => {
    const conn = new URL(options.url).openConnection();
    try {
      conn.setRequestMethod(options.method || "GET");
      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          conn.setRequestProperty(key, options.headers[key]);
        });
      }
      if (options.beforeConnect) {
        options.beforeConnect(conn);
      }
      conn.connect();
      if (conn.getResponseCode() === 200) {
        const reader = new BufferedReader(
          new InputStreamReader(conn.getInputStream())
        );
        let responseData = "";
        let line = "";
        while ((line = reader.readLine()) !== null) {
          responseData += line;
        }
        reader.close();
        resolve({ response: responseData, connect: conn });
      } else {
        reject({ connect: conn });
      }
      conn.disconnect();
    } catch (err) {
      reject({ error: err, connect: conn });
    }
  });
}
