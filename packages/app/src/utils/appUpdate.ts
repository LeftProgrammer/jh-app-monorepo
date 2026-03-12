// APP更新
import type { CustomRequestOptions } from '../http/types'

/**
 * APP 版本信息接口
 */
export interface AppVersionInfo {
  version: string
  note: string
  fileSize?: number
}

/**
 * 获取最新版本信息
 * @param appId 应用ID
 * @param httpGet HTTP GET 请求函数，由调用方注入
 */
export async function getLatestVersion(
  appId: string,
  httpGet: <T>(url: string, config?: CustomRequestOptions) => Promise<T>,
): Promise<AppVersionInfo | null> {
  try {
    return await httpGet<AppVersionInfo>(`/infra/app-client-version/get-latest-version?appId=${appId}`)
  } catch (error) {
    console.error('获取最新版本失败:', error)
    return null
  }
}

/**
 * APP 更新检查和下载
 * @param appId 应用ID
 * @param httpGet HTTP GET 请求函数，由调用方注入
 * @param baseUrl 服务器基础地址，默认从环境变量获取
 */
export default async function appUpdate(
  appId: string,
  httpGet: <T>(url: string, config?: CustomRequestOptions) => Promise<T>,
  baseUrl?: string,
) {
  const serverBaseUrl = baseUrl || (import.meta as any).env?.VITE_SERVER_BASEURL || ''

  // 查询最新版本
  const latestVersion = await getLatestVersion(appId, httpGet)
  if (!latestVersion) {
    return
  }

  console.log('appUpdate', latestVersion)
  const androidVersion = latestVersion.version
  const appMsg = latestVersion.note
  const apkSize = latestVersion.fileSize

  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    const client_version = wgtinfo.version
    const flag_update = client_version < androidVersion

    if (flag_update) {
      console.log('需要更新')
    } else {
      console.log('不需要更新')
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
          const url = `${serverBaseUrl}/infra/app-client-version/download-latest-version?appId=${appId}`
          const dtask = plus.downloader.createDownload(
            url,
            {
              method: 'GET',
              filename: '_doc/innovate/update/',
            },
            (d, status) => {
              if (status === 200) {
                const path = d.filename
                plus.runtime.install(path)
              } else {
                plus.nativeUI.alert(`版本更新失败:${status}`)
              }
            },
          )
          try {
            dtask.start()
            let prg = 0
            const showLoading = plus.nativeUI.showWaiting('正在下载')
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
                    prg = Math.floor((Number(task.downloadedSize) / apkSize) * 100)
                    title = `正在下载：${prg}%`
                  } else {
                    title = `已下载：${(Number(task.downloadedSize) / 1024 / 1024).toFixed(2)}MB`
                  }
                  showLoading.setTitle(title)
                  break
                }
                case 4:
                  plus.nativeUI.closeWaiting()
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
}
