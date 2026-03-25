import { computed } from 'vue'
import { useUserStore } from '../store/user'

/**
 * 权限控制 Hook
 * @description 提供基于角色和权限码的权限判断方法
 * @export useAccess - 权限控制 Hook
 * @usage 权限验证和角色判断
 *
 * @example
 * const { hasPermission, hasRole } = useAccess()
 *
 * // 在模板中配合 v-if 使用（全平台兼容）
 * // <button v-if="hasPermission('system:user:update')">编辑</button>
 * // <button v-if="hasRole('admin')">管理</button>
 *
 * // 多个权限码（满足其一即可）
 * // <button v-if="hasPermission('system:user:update', 'system:user:create')">操作</button>
 *
 * // 在逻辑中使用
 * if (hasPermission('system:user:delete')) { ... }
 */
function useAccess() {
  const userStore = useUserStore()

  /** 用户权限码集合（响应式） */
  const permissionSet = computed(() => new Set(userStore.permissions))
  /** 用户角色集合（响应式） */
  const roleSet = computed(() => new Set(userStore.roles))

  /**
   * 判断是否有指定权限码（满足其一即可）
   * @param codes 权限码，支持传入多个参数
   */
  function hasPermission(...codes: string[]): boolean {
    if (codes.length === 0) return true
    return codes.some(code => permissionSet.value.has(code))
  }

  /**
   * 判断是否有指定角色（满足其一即可）
   * @param roles 角色标识，支持传入多个参数
   */
  function hasRole(...roles: string[]): boolean {
    if (roles.length === 0) return true
    return roles.some(role => roleSet.value.has(role))
  }

  return {
    hasPermission,
    hasRole,
  }
}

export default useAccess
