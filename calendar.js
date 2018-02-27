
// 头部
Vue.component('v-header', {
    template: `<div class="header_wrap">
        <div class="header_prev">
            &lt;
        </div>
        <div class="header_title">
            {{nowDate}}
        </div>
        <div class="header_next">
            &gt;
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
        <div v-for="item in dateArr" class="date_items">
            <div v-for="i in item.date" class="date_cont">
                <span class="date_text">{{i}}</span>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            dateArr: [
                {
                    date: [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                    ]
                },
                {
                    date: [
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                    ]
                },
                {
                    date: [
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                    ]
                },
                {
                    date: [
                        22,
                        23,
                        24,
                        25,
                        26,
                        27,
                        28,
                    ]
                },
                {
                    date: [
                        29,
                        30,
                        31,
                    ]
                },
            ]
        }
    }
})

function calendar(id, options) {

    new Vue({
        el: id,
        data: {

        },
        template: `<div>
            <v-header></v-header>
            <week></week>
            <date></date>
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