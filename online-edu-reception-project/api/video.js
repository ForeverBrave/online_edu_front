import request from '@/utils/request'

export default {
    //获取播放凭证的方法
    getPlayVideoAuth(vid){
        return request({
            url: '/vidservice/vod/getPlayAuth/'+vid,
            method: 'get'
        })
    }
}