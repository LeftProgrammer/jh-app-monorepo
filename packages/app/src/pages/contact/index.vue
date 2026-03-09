<template>
  <view class="contact-page">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="navbarTitle"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="handleBack"
    />
    
    <!-- 面包屑导航 -->
    <Breadcrumb
      ref="breadcrumbRef"
      v-model="currentDeptId"
      v-model:current-dept="currentDep"
      class="hidden"
    />
    
    <!-- 通讯录列表 -->
    <ContactList
      :departments="currentDeptList"
      :users="currentUserList"
      :loading="loading"
      :show-user-list="showUserList"
      :user-list-text="userListText"
      @department-click="handleEnterDept"
      @user-click="handleUserClick"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { useToast } from "wot-design-uni"
import { getSimpleDeptList } from "@/api/system/dept"
import { getUserPage, getUser } from "@/api/system/user"
import { findChildren, handleTree } from "@/utils/tree"
import ContactList from "./components/contact-list.vue"
import Breadcrumb from "./components/breadcrumb.vue"
import { navigateBackPlus } from "@/utils"
import { useUserStore } from "@/store"

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
})

const userStore = useUserStore()
const loading = ref(false)
const deptList = ref<any[]>([]) // 完整部门列表（树形结构）
const toast = useToast()
const userList = computed(() => userStore.userList)

const currentDep = ref() // 当前层级的部门编号
const currentDeptId = ref(0) // 当前层级的部门编号
const breadcrumbRef = ref()

// 计算属性
const navbarTitle = computed(() => {
  return currentDep.value?.name || "通讯录"
})

const currentDeptList = computed(() => {
  if (currentDeptId.value === 0) {
    return deptList.value.filter((item) => item.parentId === 0)
  }
  return findChildren(deptList.value, currentDeptId.value)
})

const currentUserList = computed(() => {
  if (currentDeptId.value === 0) {
    // 根层级不显示用户，只显示部门
    return []
  }
  return userList.value.filter((item) => item.deptId === currentDeptId.value)
})

const showUserList = computed(() => {
  return currentDeptList.value.length > 0 && currentUserList.value.length > 0
})

const userListText = computed(() => {
  return currentDeptId.value === 0 ? "" : "部门成员"
})

// 事件处理
function handleEnterDept(item: any) {
  breadcrumbRef.value?.enter({ id: item.id!, name: item.name })
}

function handleBack() {
  if (currentDeptId.value === 0) {
    navigateBackPlus()
    return
  }
  breadcrumbRef.value?.back()
}

async function handleUserClick(item: any) {
  if (!item.mobile) {
    toast.show("暂无联系方式")
    return
  }
  
  // #ifdef APP-PLUS
  uni.makePhoneCall({
    phoneNumber: item.mobile
  })
  // #endif
  
  // #ifndef APP-PLUS
  toast.show("拨号功能仅在APP中可用")
  // #endif
}

// 初始化
onMounted(async () => {
  loading.value = true
  try {
    // 获取部门列表
    const deptData = await getSimpleDeptList()
    deptList.value = handleTree(deptData)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.contact-page {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
