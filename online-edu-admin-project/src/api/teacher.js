import request from '@/utils/request'  //模板提供的组件，axios封装

export default {
    
    //分页条件查询的方法（当前页，每页记录数，条件封装对象）
    getTeacherPageList(page,limit,searchObj){
        return request({
            //后台controller的路径
            url: '/eduservice/teacher/moreCondtionPageList/'+page+'/'+limit,
            //提交请求方式
            method: 'post',
            //传递条件对象，如果传递json数据，使用data;如果不是传递json，则使用params
            data: searchObj 
        })
    },
    //根据id删除讲师
    deleteTeacherId(id){
        return request({
            //后台controller的路径
            url: '/eduservice/teacher/'+id,
            //提交请求方式
            method: 'delete',
        })
    },
    //添加讲师
    saveTeacher(teacher){
        return request({
            //后台controller的路径
            url: '/eduservice/teacher/saveTeacher',
            //提交请求方式
            method: 'post',
            //传递条件对象，如果传递json数据，使用data;如果不是传递json，则使用params
            data: teacher
        })
    },
    //根据id查询
    getTeacherById(id){
        return request({
            //后台controller的路径
            url: '/eduservice/teacher/getTeacherInfo/'+id,
            //提交请求方式
            method: 'get',
        })
    },
    //修改讲师
    updateTeacher(teacher){
        return request({
            //后台controller的路径
            url: '/eduservice/teacher/updateTeacher',
             //提交请求方式
            method: 'post',
            //传递条件对象，如果传递json数据，使用data;如果不是传递json，则使用params
            data: teacher
        })
    }


}
