<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#F5F5F5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="会议预约"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="clickLeft"
    />
    <!-- 详情内容 -->
    <wd-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :class="type !== 'detail' && type !== 'todo' ? 'pb-70px' : 'pb-0px'"
    >
      <wd-cell-group border title="基本信息" class="mb-16rpx">
        <wd-cell
          title="会议室"
          required
          is-link
          :value="formData.meetingRoomName"
          @click="selectRoom"
        />
        <!-- <wd-picker
          v-model="formData.meetingRoomId"
          :columns="roomList"
          label="会议室"
          label-width="200rpx"
          :readonly="disabled || isApproved"
          align-right
          value-key="id"
          label-key="name"
          prop="meetingRoomId"
          placeholder="请选择会议室"
          @confirm="meetingRoomHandleConfirm"
        /> -->
        <wd-input
          v-model="formData.meetingRoomNum"
          label="可容纳人数"
          readonly
          label-width="200rpx"
          align-right
          type="text"
          prop="meetingRoomNum"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.projector"
          label="是否有投影仪"
          readonly
          label-width="200rpx"
          align-right
          type="text"
          prop="projector"
          placeholder="自动带出"
        />
        <wd-datetime-picker
          v-model="formData.meetDate"
          label="会议日期"
          type="date"
          align-right
          readonly
          label-width="200rpx"
          :min-date="new Date().getTime()"
          prop="meetDate"
          placeholder="请选择会议日期"
        />
        <wd-datetime-picker
          v-model="formData.meetTime"
          label="会议时间"
          align-right
          readonly
          type="time"
          :default-value="['08:00', '08:00']"
          :min-hour="8"
          :max-hour="20"
          :filter="meetTimeFilter"
          label-width="200rpx"
          prop="meetTime"
        />
        <UserPicker
          v-model="formData.personCharge"
          label="主持人"
          label-width="100px"
          prop="personCharge"
          :readonly="disabled || isApproved"
          align-right
          @confirm="personChargeConfirm"
        />
        <wd-input
          v-model="formData.personChargePhone"
          label="主持人电话"
          readonly
          label-width="200rpx"
          align-right
          type="text"
          prop="personChargePhone"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.personChargeUnitName"
          label="主持人部门"
          readonly
          align-right
          label-width="150rpx"
          type="text"
          prop="personChargeUnitName"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.name"
          label="会议名称"
          :readonly="disabled || isApproved"
          align-right
          type="text"
          label-width="200rpx"
          prop="name"
          placeholder="请输入会议名称"
        />

        <wd-input
          v-model="formData.createName"
          label="使用人"
          align-right
          label-width="200rpx"
          readonly
          type="text"
          prop="createName"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.phone"
          align-right
          label="联系电话"
          label-width="200rpx"
          type="text"
          readonly
          prop="phone"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.sysOrgCodeName"
          label="组织单位"
          align-right
          readonly
          label-width="140rpx"
          type="text"
          prop="sysOrgCodeName"
          placeholder="自动带出"
        />

        <wd-cell title="参会人数" title-width="100px" prop="planNum">
          <wd-input-number
            v-model="formData.planNum"
            align-right
            :disabled="disabled || isApproved"
            label-width="200rpx"
            :min="0"
            type="text"
            prop="planNum"
            placeholder="请输入"
          />
        </wd-cell>
        <wd-cell title="是否有领导" title-width="100px" prop="haveLeader">
          <wd-switch
            v-model="formData.haveLeader"
            :inactive-value="0"
            :active-value="1"
            :disabled="disabled || isApproved"
          />
        </wd-cell>
        <UserPicker
          v-if="formData.haveLeader === 1"
          v-model="formData.leader"
          prop="leader"
          label="参会领导"
          label-width="100px"
          :readonly="disabled || isApproved"
          type="checkbox"
        />
        <wd-textarea
          v-model="formData.remark"
          label="备注"
          :readonly="disabled || isApproved"
          prop="remark"
          placeholder="请输入备注"
          auto-height
          :maxlength="200"
          show-word-limit
        />

        <wd-cell
          v-if="formData.status === 2"
          title="会议照片"
          title-width="100px"
          prop="picture"
        >
          <file-upload v-model:file-id="formData.picture" :disabled="disabled" />
        </wd-cell>
        <wd-cell
          v-if="formData.status === 2"
          title="会议纪要"
          title-width="100px"
          prop="accessoryFile"
        >
          <file-upload v-model:file-id="formData.accessoryFile" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>
      <view class="mb-16rpx bg-#fff p-16rpx">
        <view class="flex justify-between items-center">
          <view>参会人员</view>
          <UserPicker
            v-if="!disabled && !isApproved"
            ref="personRef"
            :use-default-slot="true"
            :model-value="personRecords.map((x) => x.userId).join(',')"
            type="checkbox"
            @confirm="personConfirm"
          >
            <wd-button icon="add-circle" type="text">添加</wd-button>
          </UserPicker>
        </view>
        <div
          v-for="(item, index) in personRecords"
          :key="item.id"
          class="flex text-#4E5969 px-16px py-8rpx bg-#F2F3F5 mb-16rpx justify-between items-center"
        >
          <view class="w-200rpx">
            {{ item.nickname }}
          </view>
          <view class="w-100rpx">
            {{ getDictLabel(DICT_TYPE.SYSTEM_USER_SEX, item.sex) }}
          </view>
          <view>{{ item.mobile }}</view>
          <wd-icon
            v-if="!disabled && !isApproved"
            name="delete"
            size="22px"
            color="#F53F3F"
            @click="delUser(index)"
          />
        </div>
      </view>
      <wd-cell-group border title="审批信息">
        <UserPicker
          v-model="formData.user1"
          label="物业管理审批"
          label-width="100px"
          prop="user1"
          align-right
          :readonly="disabled || isApproved"
        />
      </wd-cell-group>
    </wd-form>
    <view
      v-if="!embedded && !disabled"
      class="!position-fixed bg-#fff bottom-0px left-0px right-0px flex py-24rpx justify-around"
    >
      <wd-button plain :round="false" @click="handleSubmit(-1)" v-if="!isApproved">
        暂存
      </wd-button>
      <wd-button :round="false" @click="handleSubmit(1)">提交</wd-button>
    </view>
  </view>
  <wd-popup
    v-model="showPopup"
    position="bottom"
    :custom-style="`height:calc(100vh - ${getNavbarHeight()}px)`"
  >
    <view class="flex flex-col h-100%">
      <view class="flex" style="border-botom: 1px solid #e5e6eb">
        <wd-picker
          v-model="formData.meetingRoomId"
          class="w-50%"
          :columns="roomList"
          :readonly="disabled || isApproved"
          label-width="200rpx"
          value-key="id"
          placeholder="请选择会议室"
          label-key="name"
          prop="meetingRoomId"
          @confirm="meetingRoomHandleConfirm"
        />
        <wd-datetime-picker
          v-model="formData.meetDate"
          :readonly="disabled || isApproved"
          class="w-50%"
          type="date"
          align-right
          label-width="200rpx"
          placeholder="请选择会议日期"
          :min-date="new Date().getTime()"
          prop="meetDate"
        />
      </view>
      <view class="timeBox flex-1 py-50rpx pl-120rpx overflow-auto">
        <view
          v-for="item in 24"
          :key="item"
          class="h-63rpx position-relative"
          :style="{
            backgroundColor:
              selectHours.indexOf(item) !== -1
                ? stateColor(1)
                : stateColor(hourState(item))
          }"
          @click="hourClick(item)"
        >
          <!-- {{ item }} -->
          <text
            v-if="item % 2 !== 0"
            class="position-absolute text-#4E5969 text-27rpx top-0% left-0 translate-y--50% translate-x--120%"
          >
            {{ String((item - 1) * 0.5 + 8).padStart(2, "0") }}:00
          </text>
        </view>
      </view>
      <view
        class="flex justify-between items-center p-16rpx"
        style="border-top: 1px solid #e5e6eb"
      >
        <text class="text-#4E5969 text-27rpx"> 会议时间：{{ selectTimeText }} </text>
        <wd-button size="small" @click="checkTime">预约</wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { useToast } from "wot-design-uni";
