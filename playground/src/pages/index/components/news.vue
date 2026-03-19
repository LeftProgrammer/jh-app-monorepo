<template>
  <view class="mt-20rpx overflow-hidden rounded-8rpx bg-white p-23rpx">
    <view class="flex justify-between items-center">
      <text class="text-[#1D2129] text-31rpx font-600">新闻资讯</text>
      <text class="text-[#ACACAC] text-27rpx font-500" @click="routerTo">
        更多
        <wd-icon name="arrow-right" size="27rpx" color="#ACACAC" />
      </text>
    </view>
    <view
      v-for="item in list"
      :key="item.id"
      class="newItem flex justify-between py-20rpx gap-100rpx items-center"
    >
      <view class="flex flex-col flex-1 justify-between">
        <view class="two-line-ellipsis text-#1D2129 text-27rpx font-400 mb-23rpx">
          {{ item.name }}
        </view>
        <view class="text-#ACACAC text-23rpx">{{ item.publishDate }}</view>
      </view>
      <wd-img
        :width="100"
        :radius="4"
        :height="70"
        :src="item.picture[0]?.url"
        :preview-src="item.picture[0]?.url"
        :enable-preview="true"
      />
    </view>
  </view>
  <view class="h-40rpx" />
</template>

<script lang="ts" setup>
import { getPage } from "@/api/general/news";
import { getFileByIds } from "@jinghe-sanjiaoroad-app/framework/api/infra/file";
defineOptions({
  name: "HomeNews"
});
const list = ref([]);
onMounted(async () => {
  const data = await getPage({
    pageNo: 1,
    pageSize: 3,
    status: 1
  });
  for (let i = 0; i < data.list.length; i++) {
    const item: any = data.list[i];
    if (item.picture) {
      const file = await getFileByIds(item.picture);
      item.picture = file;
    } else {
      item.picture = [];
    }
  }
  list.value = data.list || [];
});
/** 跳转项目新闻 */
function routerTo() {
  uni.navigateTo({ url: "/pages/general/news/index" });
}
</script>
<style lang="scss" scoped>
.newItem {
  border-bottom: 1px solid #ededed;
}
</style>
