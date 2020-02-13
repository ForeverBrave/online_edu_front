import request from '@/utils/request'

export default {
    //查询讲师带分页
    getTeacherListPage(page,limit){
        return request({
            url: '/eduservice/frontTeacher/'+page+'/'+limit,
            method: 'get'
        })
    },
    //根据讲师id查询详情
    getTeacherInfoId(id){
        return request({
            url: '/eduservice/frontTeacher/'+id,
            method: 'get'
        })
    }
}