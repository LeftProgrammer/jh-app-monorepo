<template>
  <wd-upload
    v-bind="restProps"
    :action="uploadAction"
    v-model:file-list="resolvedFileList"
    :before-preview="beforePreview"
    @change="handleUploadChange"
    @remove="emit('remove', $event)"
    @success="emit('success', $event)"
    @fail="emit('fail', $event)"
    @progress="emit('progress', $event)"
    @oversize="emit('oversize', $event)"
    @chooseerror="emit('chooseerror', $event)"
    @update:file-list="emit('update:fileList', $event)"
  />
</template>

<script setup lang="ts">
import { getFileByIds, getFileStream } from '@/api/infra/file'
import {
  type UploadFileItem,
  type UploadErrorEvent,
  type UploadChangeEvent,
  type UploadSuccessEvent,
  type UploadProgressEvent,
  type UploadOversizeEvent,
  type UploadRemoveEvent
} from 'wot-design-uni/components/wd-upload/types'

import { useAttrs, computed, ref, watch } from 'vue'
import { isImageUrl, isVideoUrl } from 'wot-design-uni/components/common/util'
const { VITE_SERVER_BASEURL } = import.meta.env;

// ====== Props & Emits ======
const props = defineProps<{
  fileId?: string | number | (string | number)[]
  action?: string
}>()
// 设置默认值
const uploadAction = computed(() => props.action ?? '/infra/file/upload-file')

const emit = defineEmits<{
  (e: 'update:fileId', value: (string | number | UploadFileItem)[]): void
  (e: 'fail', value: UploadErrorEvent): void
  (e: 'change', value: UploadChangeEvent): void
  (e: 'success', value: UploadSuccessEvent): void
  (e: 'progress', value: UploadProgressEvent): void
  (e: 'oversize', value: UploadOversizeEvent): void
  (e: 'chooseerror', value: any): void
  (e: 'remove', value: UploadRemoveEvent): void
  (e: 'update:fileList', value: UploadFileItem[]): void
}>()

// ====== 属性透传（排除 fileList 和事件）======
const attrs = useAttrs()

// 从 restProps 中排除 action，避免重复绑定
const restProps = computed(() => {
  const { fileList, 'file-list': _, action, ...rest } = attrs
  return rest
})

// ====== 文件列表解析 ======
const resolvedFileList = ref<UploadFileItem[]>([])

// ====== 文件上传Change事件 ======
function handleUploadChange(e: UploadChangeEvent) {
  const { fileList } = e

  // 标准化：确保每个文件有 id（从 response 解析）
  const standardizedList = fileList.map((file) => {
    let id: number | string | undefined

    if (typeof file.response === 'string') {
      try {
        const res = JSON.parse(file.response)
        id = res?.data?.id
      } catch {}
    } else if (file.response?.data?.id) {
      id = file.response.data.id
    }

    return {
      ...file,
      id, // 注入 id
      uid: file.uid ?? id ?? String(Math.random()),
      name: file.name || 'unknown',
      url: file.url || '',
      status: file.status || 'success'
    }
  })

  const ids = standardizedList.map((f) => f.id).filter(Boolean)

  // 向外 emit update:fileId
  // 只传递 id 列表（简洁） or 整个对象列表（保留完整信息）
  emit('update:fileId', props.returnObject ? standardizedList : ids.join(','))

  // 同时也 emit 原始 change 事件（兼容性）
  emit('change', e)
}

