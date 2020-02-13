import request from '@/utils/request'  //模板提供的组件，axios封装

export default{
    //添加
    addVideo(video){
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: video
        })
    },
    //根据id查询
    getVideoInfo(videoId){
        return request({
            url: '/eduservice/video/'+videoId,
            method: 'get'
        })
    },
    //修改
    updateVideo(video){
        return request({
            url: '/eduservice/video/updateVideo',
            method: 'post',
            data: video
        })
    },
    //删除
    deleteVideo(videoId){
        return request({
            url: '/eduservice/video/'+videoId,
            method: 'delete'
        })
    },
    //删除阿里云视频的方法
    removeAliyunVideo(videoId){
        return request({
            url: '/vidservice/vod/'+videoId,
            method: 'delete'
        })
    }
    
    

}