<template>
  <view :class="containerClass">
    <wd-swiper
      :list="bannerList"
      v-bind="swiperProps"
      @click="handleClick"
      @change="handleChange"
      @animationfinish="handleAnimationFinish"
    >
      <!-- 透传所有插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </wd-swiper>
  </view>
</template>

<script lang="ts" setup>
import { staticUrl } from "@/utils";

defineOptions({
  name: "HomeBanner"
});

interface Props {
  // Banner 数据
  banners?: string[];
  // 容器样式
  containerClass?: string;
  // 禁用默认样式
  disableDefaultStyle?: boolean;
  // 透传所有 wd-swiper 的属性
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  banners: () => [
    staticUrl("/static/banner/banner01.png"),
    staticUrl("/static/banner/banner02.png"),
    staticUrl("/static/banner/banner03.png")
  ],
  containerClass: 'mx-20rpx mt-20rpx overflow-hidden rounded-16rpx bg-white',
  disableDefaultStyle: false
});

// 事件
const emit = defineEmits<{
  // Swiper 原生事件
  click: [index: number];
  change: [index: number];
  animationfinish: [index: number];
  // 自定义事件
  bannerClick: [banner: string, index: number];
}>();

// 计算属性
const bannerList = computed(() => props.banners);

// 默认配置
const defaultSwiperProps = {
  autoplay: true,
  interval: 5000,
  indicatorPosition: 'bottom-right',
  imageMode: 'aspectFill',
  height: '300rpx',
  customClass: 'rounded-16rpx overflow-hidden'
};

// 合并配置：用户配置覆盖默认配置
const swiperProps = computed(() => {
  const { banners, containerClass, disableDefaultStyle, ...userProps } = props;
  
  if (disableDefaultStyle) {
    return userProps;
  }
  
  return {
    ...defaultSwiperProps,
    ...userProps
  };
});

/** 处理点击 */
function handleClick(index: number) {
  const banner = bannerList.value[index];
  emit('click', index);
  emit('bannerClick', banner, index);
}

/** 处理切换 */
function handleChange(index: number) {
  emit('change', index);
}

/** 处理动画结束 */
function handleAnimationFinish(index: number) {
  emit('animationfinish', index);
}

/** 暴露方法 */
defineExpose({
  // 获取当前 banner 列表
  getBannerList: () => bannerList.value
});
</script>

<style lang="scss" scoped>
// 默认样式可以通过 disableDefaultStyle 禁用
</style>
