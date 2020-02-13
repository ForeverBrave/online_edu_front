import request from '@/utils/request'  //模板提供的组件，axios封装

export default{
    getStatisticsData(day){
        return request({
            url: '/statistics/daily/getStatisticsDay/'+day,
            method: 'get'
        })
    },
    //根据时间范围获取统计数据
    getCountData(searchObj){
        return request({
            url: `/statistics/daily/getDataCount/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method: 'get'
        })
    }

}