import SubscribeApi from "@/api/general/meeting";
import { navigateBackPlus, deepClone } from "@/utils";
import UserPicker from "@/components/system-select/user-picker.vue";
import { formatDate } from "@/utils/date";
import { useUserStore } from "@/store";
import { getDictLabel } from "@/hooks/useDict";
import { DICT_TYPE } from "@/utils/constants";
import { useGlobalState } from "@/store/global";
import { getNavbarHeight } from "@/utils";
import dayjs from "dayjs";

const props = defineProps<{
  id?: number | string;
  embedded?: boolean; // 是否作为嵌入组件使用（非路由访问）
  type?: string; //类型 create新增 update 修改 detail查看
  todoTask?: any; //当前办理人
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});
const disabled = computed(() => {
  return props.type === "detail" || props.embedded;
});
const globalState = useGlobalState();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});
const formRef = ref();
const toast = useToast();
const formData: any = ref({});
const isApproved: any = computed(() => formData.value.status === 2);
const formRules = {
  meetingRoomId: [{ required: true, message: "请选择" }],
  meetDate: [{ required: true, message: "请选择" }],
  meetTime: [{ required: true, message: "请选择" }],
  name: [{ required: true, message: "请输入" }],
  leader: [{ required: true, message: "请选择" }],
  user1: [{ required: true, message: "请选择" }]
};
const roomList = ref([]);
const personRecords = ref([]);
const reservationTime = ref([]);

