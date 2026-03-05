<template>
  <view>
    <!-- 搜索组件 -->
    <MySearchForm @search="handleSearch" @reset="handleReset" />

    <view class="bpm-list">
      <!-- 我的列表 -->
      <view
        v-for="item in list"
        :key="item.id"
        class="bpm-card px-19rpx py-23rpx flex justify-between items-center"
        @click="handleDetail(item)"
      >
        <view
          :class="item.status === 1 ? 'w-[calc(100%-50rpx)]' : 'w-[calc(100%-140rpx)]'"
        >
          <view class="text-#1D2129 text-31rpx mb-19rpx text-ellipsis">
            {{ item.name }}
          </view>
          <view
            class="text-27rpx text-#86909C flex justify-between items-center gap-10rpx"
            @click.stop=""
          >
            <view>
              <text class="text-#009688">{{ item.processDefinition?.name }}</text>
              <wd-divider vertical />
              <text>{{ item.tasks ? item.tasks[0].name : "" }}</text>
              <wd-divider v-if="item.tasks" vertical />
              <text>{{ formatPast(item.startTime) }}</text>
            </view>
            <wd-button
              v-if="item.status === 1"
              size="small"
              :round="false"
              class="!h-46rpx !px-25rpx !rounded-8rpx"
              @click="handleUrging(item)"
            >
              催办
            </wd-button>
          </view>
        </view>
        <view class="flex justify-center items-center">
          <image
            v-if="item.status !== 1"
            :src="`/static/images/task/status-${item.status}.png`"
            class="w-110rpx h-95rpx"
          />
          <wd-icon name="arrow-right" size="31rpx" color="#009688" />
        </view>
      </view>
      <wd-message-box />
      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="bpm-empty">
        <wd-status-tip image="content" tip="暂无发起的流程" />
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ProcessInstance } from "@/api/bpm/processInstance";
import type { LoadMoreState } from "@/http/types";
import { onReachBottom } from "@dcloudio/uni-app";
import { computed, onMounted, ref } from "vue";
import { useMessage, useToast } from "wot-design-uni";
import { getProcessInstanceMyPage, urgeCreate } from "@/api/bpm/processInstance";
import { useUserStore } from "@/store";
import { DICT_TYPE } from "@/utils/constants";
import { formatPast } from "@/utils/date";
import MySearchForm from "./my-search-form.vue";
import "../styles/index.scss";

const userStore = useUserStore();
const userNickname = computed(() => userStore.userInfo?.nickname || "");
const message = useMessage();
const toast = useToast();

const total = ref(0);
const list = ref<ProcessInstance[]>([]);
const loadMoreState = ref<LoadMoreState>("loading");

const queryParams = ref({
  pageNo: 1,
  pageSize: 10
});

/** 查询列表 */
async function getList() {
  loadMoreState.value = "loading";
  try {
    const data = await getProcessInstanceMyPage(queryParams.value);
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
function handleUrging(row: any) {
  message
    .confirm({
      msg: "是否提醒当前节点审批人流程办理",
      title: "催办"
    })
    .then(async ({ action }) => {
      if (action === "confirm") {
        // 方法1：map 提取
        const userTaskVOS = row.tasks.map((task) => ({
          taskId: task.id,
          userId: task.assigneeUser.id
        }));
        const data = {
          startUserId: row.startUser.id,
          processInstanceId: row.id,
          processInstanceName: row.processDefinition.name,
          title: row.formVariables.title,
          processDefinitionId: row.processDefinitionId,
          activityName: row.tasks[0].name,
          userTaskVOS
        };
        const res = await urgeCreate(data);
        toast.show(res);
      }
    });
}
/** 查看详情 */
function handleDetail(item: ProcessInstance) {
  uni.navigateTo({
    url: `/pages-bpm/processInstance/detail/index?id=${item.id}&type=my`
  });
}

/** 发起流程 */
function handleCreate() {
  uni.navigateTo({ url: "/pages-bpm/processInstance/create/index" });
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
