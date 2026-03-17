/** ========== COMMON - 通用模块 ========== */
const COMMON_DICT = {
  USER_TYPE: 'user_type',
  COMMON_STATUS: 'common_status',
  TERMINAL: 'terminal', // 终端
  DATE_INTERVAL: 'date_interval', // 数据间隔
} as const

/** ========== SYSTEM - 系统模块 ========== */
const SYSTEM_DICT = {
  SYSTEM_USER_SEX: 'system_user_sex',
  SYSTEM_MENU_TYPE: 'system_menu_type',
  SYSTEM_ROLE_TYPE: 'system_role_type',
  SYSTEM_DATA_SCOPE: 'system_data_scope',
  SYSTEM_NOTICE_TYPE: 'system_notice_type',
  SYSTEM_LOGIN_TYPE: 'system_login_type',
  SYSTEM_LOGIN_RESULT: 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE: 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE: 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS: 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS: 'system_sms_receive_status',
  SYSTEM_OAUTH2_GRANT_TYPE: 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS: 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE: 'system_notify_template_type',
  SYSTEM_SOCIAL_TYPE: 'system_social_type',
  SYSTEM_DICT_COLOR_TYPE: 'system_dict_color_type', // 字典颜色类型
} as const

/** ========== INFRA - 基础设施模块 ========== */
const INFRA_DICT = {
  INFRA_BOOLEAN_STRING: 'infra_boolean_string',
  INFRA_JOB_STATUS: 'infra_job_status',
  INFRA_JOB_LOG_STATUS: 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS: 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE: 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE: 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE: 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE: 'infra_codegen_scene',
  INFRA_FILE_STORAGE: 'infra_file_storage',
  INFRA_OPERATE_TYPE: 'infra_operate_type',
  APP_UPDATE: 'app_update',
} as const

/** ========== BPM - 工作流模块 ========== */
const BPM_DICT = {
  BPM_MODEL_FORM_TYPE: 'bpm_model_form_type', // BPM 模型表单类型
  BPM_MODEL_TYPE: 'bpm_model_type', // BPM 模型类型
  BPM_OA_LEAVE_TYPE: 'bpm_oa_leave_type', // BPM OA 请假类型
  BPM_PROCESS_INSTANCE_STATUS: 'bpm_process_instance_status', // BPM 流程实例状态
  BPM_PROCESS_LISTENER_TYPE: 'bpm_process_listener_type', // BPM 流程监听器类型
  BPM_PROCESS_LISTENER_VALUE_TYPE: 'bpm_process_listener_value_type', // BPM 流程监听器值类型
  BPM_TASK_CANDIDATE_STRATEGY: 'bpm_task_candidate_strategy', // BPM 任务候选人策略
  BPM_TASK_STATUS: 'bpm_task_status', // BPM 任务状态
  APPROVE_REASON: 'approve_reason',
} as const

// ========== 人员管理 模块 ==========
const PERSON_DICT = {
  PERSON_PERSONTYPE: 'person_type', // 人员管理_人员进退场_人员类型
  PERSON_JOB: 'job', // 人员管理_人员进退场_岗位类型
  PERSON_EQ_CODE: 'person_eq_code', // 人员管理_人员进退场_设备编号
  PERSON_SAFE_EDUCATION: 'safe_education', // 人员管理_人员进退场_安全教育状态
}

// ========== PMS 模块 ==========
const PMS_DICT = {
  LHT_SEND_DOCUMENT_TYPE: 'lht_send_document_type',
  YZ_SEND_DOCUMENT_TYPE: 'yz_send_document_type',
  UNIT_TYPE: 'unit_type',
  PROJECT_NEWS_TYPE: 'projectNewsType',
  HONOR_TYPE: 'honor_type',
  WORK_AREA_DIRECTORY: 'work_area_directory',
  BIG_EVENT_TYPE: 'big_event_type',
  JL_SEND_DOCUMENT_TYPE: 'jl_send_document_type',
  SG_SEND_DOCUMENT_TYPE: 'sg_send_document_type',
  SJ_SEND_DOCUMENT_TYPE: 'sj_send_document_type',
  SHEJI_SEND_DOCUMENT_TYPE: 'sheji_send_document_type',
  DOCUMENT_TYPE: 'document_type',
  RECEIVED_TYPE: 'received_type',
} as const

