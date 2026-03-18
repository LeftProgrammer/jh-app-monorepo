<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="用印申请"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />
    <wd-sticky>
      <wd-datetime-picker
        v-model="queryParams.useDate"
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
        class="bg-#fff mx-16rpx px-23rpx pt-31rpx pb-16rpx mb-16rpx rounded-8rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex items-center justify-between gap-16rpx">
          <view class="flex-1 text-#1D2129 text-31rpx text-ellipsis">
            {{ item.reporter }}的用印申请
          </view>
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="item.status" />
        </view>
        <wd-divider class="!p-0 !my-16rpx" />
        <view
          class="flex items-center justify-between mb-19rpx text-27rpx text-#1D2129 gap-31rpx"
        >
          <text class="text-#4E5969">申请日期</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ formatDate(item.createTime) }}
          </text>
        </view>
        <view
          class="flex items-center justify-between mb-19rpx text-27rpx text-#1D2129 gap-31rpx"
        >
          <text class="text-#4E5969">申请人</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.reporter }}
          </text>
        </view>
        <view
          class="flex items-center justify-between mb-19rpx text-27rpx text-#1D2129 gap-31rpx"
        >
          <text class="text-#4E5969">用印部门</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.reporterDepartName }}
          </text>
        </view>
        <view class="flex items-center justify-between text-27rpx text-#1D2129 gap-31rpx">
          <text class="text-#4E5969">数量</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.num }}
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
    <!-- 加载更多 -->
    <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    <!-- 新增 -->
    <wd-fab :draggable="true" :expandable="false" @click="routerTo('create')" />
  </view>
</template>

<script lang="ts" setup>
import { deepClone, DICT_TYPE, formatDate, navigateBackPlus } from '@/utils'
import SealDeclarationApi from "@/api/general/seal-declaration"
import type { LoadMoreState } from "@/http/types"
import { getDictLabel } from '@/hooks'
import { useUserStore } from "@/store"
import { useMessage } from "wot-design-uni"

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
  useDate: []
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
    if (params.useDate.length > 0) {
      params.useDate = [formatDate(params.useDate[0]), formatDate(params.useDate[0])];
    }
    // delete params.date;
    const data = await SealDeclarationApi.getPage(params);
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
        await SealDeclarationApi.delete(item.id);
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
    url: `/pages/general/sealdeclaration/SealDeclarationForm?type=${type}&id=${
      item?.id || ""
    }`
  });
}
/** 初始化 */
onMounted(async () => {
  reset();
});
</script>

<style lang="scss" scoped></style>
