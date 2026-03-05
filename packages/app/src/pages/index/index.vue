<template>
  <view class="yd-page-container px-16rpx">
    <!-- 顶部导航栏 -->
    <!-- <wd-navbar
      title="工作台"
      placeholder safe-area-inset-top fixed
    /> -->
    <!-- 用户信息头部 -->
    <UserHeader />
    <!-- 菜单区域 -->
    <MenuSection />
    <!-- 项目新闻 -->
    <HomeNews />
    <!-- Banner 轮播图 -->
    <!-- <HomeBanner /> -->
  </view>
</template>

<script lang="ts" setup>
import HomeBanner from "./components/banner.vue";
import HomeNews from "./components/news.vue";
import MenuSection from "./components/menu-section.vue";
import UserHeader from "./components/user-header.vue";

defineOptions({
  name: "Home"
});

definePage({
  type: "home",
  style: {
    navigationStyle: "custom"
  }
});
</script>
<style lang="scss" scoped>
.yd-page-container {
  background: linear-gradient(
    180deg,
    #22b5af 0%,
    #3fc5be 10.52%,
    #95e6ea 20.26%,
    #f5f5f5 30%,
    #f5f5f5 100%
  );
}
</style>
