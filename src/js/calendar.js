
// 引入vue
let Vue = require('../../assets/vue')

// 引入element
import { DatePicker } from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css' //引入报错

// 引入样式
require('../style/style.scss')

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

//符合条件的时间戳转换成规定时间格式 （2018-01-03）
Date.prototype.transformation = function () {
    // 返回日期。
    let month = this.getMonth() + 1 > 9 ? this.getMonth() + 1 : `0${this.getMonth() + 1}`
    let date = this.getDate() > 9 ? this.getDate() : `0${this.getDate()}`
    return `${this.getFullYear()}-${month}-${date}`                         
}

// 批量设置查询函数
Vue.prototype.getBatchDate = function (startDate, endDate, queryWeek) {
    queryWeek = queryWeek ? queryWeek : []
    let startArr = startDate.split('-')
    let endArr = endDate.split('-')
    // 获取开始时间距离1970年1月1日的时间
    let startTime = new Date(startArr[0], startArr[1], startArr[2]).getTime()
    // 获取结束时间距离1970年1月1日的时间
    let endTime = new Date(endArr[0], endArr[1], endArr[2]).getTime()
    // 储存符合条件的日期的数组
    let timeStampTrue = []
    // 判断符合条件的 周几
    if (queryWeek.length > 0){
        for (let k = startTime; k <= endTime;) {
            let date = new Date(k)
            for(let i = 0; i < queryWeek.length; i++){
                let week = date.getDay() == queryWeek[i] ? date.transformation() : ''
                week && timeStampTrue.push({
                    time: week,
                    timeStamp: k
                })
            }
            k = k + 24 * 60 * 60 * 1000
        }
    }else {
        for (let k = startTime; k <= endTime;) {
            let date = new Date(k)
            let week = date.transformation()
            week && timeStampTrue.push({
                time: week,
                timeStamp: k
            })
            k = k + 24 * 60 * 60 * 1000
        }
    }
    if(timeStampTrue.length > 0){
        timeStampTrue = timeStampTrue.sort( (a, b) => {
            return a.timeStamp - b.timeStamp
        })
    }
    return timeStampTrue
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

        <div slot="btnThree" class="btnThree">
            <div class="header_button" data-id="0" @click="selectorShowHide">
                批量删除
            </div>
        </div>
        <div slot="btnFour" class="btnFour">
            <div class="header_button" data-id="1" @click="selectorShowHide">
                批量设置
            </div>
        </div>

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
            currentMonthStr: "",
        }
    },
    computed: {
        
    },
    props: ["date", "realTime", 'selectorInput', 'selectorOnOff'],
    methods: {
        selectorShowHide(e){
            let status = e.currentTarget.dataset.id == 0 ? 'del' : 'add'
            this.$emit('changeBtn', 'header', status)
        },
        prev: function() {
            this.currentMonth--
            if (this.currentMonth < 0) {
                this.currentMonth = 11
                this.currentYear--
            }
            this.$emit("childBtnClick", {
                btnClick: "prev",
                time: `${this.currentYear}-${this.currentMonth}-${new Date().getDate()}`,
                currentDate: `${this.currentYear}-${this.currentMonth + 1 > 9 ? `${this.currentMonth + 1}` : `0${this.currentMonth + 1}`}`
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
                time: `${this.currentYear}-${this.currentMonth}-${new Date().getDate()}`,
                currentDate: `${this.currentYear}-${this.currentMonth + 1 > 9 ? `${this.currentMonth + 1}` : `0${this.currentMonth + 1}`}`
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
    template: `<ul class="week_wrap" :style="{borderWidth: borderWidth, marginBottom: '-' + borderWidth, borderColor: borderColor}">
        <li v-for="item in weekText" class="week_items" :style="{borderWidth: borderWidth, borderColor: borderColor, marginRight: '-' + borderWidth, color: titleWeekFontColor, fontSize: titleWeekFontSize}">
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
    },
    props: ['borderWidth', 'titleWeekFontColor', 'titleWeekFontSize', 'borderColor']
})

// elementUI日期选择组件
Vue.component(DatePicker.name, DatePicker)

// 设置面板
Vue.component('selector', {
    template: `<div class="selector_wrap" v-show="selectorOnOff" @click="selectorShowHide">
        <div class="selector_cont" v-show="selectorOnOff" @click="stopPropagation">
            <div class="selector_tit">
                <span class="selector_tit_left">{{selectorTit}}</span>
                <span>{{selectorDay}}</span>
                <span class="iconfont icon-guanbi" @click="selectorShowHide"></span>
            </div>
            
            <div class="selector_inp" v-if="selectorTop">
                <ul>
                    <li 
                        v-for="(item, index) in selectorInput"
                        :class="'selector_input' + index"
                        data-tip=""
                    >
                        <label :for="'selector_input' + index" class="label_name">{{item}}</label>
                        <i>:</i>
                        <span v-if="index == 'status'" class="radio_wrap">
                            <label>
                                <input type="radio" name="status" value="1" v-model="inputVals[index]" :checked="inputVals[index] == 1"/>是
                            </label>
                            <label>
                                <input type="radio" name="status" value="-1" v-model="inputVals[index]" :checked="inputVals[index] == -1"/>否
                            </label>
                        </span>
                        <input v-if="!(index == 'status')" class="inputText" type="text" :id="'selector_input' + index" :placeholder="'请输入' + item" value="" v-model="inputVals[index]" ref="selectorInput"/>
                    </li>
                </ul>
            </div>
            
            <div class="selector_range" v-show="selectorAll">
                <ul>
                    <li>日期范围:</li>
                    <li class="date_picker_wrap">
                        <!-- <p><input type="text" placeholder="开始时间 如: xxxx-xx-xx 或 xxxx/xx/xx" v-model="startDate" /></p>
                        <p><input type="text" placeholder="结束时间 如: xxxx-xx-xx 或 xxxx/xx/xx" v-model="endDate" /></p> -->
                        <el-date-picker
                            v-model="datePickerValue"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="editable"
                            :unlink-panels="unlinkPanels"
                            popper-class="selector_data_popper"
                            @change="datePrickChange"
                        >
                        </el-date-picker>
                    </li>
                    <li>星期范围: 不单独选择时默认全部设置</li>
                    <li class="week_input_wrap">
                        <label>
                            <input type="checkbox" name="sun" v-model="week[0]" value="0"/>
                            周日
                        </label>
                        <label>
                            <input type="checkbox" name="mon" v-model="week[1]" value="1"/>
                            周一
                        </label>
                        <label>
                            <input type="checkbox" name="tues" v-model="week[2]" value="2"/>
                            周二
                        </label>
                        <label>
                            <input type="checkbox" name="wednes" v-model="week[3]" value="3"/>
                            周三
                        </label>
                        <label>
                            <input type="checkbox" name="thurs" v-model="week[4]" value="4"/>
                            周四
                        </label>
                        <label>
                            <input type="checkbox" name="fri" v-model="week[5]" value="5"/>
                            周五
                        </label>
                        <label>
                            <input type="checkbox" name="week" v-model="week[6]" value="6"/>
                            周六
                        </label>
                    </li>
                </ul>
            </div>
            <div class="selector_btns">
                <div class="selector_btn1" @click="determine">确定</div>
                <div class="selector_btn2" @click="selectorShowHide">取消</div>
            </div>

        </div>
    </div>`,
    data(){
        return {
            inputVals: {},
            startDate: '',
            endDate: '',
            dateReg: /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/,
            week: [],
            datePickerValue: '',
            editable: false,
            unlinkPanels: true
        }
    },
    computed: {
        selectorTit(){
            return this.selectorTitle || '设置'
        },
        selectorDay(){
            if(!this.selectorData) return ''
            let date = new Date(this.selectorData)
            return `${date.getFullYear()}年${date.getMonth() + 1 > 9 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`}月${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}日`
        }
    },
    props: [
        'selectorOnOff',
        'selectorInput',
        'selectorTitle',
        'selectorAll',
        'selectorData',
        'selectCurrentData',
        'selectorTop'
    ],
    
    watch: {
        selectCurrentData(newVal){
            this.inputVals = newVal
        },
        selectorOnOff(newVal){
            if(!newVal){
                this.inputVals = {}
            }
        }
    },
    methods: {
        selectorShowHide(index){
            this.$emit('changeBtn', 'selector')
        },
        stopPropagation(e){
            e.stopPropagation()
        },
        datePrickChange(data){
            if(data){
                this.startDate = `${data[0].getFullYear()}-${data[0].getMonth()}-${data[0].getDate()}`
                this.endDate = `${data[1].getFullYear()}-${data[1].getMonth()}-${data[1].getDate()}`
            }else{
                this.startDate = this.endDate = ''
            }
        },
        determine(e){
            if (this.selectorAll){
                if (!this.startDate || !this.endDate) {
                    alert('请选择时间')
                    return
                }
                let startDate = this.startDate.split('-')
                let endDate = this.endDate.split('-') 

                if (this.week.length > 0) {
                    let arr = []
                    for (let i = 0; i < this.week.length; i++) {
                        if (this.week[i]) {
                            arr.push(i) //因为getBatchDate函数接受星期参数是暂时只支持数组的每一个元素为数字
                        }
                    }
                    
                    var timeData = this.getBatchDate(startDate.join('-'), endDate.join('-'), arr)
                } else {
                    var timeData = this.getBatchDate(startDate.join('-'), endDate.join('-'))
                }

                let dateArr = []
                for (let i = 0; i < timeData.length; i++) {
                    dateArr.push({
                        time: timeData[i].time,
                        notepadText: this.inputVals
                    })
                }
                this.$emit('changeMsg', dateArr, this.selectorAll, this.selectorTop)
                this.inputVals = {} //改变对象的引用的地址防止改一全变
            }else{
                this.$emit('changeMsg', {
                    notepadText: this.inputVals 
                }, this.selectorAll)
                this.inputVals = {} //改变对象的引用的地址防止改一全变
            }
            this.selectorShowHide()
        }
    },
    mounted(){
        let priceReg = /^[0-9]+(\.[0-9]{0,2}){0,}$/
        if (!this.$refs.selectorInput) return
        for (let i = 0; i < this.$refs.selectorInput.length; i++) {
            let ele = this.$refs.selectorInput[i]
            ele.id.indexOf('price') > -1 && (ele.onfocus = function(){
                this.parentNode.className = 'selector_inputprice selector_inputprice_not'
                this.parentNode.setAttribute('data-tip', '请输入数字,小数点后最多两位')
                if (priceReg.test(this.value)) {
                    this.parentNode.className = 'selector_inputprice'
                } else {
                    this.parentNode.setAttribute('data-tip', '输入有误!请输入数字')
                    this.parentNode.className = 'selector_inputprice selector_inputprice_not'
                }
            },
            ele.oninput = function () {
                if(priceReg.test(this.value)){
                    this.parentNode.className = 'selector_inputprice'
                }else{
                    this.parentNode.setAttribute('data-tip', '输入有误!请输入数字')
                    this.parentNode.className = 'selector_inputprice selector_inputprice_not'
                }
            },
            ele.onblur = function() {
                this.parentNode.className = 'selector_inputprice'
            })
        }
    }
}) 


// 每天日期
Vue.component("date", {
    template: `<div class="date_wrap" :style="{borderWidth: borderWidth, borderColor: borderColor}">

        <div 
            v-for="(i, index) in currentDateArr" 
            class="date_cont" 
            @click="i.dayNum ? setDateText(index, i.timeStamp) : null" 
            @mouseenter="enter(index)"
            @mouseleave="leave(index)"
            :style="{
                borderWidth: borderWidth, 
                marginRight: '-' + borderWidth, 
                marginBottom: '-' + borderWidth, 
                borderColor: borderColor
            }"
        >
            <span 
                class="date_text" 
                :style="{top: borderWidth}"
                v-if="index !== corner"
            >{{i.dayNum}}</span>

            <span 
                class="date_text iconfont icon-quxiao" 
                :style="{top: borderWidth}"
                v-if="i.dayNum && index === corner"
                :data-day="i.dayNum"
                @click="deleteDay($event, index)"
            ></span>
            <div class="date_cont_scroll">
                <ul>
                    <li v-for="(note, key) in i.notepad" :class="key == 'notmalText' ? 'date_cont_center' : '' " :style="{color: notepadColor, fontSize: notepadFontSize}">
                        <span>{{key == 'notmalText' ? '' : key + ' : '}}</span>
                        <span>
                            {{notepadKeyConfig['status'] == key && note == 1 ? '是' : notepadKeyConfig['status'] == key && note == -1 ? '否' : note}}
                        </span>
                    </li>
                </ul>
            </div>
            
        </div>
        
    </div>`,
    data: function() {
        return {
            currentDateArr: [],
            currentYear: "",
            currentMouth: "",
            corner: ''
        };
    },
    props: ["date", "realTime", 'notepadConfig', 'notepadKeyConfig', 'notepadNormalText', 'batchDate', 'notepadColor', 'notepadFontSize', 'borderWidth', 'borderColor'],
    methods: {
        enter(index){
            this.corner = index
        },  
        leave(index){
            this.corner = ''
        },
        deleteDay(e, index){
            e.stopPropagation()
            if(confirm('确定删除这一天吗?')){
                this.$emit('deleteBtn', {
                    index: index,
                    timeStamp: this.currentDateArr[index].timeStamp
                })
            }
            
        },
        setDateText(index, timeStamp){
            this.$emit('changeBtn', 'date', {
                index: index,
                timeStamp: timeStamp,
                notepadText: this.currentDateArr[index].notepad
            })
        },
        getDateList() {
            
            let startDate = 1;
            let timeMsg = this.getDayWeek(this.date, this.realTime);
            let timeObj = [];
            for (let i = 0, I = timeMsg.endDate + timeMsg.week; i < I; i++) {
                if(i < timeMsg.week){
                    timeObj.push({
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
                    for(let a = 0, A = this.notepadConfig.length; a < A; a++){
                        if(this.notepadConfig[a].time == time){
                            for(let i in this.notepadKeyConfig){
                                notepad[this.notepadKeyConfig[i]] = this.notepadConfig[a].notepadText[i]
                            }
                            break
                        }
                    }
                    if (JSON.stringify(notepad) == '{}'){
                        notepad.notmalText = this.notepadNormalText
                    }
                    timeObj.push({
                        dayNum: startDate,
                        timeStamp: time,
                        notepad: notepad
                    });
                    startDate++
                }
            }
            let surplus = 7 - (timeObj.length % 7)
            if (surplus < 7){
                for(let i = 0; i < surplus; i++){
                    timeObj.push({
                        dayNum: ''
                    })
                }
            }
            this.currentDateArr = timeObj;
        }
    },
    mounted: function() {
        this.getDateList();
    },
    watch: {
        date() {
            this.getDateList()
        },
        notepadConfig(){
            this.getDateList()
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
        titleWeekFontSize: '星期栏字体大小',
        titleWeekFontColor: '星期栏字体颜色',
        itemsTextChange: '时间单元格内容变化时',
        styleSheetUrl: '插件样式表路径 默认 ./style.css',
        notepadNormalText: '单元格默认文本 默认为空'，
        notepadColor: '单元格文本颜色 默认黑色',
        notepadFontSize: '单元格文本大小 默认12px',
         notepadKeyConfig: { //配置冒号前的名字 和对应的变量
            price: '单价',
            number: '数量',
            status: '接待' // 固定参数 代表单选状态
        },
        notepadConfig: [ //指定某天显示的文本
            {
                time: '2018-03-01',
                notepadText: {
                    price: '1800.00',
                    number: '1',
                    status: '1' // 1为真 -1为假
                }
            }
        ],
        dateNotepadChange: function(day, data){
            // 数据改变时的回调函数 day 当前显示的月份 data 修改的数据
        },
        deleteCallBack： function(day, data){
            // day 当前显示的月份 data 删除的数据日期
        },
        nextBtnClick: function(){
            // 点击下一个月按钮时触发
        },
        prevBtnClick: function(){
            // 点击上一个月按钮时触发
        },
        toogleBtnClick: function(data){
            // 点击上一个月和下一个月都会触发 data中带有标识
        }
        // 回调函数中使用 this.notepadConfigUpdata 改变notepadConfigUpdata可以更新数据从新渲染页面
    }
*/

function calendar(id, options) {
    let date = new Date()
    // 判断传入的时间是现实时间还是js时间 没传默认为 现实时间（true）
    options.realTime = options.realTime == undefined ? true : typeof options.realTime == "boolean" ? options.realTime : true
    // 判断是否传入时间
    options.date = options.date ? options.date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    // 将 notepadConfig 里的时间转换成时间戳
    options.notepadConfig = options.notepadConfig.map( (item) => {
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
            borderWidth: options.borderWidth || '1px',
            borderColor: options.borderColor || '#ccc',
            titleWeekFontSize: options.titleWeekFontSize || '18px',
            titleWeekFontColor: options.titleWeekFontColor || '#000',
            notepadConfig: options.notepadConfig,
            notepadConfigUpdata: '',
            notepadKeyConfig: options.notepadKeyConfig,
            notepadNormalText: options.notepadNormalText,
            notepadDate: null,
            notepadColor: options.notepadColor || '#000',
            notepadFontSize: options.notepadFontSize || '12px',
            batchDate: options.batchDate,
            selectorInput: options.notepadKeyConfig,
            selectorOnOff: false,
            selectorTitle: '',
            selectorAll: false,
            selectorTop: true,
            selectorData: '',
            selectCurrentData: {},
            dateIndex: '',
            timeStamp: ''
        },
        template: `<div id='${id.substr(1)}'>
            <v-header 
                :date="date" 
                :realTime="realTime" 
                v-on:childBtnClick="childBtnClick" 
                :selectorInput="selectorInput" 
                :selectorOnOff="selectorOnOff" 
                v-on:changeBtn="changeBtn"
            ></v-header>

            <week 
                :borderWidth="borderWidth"
                :titleWeekFontColor="titleWeekFontColor"
                :titleWeekFontSize="titleWeekFontSize"
                :borderColor="borderColor"
            ></week>

            <date 
                :date="date" 
                :realTime="realTime" 
                :notepadKeyConfig="notepadKeyConfig" 
                :notepadConfig="notepadConfig" 
                :notepadNormalText="notepadNormalText" 
                :batchDate="batchDate"
                :notepadFontSize="notepadFontSize"
                :notepadColor="notepadColor"
                :borderWidth="borderWidth"
                :borderColor="borderColor"
                v-on:deleteBtn="deleteBtn"
                v-on:changeBtn="changeBtn"
                v-on:notepadDateChange="notepadDateChange"
            ></date>

            <selector 
                :selectorInput="notepadKeyConfig"
                :selectCurrentData="selectCurrentData" 
                :selectorOnOff="selectorOnOff" 
                :selectorTitle="selectorTitle"
                :selectorAll="selectorAll"
                :selectorData="selectorData"
                :selectorTop="selectorTop"
                v-on:changeMsg="changeMsg"
                v-on:changeBtn="changeBtn"
            ></selector>
            
        </div>`,
        methods: {
            deleteBtn(data){
                let currentDate = `${this.date.split('-')[0]}-${this.date.split('-')[1] > 9 ? this.date.split('-')[1] : `0${this.date.split('-')[1]}`}`
                for(let i = 0; i < this.notepadConfig.length; i++){
                    if (this.notepadConfig[i].time == data.timeStamp){
                        this.notepadConfig.splice(i, 1)
                        break
                    }
                }
                typeof options.deleteCallBack == 'function' && options.deleteCallBack.call(this, currentDate, {
                    time: new Date(data.timeStamp).transformation()
                })
            },
            childBtnClick(e) {
                let time = e.time.split("-");
                this.realTime && time[1]++;
                this.date = time.join("-");
                if(e.btnClick == 'next'){
                    typeof options.nextBtnClick == 'function' && options.nextBtnClick.call(this)
                }else if (e.btnClick == 'prev'){
                    typeof options.prevBtnClick == 'function' && options.prevBtnClick.call(this)
                }
                typeof options.toogleBtnClick == 'function' && options.toogleBtnClick.call(this, {
                    btnName: e.btnClick,
                    currentDate: e.currentDate
                })
            },
            notepadDateChange(data){
                this.notepadDateChange = data
            },
            changeMsg(data, selectorAll, selectorTop){
                if(selectorTop !== undefined && !selectorTop){ // 批量删除
                    let currentDate = `${this.date.split('-')[0]}-${this.date.split('-')[1] > 9 ? this.date.split('-')[1] : `0${this.date.split('-')[1]}`}`

                    let deleteDate = []

                    for(let i = 0, I = this.notepadConfig.length; i < I; i++){
                        if(this.notepadConfig[i]) {
                            let notepadItemTimeStamp = this.notepadConfig[i].time
                            for (let inx = 0, Inx = data.length; inx < Inx; inx++){
                                let time = data[inx].time.split('-')
                                let dataItemTimeStamp = Date.parse(new Date(time[0], time[1] - 1, time[2]))
                                if(dataItemTimeStamp == notepadItemTimeStamp){
                                    deleteDate.push(new Date(notepadItemTimeStamp).transformation())
                                    this.notepadConfig.splice(i, 1)
                                    i--
                                }
                            }
                        }
                    }
                    options.dateNotepadChange.call(this, currentDate, deleteDate)
                    return 
                }
                if (this.selectorAll){ //判断点击的是批量添加还是单个时间
                    let change = false
                    for(let i in data[0].notepadText){
                        change = true
                        break
                    }      
                    if(!change) return         

                    this.notepadConfig = data.map(function (item) {
                        let itemTime = item.time.split('-')
                        itemTime[1]--

                        return {
                            time: Date.parse(new Date(itemTime[0], itemTime[1], itemTime[2])),
                            notepadText: item.notepadText
                        }
                    })
                    
                    if (typeof options.dateNotepadChange == 'function'){
                        let exportDateArr = []
                        for(let i = 0; i < this.notepadConfig.length; i++){
                            exportDateArr.push({
                                time: new Date(this.notepadConfig[i].time).transformation(),
                                notepadText: { ...this.notepadConfig[i].notepadText},
                                // timeStamp: this.notepadConfig[i].time
                            })
                        }
                        let currentDate = `${this.date.split('-')[0]}-${this.date.split('-')[1] > 9 ? this.date.split('-')[1] : `0${this.date.split('-')[1]}`}`
                        options.dateNotepadChange.call(this, currentDate, exportDateArr)
                    }
                }else {
                    let notepadConfig = [...this.notepadConfig] //改变对象的引用的地址 否则vue监听不到数据变化
                    let changeOnOff = false
                    for(let i in data.notepadText){
                        changeOnOff = true
                    }
                    if(!changeOnOff) return
                    let add = true 
                    let exportDateArr = []
                    for(let i = 0; i < this.notepadConfig.length; i++){
                        if (this.notepadConfig[i].time == this.timeStamp){
                            let dateMsg = {
                                time: this.timeStamp,
                                notepadText: data.notepadText
                            }
                            notepadConfig[i] = dateMsg
                            exportDateArr.push({
                                time: new Date(dateMsg.time).transformation(),
                                notepadText: { ...dateMsg.notepadText }, // 防止改变数组时影响vue数据
                                // timeStamp: dateMsg.time
                            })
                            add = false
                            break
                        }
                    }
                    if(add){ // 判断是修改还是添加
                        let dateMsg = {
                            time: this.timeStamp,
                            notepadText: data.notepadText
                        }
                        notepadConfig.push(dateMsg)
                        exportDateArr.push({
                            time: new Date(dateMsg.time).transformation(),
                            notepadText: { ...dateMsg.notepadText}, // 防止改变数组时影响vue数据
                            // timeStamp: dateMsg.time
                        })
                    }
                    this.notepadConfig = notepadConfig
                    let currentDate = `${this.date.split('-')[0]}-${this.date.split('-')[1] > 9 ? this.date.split('-')[1] : `0${this.date.split('-')[1]}`}`
                    typeof options.dateNotepadChange == 'function' && options.dateNotepadChange.call(this, currentDate, exportDateArr)
                }
                
            },
            changeBtn(id, data){ // 控制设置面板
                this.selectorOnOff = !this.selectorOnOff
                if(id == 'header'){
                    if(data == 'add'){
                        this.selectorTitle = '批量设置'
                        this.selectorAll = true
                        this.selectorTop = true
                    }else{
                        this.selectorTitle = '批量删除'
                        this.selectorAll = true
                        this.selectorTop = false
                    }
                }else if(id !== 'selector') {
                    this.selectorTitle = '设置'
                    this.selectorData = data.timeStamp
                    this.selectorAll = false
                    this.selectorTop = true
                }
                if (data && id == 'date'){
                    
                    let obj = {}
                    for(let i in this.notepadKeyConfig){
                        for (let k in data.notepadText){
                            if (this.notepadKeyConfig[i] == k){
                                obj[i] = data.notepadText[k]
                            }
                        }
                    }
                    this.selectCurrentData = obj
                    this.timeStamp = data.timeStamp
                }
            }
        },
        watch: {
            notepadConfigUpdata(newVal){
                this.notepadConfig = newVal.map( item => {
                    let itemTime = item.time.split('-')
                    itemTime[1]--

                    return {
                        time: Date.parse(new Date(itemTime[0], itemTime[1], itemTime[2])),
                        notepadText: item.notepadText
                    }
                })
            }
        },
        mounted: function() {
            
        }
    });
}
// 将函数calendar放在window下否则不可调用
window.calendar = calendar