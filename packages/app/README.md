# @jinghe-sanjiaoroad-app/app

## 📦 导入指南

### 页面模块
```typescript
// 工作台页面
import { pages } from '@jinghe-sanjiaoroad-app/app'
const { HomePage, UserHeader, MenuSection } = pages.index

// 或者直接导入
import { HomePage, UserHeader, MenuSection } from '@jinghe-sanjiaoroad-app/app/pages/index'

// 使用示例
// HomePage - 首页工作台页面
// UserHeader - 用户头部组件（优化版）
// MenuSection - 菜单区域组件
```

#### UserHeader 组件使用方式

**1. 基础使用（默认配置）**
```vue
<template>
  <UserHeader />
</template>
```

**2. 自定义数据**
```vue
<template>
  <UserHeader 
    :todoNum="5"
    :messageNum="3"
    :userInfo="myUserInfo"
  />
</template>
```

**3. 自定义静态资源**
```vue
<template>
  <UserHeader 
    bannerImage="/my-assets/banner.jpg"
    todoIcon="/my-assets/todo.svg"
    messageIcon="/my-assets/message.svg"
  />
</template>
```

**4. 自定义路由**
```vue
<template>
  <UserHeader 
    todoRoute="/my-pages/todo"
    messageRoute="/my-pages/message"
  />
</template>
```

**5. 事件监听**
```vue
<template>
  <UserHeader 
    @todo-click="handleTodoClick"
    @message-click="handleMessageClick"
    @todo-fetched="handleTodoFetched"
    @message-fetched="handleMessageFetched"
  />
</template>

<script setup>
function handleTodoClick(todoNum) {
  console.log('点击待办，数量:', todoNum)
}

function handleTodoFetched(count) {
  console.log('获取到待办数量:', count)
}
</script>
```

**6. 插槽自定义**
```vue
<template>
  <UserHeader :autoFetch="false">
    <!-- 自定义 Banner -->
    <template #banner>
      <view class="my-banner">自定义 Banner</view>
    </template>
    
    <!-- 自定义卡片区域 -->
    <template #cards>
      <view class="my-cards">自定义卡片</view>
    </template>
    
    <!-- 自定义待办图标 -->
    <template #todo-icon>
      <image src="/my-icons/todo.svg" />
    </template>
  </UserHeader>
</template>
```

**7. 方法调用**
```vue
<template>
  <UserHeader ref="userHeaderRef" />
</template>

<script setup>
const userHeaderRef = ref()

// 手动刷新数据
const refreshData = async () => {
  const result = await userHeaderRef.value.refreshData()
  console.log('刷新结果:', result)
}

// 单独获取待办数量
const fetchTodoCount = async () => {
  const count = await userHeaderRef.value.fetchTodoCount()
  console.log('待办数量:', count)
}
</script>
```

#### 完整配置示例
```vue
<template>
  <UserHeader 
    :userInfo="userInfo"
    :todoNum="todoCount"
    :messageNum="messageCount"
    bannerImage="/assets/custom-banner.png"
    todoIcon="/assets/custom-todo.png"
    todoCountIcon="/assets/custom-count.png"
    messageIcon="/assets/custom-message.png"
    todoRoute="/pages/custom-todo"
    messageRoute="/pages/custom-message"
    :autoFetch="false"
    @todo-click="handleTodo"
    @message-click="handleMessage"
  >
    <template #banner>
      <view class="custom-banner">
        <text>欢迎回来！</text>
      </view>
    </template>
  </UserHeader>
</template>
```

#### HomeBanner 组件使用方式

**1. 基础使用（默认配置）**
```vue
<template>
  <HomeBanner />
</template>
```

**2. 自定义数据**
```vue
<template>
  <HomeBanner :banners="myBanners" />
</template>

<script setup>
const myBanners = [
  '/static/my-banner1.png',
  '/static/my-banner2.png'
]
</script>
```

**3. 完全自定义（透传所有 wd-swiper 属性）**
```vue
<template>
  <HomeBanner 
    :banners="myBanners"
    :autoplay="false"
    :interval="3000"
    :indicator-position="'bottom-left'"
    :height="'400rpx'"
    :custom-class="'my-custom-class'"
    container-class="my-container-class"
    @banner-click="handleBannerClick"
  />
</template>
```

