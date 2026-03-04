<template>
  <view>
    <!-- 搜索组件 -->
    <CopySearchForm @search="handleSearch" @reset="handleReset" />

    <view class="bpm-list">
      <!-- 抄送列表 -->
      <view
        v-for="item in list"
        :key="item.id"
        class="bpm-card px-19rpx py-23rpx flex justify-between items-center"
        @click="handleDetail(item)"
      >
        <view class="w-[calc(100%-140rpx)]">
          <view class="text-#1D2129 text-31rpx mb-19rpx text-ellipsis">
            {{ item.processInstanceName }}
          </view>
          <view class="text-27rpx text-#86909C">
            <text class="text-#009688">{{ item.processDefinition?.name }}</text>
            <wd-divider vertical />
            <text>{{ item.createUser?.nickname }}</text>
            <wd-divider vertical />
            <text>{{ formatDate(item.createTime, "MM-DD HH:mm") }}</text>
          </view>
        </view>
        <view class="flex justify-center items-center">
          <image
            :src="`/static/images/task/status-${item.status}.png`"
            class="w-110rpx h-95rpx"
          />
          <wd-icon name="arrow-right" size="31rpx" color="#009688" />
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="bpm-empty">
        <wd-status-tip image="content" tip="暂无抄送任务" />
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ProcessInstanceCopy } from "@/api/bpm/processInstance";
import type { LoadMoreState } from "@/http/types";
import { onReachBottom } from "@dcloudio/uni-app";
import { formatDate } from "@/utils/date";
import { onMounted, ref } from "vue";
import { getProcessInstanceCopyPage } from "@/api/bpm/processInstance";
import { formatDateTime } from "@/utils/date";
import CopySearchForm from "./copy-search-form.vue";
import "../styles/index.scss";

const total = ref(0);
const list = ref<ProcessInstanceCopy[]>([]);
const loadMoreState = ref<LoadMoreState>("loading");
const queryParams = ref({
  pageNo: 1,
  pageSize: 10
});

/** 查询列表 */
async function getList() {
  loadMoreState.value = "loading";
  try {
    const data = await getProcessInstanceCopyPage(queryParams.value);
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

/** 搜索 */
function handleSearch(data?: Record<string, any>) {
  queryParams.value = {
    ...data,
    pageNo: 1,
    pageSize: queryParams.value.pageSize
  };
  list.value = [];
  getList();
}

/** 重置 */
function handleReset() {
  list.value = [];
  queryParams.value.pageNo = 1;
  handleSearch();
}

/** 查看详情 */
function handleDetail(item: ProcessInstanceCopy) {
  uni.navigateTo({
    url: `/pages-bpm/processInstance/detail/index?id=${item.processInstanceId}&type=copy`
  });
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore();
});

/** 初始化 */
onShow(() => {
  handleReset();
});
</script>
