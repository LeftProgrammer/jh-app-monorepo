import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户信息接口
export interface IUserInfoRes {
  userId: number
  phone: string
  username: string
  nickname: string
  avatar: string
  department?: string
  departmentName?: string
  [key: string]: any
}

// 权限信息接口
export interface AuthPermissionInfo {
  user: IUserInfoRes
  roles: string[]
  permissions: string[]
  tenantId?: number
  favoriteMenus?: string[]
}

// 初始化状态
const userInfoState: IUserInfoRes = {
  userId: -1,
  phone: '',
  username: '',
  nickname: '',
  avatar: '/static/images/default-avatar.png',
}

export const useUserStore = defineStore('user', () => {
  // 定义用户信息
  const userInfo = ref<IUserInfoRes>({ ...userInfoState })
  const tenantId = ref<number | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const favoriteMenus = ref<string[]>([])
  const userList = ref<any[]>([])

  /** 设置用户头像 */
  const setUserAvatar = (avatar: string) => {
    userInfo.value.avatar = avatar
  }

  /** 设置用户信息 */
  const setUserInfo = async (val: AuthPermissionInfo) => {
    // 若头像为空 则使用默认头像
    if (!val.user) {
      val.user = { ...userInfoState }
    }
    if (!val.user.avatar) {
      val.user.avatar = userInfoState.avatar
    }
    userInfo.value = val.user
    setUserAvatar(userInfo.value.avatar)

    // 设置其他信息
    roles.value = val.roles || []
    permissions.value = val.permissions || []
    tenantId.value = val.tenantId || null
    favoriteMenus.value = val.favoriteMenus || []
  }

  /** 获取用户信息 */
  const fetchUserInfo = async () => {
    try {
      // 这里应该调用获取用户信息的API
      // const res = await getUserInfoApi()
      // await setUserInfo(res)

      // 临时模拟
      const mockUserInfo: AuthPermissionInfo = {
        user: {
          userId: 1,
          phone: '13800138000',
          username: 'admin',
          nickname: '管理员',
          avatar: '/static/images/default-avatar.png',
        },
        roles: ['admin'],
        permissions: ['*'],
        tenantId: 1,
        favoriteMenus: []
      }
      await setUserInfo(mockUserInfo)

      return mockUserInfo
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /** 清除用户信息 */
  const clearUserInfo = () => {
    userInfo.value = { ...userInfoState }
    tenantId.value = null
    roles.value = []
    permissions.value = []
    favoriteMenus.value = []
    userList.value = []
  }

  /** 检查权限 */
  const hasPermission = (permission: string) => {
    if (permissions.value.includes('*')) {
      return true // 超级管理员
    }
    return permissions.value.includes(permission)
  }

  /** 检查角色 */
  const hasRole = (role: string) => {
    return roles.value.includes(role)
  }

  /** 获取用户列表 */
  const fetchUserList = async () => {
    try {
      // 这里应该调用获取用户列表的API
      // const res = await getUserListApi()
      // userList.value = res

      // 临时模拟
      userList.value = [
        {
          userId: 1,
          username: 'admin',
          nickname: '管理员',
          phone: '13800138000',
          avatar: '/static/images/default-avatar.png'
        }
      ]

      return userList.value
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  return {
    // 状态
    userInfo,
    tenantId,
    roles,
    permissions,
    favoriteMenus,
    userList,
    // 方法
    setUserAvatar,
    setUserInfo,
    fetchUserInfo,
    clearUserInfo,
    hasPermission,
    hasRole,
    fetchUserList,
  }
}, {
  persist: true,
})
