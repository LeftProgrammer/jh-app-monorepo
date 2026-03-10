// APP更新
import { DICT_TYPE } from "@/utils/constants";
import { useDictStore } from "@/store/dict";
import {http} from "@/http/http";
const { VITE_SERVER_BASEURL } = import.meta.env;
const appId = "test001";

export default async function appUpdate() {
  //查询最新版本
  const latestVersion = await getLatestVersion(appId);
  if (!latestVersion) {
    return;
  }
  console.log("appUpdate",latestVersion);
  const androidVersion = latestVersion.version;
  const appMsg = latestVersion.note;
  const apkSize = latestVersion.fileSize;

  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    const client_version = wgtinfo.version;
    const flag_update = client_version < androidVersion;

    if (flag_update) {
      console.log("需要更新");
    } else {
      console.log("不需要更新");
      return;
    }
    uni.showModal({
      title: "更新提示",
      content: `当前版本：V${client_version}\n最新版本：V${androidVersion}\n内容：${appMsg}`,
      confirmText: "立即更新",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          plus.nativeUI.toast("正在准备环境，请稍后!");
          const url = `${VITE_SERVER_BASEURL}/infra/app-client-version/download-latest-version?appId=${appId}`;
          const dtask = plus.downloader.createDownload(
            url,
            {
              method: "GET",
              filename: "_doc/innovate/update/",
            },
            function (d, status) {
              if (status === 200) {
                const path = d.filename; // 下载apk
                plus.runtime.install(path); // 自动安装apk文件
              } else {
                plus.nativeUI.alert("版本更新失败:" + status);
              }
            },
          );
          try {
            dtask.start(); // 开启下载的任务
            let prg = 0;
            const showLoading = plus.nativeUI.showWaiting("正在下载"); // 创建一个showWaiting对象
            dtask.addEventListener("statechanged", (task, status) => {
              switch (task.state) {
                case 1:
                  showLoading.setTitle("正在下载");
                  break;
                case 2:
                  showLoading.setTitle("已连接到服务器");
                  break;
                case 3:
                  var title = "";
                  if (apkSize) {
                    prg =
                      parseInt(String(parseFloat(String(task.downloadedSize)) / apkSize)) / 100;
                    title = "正在下载：" + prg + "%  ";
                  } else {
                    //title = "已下载：" + calculateFileSize(task.downloadedSize);
                  }
                  showLoading.setTitle(title);
                  break;
                case 4:
                  plus.nativeUI.closeWaiting();
                  // 下载完成
                  break;
              }
            });
          } catch (e) {
            plus.nativeUI.closeWaiting();
            uni.showToast({
              title: "更新失败",
              mask: false,
              duration: 1500,
            });
          }
        }
      },
    });
  });
}


export function getLatestVersion(appId: String) {
  return http.get<any>(`/infra/app-client-version/get-latest-version?appId=${appId}`);
}

