<template>
  <div>

    <!-- 阿里云视频播放器样式 -->
    <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css" >
    <!-- 阿里云视频播放器脚本 -->
    <script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js" />

    <!-- 定义播放器dom -->
    <div id="J_prismPlayer" class="prism-player" />
  </div>
</template>
<!-- 阿里云视频播放组件 -->
<script type="text/javascript" charset="utf-8" src="https://player.alicdn.com/aliplayer/presentation/js/aliplayercomponents.min.js"/>

<script>
import video from '@/api/video'

export default {
  layout:'video',
  asyncData({ params, error }) {
    return video.getPlayVideoAuth(params.vid)
      .then(response => {
          return {
            //视频id
            vid: params.vid,
            //播放凭证
            playAuth: response.data.data.playAuth
          }
      })
  },
  /**
   * 页面渲染完成时：此时js脚本已加载，Aliplayer已定义，可以使用
   * 如果在created生命周期函数中使用，Aliplayer is not defined错误
   */
  mounted() {
      
      /* eslint-disable no-undef */
      /*const player = */new Aliplayer({
          id: 'J_prismPlayer',
          vid: this.vid, // 视频id
          playauth: this.playAuth, // 播放凭证
          encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项
          width: '100%',
          height: '500px',
          // 以下可选设置
          cover: 'http://video.yaohuan.work/image/default/DF3E77AA7D894DA5975068C5F5201D63-6-2.jpg', // 封面
          qualitySort: 'asc', // 清晰度排序

          mediaType: 'video', // 返回音频还是视频
          autoplay: false, // 自动播放
          isLive: false, // 直播
          rePlay: false, // 循环播放
          preload: true,
          controlBarVisibility: 'hover', // 控制条的显示方式：鼠标悬停
          useH5Prism: true, // 播放器类型：html5
      }, function(player) {
          console.log('播放器创建成功')
      })
  }
}
</script>