**4. 禁用默认样式**
```vue
<template>
  <HomeBanner 
    :disable-default-style="true"
    container-class="my-full-custom-container"
    :custom-class="'my-swiper'"
  />
</template>
```

**5. 插槽使用（透传所有 wd-swiper 插槽）**
```vue
<template>
  <HomeBanner :banners="myBanners">
    <!-- 自定义指示器 -->
    <template #indicator="{ active, total }">
      <view class="my-indicator">
        {{ active + 1 }} / {{ total }}
      </view>
    </template>
    
    <!-- 自定义每项内容 -->
    <template #default="{ item, index }">
      <view class="my-banner-item">
        <image :src="item" mode="aspectFill" />
        <view class="banner-overlay">
          <text>自定义内容 {{ index + 1 }}</text>
        </view>
      </view>
    </template>
  </HomeBanner>
</template>
```

**6. 方法调用**
```vue
<template>
  <HomeBanner ref="bannerRef" />
</template>

<script setup>
const bannerRef = ref()

// 获取当前 banner 列表
const currentBanners = bannerRef.value.getBannerList()
console.log('当前 banners:', currentBanners)
</script>
```

#### 完整配置示例
```vue
<template>
  <HomeBanner 
    :banners="banners"
    :autoplay="true"
    :interval="4000"
    :indicator-position="'bottom-center'"
    :image-mode="'aspectFit'"
    :height="'350rpx'"
    :custom-class="'rounded-lg shadow-lg'"
    container-class="p-4 bg-gray-100"
    :disable-default-style="false"
    @click="handleSwiperClick"
    @change="handleSwiperChange"
    @banner-click="handleBannerClick"
  >
    <template #default="{ item, index }">
      <view class="relative">
        <image :src="item" mode="aspectFill" class="w-full h-full" />
        <view class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50">
          <text class="text-white text-lg font-bold">Banner {{ index + 1 }}</text>
        </view>
      </view>
    </template>
  </HomeBanner>
</template>

<script setup>
const banners = [
  '/static/banner1.png',
  '/static/banner2.png',
  '/static/banner3.png'
]

function handleSwiperClick(index) {
  console.log('Swiper 点击:', index)
}

function handleSwiperChange(index) {
  console.log('Swiper 切换:', index)
}

function handleBannerClick(banner, index) {
  console.log('Banner 点击:', banner, index)
}
</script>
```

#### MenuGrid 组件使用方式

**1. 基础使用（默认配置）**
```vue
<template>
  <MenuGrid :menus="menuList" />
</template>

<script setup>
const menuList = [
  { key: 'home', name: '首页', url: '/pages/home/index' },
  { key: 'user', name: '用户', url: '/pages/user/index' }
]
</script>
```

**2. 自定义布局**
```vue
<template>
  <MenuGrid 
    :menus="menuList"
    :column="4"
    :border="true"
    container-class="my-menu-container"
  />
</template>
```

**3. 自定义图标**
```vue
<template>
  <MenuGrid 
    :menus="menuList"
    :icon-size="'60rpx'"
    :icon-bg-color="'#f0f0f0'"
    :disable-default-icon="true"
  >
    <!-- 自定义图标插槽 -->
    <template #icon="{ menu, index }">
      <view class="custom-icon">
        <text>{{ menu.name.charAt(0) }}</text>
      </view>
    </template>
  </MenuGrid>
</template>
```

**4. 禁用自动导航**
```vue
<template>
  <MenuGrid 
    :menus="menuList"
    :auto-navigate="false"
    @menu-click="handleMenuClick"
  />
</template>

<script setup>
function handleMenuClick(menu, index) {
  console.log('点击菜单:', menu, index)
  // 自定义导航逻辑
  uni.navigateTo({ url: menu.url })
}
</script>
```

**5. 完全自定义（透传所有 wd-grid 属性）**
```vue
<template>
  <MenuGrid 
    :menus="menuList"
    :column="3"
    :clickable="true"
    :border="false"
    :gutter="'20rpx'"
    :custom-class="'my-grid'"
    @click="handleClick"
    @grid-click="handleGridClick"
  >
    <!-- 自定义菜单项内容 -->
    <template #default="{ menu, index }">
      <view class="custom-menu-item">
        <text>{{ menu.name }}</text>
      </view>
    </template>
  </MenuGrid>
</template>
```

