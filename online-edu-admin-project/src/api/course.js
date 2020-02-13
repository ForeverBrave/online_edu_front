import request from '@/utils/request'  //模板提供的组件，axios封装

export default{
    //添加课程
    addCourseInfo(courseInfo){
        return request({
            url: '/eduservice/course',
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师，显示到下拉列表
    getAllTeacherList(){
        return request({
            url: '/eduservice/teacher',
            method: 'get'
        })
    },
    //根据课程id查询课程信息
    getCourseInfoById(id){
        return request({
            url: '/eduservice/course/getCourseInfo/'+id,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url: '/eduservice/course/updateCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    //分页条件查询的方法（当前页，每页记录数，条件封装对象）
    getCoursePageList(page,limit,searchObj){
        return request({
            //后台controller的路径
            url: '/eduservice/course/moreCondtionPageList/'+page+'/'+limit,
            //提交请求方式
            method: 'post',
            //传递条件对象，如果传递json数据，使用data;如果不是传递json，则使用params
            data: searchObj 
        })
    },
    //删除课程方法
    deleteCourseId(id){
        return request({
            url: '/eduservice/course/deleteCourseById/'+id,
            method: 'delete',
        })
    },
    //根据课程id查询课程详细信息
    getAllCourseInfo(id){
        return request({
            url: '/eduservice/course/getAllCourseInfo/'+id,
            method: 'get'
        })
    },
    //根据课程id修改课程状态
    updateCourseStatus(id){
        return request({
            url: '/eduservice/course/publishCourse/'+id,
            method: 'get'
        })
    }
}