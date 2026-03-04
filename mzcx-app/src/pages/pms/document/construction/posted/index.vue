<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="施工发文"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />
    <wd-swipe-action v-for="item in list" :key="item.id">
      <view
        class="bg-#fff mx-16rpx px-23rpx pt-31rpx pb-16rpx mb-16rpx rounded-8rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex justify-between items-center gap-31rpx">
          <view class="flex-1 text-#1D2129 text-31rpx text-ellipsis">
            {{ item.name }}
          </view>
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="item.status" />
        </view>
        <wd-divider class="!p-0 !my-16rpx" />
        <view>
          <view class="flex justify-between items-center gap-31rpx text-27rpx mb-19rpx">
            <text class="text-#4E5969">发起日期</text>
            <text class="flex-1 text-ellipsis text-right text-#1D2129">
              {{ formatDate(item.sendDate) }}
            </text>
          </view>
        </view>
        <view class="flex justify-between items-center gap-31rpx text-27rpx mb-19rpx">
          <text class="text-#4E5969">发起人</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129"
            >{{ item.sendUserName }}
          </text>
        </view>
        <view class="flex justify-between items-center gap-31rpx text-27rpx">
          <text class="text-#4E5969">收文单位</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.receivingUnitName }}
          </text>
        </view>
      </view>
      <template #right>
        <view class="action">
          <view class="flex items-center justify-center px-11px text-#fff bg-blue">
            编辑
          </view>
          <view class="flex items-center justify-center px-11px text-#fff bg-red">
            查看
          </view>
        </view>
      </template>
    </wd-swipe-action>
    <!-- 暂无数据 -->
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
import { navigateBackPlus } from "@/utils";
import { getPage } from "@/api/pms/document/posted";
import type { LoadMoreState } from "@/http/types";
import { useUserStore } from "@/store";
import { DICT_TYPE } from "@/utils/constants/dict-enum";
import { formatDate } from "@/utils/date";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});
const list = ref<any[]>([]);
const total = ref(0);
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  sendType: 4,
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

function routerTo(type: string, item?: any) {
  uni.navigateTo({
    url: `/pages/pms/document/construction/posted/dataForm?type=${type}&id=${
      item?.id || ""
    }`
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