**6. 方法调用**
```vue
<template>
  <MenuGrid ref="menuGridRef" :menus="menuList" />
</template>

<script setup>
const menuGridRef = ref()

// 获取菜单列表
const currentMenus = menuGridRef.value.getMenuList()

// 获取菜单数量
const menuCount = menuGridRef.value.getMenuCount()

// 手动导航
menuGridRef.value.navigateToPage('/pages/custom/index')
</script>
```

#### 完整配置示例
```vue
<template>
  <MenuGrid 
    :menus="menus"
    :column="4"
    :clickable="true"
    :border="false"
    :icon-size="'55rpx'"
    :image-mode="'aspectFit'"
    :icon-bg-color="'#f8f8f8'"
    :disable-default-icon="false"
    container-class="p-4 bg-white rounded-lg"
    :auto-navigate="true"
    @menu-click="handleMenuClick"
    @click="handleClick"
  >
    <!-- 自定义图标 -->
    <template #icon="{ menu }">
      <view class="menu-icon" :style="{ backgroundColor: menu.color }">
        <wd-icon :name="menu.icon" color="#fff" />
      </view>
    </template>
    
    <!-- 自定义文本 -->
    <template #text="{ menu }">
      <text class="menu-text">{{ menu.name }}</text>
    </template>
  </MenuGrid>
</template>

<script setup>
const menus = [
  { 
    key: 'home', 
    name: '首页', 
    url: '/pages/home/index',
    icon: 'home',
    color: '#1890ff'
  },
  { 
    key: 'user', 
    name: '用户', 
    url: '/pages/user/index',
    icon: 'user',
    color: '#52c41a'
  },
  {
    key: 'settings',
    name: '设置',
    url: '/pages/settings/index',
    imageUrl: '/static/icons/settings.png'
  }
]

function handleMenuClick(menu, index) {
  console.log('菜单点击:', menu, index)
}

function handleClick(data) {
  console.log('网格点击:', data)
}
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-size: 26rpx;
  color: #333;
}
</style>
```

#### HomeNews 组件使用方式

**1. 基础使用（默认配置）**
```vue
<template>
  <HomeNews />
</template>
```

**2. 自定义配置**
```vue
<template>
  <HomeNews 
    title="公司动态"
    :page-size="5"
    :show-image="true"
    more-route="/pages/company/news"
    @item-click="handleNewsClick"
  />
</template>

<script setup>
function handleNewsClick(news, index) {
  console.log('点击新闻:', news, index)
  // 跳转到新闻详情
  uni.navigateTo({ url: `/pages/news/detail?id=${news.id}` })
}
</script>
```

**3. 外部数据源**
```vue
<template>
  <HomeNews 
    :auto-fetch="false"
    :news-data="myNewsData"
    @data-loaded="handleDataLoaded"
  />
</template>

<script setup>
const myNewsData = ref([
  { id: 1, name: '新闻标题1', publishDate: '2024-01-01', picture: [] },
  { id: 2, name: '新闻标题2', publishDate: '2024-01-02', picture: [] }
])

function handleDataLoaded(data) {
  console.log('数据加载完成:', data)
}
</script>
```

**4. 完全自定义样式**
```vue
<template>
  <HomeNews 
    title="最新资讯"
    container-class="my-news-container"
    title-class="my-title"
    item-class="my-news-item"
    :image-width="120"
    :image-height="80"
    :show-bottom-space="false"
    @more-click="handleMoreClick"
  />
</template>

<style lang="scss" scoped>
.my-news-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 30rpx;
}

.my-title {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.my-news-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
</style>
```

**5. 方法调用**
```vue
<template>
  <HomeNews ref="newsRef" />
  <button @click="refreshNews">刷新新闻</button>
</template>

<script setup>
const newsRef = ref()

function refreshNews() {
  newsRef.value.refresh()
}

function getNewsData() {
  const newsList = newsRef.value.getNewsList()
  const loading = newsRef.value.getLoading()
  const error = newsRef.value.getError()
  
  console.log('新闻列表:', newsList)
  console.log('加载状态:', loading)
  console.log('错误信息:', error)
}
</script>
```