// ========== 综合管理 模块 ==========
const GENERAL_DICT = {
  PARTY_MEMBER_STATUS: 'party_status', // 党建与工会_党组织成员_状态
  COMPREHENSIVE_PARTY_ACTIVITIES_TYPE: 'party_type', // 党建与工会_党建活动_活动类型
  COMPREHENSIVE_TRAINING_MATERIALS_TYPE: 'training_type', // 内部培训_培训资料_活动类型
  COMPREHENSIVE_TRAINING_RECORD_TYPE: 'record_type', // 内部培训_培训记录_活动类型
  COMPREHENSIVE_ARCHIVING_TYPE: 'archiving_type', // 综合管理_档案管理_类型
  SEAL_TYPE: 'seal_type', // 用印类型
  SEAL_CATEGORY: 'seal_category', // 用印类别
  LEAVE_TYPE: 'leave_type', // 综合管理_请假_类型
  POSITION_TYPE: 'position_type', // 综合管理_岗位_类型
  FLOOR_TYPE: 'floor_type', // 入住管理_楼层_类型
  CHECK_IN_TYPE: 'check_in_type',
  MEETING_STATUS: 'meeting_status', // 综合管理_岗位_类型
} as const
// ========== 设计管理 模块 ==========
const DESIGN_DICT = {
  DESIGN_PLAN_PROFESSION: 'design_plan_profession', // 供图计划_专业
  DESIGN_PLAN_RELATE_STATE: 'design_plan_relate_state', // 供图计划_关联状态
  DESIGN_PLAN_PLAN_STATE: 'design_plan_plan_state', // 供图计划_供图状态
  DESIGN_APPROVAL_FILE_TYPE: 'design_approval_file_type', // 供图计划_供图状态
  DESIGN_APPROVAL_FILE_LEVEL: 'design_approval_file_level', // 设计文件报审_文件级别
  DESIGN_APPROVAL_VERSION: 'design_approval_version', // 设计文件报审_版本
} as const

// ========== 质量管理 模块 ==========
const QUALITY_DICT = {
  QUALITY_INSPECTION_RECORDS_INSPECTIONTYPE:
    'quality_inspection_records_inspectionType', // 质量检查_检查类型
  QUALITY_INSPECTION_RECORDS_INSPECTIONRESULT:
    'quality_inspection_records_inspectionResult', // 质量检查_检查结果
  QUALITY_CATALOGUE_TREE_QBSLAYER: 'quality_catalogue_tree_qbsLayer', // 项目划分_层级
} as const

// ========== 车辆管理 模块 ==========
const CAR_DICT = {
  VEHICLE_COLOR: 'vehicle_color', // 车辆颜色
  VEHICLE_TYPE: 'vehicle_type', // 车辆类型
  PLATE_COLOR: 'plate_color', // 车牌颜色
  PLATE_TYPE: 'plate_type', // 车牌类型
} as const

// ========== 安全管理 模块 ==========
const SAFETY_DICT = {
  INSPECTION_TYPE: 'inspection_type',
  DANGER_LEVEL: 'danger_level',
  SAFE_QUALITY_ORG: 'safe_quality_org',
  INSPECTION_RESULT: 'inspection_result',
} as const

/** 字典类型枚举 - 统一导出 */
export const DICT_TYPE = {
  ...BPM_DICT,
  ...INFRA_DICT,
  ...SYSTEM_DICT,
  ...COMMON_DICT,
  ...PERSON_DICT,
  ...DESIGN_DICT,
  ...GENERAL_DICT,
  ...QUALITY_DICT,
  ...CAR_DICT,
  ...PMS_DICT,
  ...SAFETY_DICT,
} as const
