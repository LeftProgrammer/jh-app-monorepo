<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="请假申请"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />
    <wd-sticky>
      <wd-datetime-picker
        v-model="queryParams.date"
        placeholder-left
        :default-value="[new Date().getTime(), new Date().getTime()]"
        type="date"
        :clearable="true"
        class="w-[calc(100vw-0rpx)]"
        @confirm="handleSearch"
      />
    </wd-sticky>
    <wd-swipe-action
      v-for="(item, index) in list"
      :key="item.id"
      :disabled="item.status !== -1"
    >
      <view
        class="bg-#fff mx-16rpx px-19rpx py-27rpx mb-16rpx rounded-8rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex items-center justify-between gap-31rpx">
          <view class="flex-1 text-#1D2129 text-31rpx text-ellipsis">
            {{ item.createName }}的请假申请
          </view>
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="item.status" />
        </view>
        <wd-divider class="!p-0 !my-16rpx" />
        <view class="flex items-center justify-between mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">申请日期</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.applyDate }}
          </text>
        </view>
        <view class="flex items-center justify-between mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">请假时间</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ formatDate(item.startApplyTime) }}~{{ formatDate(item.endApplyTime) }}
          </text>
        </view>
        <view class="flex items-center justify-between text-27rpx gap-31rpx">
          <text class="text-#4E5969">请假类别</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ getDictLabel(DICT_TYPE.LEAVE_TYPE, item.type) }}
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
import { navigateBackPlus, deepClone } from "@/utils";
import LeaveApplyApi from "@/api/general/leaveApply";
import type { LoadMoreState } from "@/http/types";
import { DICT_TYPE } from "@/utils/constants";
import { getDictLabel } from "@/hooks/useDict";
import { useUserStore } from "@/store";
import { formatDate } from "@/utils/date";
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
  unitId: userInfo.value.department,
  date: []
});
const loadMoreState = ref<LoadMoreState>("loading");
function handleSearch() {
  list.value = [];
  queryParams.value.pageNo = 1;
  getList();
}
/** 查询列表 */
async function getList() {
  loadMoreState.value = "loading";
  try {
    const params: any = deepClone(queryParams.value);
    if (params.date.length > 0) {
      params.startApplyTime = formatDate(params.date[0], "YYYY-MM-DD HH:mm:ss");
      params.endApplyTime = formatDate(params.date[1], "YYYY-MM-DD HH:mm:ss");
    }
    delete params.date;
    const data = await LeaveApplyApi.getPage(params);
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
function handleDelete(item: any, index: number) {
  message
    .confirm({
      title: "提示",
      msg: "确定删除数据？"
    })
    .then(async ({ action }) => {
      if (action === "confirm") {
        await LeaveApplyApi.delete(item.id);
        list.value.splice(index, 1);
      }
    });
}
/** 触底加载更多 */
onReachBottom(() => {
  loadMore();
});
function reset() {
  list.value = [];
  queryParams.value.pageNo = 1;
  getList();
}
function routerTo(type: string, item?: any) {
  uni.navigateTo({
    url: `/pages/general/leaveApply/dataForm?type=${type}&id=${item?.id || ""}`
  });
}
/** 初始化 */
onShow(() => {
  reset();
});
</script>

<style lang="scss" scoped></style>