#### 完整配置示例
```vue
<template>
  <HomeNews 
    title="行业资讯"
    more-text="查看全部"
    more-icon="arrow-right"
    more-route="/pages/industry/news"
    :show-bottom-space="true"
    
    container-class="mt-20rpx overflow-hidden rounded-8rpx bg-white p-23rpx"
    title-class="text-[#1D2129] text-31rpx font-600"
    more-class="text-[#ACACAC] text-27rpx font-500"
    title-text-class="two-line-ellipsis text-#1D2129 text-27rpx font-400 mb-23rpx"
    date-text-class="text-#ACACAC text-23rpx"
    item-class="newItem flex justify-between py-20rpx gap-100rpx items-center"
    empty-class="text-center py-40rpx text-gray-500"
    
    :show-image="true"
    :image-width="100"
    :image-height="70"
    :image-radius="8"
    image-mode="aspectFill"
    :enable-preview="true"
    
    :page-size="3"
    :status="1"
    :show-empty="true"
    empty-text="暂无资讯"
    
    :auto-fetch="true"
    :enable-item-click="true"
    
    :image-props="{ lazy: true, loading: 'lazy' }"
    
    @more-click="handleMoreClick"
    @item-click="handleNewsClick"
    @data-loaded="handleDataLoaded"
    @data-error="handleDataError"
    @refresh="handleRefresh"
  />
</template>

<script setup>
function handleMoreClick() {
  console.log('点击更多')
}

function handleNewsClick(news, index) {
  console.log('点击新闻:', news, index)
  uni.navigateTo({ url: `/pages/news/detail?id=${news.id}` })
}

function handleDataLoaded(data) {
  console.log('数据加载完成:', data)
}

function handleDataError(error) {
  console.error('数据加载失败:', error)
}

function handleRefresh() {
  console.log('刷新完成')
}
</script>
```

#### MenuSection 组件使用方式

**1. 基础使用（默认配置）**
```vue
<template>
  <MenuSection />
</template>
```

**2. 自定义菜单数据**
```vue
<template>
  <MenuSection 
    :favorite-menus="myFavoriteMenus"
    :chunk-size="8"
    :show-more-button="true"
    more-button-text="设置"
  />
</template>

<script setup>
const myFavoriteMenus = ['home', 'user', 'settings', 'news']
</script>
```

**3. 自定义布局和样式**
```vue
<template>
  <MenuSection 
    :column="4"
    :height="'320rpx'"
    :autoplay="true"
    container-class="my-menu-section"
    @menu-click="handleMenuClick"
  />
</template>

<style lang="scss" scoped>
.my-menu-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}
</style>
```

**4. 完全自定义（透传所有属性）**
```vue
<template>
  <MenuSection 
    :chunk-size="6"
    :show-more-button="false"
    :autoplay="false"
    :indicator-config="{ type: 'fraction' }"
    :swiper-props="{ loop: false }"
    :grid-props="{ gutter: '20rpx' }"
    :icon-size="'70rpx'"
    :auto-navigate="false"
    @click="handleClick"
    @swiper-change="handleSwiperChange"
    @settings-click="handleSettingsClick"
  >
    <!-- 自定义图标 -->
    <template #icon="{ menu }">
      <view class="custom-icon" :style="{ backgroundColor: menu.color }">
        <text class="icon-text">{{ menu.name.charAt(0) }}</text>
      </view>
    </template>
  </MenuSection>
</template>

<script setup>
function handleClick(menu) {
  console.log('菜单点击:', menu)
}

function handleSwiperChange(index) {
  console.log('轮播切换:', index)
}

function handleSettingsClick() {
  console.log('设置点击')
}
</script>

<style lang="scss" scoped>
.custom-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon-text {
    color: white;
    font-size: 28rpx;
    font-weight: bold;
  }
}
</style>
```

**5. 方法调用**
```vue
<template>
  <MenuSection ref="menuSectionRef" />
  <button @click="refreshMenu">刷新菜单</button>
</template>

<script setup>
const menuSectionRef = ref()

function refreshMenu() {
  menuSectionRef.value.refreshData()
}

function getMenuData() {
  const menuGroups = menuSectionRef.value.getMenuGroups()
  const favoriteItems = menuSectionRef.value.getFavoriteMenuItems()
  
  console.log('菜单分组:', menuGroups)
  console.log('常用菜单:', favoriteItems)
}
</script>
```