const banList = ref({ ing: [], done: [] });
const dateToIndex = computed(() => {
  return (date) => {
    const minutesOfNow = dayjs(date).minute();
    const hourNow = dayjs(date).hour();
    return (hourNow - 8) * 2 + 1 + (minutesOfNow >= 30 ? 1 : 0);
  };
});
const hourState = computed(() => {
  return (item: any) => {
    const nowTime = dateToIndex.value(new Date());
    const meetDate = formatDate(formData.value.meetDate, "YYYYMMDD");
    const toDay = formatDate(new Date(), "YYYYMMDD");
    if (!meetDate) return 0;
    if (meetDate > toDay) {
      // 会议日期大于今天，判断已预订会议即可
      if (banList.value.done.indexOf(item) != -1) return 2;
      else if (banList.value.ing.indexOf(item) != -1) return 1;
      else return 0;
    } else {
      if (item <= nowTime) {
        if (banList.value.done.indexOf(item) != -1) return 2;
        else if (banList.value.ing.indexOf(item) != -1) return 3;
        else return 3;
      } else {
        if (banList.value.done.indexOf(item) != -1) return 2;
        else if (banList.value.ing.indexOf(item) != -1) return 1;
        else return 0;
      }
    }
  };
});
const stateColor = computed(() => {
  return (state) => {
    switch (state) {
      case 0:
        return "#fff"; //空闲
      case 1:
        return "#93BE93"; //占用中(正在审批中的会议)
      case 2:
        return "#F2F3F5"; //锁定（审批已通过、或者已经开过的会议）
      case 3:
        return "#C9CDD4"; //已过期/已停用/未开放（过期时间）
      default:
        return "#FFFFFF";
    }
  };
});
watch(
  formData,
  (val) => {
    if (val.meetingRoomId && val.meetDate) {
      banList.value = { ing: [], done: [] };
      startIndex.value = 0;
      endIndex.value = 0;
      getRoomTime();
    } else {
      banList.value = { ing: [], done: [] };
    }
  },
  { deep: true }
);
const showPopup = ref(false);
function selectRoom() {
  if (disabled.value) return;
  if (formData.value.meetTime && formData.value.meetTime.length > 0) {
    const start = formData.value.meetTime[0];
    const end = formData.value.meetTime[1];
    startIndex.value =
      (start.split(":")[0] - 8) * 2 + (start.split(":")[1] == "00" ? 1 : 0);
    endIndex.value = (end.split(":")[0] - 8) * 2 + (end.split(":")[1] == "00" ? 0 : 1);
  }
  showPopup.value = true;
}
/**
 * @description 获取当前会议室已预订时间
 */
async function getRoomTime() {
  const reservationTime: any = await SubscribeApi.reservationStatus({
    meetingRoomId: formData.value.meetingRoomId,
    startQueryTime: formatDate(new Date())
  });
  reservationTime
    .map((x) => {
      return {
        ...x,
        startTime: formatDate(x.startTime, "YYYY-MM-DD HH:mm:ss"),
        endTime: formatDate(x.endTime, "YYYY-MM-DD HH:mm:ss")
      };
    })
    .filter(
      (x: any) =>
        x.startTime.includes(formatDate(formData.value.meetDate)) && x.status !== 4
    )
    .forEach((x: any) => {
      const start = dateToIndex.value(x.startTime);
      const end = dateToIndex.value(x.endTime);
      for (let i = start; i < end; i++) {
        if (x.status === 2) banList.value.done.push(i);
        else banList.value.ing.push(i);
      }
    });
}
const startIndex = ref(0);
const endIndex = ref(0);
const selectHours = computed(() => {
  if (startIndex.value && endIndex.value) {
    let hours = [];
    for (let i = startIndex.value; i <= endIndex.value; i++) {
      hours.push(i);
    }
    return hours;
  } else {
    return [];
  }
});
const selectTimeText = computed(() => {
  if (!startIndex.value || !endIndex.value) return "";
  return `${Math.floor(((startIndex.value - 1) * 30) / 60 + 8)}:${
    startIndex.value % 2 === 0 ? "30" : "00"
  }-${Math.floor((endIndex.value * 30) / 60 + 8)}:${
    endIndex.value % 2 === 0 ? "00" : "30"
  } ${Math.floor((endIndex.value - startIndex.value + 1) / 2)}小时${
    (endIndex.value - startIndex.value) % 2 === 0 ? "30" : "00"
  }分钟`;
});
function hourClick(item) {
  if (!formData.value.meetingRoomId || !formData.value.meetDate) {
    uni.showToast({ title: "请先选择会议室和日期", icon: "none" });
    return;
  }

  if (hourState.value(item) !== 0 || disabled.value || isApproved.value) return;
  if (!startIndex.value) {
    startIndex.value = item;
    endIndex.value = item;
  } else {
    if (item < startIndex.value) startIndex.value = item;
    else if (item > endIndex.value) endIndex.value = item;
    else {
      if (item === startIndex.value) endIndex.value = item;
      else if (item === endIndex.value) startIndex.value = item;
      else if (item - startIndex.value < endIndex.value - item) {
        startIndex.value = item;
      } else {
        endIndex.value = item;
      }
    }
  }
}

