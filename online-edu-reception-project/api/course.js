import request from '@/utils/request'

export default {
    //课程列表带分页
    getCourseListPage(page,limit){
        return request({
            url: '/eduservice/frontCourse/'+page+'/'+limit,
            method: 'get'
        })
    },
    //根据课程id查询详情
    getCourseInfoId(id){
        return request({
            url: '/eduservice/frontCourse/'+id,
            method: 'get'
        })
    }
}