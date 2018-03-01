
// 全局函数
Vue.prototype.testingYear = function(year) { //检测当前年份是否是闰年 闰年返回true 可以被4整除不能被100 的事闰年 （平常年） 世纪年可以被400整除才是 返回true为闰年 false 平年
    // return year % 100 == 0 ? year % 400 == 0 ? true : false : year % 4 == 0 ? true : false
    return year % 400 == 0 || year % 4 == 0 && year % 100 != 0
}
// 获取自定日期是星期几 返回天数和 1号是周几
/* 
    date: 时间,
    bol: 是现实时间还是js时间 ,
    thatDay: '当前日期'
*/
Vue.prototype.getDayWeek = function(date, bol, thatDay) {
    if (date && date.split){
        date = date.split('-')
        let year = date[0]
        let mouth = bol ? date[1] - 1 : parseFloat(date[1]);
        console.log(mouth)
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
Vue.component("v-header", {
    template: `<div class="header_wrap">
        <div class="header_prev" @click="prev">
            <div class="iconfont icon-jiantouleft"></div>
        </div>

        <div slot="btnOne"></div>
        <div slot="btnTwo"></div>

        <div class="header_title">
            {{currentYear}}年 {{currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : currentMonth + 1}}月
        </div>

        <div slot="btnThree"></div>
        <div slot="btnFour"></div>

        <div class="header_next" @click="next">
            <div class="iconfont icon-jiantouright"></div>
        </div>
    </div>`,
    data: function() {
        return {
            nowDate: "",
            currentYear: "",
            currentMonth: "",
            currentYearStr: "",
            currentMonthStr: ""
        }
    },
    props: ["date", "realTime"],
    methods: {
        prev: function() {
            this.currentMonth--
            if (this.currentMonth < 0) {
                this.currentMonth = 11
                this.currentYear--
            }
            this.$emit("childBtnClick", {
                btnClick: "prev",
                time: `${this.currentYear}-${this.currentMonth}-${new Date().getDate()}`,
            });
        },
        next: function() {
            this.currentMonth++
            if (this.currentMonth > 11) {
                this.currentMonth = 0
                this.currentYear++
            }
            this.$emit("childBtnClick", {
                btnClick: "next",
                time: `${this.currentYear}-${this.currentMonth}-${new Date().getDate()}`
            });
        }
    },
    mounted: function() {
        if (this.date && this.date.split) {
            if(this.realTime) {
                this.currentYear = parseFloat(this.date.split("-")[0])
                this.currentMonth = parseFloat(this.date.split("-")[1]) - 1;
            }else {
                this.currentYear = parseFloat(this.date.split("-")[0])
                this.currentMonth = parseFloat(this.date.split("-")[1])
            }
            return;
        }
        let date = new Date()
        this.nowDate = `${date.getFullYear()}年 ${date.getMonth() + 1}月`
    }
});

// 头部星期组件
Vue.component('week', {
    template: `<ul class="week_wrap">
        <li v-for="item in weekText" class="week_items">
            {{item}}
        </li>    
    </ul>`,
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
Vue.component("date", {
    template: `<div class="date_wrap">
        <div v-for="item in currentDateArr" class="date_items">
            <div v-for="i in item.date" class="date_cont">
                <span class="date_text">{{i.dayNum}}</span>
                <ul>

                </ul>
            </div>
        </div>
    </div>`,
    data: function() {
        return {
            currentDateArr: [],
            currentYear: "",
            currentMouth: ""
        };
    },
    props: ["date", "realTime",'notepadConfig','notepadKeyConfig', 'notepadNormalText'],
    methods: {
        getDateList: function() {
            console.log("sada", this.date);
            let startDate = 1;
            let timeMsg = this.getDayWeek(this.date, this.realTime);
            console.log(timeMsg);
            let timeObj = [];
            let weekDay = [];
            for (let i = 0, I = timeMsg.endDate + timeMsg.week; i < I; i++) {
                if(i < timeMsg.week){
                    weekDay.push({
                        dayNum: ''
                    })
                }else {
                    let time = ''
                    if(this.realTime){
                        time = new Date(this.date.split('-')[0], this.date.split('-')[1] - 1, startDate)
                    }else {
                        time = new Date(this.date.split("-")[0], this.date.split("-")[1], startDate);
                    }
                    time = Date.parse(time)
                    let notepad = {}
                    // console.log(this.notepadConfig);
                    
                        // console.log(i)
                    for(let a = 0, A = this.notepadConfig.length; a < A; a++){
                        if(this.notepadConfig[a].time == time){
                            console.log(a)
                            for(let i in this.notepadKeyConfig){
                                notepad[this.notepadKeyConfig[i]] = this.notepadConfig[a].notepadText[i];
                            }
                        }
                    }
                    console.log(notepad);
                    weekDay.push({
                        dayNum: startDate,
                        timeStamp: time,
                        notepad: {

                        }
                    });
                    startDate++
                }
                
                if (weekDay.length == 7) {
                    timeObj.push({ date: weekDay });
                    weekDay = [];
                }
            }
            weekDay.length > 0 && timeObj.push({ date: weekDay });
            console.log(timeObj);
            this.currentDateArr = timeObj;
        }
    },
    mounted: function() {
        this.getDateList();
    },
    watch: {
        date() {
            this.getDateList();
        }
    }
});

// Vue主组件
// 参数 id = 页面元素的id string
// options 组件配置 
/* 
    {
        date: '指定的当前显示月份 不穿为当前时间的月份',
        realTime: '当前时间是现实时间还是js时间, 默认为现实时间',
        borderWidth: '边框线的像素',
        itemsTextChange: '时间单元格内容变化时',
        styleSheetUrl: '插件样式表路径 默认 ./style.css',
        notepadNormalText: '单元格默认文本 默认为空'，
        notepadColor: '单元格文本颜色 默认黑色',
        notepadFontSize: '单元格文本大小 默认12px',
        notepadKeyConfig: { //配置冒号前的名字 和对应的变量
            price: '单价',
            number: '数量'
        },
        notepadConfig: [ //指定某天显示的文本
            {
                time: '2018-03-01',
                notepadText: {
                    price: '1800.00',
                    number: '1'
                }
            }
        ]
    }
*/
function calendar(id, options) {
    let date = new Date()
    // 判断传入的时间是现实时间还是js时间 没传默认为 现实时间（true）
    options.realTime = options.realTime == undefined ? true : typeof options.realTime == "boolean" ? options.realTime : true
    // 判断是否传入时间
    options.date = options.date ? options.date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    // 将 notepadConfig 里的时间转换成时间戳
    options.notepadConfig = options.notepadConfig.map( function(item) {
        if(options.realTime){
            let itemTime = item.time.split('-')
            itemTime[1]--
            
            return {
                time: Date.parse(new Date(itemTime[0], itemTime[1], itemTime[2])),
                notepadText: item.notepadText
            }
        }
    })
    
    new Vue({
        el: id,
        data: {
            date: options.date,
            contWidth: "",
            realTime: options.realTime,
            notepadConfig: options.notepadConfig,
            notepadKeyConfig: options.notepadKeyConfig,
            notepadNormalText: options.notepadNormalText
        },
        template: `<div id='${id.substr(1)}'>
            <v-header :date="date" :realTime="realTime" v-on:childBtnClick="childBtnClick"></v-header>
            <week></week>
            <date :date="date" :realTime="realTime" :notepadKeyConfig="notepadKeyConfig" :notepadConfig="notepadConfig" :notepadNormalText="notepadNormalText"></date>
        </div>`,
        methods: {
            childBtnClick: function(e) {
                let time = e.time.split("-");
                this.realTime && time[1]++;
                this.date = time.join("-");
            }
        },
        mounted: function() {
            let link = document.createElement("link");
            link.href = options.styleSheetUrl || "./style.css";
            link.rel = "stylesheet";
            document.querySelector("head").appendChild(link);
        }
    });
}