async function getRoomList() {
  const data: any = await SubscribeApi.getRoomPage({
    pageNo: 1,
    pageSize: 200,
    unitId: userInfo.value.department
  });
  roomList.value = data.list;
}
function meetingRoomHandleConfirm({ selectedItems }) {
  formData.value.meetingRoomName = selectedItems.name;
  formData.value.meetingRoomNum = selectedItems.num;
  formData.value.projector = selectedItems.projector === 1 ? "有" : "无";
}
function meetTimeFilter(type, values) {
  if (type === "minute") {
    return [0, 30];
  }
  return values;
}
function checkTime() {
  if (!startIndex.value || !endIndex.value) {
    uni.showToast({ title: "请选择时间", icon: "none" });
  }
  formData.value.meetTime = [
    `${Math.floor(((startIndex.value - 1) * 30) / 60 + 8)}:${
      startIndex.value % 2 === 0 ? "30" : "00"
    }`,
    `${Math.floor((endIndex.value * 30) / 60 + 8)}:${
      endIndex.value % 2 === 0 ? "00" : "30"
    }`
  ];
  showPopup.value = false;
  startIndex.value = 0;
  endIndex.value = 0;
}
async function personChargeConfirm(ids, users) {
  if (ids) {
    formData.value.personChargePhone = users[0].mobile;
    formData.value.personChargeUnitName = users[0].deptName;
  } else {
    formData.value.personChargePhone = "";
    formData.value.personChargeUnitName = "";
  }
}
function personConfirm(ids, users) {
  personRecords.value = users.map((x) => {
    return { ...x, userId: x.id, id: "" };
  });
}
function delUser(index) {
  personRecords.value.splice(index, 1);
}
/** 获取详情数据 */
async function getDetail() {
  try {
    toast.loading("加载中...");
    const data: any = await SubscribeApi.get(props.id);
    data.meetDate = new Date(data.startTime).getTime();
    data.meetTime = [
      formatDate(data.startTime, "HH:mm"),
      formatDate(data.endTime, "HH:mm")
    ];
    personRecords.value = data.subList;
    formData.value = data;
  } finally {
    toast.close();
  }
}

async function handleSubmit(status) {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  const data = deepClone(formData.value);
  if (data.picture) data.picture = data.picture?.map((x) => x.id).join(",");
  if (data.accessoryFile)
    data.accessoryFile = data.accessoryFile?.map((x) => x.id).join(",");
  data.status = isApproved.value ? null : status;
  data.startTime = `${formatDate(data.meetDate)} ${data.meetTime[0]}:00`;
  data.endTime = `${formatDate(data.meetDate)} ${data.meetTime[1]}:00`;
  data.subList = personRecords.value;
  const api = !data.id ? SubscribeApi.create : SubscribeApi.update;
  api(data).then(() => {
    uni.showToast({ title: "提交成功", icon: "success" });
    globalState.fetchGlobalInfo();
    if (!props.embedded) navigateBackPlus();
  });
}

defineExpose({ formRef, handleSubmit });
function clickLeft() {
  if (showPopup.value) showPopup.value = false;
  else navigateBackPlus();
}
/** 初始化 */
onMounted(() => {
  getRoomList();
  if (!props.id) {
    formData.value = {
      createName: userInfo.value.nickname,
      phone: userInfo.value.phone,
      applyDate: formatDate(new Date()),
      sysOrgCodeName: userInfo.value.departmentName,
      unitId: userInfo.value.department,
      meetTime: []
    };
  } else {
    getDetail();
  }
});
</script>

<style lang="scss" scoped>
.timeBox {
  view {
    &:nth-child(odd) {
      border-top: 1px solid #dfdfdf;
    }
    &:nth-child(even) {
      border-top: 1px dashed #dfdfdf;
    }
    &:last-child {
      border-bottom: 1px solid #dfdfdf;
    }
  }
}
</style>
