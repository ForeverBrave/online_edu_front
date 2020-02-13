<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

      <el-button type="text" @click="openAddChapter()">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chanpterList">
          <li
              v-for="chapter in chapterVideoList"
              :key="chapter.id">
              <p>
                  {{ chapter.title }}
                  <span class="acts">
                      <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
                      <el-button style="" type="text" @click="getChapterById(chapter.id)">编辑</el-button>
                      <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                  </span>

              </p>

              <!-- 小节 -->
              <ul class="chanpterList videoList">
                  <li
                      v-for="video in chapter.children"
                      :key="video.id">
                      <p>{{ video.title }}
                          <span class="acts">
                              <el-button type="text" @click="openVideoEditDialog(video.id)">编辑</el-button>
                              <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                          </span>
                      </p>
                  </li>
              </ul>
          </li>
      </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
        <el-form :model="video" label-width="120px">
            <el-form-item label="小节标题">
                <el-input v-model="video.title"/>
            </el-form-item>
            <el-form-item label="小节排序">
                <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
            </el-form-item>
            <!--上传按钮实现视频上传-->
          <el-form-item label="上传视频">
              <el-upload
                  :on-success="handleVodUploadSuccess"
                  :on-remove="handleVodRemove"
                  :before-remove="beforeVodRemove"
                  :on-exceed="handleUploadExceed"
                  :file-list="fileList"
                  :action="BASE_API+'/vidservice/vod/upload'"
                  :limit="1"
                  class="upload-demo">
              <el-button size="small" type="primary">上传视频</el-button>
              <el-tooltip placement="right-end">
                  <div slot="content">最大支持1G，<br>
                      支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                      GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                      MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                      SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                  <i class="el-icon-question"/>
              </el-tooltip>
              </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/chapter'
import video from '@/api/video'

