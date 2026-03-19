<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="安全检查"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />

    <!-- 列表内容 -->
    <wd-swipe-action v-for="(item, index) in list" :key="item.id" :disabled="false">
      <view
        class="bg-#fff mx-16rpx px-19rpx py-27rpx mb-16rpx rounded-8rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex items-center justify-between gap-31rpx">
          <view class="flex-1 text-ellipsis text-#1D2129 text-31rpx">
            {{ item.code }}
          </view>
          <!-- 检查结果标签 -->
          <jh-dict-tag :type="DICT_TYPE.INSPECTION_RESULT" :value="item.inspectionResult" />
        </view>
        <wd-divider class="!p-0 !my-16rpx" />

        <view class="flex items-center justify-between mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">检查单位</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.reportingUnitName || "N/A" }}
          </text>
        </view>
        <view class="flex items-center justify-between mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">检查类型</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ getDictLabel(DICT_TYPE.INSPECTION_TYPE, item.inspectionType) || "N/A" }}
          </text>
        </view>
        <view class="flex items-center justify-between mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">检查工区</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.workAreaName || "N/A" }}
          </text>
        </view>
        <view class="flex items-center justify-between mb-19rpx text-27rpx gap-31rpx">
          <text class="text-#4E5969">检查日期</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ formatDate(item.inspectionDate, "YYYY-MM-DD") || "N/A" }}
          </text>
        </view>
        <view class="flex items-center justify-between text-27rpx gap-31rpx">
          <text class="text-#4E5969">检查上报人</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.reporter || "N/A" }}
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

    <wd-status-tip v-if="!list.length && loadMoreState !== 'loading'" tip="暂无数据">
      <template #image>
        <image src="/static/images/noData.png" class="h-140rpx w-280rpx" />
      </template>
    </wd-status-tip>
    <!-- 加载更多 -->
    <wd-loadmore
      v-if="list.length > 0 && total > list.length"
      :state="loadMoreState"
      @reload="loadMore"
    />
    <wd-loadmore v-if="list.length > 0 && total === list.length" state="finished" />

    <!-- 新增按钮 -->
    <wd-fab :draggable="true" :expandable="false" @click="routerTo('create')" />
  </view>
</template>

<script lang="ts" setup>
import { deepClone, DICT_TYPE, formatDate, navigateBackPlus } from '@/utils'
import { computed, onMounted, ref } from "vue"
import InspectionApi from "@/api/pms/safety/safeInspection/inspection"
import type { LoadMoreState } from "@/http"
import { getDictLabel, getStrDictOptions } from '@/hooks'
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
  inspectionOrg: "", // 检查工区 (PC的treeSelectedValue)
  inspectionType: "", // 检查类型
  inspectionResult: "", // 检查结果
  dateRange: [], // 前端使用的日期范围
  inspectionDateStart: "", // 传递给后端的开始日期
  inspectionDateEnd: "" // 传递给后端的结束日期
});
const loadMoreState = ref<LoadMoreState>("loading");
const treeSelectedOrgName = ref("检查工区"); // 用于显示当前选中的检查工区名称

/** PC treeProps 转换为适合 wd-picker 的单列数据 */
const getOrgPickerColumns = () => {
  const root = treeProps.value.treeData[0]; // 假设根节点是 "安全检查结构"
  return root.children.map((item: any) => ({
    label: item.name,
    value: item.id
  }));
};

/** 处理工区筛选 */
function handleOrgFilter(value: string, label: string) {
  queryParams.value.inspectionOrg = value;
  treeSelectedOrgName.value = label;
}

/** 字典筛选处理 */
function handleDictFilter(field: "inspectionType" | "inspectionResult", value: string) {
  queryParams.value[field] = value;
}

/** 触发搜索 */
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

    // 处理日期范围筛选
    if (
      params.dateRange &&
      params.dateRange.length === 2 &&
      params.dateRange[0] &&
      params.dateRange[1]
    ) {
      params.inspectionDateStart = formatDate(params.dateRange[0], "YYYY-MM-DD 00:00:00");
      params.inspectionDateEnd = formatDate(params.dateRange[1], "YYYY-MM-DD 23:59:59");
    } else {
      params.inspectionDateStart = "";
      params.inspectionDateEnd = "";
    }
    delete params.dateRange; // 移除前端使用的 dateRange 字段

    const data = await InspectionApi.getPage(params);
    list.value = [...list.value, ...data.list];
    total.value = data.total;
    loadMoreState.value = list.value.length >= total.value ? "finished" : "loading";
  } catch (e) {
    console.error("获取安全检查列表失败", e);
    queryParams.value.pageNo =
      queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1;
    loadMoreState.value = "error";
  }
}

/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === "finished" || loadMoreState.value === "error") {
    return;
  }
  queryParams.value.pageNo++;
  getList();
}

/** 删除操作 */
function handleDelete(item: any, index: number) {
  message
    .confirm({
      title: "提示",
      msg: `确定删除检查编号为 ${item.code} 的记录？`
    })
    .then(async ({ action }) => {
      if (action === "confirm") {
        try {
          await InspectionApi.delete(item.id);
          list.value.splice(index, 1);
          total.value--; // 更新总数
          // 如果删除后列表变空或不满一页，尝试重新加载以确保页面数据完整性
          if (list.value.length === 0 && total.value > 0) {
            handleSearch();
          } else if (
            list.value.length < queryParams.value.pageSize &&
            total.value > list.value.length
          ) {
            loadMore();
          }
        } catch (error) {
          console.error("删除失败", error);
        }
      }
    });
}

/** 路由跳转 (新增/编辑/详情) */
function routerTo(type: string, item?: any) {
  let url = `/pages/pms/safety/safeInspection/inspection/dataForm?type=${type}`;
  if (item?.id) {
    url += `&id=${item.id}`;
  }
  uni.navigateTo({ url });
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore();
});

/** 初始化/刷新列表 */
function reset() {
  list.value = [];
  queryParams.value.pageNo = 1;

  // 重置筛选条件
  queryParams.value.inspectionOrg = "";
  queryParams.value.inspectionType = "";
  queryParams.value.inspectionResult = "";
  queryParams.value.dateRange = [];
  queryParams.value.inspectionDateStart = "";
  queryParams.value.inspectionDateEnd = "";
  treeSelectedOrgName.value = "检查工区"; // 重置显示文本

  getList();
}

/** 页面生命周期挂载 */
onShow(() => {
  reset();
});

// PC端 treeProps 数据，在移动端需要转换为 picker 列
const treeProps = computed(() => ({
  treeData: [
    {
      id: "",
      name: "安全检查结构",
      children: getStrDictOptions(DICT_TYPE.SAFE_QUALITY_ORG).map((item) => ({
        id: item.value,
        name: `${item.label}`
      }))
    }
  ],
  isSelectFirst: true // 这在移动端可能不需要完全模拟，但数据结构保留
}));

onMounted(async () => {
  // 如果需要默认选中第一个工区，可以在这里设置
  if (
    treeProps.value.isSelectFirst &&
    getOrgPickerColumns().length > 0 &&
    !queryParams.value.inspectionOrg
  ) {
    const firstOrg = getOrgPickerColumns()[0];
    queryParams.value.inspectionOrg = firstOrg.value;
    treeSelectedOrgName.value = firstOrg.label;
  }
  // 初始加载列表已在 onShow 中
});
</script>

<style lang="scss" scoped></style>