#### 完整配置示例
```vue
<template>
  <MenuSection 
    :favorite-menus="favoriteMenus"
    :chunk-size="9"
    :show-more-button="true"
    more-button-text="更多功能"
    
    :height="'300rpx'"
    :autoplay="false"
    :indicator-config="{ type: 'dots-bar', dynamic: true }"
    
    :column="5"
    :clickable="true"
    :border="false"
    
    :icon-size="'65rpx'"
    image-mode="aspectFill"
    :disable-default-icon="false"
    
    container-class="bg-white rounded-12rpx shadow-lg"
    
    :auto-navigate="true"
    more-route="/pages/custom/settings"
    
    :swiper-props="{ loop: false, easing: 'ease-out' }"
    :grid-props="{ gutter: '10rpx' }"
    
    @click="handleMenuClick"
    @more-click="handleMoreClick"
    @swiper-click="handleSwiperClick"
    @swiper-change="handleSwiperChange"
    @settings-click="handleSettingsClick"
  >
    <!-- 自定义图标插槽 -->
    <template #icon="{ menu }">
      <view v-if="menu.key === 'more'" class="more-icon">
        <wd-icon name="add" size="40rpx" color="#999" />
      </view>
      <view v-else class="menu-icon">
        <image 
          v-if="menu.imageUrl" 
          :src="menu.imageUrl" 
          mode="aspectFill"
          class="w-100% h-100%"
        />
        <wd-icon 
          v-else-if="menu.icon" 
          :name="menu.icon" 
          :size="iconSize"
          :color="menu.iconColor || '#666'"
        />
      </view>
    </template>
  </MenuSection>
</template>

<script setup>
const favoriteMenus = ['home', 'user', 'settings', 'news', 'docs']

function handleMenuClick(menu) {
  console.log('菜单点击:', menu)
}

function handleMoreClick() {
  console.log('更多按钮点击')
}

function handleSwiperClick(data) {
  console.log('轮播点击:', data)
}

function handleSwiperChange(index) {
  console.log('轮播切换到:', index)
}

function handleSettingsClick() {
  console.log('设置页面跳转')
}
</script>

<style lang="scss" scoped>
.more-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 61rpx;
  height: 61rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

#### 菜单配置使用方式

**menuGroupsData 是工作台菜单的静态配置数据**，现在支持多种简化配置方式，减少使用者的心智负担。

##### 🎯 最简单的使用方式

**方式1: 直接传入数组（推荐）**
```typescript
import { configureMenus } from '@jinghe-sanjiaoroad-app/app'

// 最简单：直接传入菜单数组
configureMenus([
  {
    key: "business",
    name: "业务模块", 
    menus: [
      {
        key: "order",
        name: "订单管理",
        url: "/pages/order/index"
      }
    ]
  }
])
```

**方式2: 增量添加**
```typescript
import { addMenuGroup, addMenuItem } from '@jinghe-sanjiaoroad-app/app'

// 添加整个分组
addMenuGroup({
  key: "tools",
  name: "工具模块",
  menus: [
    { key: "calculator", name: "计算器", url: "/pages/tools/calculator" }
  ]
})

// 添加单个菜单到现有分组
addMenuItem("general", {
  key: "new-feature",
  name: "新功能",
  url: "/pages/new/index"
})
```

**方式3: 零配置使用**
```typescript
// 不配置任何东西，使用默认菜单
// 直接在页面中使用即可
```

##### 📱 组件使用：零配置开始

**基础使用（推荐）**
```vue
<template>
  <!-- 所有组件都有合理的默认值，可以直接使用 -->
  <UserHeader />
  <MenuSection />
  <HomeNews />
  <HomeBanner />
</template>
```

**渐进式增强**
```vue
<template>
  <!-- 第一步：直接使用 -->
  <MenuSection />
  
  <!-- 第二步：需要时才配置 -->
  <MenuSection :chunk-size="6" />
  
  <!-- 第三步：高级配置 -->
  <MenuSection 
    :chunk-size="6"
    :height="'320rpx'"
    @menu-click="handleClick"
  />
</template>
```

##### 🎨 智能默认值

所有组件都提供了智能默认值，减少配置负担：

**UserHeader**
```vue
<!-- ✅ 零配置：自动获取用户数据、待办数量 -->
<UserHeader />

<!-- ⚡ 按需配置：自定义数据源 -->
<UserHeader 
  :user-info="myUser"
  :todo-num="5"
  :auto-fetch="false"
/>
```

**HomeBanner**
```vue
<!-- ✅ 零配置：使用默认轮播图 -->
<HomeBanner />