export default {
    data() {
        return {
            id: '',
            chapterVideoList: [], // 章节嵌套视频列表
            video: {// 小节对象
              title: '',
              sort: 0,
              chapterId: '',
              courseId: '',
              videoSourceId: '',
              videoOriginalName: ''
            },
            chapter: {// 章节对象
              title: '',
              sort: 0,
              courseId: ''
            },
            dialogChapterFormVisible: false,
            dialogVideoFormVisible: false,
            fileList: [], //上传文件列表
            BASE_API: process.env.BASE_API // 接口API地址
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(){
          //获取路由中的id
          if(this.$route.params && this.$route.params.id){
              this.id = this.$route.params.id
              this.getChapterVideoId(this.id)
          }
        },
        //1、上传视频成功之后调用的方法
        handleVodUploadSuccess(response,file,fileList){
          this.video.videoSourceId = response.data.videoId
          //赋值文件名称
          this.video.videoOriginalName = file.name
        },
        //2、上传之前做限制的方法
        handleUploadExceed(file,fileList){
          this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },
        //3、删除之前弹出确认框
        beforeVodRemove(file,fileList){
          return this.$confirm(`确定移除 ${file.name}？`)
        },
        //4、删除云端视频的方法
        handleVodRemove(file,fileList){
          //调用后台方法实现
          video.removeAliyunVideo(this.video.videoSourceId)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除视频成功！'
              })
            })
            .catch(response => {
              this.$message({
                type: 'error',
                message: '删除视频失败！'
              })
            })
        },
        //弹框保存修改小节的方法
        saveOrUpdateVideo(){
          //判断是添加还是修改
          if(!this.video.id){
            this.addVideo()
          }else{
            this.updateVideo()
          }
        },
        //添加小节方法
        addVideo(){
          //把课程id赋值
          this.video.courseId = this.id
          video.addVideo(this.video)
            .then(response => {
              //关闭弹框
              this.dialogVideoFormVisible = false
              //提示信息
              this.$message({
                    type: 'success',
                    message: '添加小节成功!'
              })
              //刷新页面
              this.getChapterVideoId(this.id)
            })
            .catch(response => {
              this.$message({
                    type: 'error',
                    message: '添加小节失败!'
              })
            })
        },
        //修改小节方法
        updateVideo(){
          video.updateVideo(this.video)
            .then(response => {
              //弹窗关闭
              this.dialogVideoFormVisible = false
              //提示信息
              this.$message({
                    type: 'success',
                    message: '修改小节成功!'
              })
              //刷新页面
              this.getChapterVideoId(this.id)
            })
            .catch(response => {
              this.$message({
                    type: 'error',
                    message: '修改小节失败!'
              })
            })
        },
        //删除小节方法
        removeVideo(id){
          this.$confirm('您将删除该小节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //调用方法进行删除
                //return 表示后面then还会执行
                return video.deleteVideo(id)
            }).then(() => {
                //刷新整个页面
                this.getChapterVideoId(this.id)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            }).catch((response) => {
                //判断点击取消，还是删除失败
                if (response === 'cancel') {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                }        
            })
        },
        //打开弹出框更新方法
        openVideoEditDialog(videoId){
          this.dialogVideoFormVisible =true
          //根据小节id查询
          video.getVideoInfo(videoId)
            .then(response => {
              this.video = response.data.eduVideo
              //把视频名称设置到fileList中
              this.fileList = [{'name': this.video.videoOriginalName}]
            })
        },
        //打开小节弹出框方法
        openVideoDialog(chapterid){
          //弹出框
          this.dialogVideoFormVisible = true
          this.video.title = ''
          this.video.sort = 0
          //把章节id赋值
          this.video.chapterId = chapterid
          this.fileList = []
        },
        //弹出添加章节弹框，表单数据清空
        openAddChapter(){
          //弹出框
          this.dialogChapterFormVisible = true
          //表单清空
          this.chapter.title = ''
          this.chapter.sort = 0
          this.chapter.courseId = ''
        },
        //删除章节方法
        removeChapter(id){
          this.$confirm('您将删除该章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //调用方法进行删除
                //return 表示后面then还会执行
                return chapter.deleteChapter(id)
            }).then(() => {
                //刷新整个页面
                this.getChapterVideoId(this.id)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            }).catch((response) => {
                //判断点击取消，还是删除失败
                if (response === 'cancel') {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                }        
            })
        },
        //点击编辑，弹出框，根据章节id查询，做数据回显
        getChapterById(chapterid){
          // alert(chapterid)
          this.dialogChapterFormVisible = true
          //根据章节id查询
          chapter.getChapterInfo(chapterid)
            .then(response => {
              this.chapter = response.data.eduChapter
            })
        },
        //弹框保存修改章节的方法
        saveOrUpdate(){
          //判断点击确定，做修改还是添加
          if(!this.chapter.id){
            //添加章节的方法
            this.saveChapter()
          }else{
            this.updateChapter()
          }
        },
        updateChapter(){
          chapter.updateChapter(this.chapter)
            .then(response => {
              //关闭弹出
                this.dialogChapterFormVisible = false
                this.$message({
                    type: 'success',
                    message: '修改章节成功!'
                })
                //刷新页面
                this.getChapterVideoId(this.id)
            })
            .catch(response => {
                this.$message({
                    type: 'error',
                    message: '修改章节失败!!'
                })
            })
        },
        //添加章节的方法
        saveChapter(){
            //设置课程id
            this.chapter.courseId = this.id
            chapter.addChapter(this.chapter)
              .then(response => {
                //关闭弹出
                this.dialogChapterFormVisible = false
                this.$message({
                    type: 'success',
                    message: '添加章节成功!'
                })
                //刷新页面
                this.getChapterVideoId(this.id)
              })
              .catch(response => {
                this.$message({
                    type: 'error',
                    message: '添加章节失败!!'
                })
              })
        },
        //根据课程id查询章节和小节信息
        getChapterVideoId(id){
          chapter.getAllChapterVideoList(id)
            .then(response => {
              //赋值给集合
              this.chapterVideoList = response.data.items
            })
            .catch(response => {
              this.$message({
                    type: 'error',
                    message: '数据加载失败!'
                })
            })
        },
        previous(){
            this.$router.push({path:'/course/info/'+this.id})
        },
        next(){
            this.$router.push({path:'/course/publish/'+this.id})
        }
    }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>