watch(
  () => props.fileId,
  async (newIds) => {
    console.log('watch props.fileId', newIds)
    if (!newIds && newIds !== 0) {
      resolvedFileList.value = []
      return
    }

    try {
      // ====== 情况 1: 是对象数组（即 UploadFileItem[]）======
      if (Array.isArray(newIds) && newIds.length > 0) {
        const firstItem = newIds[0]

        // 判断是否为文件对象（有 id 或 response）
        if (
          typeof firstItem === 'object' &&
          firstItem !== null &&
          ('id' in firstItem || 'response' in firstItem)
        ) {
          // 直接格式化为标准 UploadFileItem[]
          resolvedFileList.value = newIds.map((file) => {
            let fileId: string | number | undefined

            // 优先使用顶层 id（你示例中已有）
            if (typeof file.id !== 'undefined') {
              fileId = file.id
            }
            // 其次尝试从 response 解析
            else if (typeof file.response === 'string') {
              try {
                const res = JSON.parse(file.response)
                fileId = res?.data?.id
              } catch (e) {
                // ignore parse error
              }
            } else if (file.response?.data?.id) {
              fileId = file.response.data.id
            }

            return {
              ...file,
              uid: file.uid ?? fileId ?? String(Math.random()), // 必须有 uid
              name: file.name || 'unknown',
              url: file.url || '',
              status: file.status || 'success'
            }
          })
          return // ⚠️ 重要：不再继续执行下面的 getFileByIds
        }
      }

      // ====== 情况 2: 是普通 ID（string/number/array）======
      let idList: string[] = []

      if (typeof newIds === 'number') {
        idList = [String(newIds)]
      } else if (typeof newIds === 'string') {
        idList = newIds
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
      } else if (Array.isArray(newIds)) {
        idList = newIds.map((id) => String(id).trim()).filter(Boolean)
      } else {
        resolvedFileList.value = []
        return
      }

      if (idList.length === 0) {
        resolvedFileList.value = []
        return
      }

      const files = await getFileByIds(idList.join(','))
      resolvedFileList.value = files.map((file) => ({
        ...file,
        url: file.url || '',
        name: file.name || 'unknown',
        status: 'success',
        uid: file.id ?? String(Math.random()) // 确保 uid 存在且唯一
      }))
    } catch (err) {
      console.error('Failed to load files by IDs:', newIds, err)
      resolvedFileList.value = []
      uni.showToast({ title: '文件列表加载失败', icon: 'none' })
    }
  },
  { immediate: true }
)

// ====== beforePreview 逻辑 ======
const downloadCache = new Map<string, string>()

const beforePreview = async ({
  file,
  resolve
}: {
  file: UploadFileItem
  resolve: (isPass: boolean) => void
}) => {
  if (isImage(file) || isVideo(file)) {
    resolve(true)
    return
  }
  const url = file?.url
  if (typeof url === 'string' && /^https?:\/\//.test(url)) {
    const cacheKey = String(file.id ?? url)

    if (downloadCache.has(cacheKey)) {
      resolveWithOpen(downloadCache.get(cacheKey)!)
      resolve(false)
      return
    }
    uni.downloadFile({
      url:`${VITE_SERVER_BASEURL}/infra/file/${file.configId}/get/${file.path}`,
      success: (res) => {
        if (res.statusCode === 200 && res.tempFilePath) {
          downloadCache.set(cacheKey, res.tempFilePath)
          resolveWithOpen(res.tempFilePath)
          resolve(false)
        } else {
          console.warn('Download failed with status:', res, res.statusCode)
          resolve(false)
        }
      },
      fail: (err) => {
        console.error('Download file failed:', err)
        resolve(false)
      }
    })
  } else {
    resolve(true)
  }
}
function getShortFileName(url, ext = '.jpg') {
  // 简单的哈希函数示例（生产环境建议使用成熟的 md5 库）
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i)
    hash |= 0 // 转换为32位整数
  }
  // 取哈希值的绝对值并截取一部分，确保文件名简短
  return Math.abs(hash).toString(36) + ext
}
function isVideo(file: UploadFileItem) {
  return (file.name && isVideoUrl(file.name)) || isVideoUrl(file.url)
}

function isImage(file: UploadFileItem) {
  return (file.name && isImageUrl(file.name)) || isImageUrl(file.url)
}

function resolveWithOpen(tempPath: string) {
  uni.openDocument({
    filePath: tempPath,
    fail: (err) => {
      let errMsg = '无法打开文件'
      if (err.errMsg.includes('not found 3th activity')) {
        errMsg = '未安装可打开此文件的应用'
      } else if (err.errMsg.includes('file not found')) {
        errMsg = '文件已失效，请重新操作'
      }
      uni.showToast({ title: errMsg, icon: 'none' })
    }
  })
}
</script>
