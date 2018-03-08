# calendar
    基于vue的日历插件

## 使用方法 
    直接调用 calendar(id, {options})
    参数 id = 页面元素的id string

## options 组件配置 

    {
        date: '指定的当前显示月份 不穿为当前时间的月份',
        realTime: '当前时间是现实时间还是js时间, 默认为现实时间',
        borderWidth: '边框线的像素', 
        borderColor: '边框线颜色',
        titleWeekFontSize: '星期栏字体大小',
        titleWeekFontColor: '星期栏字体颜色',
        styleSheetUrl: '插件样式表路径 默认 ./style.css (已经废弃)',
        notepadNormalText: '单元格默认文本 默认为空',
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
        ],
        dateNotepadChange: function(){
            // 数据改变时的回调函数
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
    }

