<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="营地安全"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />
    <wd-swipe-action
      v-for="(item, index) in list"
      :key="item.id"
      :disabled="item.status !== -1"
    >
      <view
        class="bg-#fff mx-16rpx px-23rpx pt-31rpx pb-16rpx mb-16rpx rounded-8rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex justify-between items-center">
          <view class="flex-1 text-#1D2129 text-31rpx text-ellipsis">
            {{ item.description }}
          </view>
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="item.status" />
        </view>
        <wd-divider class="!p-0 !my-16rpx" />
        <view>
          <view class="flex justify-between items-center mb-19rpx text-27rpx gap-31rpx">
            <text class="text-#4E5969">检查日期</text>
            <text class="flex-1 text-ellipsis text-right text-#1D2129">
              {{ formatDate(item.checkDate) }}
            </text>
          </view>
        </view>
        <view class="flex justify-between items-center mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">隐患位置</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.location }}
          </text>
        </view>
        <view class="flex justify-between items-center text-27rpx gap-31rpx">
          <text class="text-#4E5969">是否验收</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.status === 3 ? "是" : "否" }}
          </text>
        </view>
      </view>
      <template #right>
        <view class="h-100% flex">
          <view
            class="flex items-center justify-center px-11px text-#fff bg-blue"
            @click="routerTo('update', item)"
          >
            编辑
          </view>
          <view
            class="flex items-center justify-center px-11px text-#fff bg-red"
            @click="handleDelete(item, index)"
          >
            删除
          </view>
        </view>
      </template>
    </wd-swipe-action>
    <wd-status-tip v-if="list.length === 0" tip="暂无数据">
      <template #image>
        <image src="/static/images/noData.png" class="h-140rpx w-280rpx" />
      </template>
    </wd-status-tip>
    <!-- 加载更多 -->
    <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    <!-- 新增 -->
    <wd-fab :draggable="true" :expandable="false" @click="routerTo('create')" />
  </view>
</template>

<script lang="ts" setup>
;
import { formatDate, formatDateTimeHour, navigateBackPlus } from '@/utils'
import { getPage, deleteById } from "@/api/general/camp/safety";
import type { LoadMoreState } from "@/http/types";
import { useUserStore } from "@/store";
import { DICT_TYPE } from "@/utils";
;
import { useMessage } from "wot-design-uni";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});
const message = useMessage();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});
const list = ref<any[]>([]);
const total = ref(0);
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  sendType: 3,
  unitId: userInfo.value.department
});
const loadMoreState = ref<LoadMoreState>("loading");

/** 查询列表 */
async function getList() {
  loadMoreState.value = "loading";
  try {
    const data = await getPage(queryParams.value);
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
function handleDelete(item: any, index: number) {
  message
    .confirm({
      title: "提示",
      msg: "确定删除数据？"
    })
    .then(async ({ action }) => {
      if (action === "confirm") {
        await deleteById(item.id);
        list.value.splice(index, 1);
      }
    });
}
function routerTo(type: string, item?: any) {
  uni.navigateTo({
    url: `/pages/general/camp/safety/SafetyForm?type=${type}&id=${item?.id || ""}`
  });
}

/** 初始化 */
onShow(async () => {
  reset();
});
function reset() {
  list.value = [];
  queryParams.value.pageNo = 1;
  getList();
}
</script>

<style lang="scss" scoped>
.action {
  height: 100%;
}

.button {
  display: inline-block;
  padding: 0 11px;
  height: 100%;
  color: white;
  line-height: 42px;
}
</style>
