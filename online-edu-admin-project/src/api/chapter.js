import request from '@/utils/request'  //模板提供的组件，axios封装

export default{
    //根据课程id查询课程所有章节和小节
    getAllChapterVideoList(courseId){
        return request({
            url: '/eduservice/chapter/getChapterVideoList/'+courseId,
            method: 'get'
        })
    },
    //添加
    addChapter(chapter){
        return request({
            url: '/eduservice/chapter/addChapter',
            method: 'post',
            data: chapter
        })
    },
    //根据id查询
    getChapterInfo(chapterId){
        return request({
            url: '/eduservice/chapter/getChapterById/'+chapterId,
            method: 'get'
        })
    },
    //修改
    updateChapter(chapter){
        return request({
            url: '/eduservice/chapter/updateChapter',
            method: 'post',
            data: chapter
        })
    },
    //删除
    deleteChapter(chapterId){
        return request({
            url: '/eduservice/chapter/'+chapterId,
            method: 'delete'
        })
    }
    
    

}