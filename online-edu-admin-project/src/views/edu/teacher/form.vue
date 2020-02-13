<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">

            <!-- 头衔缩略图 -->
            <pan-thumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 -->
            <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
            </el-button>

            <!-- v-show：是否显示上传组件
                :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                :url：后台上传的url地址
                @close：关闭上传组件
                @crop-upload-success：上传成功后的回调 -->
            <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduservice/oss/upload'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultForm = {
  name: '',
  sort: 0,
  level: '',
  career: '',
  intro: '',
  //设置默认头像
  avatar: 'http://edu-teacher-icon.oss-cn-hangzhou.aliyuncs.com/2020/02/03/bd653f13-96ba-4012-b660-b39dc5466154file.png'
}

export default {
    //声明使用额外组件
    components: {
        ImageCropper,
        PanThumb
    },
    data() {
        return {
            BASE_API: process.env.BASE_API, // 接口API地址
            imagecropperShow: false, // 是否显示上传组件
            imagecropperKey: 0, // 上传组件id
            //设置teacher的初始值
            teacher: defaultForm
        }
    },
    //路由监听
    watch: {
        $route(to, from) {
            console.log('watch $route')
            this.init()
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(){
            //在页面加载之前，判断路由里是否有id值
            //如果有id值，则为更新方法，调用方法根据id查询
            //从路由里面获取值
            if(this.$route.params && this.$route.params.id){
                const id = this.$route.params.id
                this.getTeacherById(id)
            }else{
                //添加方法
                //表单数据清空
                this.teacher = {...defaultForm}
            }
        },
        //实现添加和修改使用同一个表单
        saveOrUpdate(){
            //判断是否有id值.没，有则调用添加方法；有，则调用更新方法
            if(!this.teacher.id){
                this.saveTeacher()
            }else{
                this.updateTeacher()
            }
        },
        //根据id查询讲师
        getTeacherById(id){
            teacher.getTeacherById(id)
                .then(response => {
                    this.teacher = response.data.eduTeacher
                })
        },
        //添加讲师的方法
        saveTeacher() {
            //调用后台接口的方法实现添加
            teacher.saveTeacher(this.teacher)
                .then(() => {
                    //请求之后，添加之后，提示用户,
                    return this.$message({
                        type: 'success',
                        message: '添加成功!'
                    })
                    console.log("=== 触发成功 ===")
                }).then(() => {
                    //回到列表页面中，通过路由跳转回到列表页面中
                    this.$router.push({path: '/teacher'})
                })
                .catch(() => {
                    this.$message({
                        type: 'success',
                        message: '添加失败!'
                    })
                    console.log("=== 触发失败 ===")
                })
        },
        //修改讲师的方法
        updateTeacher(){
            teacher.updateTeacher(this.teacher)
                .then(() => {
                    return this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                }).then(() => {
                    //回到列表页面中，通过路由跳转回到列表页面中
                    this.$router.push({path: '/teacher'})
                }).catch(() => {
                        this.$message({
                        type: 'error',
                        message: '修改失败!'
                    })
                })
        },
        // 上传成功后的回调函数
        cropSuccess(data) {
           this.imagecropperShow = false
            //获取后台返回图片地址，显示到页面中
           this.teacher.avatar = data.imgurl
           // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
           this.imagecropperKey = this.imagecropperKey + 1
        },
        // 关闭上传组件
        close() {
            //点击x，关闭弹窗
            this.imagecropperShow = false
            // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        }
    }
}
</script>