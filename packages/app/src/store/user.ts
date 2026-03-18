/**
 * 用户状态管理模块
 *
 * @description 提供用户信息的管理，包括用户资料、权限信息、部门信息等
 * @export useUserStore - 用户状态管理 Store
 * @export userStores - 用户模块命名空间
 * @usage 用户信息管理、权限控制、部门管理
 */
import type { AuthPermissionInfo, IUserInfoRes } from '../api/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFileByIds } from '../api/infra/file'
import {
  // getUserInfo,
  getAuthPermissionInfo,
  getDeptByUsername,
} from '../api/login'
import { getUserList } from '../api/system/user'
// 初始化状态
const userInfoState: IUserInfoRes = {
  userId: -1,
  phone: '',
  username: '',
  nickname: '',
  avatar: '/static/images/default-avatar.png', // TODO @芋艿：CDN 化
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfoRes>({ ...userInfoState })
    const tenantId = ref<number | null>(null) // 租户编号
    const roles = ref<string[]>([]) // 角色标识列表
    const permissions = ref<string[]>([]) // 权限标识列表
    const favoriteMenus = ref<string[]>([]) // 常用菜单 key 列表
    const userList = ref<any[]>([]) // 存储所有用户

    const setUserAvatar = async (avatar: string) => {
      if (!avatar)
        return
      const file = await getFileByIds(avatar)
      if (file && file.length > 0 && file[0]?.url) {
        userInfo.value.avatar = file[0].url
      }
      // console.log('设置用户头像', avatar)
      // console.log('userInfo', userInfo.value)
    }

    /** 设置用户信息 */
    const setUserInfo = async (val: AuthPermissionInfo) => {
      // console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.user) {
        val.user.avatar = userInfoState.avatar
      }
      userInfo.value = val.user
      userInfo.value.id = String(userInfo.value.id)
      setUserAvatar(userInfo.value.avatar)
      const dept = await getDeptByUsername(userInfo.value.username)
      userInfo.value.department = dept?.department
      userInfo.value.phone = dept?.phone
      userInfo.value.departmentName = dept?.departmentName
      const users: any = await getUserList()
      userList.value = (users || []).map((x) => {
        x.id = String(x.id)
        return x
      })
      roles.value = val.roles
      permissions.value = val.permissions
    }

    /** 删除用户信息 */
    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
      userList.value = []
      roles.value = []
      permissions.value = []
      uni.removeStorageSync('user')
    }

    /** 设置租户编号 */
    const setTenantId = (id: number) => {
      tenantId.value = id
    }

    /** 设置常用菜单 */
    const setFavoriteMenus = (keys: string[]) => {
      favoriteMenus.value = keys
    }

    /** 获取用户信息 */
    const fetchUserInfo = async () => {
      const res = await getAuthPermissionInfo()
      setUserInfo(res)
      return res
    }

    return {
      userInfo,
      userList,
      tenantId,
      roles,
      permissions,
      favoriteMenus,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
      setTenantId,
      setFavoriteMenus,
    }
  },
  {
    persist: true,
  },
)
