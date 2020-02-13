<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

        <!-- 所属分类：级联下拉列表 -->
        <!-- 一级分类 -->
        <el-form-item label="课程类别">
            <el-select
            v-model="searchObj.subjectParentId"
            placeholder="请选择"
            @change="subjectLevelOneChanged">
                <el-option
                    v-for="subject in oneLevelSubjectList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select>

            <!-- 二级分类 -->
            <el-select v-model="searchObj.subjectId" placeholder="请选择">
                <el-option
                    v-for="subject in twoLevelSubjectList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item>
            <el-input v-model="searchObj.title" placeholder="课程标题"/>
        </el-form-item>
        <!-- 讲师 -->
        <el-form-item>
            <el-select
            v-model="searchObj.teacherId"
            placeholder="请选择讲师">
                <el-option
                    v-for="teacher in teacherList"
                    :key="teacher.id"
                    :label="teacher.name"
                    :value="teacher.id"/>
            </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="getCoursePageList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <!-- 表格 -->
        <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList">

        <el-table-column
            label="序号"
            width="70"
            align="center">
            <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column label="课程信息" width="470" align="center">
            <template slot-scope="scope">
            <div class="info">
                <div class="pic">
                <img :src="scope.row.cover" alt="scope.row.title" width="150px">
                </div>
                <div class="title">
                <a href="">{{ scope.row.title }}</a>
                <p>{{ scope.row.lessonNum }}课时</p>
                </div>
            </div>

            </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 10) }}
            </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
            <template slot-scope="scope">
            {{ scope.row.gmtModified.substr(0, 10) }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="课程状态" width="100" align="center" >
            <template slot-scope="scope">
                <el-tag :type="scope.row.status === 'Draft' ? 'primary' : 'success'">{{scope.row.status === 'Draft' ? '未发布' : '已发布'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="价格" width="100" align="center" >
            <template slot-scope="scope">
            {{ Number(scope.row.price) === 0 ? '免费' :
            '¥' + scope.row.price.toFixed(2) }}
            </template>
        </el-table-column>
        <el-table-column prop="buyCount" label="付费学员" width="100" align="center" >
            <template slot-scope="scope">
            {{ scope.row.buyCount }}人
            </template>
        </el-table-column>

        <!--
        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
            <router-link :to="'/edu/course/info/'+scope.row.id">
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
            </router-link>
            <router-link :to="'/edu/course/chapter/'+scope.row.id">
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
            </router-link>
            <el-button type="text" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
        </el-table-column>
        -->
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <router-link :to="'/course/info/'+scope.row.id">
                    <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                </router-link>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getCoursePageList"
        />
  </div>
</template>




<script>
import course from '@/api/course'
import teacher from '@/api/teacher'
import subject from '@/api/subject'
export default {
    data() {
        return {
            listLoading: true, // 是否显示loading信息
            list: null, // 数据列表
            total: 0, // 总记录数
            page: 1, // 页码
            limit: 10, // 每页记录数
            searchObj: {
                subjectParentId: '',
                subjectId: '',
                title: '',
                teacherId: ''
            }, // 查询条件
            teacherList: [], // 讲师列表
            oneLevelSubjectList:[], //一级分类集合
            twoLevelSubjectList:[], //二级分类集合
        }
    },
    created() {
        this.getCoursePageList()
        // 获取讲师列表
        this.getTeacherList()
        // 初始化分类列表
        this.getLevelAll()
    },
    methods: {
        //查询带分页
        getCoursePageList(page=1){
            this.page = page
            this.listLoading = true
            course.getCoursePageList(this.page,this.limit,this.searchObj)
                .then(response => {
                    //每页数据
                    this.list = response.data.items
                    //总记录数
                    this.total = response.data.total

                    this.listLoading = false    
                })
        },
        //获取所有讲师的方法
        getTeacherList(){
            course.getAllTeacherList()
                .then(response => {
                    this.teacherList = response.data.items
                })
        },
        //获取所有分类信息
        getLevelAll(){
            subject.getAllSubjectList()
                .then(response => {
                    this.oneLevelSubjectList = response.data.OneSubjectDto
                })
        },
        //触发change事件，显示一级分类里面所有的二级分类
        subjectLevelOneChanged(value){
            //获取选择一级分类的id值
            //根据一级分类id值，获取下面所有的二级分类

            //1、遍历所有一级分类集合
            for(var i = 0;i<this.oneLevelSubjectList.length;i++){
                //2、获得每个一级分类
                var levelOne = this.oneLevelSubjectList[i]
                //3、判断value和遍历出来的每一个一级分类的id是否一样
                if(value === levelOne.id){
                    //如果一样，取出下面的每个二级分类，children
                    this.twoLevelSubjectList = levelOne.children
                    this.courseInfo.subject = ''
                }
            }
        },
        //删除课程的方法
        removeDataById(id){
            //调用方法根据id删除
            this.$confirm('您将删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //调用方法进行删除
                //return 表示后面then还会执行
                return course.deleteCourseId(id)
            }).then(() => {
                //刷新整个页面
                this.getCoursePageList()
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
        resetData() {
            this.searchObj = {}
            this.twoLevelSubjectList = [] // 二级分类列表
            this.getCoursePageList()
        }
    }
}
</script>





<style scoped>
.myClassList .info {
    width: 450px;
    overflow: hidden;
}
.myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
}
.myClassList .info .pic a {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.myClassList .info .pic img {
    display: block;
    width: 100%;
}
.myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
}
.myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
}
.myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
}
</style>