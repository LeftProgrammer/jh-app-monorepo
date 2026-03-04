/**
 * 表单验证工具类
 */
export class Validation {
  /**
   * 验证邮箱
   */
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 验证手机号（中国大陆）
   */
  static isPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  /**
   * 验证身份证号（中国大陆）
   */
  static isIdCard(idCard: string): boolean {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return idCardRegex.test(idCard)
  }

  /**
   * 验证URL
   */
  static isUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * 验证IP地址
   */
  static isIP(ip: string): boolean {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipRegex.test(ip)
  }

  /**
   * 验证密码强度
   * 至少8位，包含大小写字母、数字和特殊字符
   */
  static isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  /**
   * 验证中文字符
   */
  static isChinese(text: string): boolean {
    const chineseRegex = /^[\u4e00-\u9fa5]+$/
    return chineseRegex.test(text)
  }

  /**
   * 验证数字
   */
  static isNumber(value: string): boolean {
    const numberRegex = /^-?\d*\.?\d+$/
    return numberRegex.test(value)
  }

  /**
   * 验证整数
   */
  static isInteger(value: string): boolean {
    const integerRegex = /^-?\d+$/
    return integerRegex.test(value)
  }

  /**
   * 验证正整数
   */
  static isPositiveInteger(value: string): boolean {
    const positiveIntegerRegex = /^[1-9]\d*$/
    return positiveIntegerRegex.test(value)
  }

  /**
   * 验证非空
   */
  static isNotEmpty(value: any): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  }

  /**
   * 验证长度范围
   */
  static isLengthInRange(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max
  }

  /**
   * 验证数值范围
   */
  static isNumberInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  /**
   * 验证银行卡号
   */
  static isBankCard(cardNumber: string): boolean {
    const bankCardRegex = /^[0-9]{16,19}$/
    return bankCardRegex.test(cardNumber)
  }

  /**
   * 验证邮政编码
   */
  static isZipCode(zipCode: string): boolean {
    const zipCodeRegex = /^[0-9]{6}$/
    return zipCodeRegex.test(zipCode)
  }
}

/**
 * 简化的验证函数
 */
export const validation = {
  email: Validation.isEmail.bind(Validation),
  phone: Validation.isPhone.bind(Validation),
  idCard: Validation.isIdCard.bind(Validation),
  url: Validation.isUrl.bind(Validation),
  ip: Validation.isIP.bind(Validation),
  strongPassword: Validation.isStrongPassword.bind(Validation),
  chinese: Validation.isChinese.bind(Validation),
  number: Validation.isNumber.bind(Validation),
  integer: Validation.isInteger.bind(Validation),
  positiveInteger: Validation.isPositiveInteger.bind(Validation),
  notEmpty: Validation.isNotEmpty.bind(Validation),
  lengthInRange: Validation.isLengthInRange.bind(Validation),
  numberInRange: Validation.isNumberInRange.bind(Validation),
  bankCard: Validation.isBankCard.bind(Validation),
  zipCode: Validation.isZipCode.bind(Validation),
}
