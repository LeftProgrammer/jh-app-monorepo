import CryptoJS from 'crypto-js'

/**
 * API 加密工具类
 */
export class ApiEncrypt {
  private static readonly SECRET_KEY = 'jh-app-encrypt-key'

  /**
   * 加密请求数据
   */
  static encryptRequest(data: any): string {
    try {
      const jsonStr = JSON.stringify(data)
      return CryptoJS.AES.encrypt(jsonStr, this.SECRET_KEY).toString()
    } catch (error) {
      console.error('Encrypt request failed:', error)
      throw error
    }
  }

  /**
   * 解密响应数据
   */
  static decryptResponse(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY)
      const decryptedStr = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedStr)
    } catch (error) {
      console.error('Decrypt response failed:', error)
      throw error
    }
  }

  /**
   * 获取加密标识头
   */
  static getEncryptHeader(): string {
    return 'X-Encrypt'
  }

  /**
   * MD5 加密
   */
  static md5(text: string): string {
    return CryptoJS.MD5(text).toString()
  }

  /**
   * SHA256 加密
   */
  static sha256(text: string): string {
    return CryptoJS.SHA256(text).toString()
  }

  /**
   * Base64 编码
   */
  static base64Encode(text: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
  }

  /**
   * Base64 解码
   */
  static base64Decode(base64Text: string): string {
    return CryptoJS.enc.Base64.parse(base64Text).toString(CryptoJS.enc.Utf8)
  }
}
