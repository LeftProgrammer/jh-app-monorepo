import type { PageParam, PageResult } from "@/http";
import { http } from "@/http"

/** 请假申请信息 */
export interface Subscribe {
  name: string; // 会议名称
  applyTime: string; // 申请时间
  planNum: number; // 预计人数
  meetingRoomName: string; // 会议室名称
  meetingRoomId: string; // 会议室ID
  meetingRoomNum: number; // 可容纳人数
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  pattern: string; // 模式
  haveLeader: number; // 是否有领导
  leader: string; // 参会领导
  specialService: string; // 特约服务
  remark: string; // 会务备注
  phone: string; // 申请人电话
  createName: string; // 申请人
  bpmStatus: string; // 审批状态
  user1: number; // 审批节点1
  user2: number; // 审批节点2
  sysOrgCodeName: string; // 申请人部门名称
  orgCode: string; // 部门编码
  picture: string; // 图片
  accessoryFile: string; // 附件
  personChargePhone: string; // 主持人电话
  personChargeUnitName: string; // 主持人部门
  personCharge: string; // 主持人
}

// 请假管理 API
export default {
  // 查询会议室分页
  getRoomPage: (params: any) => {
    return http.get(`/meeting/room/page`, params);
  },
  // 获取指定日期所有会议室的预约记录
  roomList: (params: any) => {
    return http.get(`/meeting/subscribe/roomList`, params);
  },
  // 获取会议室当天已被预约时间
  reservationStatus: (params: any) => {
    return http.get(`/meeting/subscribe/reservationStatus`, params);
  },

  // 查询会议室预约分页
  getPage: (params: PageParam) => {
    return http.get(`/meeting/subscribe/page`, params);
  },

  // 查询会议室预约详情
  get: (id: number) => {
    return http.get(`/meeting/subscribe/get?id=${id}`);
  },

  // 新增会议室预约
  create: (data: Subscribe) => {
    return http.post(`/meeting/subscribe/create`, data);
  },

  // 修改会议室预约
  update: (data: Subscribe) => {
    return http.put(`/meeting/subscribe/update`, data);
  },

  // 删除会议室预约
  delete: (id: number) => {
    return http.delete(`/meeting/subscribe/delete?id=${id}`);
  },
};
