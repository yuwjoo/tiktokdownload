<template>
  <view class="content">
    <uni-easyinput
      class="content_searchInput"
      v-model="shareUrl"
      placeholder="请输入抖音分享链接"
    ></uni-easyinput>
    <button
      class="content_fetchButton"
      type="primary"
      size="mini"
      @click="handleClickFetch"
    >
      解析分享链接
    </button>
    <video
      class="content_video"
      :src="videoUrl"
      :poster="posterUrl"
      controls
      :key="videoKey"
    ></video>
    <button
      v-if="videoUrl"
      class="content_fetchButton"
      type="warn"
      size="mini"
      @click="handleDownloadVideo"
    >
      下载该视频
    </button>
  </view>
</template>

<script>
import { useDouyin } from "./utils/douyin";
import { extractHref } from "./utils/function";

export default {
  data() {
    return {
      douyinSDK: null, // 抖音SDK对象
      shareUrl: "https://v.douyin.com/iedRswGG/", // 分享链接地址
      videoUrl: "", // 视频地址
      posterUrl: "", // 视频封面
      videoKey: Date.now(),
    };
  },
  onReady() {
    this.init();
  },
  onShow() {
    this.handleReadClipboard();
  },
  methods: {
    /**
     * @description: 初始化
     */
    async init() {
      this.douyinSDK = await useDouyin();
    },
    /**
     * @description: 处理点击解析按钮
     */
    async handleClickFetch() {
      const shareUrl = extractHref(this.shareUrl);
      if (!shareUrl) {
        uni.showToast({
          title: "请输入有效的分享链接",
          position: "bottom",
        });
        return;
      }
      uni.showLoading({
        title: "解析中...",
        mask: true,
      });
      const data = await this.douyinSDK.parseShareUrl(shareUrl);
      this.videoUrl = data.videoUrl;
      this.posterUrl = data.posterUrl;
      this.videoKey = Date.now();
      uni.hideLoading();
    },
    /**
     * @description: 读取剪切板
     */
    handleReadClipboard() {
      const handleSuccess = (res) => {
        const content = res ? res.data : "";
        const href = extractHref(content);
        if (href && href !== this.shareUrl && content !== this.shareUrl) {
          uni.showModal({
            title: "解析链接",
            content: "检测到有新的分享链接, 是否解析？",
            success: (res) => {
              if (res.confirm) {
                this.shareUrl = href;
                this.handleClickFetch();
              }
            },
          });
        }
      };
      uni.getClipboardData({ success: handleSuccess });
    },
    /**
     * @description: 处理下载视频到本地
     */
    handleDownloadVideo() {
      uni.showLoading({
        title: "下载中...",
        mask: true,
      });
      uni.downloadFile({
        url: this.videoUrl,
        success: (res) => {
          const { statusCode, tempFilePath } = res;
          if (statusCode === 200) {
            uni.saveFile({
              tempFilePath: tempFilePath,
              success: (data) => {
                uni.saveImageToPhotosAlbum({
                  filePath: data.savedFilePath,
                  success: () => {
                    uni.showToast({
                      mask: true,
                      title: "保存成功",
                    });
                    uni.hideLoading();
                  },
                  fail: () => {
                    uni.showToast({
                      mask: true,
                      title: "保存失败",
                    });
                    uni.hideLoading();
                  },
                });
              },
              fail: () => {
                uni.showToast({
                  mask: true,
                  title: "保存失败",
                });
                uni.hideLoading();
              },
            });
          } else {
            uni.showToast({
              mask: true,
              title: "下载失败",
            });
            uni.hideLoading();
          }
        },
        fail: () => {
          uni.showToast({
            mask: true,
            title: "下载失败",
          });
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style lang="scss">
.content {
  padding: 0 20rpx;

  .content_searchInput {
    margin-top: 10rpx;
  }
  .content_fetchButton {
    margin-top: 20rpx;
    display: block;
  }
  .content_video {
    margin-top: 50rpx;
    width: 100%;
  }
}
</style>