<!-- ⚡ 按需配置：自定义轮播图 -->
<HomeBanner :banners="myBanners" />
```

**MenuGrid**
```vue
<!-- ✅ 零配置：5列网格，自动导航 -->
<MenuGrid :menus="menus" />

<!-- ⚡ 按需配置：自定义布局 -->
<MenuGrid :menus="menus" :column="4" :auto-navigate="false" />
```

**HomeNews**
```vue
<!-- ✅ 零配置：自动获取新闻数据 -->
<HomeNews />

<!-- ⚡ 按需配置：自定义数据源 -->
<HomeNews :page-size="5" :auto-fetch="false" />
```

##### 🔧 高级配置：按需学习

只有当你需要特殊功能时，才需要学习这些配置：

**完全自定义菜单**
```typescript
import { setMenuConfig } from '@jinghe-sanjiaoroad-app/app'

// 高级配置：完全控制
setMenuConfig({
  mergeWithDefault: false,  // 不合并默认菜单
  overrideDefault: true,    // 完全覆盖
  enablePermission: false,  // 禁用权限过滤
  groups: [
    {
      key: "custom",
      name: "自定义模块",
      sort: 10,
      menus: [
        {
          key: "feature",
          name: "自定义功能",
          url: "/pages/custom/index",
          icon: "star",
          iconColor: "#52c41a",
          description: "这是一个自定义功能",
          sort: 1,
          badge: "new"
        }
      ]
    }
  ]
})
```

**完全自定义组件**
```vue
<template>
  <!-- 只有需要时才使用这些高级功能 -->
  <MenuSection 
    :favorite-menus="myMenus"
    :chunk-size="8"
    :height="'300rpx'"
    :autoplay="true"
    :swiper-props="{ loop: false }"
    :grid-props="{ gutter: '20rpx' }"
    @menu-click="handleClick"
    @swiper-change="handleChange"
  >
    <!-- 自定义图标插槽 -->
    <template #icon="{ menu }">
      <view class="custom-icon">
        <text>{{ menu.name.charAt(0) }}</text>
      </view>
    </template>
  </MenuSection>
</template>
```

##### 💡 设计理念

1. **🎯 零配置可用** - 所有组件都有合理的默认值
2. **⚡ 渐进式增强** - 从简单到复杂，按需学习
3. **🔧 智能推断** - 自动处理常见场景
4. **📱 一致性** - 所有组件遵循相同的 API 设计

##### 🚀 使用建议

**新手用户**
```typescript
// 只需要这样配置
import { configureMenus } from '@jinghe-sanjiaoroad-app/app'

configureMenus([
  { key: "myapp", name: "我的应用", menus: [
    { key: "home", name: "首页", url: "/pages/home" }
  ]}
])
```

**进阶用户**
```typescript
// 可以使用更多功能，但不是必须的
import { setMenuConfig, addMenuItem } from '@jinghe-sanjiaoroad-app/app'

// 添加菜单
addMenuItem("general", { key: "feature", name: "功能", url: "/pages/feature" })

// 高级配置（可选）
setMenuConfig({ enablePermission: false })
```

**专家用户**
```typescript
// 完全控制，但需要学习更多
setMenuConfig({
  overrideDefault: true,
  groups: [/* 完全自定义 */]
})
```

### HTTP 模块
```typescript
import { http, httpGet, httpPost, httpPut, httpDelete } from '@jinghe-sanjiaoroad-app/app'
// 来源：src/http/index.ts
```

### Store 状态管理
```typescript
import { useTokenStore, useUserStore } from '@jinghe-sanjiaoroad-app/app'
// 来源：src/store/token.ts, src/store/index.ts
```

### Router 路由
```typescript
import { useRouter, toLoginPage } from '@jinghe-sanjiaoroad-app/app'
// 来源：src/router/interceptor.ts
```

### Utils 工具函数
```typescript
import { formatDate, deepClone, debounce } from '@jinghe-sanjiaoroad-app/app'
// 来源：src/utils/index.ts, src/utils/date.ts
```

### Types 类型定义
```typescript
import type { CustomRequestOptions, UserInfo } from '@jinghe-sanjiaoroad-app/app'
// 来源：src/types/index.ts, src/http/types.ts
```

## 🔍 快速查找
使用 IDE 的 "Go to Definition" 功能（F12）可以快速跳转到源码位置。
