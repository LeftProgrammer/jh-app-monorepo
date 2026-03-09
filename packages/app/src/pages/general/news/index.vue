<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="新闻列表"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />
    <view class="p-16rpx bg-#f5f5f5">
      <view
        v-for="item in list"
        :key="item.id"
        class="flex bg-#fff rounded-8rpx px-19rpx py-23rpx mb-16rpx gap-19rpx"
      >
        <wd-img
          :width="70"
          :height="70"
          :src="item.picture[0]?.url"
          radius="8rpx"
          :preview-src="item.picture[0]?.url"
          :enable-preview="true"
        />
        <view class="flex flex-col justify-between flex-1">
          <view class="text-[#1D2129] text-27rpx font-500 two-line-ellipsis">{{
            item.name
          }}</view>
          <view class="text-[#86909C] text-23rpx font-400">
            发布时间：{{ item.publishDate }}
          </view>
        </view>
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { navigateBackPlus } from "@/utils";
import type { LoadMoreState } from "@/http/types";
import { getPage } from "@/api/general/news";
import { getFileByIds } from "@/api/infra/file";

definePage({
  style: {
    navigationBarTitleText: "新闻列表",
    navigationStyle: "custom"
  }
});
const list = ref<any[]>([]);
const total = ref(0);
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  status: 1
});
const loadMoreState = ref<LoadMoreState>("loading");

/** 查询列表 */
async function getList() {
  loadMoreState.value = "loading";
  try {
    const data = await getPage(queryParams.value);
    for (let i = 0; i < data.list.length; i++) {
      const item: any = data.list[i];

      if (item.picture) {
        const file = await getFileByIds(item.picture);
        item.picture = file;
      } else {
        item.picture = [];
      }
    }

    list.value = [...list.value, ...data.list];
    total.value = data.total;
    loadMoreState.value = list.value.length >= total.value ? "finished" : "loading";
  } catch {
    queryParams.value.pageNo =
      queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1;
    loadMoreState.value = "error";
  }
}
/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === "finished") {
    return;
  }
  queryParams.value.pageNo++;
  getList();
}
/** 触底加载更多 */
onReachBottom(() => {
  loadMore();
});
/** 初始化 */
onMounted(async () => {
  getList();
});
</script>

<style lang="scss" scoped></style>
