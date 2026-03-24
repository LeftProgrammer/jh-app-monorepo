/**
 * APP 更新模块
 *
 * @description 提供 APP 版本检查和更新功能，通过字典表获取版本信息
 * @usage 仅在 APP 端使用
 */
import { getStaticBaseUrl } from '../config'
import { useDictStore } from '../store/dict'
import { DICT_TYPE } from './constants'

/**
 * 计算文件大小显示
 * @param size 文件大小（字节）
 */
function calculateFileSize(size: number): string {
  if (size < 1024) {
    return `${size}B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`
  } else {
    return `${(size / 1024 / 1024).toFixed(2)}MB`
  }
}

/**
 * APP 更新检查和下载
 *
 * @description 从字典表获取版本信息，检查是否需要更新，如需更新则下载并安装
 * @param staticBaseUrl 静态资源基础地址，默认从框架配置获取
 *
 * @example
 * // 在 App.vue 的 onLaunch 中调用
 * import appUpdate from '@/utils/appUpdate'
 * appUpdate()
 */
export default function appUpdate(staticBaseUrl?: string) {
  // #ifndef APP-PLUS
  // 非 App 端直接返回，不执行更新检查
  console.log('[appUpdate] 非 App 端，跳过更新检查')
  return
  // #endif

  // #ifdef APP-PLUS
  const baseUrl = staticBaseUrl || getStaticBaseUrl()

  const dictStore = useDictStore()
  const APP_UPDATE = dictStore.getDictOptions(DICT_TYPE.APP_UPDATE)

  const androidVersion = APP_UPDATE.find(x => x.label === 'version')?.value
  const appName = APP_UPDATE.find(x => x.label === 'name')?.value
  const apkSize = APP_UPDATE.find(x => x.label === 'size')?.value
  const appMsg = APP_UPDATE.find(x => x.label === 'msg')?.value

  // 版本信息不完整，跳过更新检查
  if (!androidVersion || !appName) {
    console.warn('[appUpdate] 字典表中缺少版本信息')
    return
  }

  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    const client_version = wgtinfo.version
    const flag_update = client_version < androidVersion

    if (flag_update) {
      console.log('[appUpdate] 需要更新')
    } else {
      console.log('[appUpdate] 不需要更新')
      return
    }

    uni.showModal({
      title: '更新提示',
      content: `当前版本：V${client_version}\n最新版本：V${androidVersion}\n内容：${appMsg}`,
      confirmText: '立即更新',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          plus.nativeUI.toast('正在准备环境，请稍后!')
          const url = `${baseUrl}/static/app/${appName}.apk`
          const dtask = plus.downloader.createDownload(
            url,
            {
              method: 'GET',
              filename: '_doc/innovate/update/',
            },
            (d, status) => {
              if (status === 200) {
                const path = d.filename // 下载apk
                plus.runtime.install(path) // 自动安装apk文件
              } else {
                plus.nativeUI.alert(`版本更新失败:${status}`)
              }
            },
          )
          try {
            dtask.start() // 开启下载的任务
            const showLoading = plus.nativeUI.showWaiting('正在下载') // 创建一个showWaiting对象
            dtask.addEventListener('statechanged', (task) => {
              switch (task.state) {
                case 1:
                  showLoading.setTitle('正在下载')
                  break
                case 2:
                  showLoading.setTitle('已连接到服务器')
                  break
                case 3: {
                  let title = ''
                  if (apkSize) {
                    const prg = Math.floor((Number(task.downloadedSize) / Number(apkSize)) * 100)
                    title = `正在下载：${prg}%`
                  } else {
                    title = `已下载：${calculateFileSize(Number(task.downloadedSize))}`
                  }
                  showLoading.setTitle(title)
                  break
                }
                case 4:
                  plus.nativeUI.closeWaiting()
                  // 下载完成
                  break
              }
            })
          } catch (e) {
            plus.nativeUI.closeWaiting()
            uni.showToast({
              title: '更新失败',
              mask: false,
              duration: 1500,
            })
          }
        }
      },
    })
  })
  // #endif
}
