import request from '@/utils/request'  //模板提供的组件，axios封装

export default{
    //查询所有课程
    getAllSubjectList() {
        return request({
            url: '/eduservice/subject',
            method: 'get'
          })
    },
    //根据id删除分类
    removeSubjectById(id){
        return request({
            url: '/eduservice/subject/'+id,
            method: 'delete'
        })
    },
    //根据id删除分类
    removeSubjectById(id){
        return request({
            url: '/eduservice/subject/'+id,
            method: 'delete'
        })
    },
    //添加一级分类
    addSubjectOne(subject){
        return request({
            url: '/eduservice/subject/addOneLevel',
            method: 'post',
            data: subject
        })
    },
    //添加二级分类
    addSubjectTwo(subject){
        return request({
            url: '/eduservice/subject/addTwoLevel',
            method: 'post',
            data: subject
        })
    }
     


}