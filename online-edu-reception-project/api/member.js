import request from '@/utils/request'

export default {
    loginUser(user){
        return request({
            url: '/ucenter/user/login',
            method: 'post',
            data: user
        })
    },
    //根据token获取用户信息
    getUserInfoToken(token){
        return request({
            url: '/ucenter/member/userInfo/'+token,
            method: 'get'
        })
    }
}