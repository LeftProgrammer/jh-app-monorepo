/**
 * PC 端业务表单路径 -> 移动端路径映射
 * - key: PC 端路径 (formCustomCreatePath / formCustomViewPath)
 * - value: 移动端路径
 * 原因是：目前暂时没有 mobile 端的自定义表单字段，所以暂时需要硬编码映射关系
 * 另外：需要在 src/pages-bpm/processInstance/detail/components/form-detail.vue 里，增加使用类似 LeaveDetail 的使用
 */
const PC_TO_MOBILE_PATH_MAP: Record<string, string> = {
  "/bpm/oa/leave/create": "/pages-bpm/oa/leave/create/index",
  "/bpm/oa/leave/detail": "/pages-bpm/oa/leave/detail/index",
  "/general/meeting/subscribe/SubscribeForm":
    "/pages/general/meeting/subscribe/SubscribeForm",
  "/general/leaveApply/dataForm": "/pages/general/leaveApply/dataForm",
  "/pms/document/consortium/posted/dataForm":
    "/pages/pms/document/consortium/posted/dataForm",
  "/pms/document/consortium/received/dataForm":
    "/pages/pms/document/consortium/received/dataForm",
  "/pms/document/supervision/posted/dataForm":
    "/pages/pms/document/supervision/posted/dataForm",
  "/pms/document/construction/posted/dataForm":
    "/pages/pms/document/construction/posted/dataForm",
  "/pms/document/owner/posted/dataForm":
    "/pages/pms/document/owner/posted/dataForm",
};

/**
 * 根据 PC 端路径获取移动端的跳转路径
 * @param pcPath PC 端的表单路径
 * @returns 移动端的跳转路径，如果没有映射则返回 undefined
 */
export function getMobileFormCustomPath(
  pcPath: string | undefined,
): string | undefined {
  console.log("🚀 ~ getMobileFormCustomPath ~ pcPath:", pcPath);
  if (!pcPath) {
    return undefined;
  }
  return PC_TO_MOBILE_PATH_MAP[pcPath];
}
