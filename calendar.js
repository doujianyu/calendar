
// 全局函数
Vue.prototype.testingYear = function(year) { //检测当前年份是否是闰年 闰年返回true 可以被4整除不能被100 的事闰年 （平常年） 世纪年可以被400整除才是 返回true为闰年 false 平年
    // return year % 100 == 0 ? year % 400 == 0 ? true : false : year % 4 == 0 ? true : false
    return year % 400 == 0 || year % 4 == 0 && year % 100 != 0
}
// 获取自定日期是星期几 返回天数和 1号是周几
Vue.prototype.getDayWeek = function(date, bol, thatDay) {
    if (date && date.split){
        date = date.split('-')
        let year = date[0]
        let mouth = bol ? date[1] - 1 : date[1]
        let day = thatDay ? date[2] : '01'
        let yearType = this.testingYear(year)
        let week = new Date(year, mouth, day).getDay()
        let endDate = 0
        switch (mouth) {
            case 0:
                endDate = 31
                break;
            case 1:
                endDate = yearType ? 29 : 28
                break;
            case 2:
                endDate = 31
                break;
            case 3:
                endDate = 30
                break;
            case 4:
                endDate = 31
                break;
            case 5:
                endDate = 30
                break;
            case 6:
                endDate = 31
                break;
            case 7:
                endDate = 31
                break;
            case 8:
                endDate = 30
                break;
            case 9:
                endDate = 31
                break;
            case 10:
                endDate = 30
                break;
            case 11:
                endDate = 31
                break;
        
            default:
                endDate = '月份有误'
                break;
        }
        return {
            week: week,
            yearType: yearType,
            endDate: endDate
        }
    }
}


// 头部
Vue.component('v-header', {
    template: `<div class="header_wrap">
        <div class="header_prev">
            <div>
                <span class="iconfont icon-jiantouleft"></span>
            </div>
        </div>

        <div slot="btnOne"></div>
        <div slot="btnTwo"></div>

        <div class="header_title">
            {{nowDate}}
        </div>

        <div slot="btnThree"></div>
        <div slot="btnFour"></div>

        <div class="header_next">
            <div>
                <span class="iconfont icon-jiantouright"></span>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            nowDate: ''
        }
    },
    mounted: function() {
        let date = new Date()
        this.nowDate = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`
    }
})

// 头部星期组件
Vue.component('week', {
    template: `<div class="week_wrap">
        <div v-for="item in weekText" class="week_items">
            {{item}}
        </div>    
    </div>`,
    data: function (){
        return {
            weekText: [
                '日',
                '一',
                '二',
                '三',
                '四',
                '五',
                '六',
            ]   
        }
    }
})

// 每天日期
Vue.component('date', {
    template: `<div class="date_wrap">
        <div v-for="item in currentDateArr" class="date_items">
            <div v-for="i in item.date" class="date_cont">
                <span class="date_text">{{i}}</span>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            currentDateArr: [],
            currentYear: '',
            currentMouth: ''
        }
    },
    props: ['date'],
    mounted: function() {
        console.log(this.date)
        let startDate = 1
        let timeMsg = this.getDayWeek(this.date, true)
        console.log(timeMsg)
        let timeObj = []
        let weekDay = []
        for (let i = 0, I = timeMsg.endDate + timeMsg.week; i < I; i++){
            console.log(timeMsg.week)
            let day = i < timeMsg.week ? '' : (startDate, startDate++)
            weekDay.push(day)
            if (weekDay.length == 7){
                timeObj.push({
                    date: weekDay
                })
                weekDay = []
            }
        }
        weekDay.length > 0 && timeObj.push({date: weekDay})
        console.log(timeObj)
        this.currentDateArr = timeObj
    }
})

function calendar(id, options) {
    let date = new Date()
    options.date = options.date ? options.date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    new Vue({
        el: id,
        data: {
            date: options.date
        },
        template: `<div>
            <v-header></v-header>
            <week></week>
            <date :date="date"></date>
        </div>`,
        mounted: function () {
            let link = document.createElement('link')
            link.href = options.styleSheetUrl || './style.css'
            link.rel = 'stylesheet'
            console.log(document.querySelector('head'))
            document.querySelector('head').appendChild(link)
        }
    })
}