/*! calendar-pirce-jquery v1.0.4 | (c) Capricorncd | https://github.com/capricorncd/calendar-pirce-jquery */
"use strict";
!
function($) {
	function CalendarPrice(t) {
		t.el || t.error && t.error({
			code: 1,
			msg: CODES[1]
		}), this.calendar = $(t.el), this.settingWindow = createSettingWindow(), this.opts = $.extend({}, DEFAULTS, t), this.init()
	}
	var formatNumber = function(t) {
			return (t = t.toString())[1] ? t : "0" + t
		},
		toNumber = function(t) {
			return t = parseInt(t), isNaN(t) ? 0 : t
		},
		isValid = function(t) {
			return !!/^(\d{4})[-\/\.](\d{1,2})[-\/\.](\d{1,2})/.test(t) && RegExp.$1 + "/" + formatNumber(RegExp.$2) + "/" + formatNumber(RegExp.$3)
		},
		formatDate = function(t, e) {
			/(y+)/i.test(e) && (e = e.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length)));
			var a = {
				"M+": t.getMonth() + 1,
				"d+": t.getDate(),
				"h+": t.getHours(),
				"m+": t.getMinutes(),
				"s+": t.getSeconds()
			};
			for (var r in a) if (new RegExp("(" + r + ")").test(e)) {
				var n = a[r] + "";
				e = e.replace(RegExp.$1, 1 === RegExp.$1.length ? n : formatNumber(n))
			}
			return e
		},
		createSettingWindow = function() {
			var t = document.createElement("div");
			return t.className = "capricorncd-date-detailed-settings", t.style.display = "none", $(t)
		},
		CODES = {
			1: "请配置日历显示的容器!",
			2: "{{text}}: 日期格式不合法!",
			3: "设置的日期范围或初始化的日期范围，与设置的周{{text}}没有交集",
			4: "开始日期格式错误",
			5: "开始日期不能小于今天",
			6: "结束日期格式错误",
			7: "结束日期不能小于开始日期",
			8: "sort(arg)方法的参数arg为非数组"
		},
		TODAY = new Date,
		today = formatDate(TODAY, "yyyy-MM-dd"),
		ONE_DAY_MSEC = 864e5,
		tomorrow = formatDate(new Date(Date.parse(TODAY) + ONE_DAY_MSEC), "yyyy-MM-dd"),
		DEFAULTS = {
			data: [],
			month: formatDate(TODAY, "yyyy/MM"),
			startDate: null,
			endDate: null,
			cancel: function() {},
			callback: function() {},
			reset: function() {
				console.log("reset completed!")
			},
			error: function() {},
			hideFooterButton: !1,
			style: {
				bgColor: "#fff"
			}
		},
		fn = CalendarPrice.prototype;
	fn._formatThisMonth = function(t) {
		var e = null;
		return (e = /^(\d{4})[-\.\/](\d{1,2})/.test(t) ? this.dateToObject(RegExp.$1 + "/" + RegExp.$2) : this.dateToObject(formatDate(TODAY, "yyyy/MM"))) <= this.endDate && e >= this.startDate ? e : this.dateToObject(formatDate(this.startDate, "yyyy/MM"))
	}, fn.init = function() {
		this.createStyleCode(), this.startDate = this._getStartDate(), this.endDate = this._getEndDate(), this.data = this._getOptionsData(), this.month = this._formatThisMonth(this.opts.month), this.initSettingWindow(), this.createCalendar(), this.handleClickEvent()
	}, fn._prevMonth = function() {
		var t = toNumber(formatDate(this.month, "yyyy")),
			e = toNumber(formatDate(this.month, "MM"));
		this.month = 1 === e ? this.dateToObject(t - 1 + "/12") : this.dateToObject(t + "/" + (e - 1)), this.createCalendar()
	}, fn._nextMonth = function() {
		var t = toNumber(formatDate(this.month, "yyyy")),
			e = toNumber(formatDate(this.month, "MM"));
		this.month = 12 === e ? this.dateToObject(t + 1 + "/01") : this.dateToObject(t + "/" + (e + 1)), this.createCalendar()
	}, fn._getStartDate = function() {
		var t = this.dateToObject(this.opts.startDate);
		// return t && t >= TODAY ? t : TODAY
		return t;
	}, fn._getEndDate = function() {
		var t = this.opts.endDate,
			e = null,
			a = null,
			r = null;
		return /^(\d{4})[-\.\/](\d{1,2})/.test(t) && (e = RegExp.$1, a = toNumber(RegExp.$2)), e && a || (e = toNumber(formatDate(TODAY, "yyyy")) + 1, a = toNumber(formatDate(TODAY, "MM"))), r = /^\d{4}[-\.\/]\d{1,2}[-\.\/](\d{1,2})/.test(t) ? RegExp.$1 : new Date(Date.parse(new Date(e, a)) - ONE_DAY_MSEC).getDate(), this.dateToObject(e + "/" + a + "/" + r)
	}, fn.dateToObject = function(t) {
		var e = "";
		return /(\d{4})[-\/\.](\d{1,2})[-\/\.]?/.test(t) && (e += RegExp.$1 + "/" + RegExp.$2), /[-\/\.]\d{1,2}[-\/\.](\d{1,2})/.test(t) ? e += "/" + RegExp.$1 : e += "/01", /\d{4}\/\d{1,2}\/\d{1,2}/.test(e) ? new Date(e) : (this.opts.error({
			code: 2,
			msg: CODES[2].replace("{{text}}", t)
		}), !1)
	}, fn.createCalendar = function() {
		var t = !0,
			e = !0,
			a = formatDate(this.month, "yyyyMM");
		formatDate(this.startDate, "yyyyMM") >= a && (t = !1), formatDate(this.endDate, "yyyyMM") <= a && (e = !1);
		var r = "";
		r += '<div class="capricorncd-calendar-container">',
			r += '\t<div class="calendar-head-wrapper" style="height: 60px; line-height: 60px; text-align: center;">',
		t && (r += '       <a class="prev-month" title="上一月"></a>'),
			r += '\t\t<div class="calendar-month-title" style="position: relative; display: inline-block; vertical-align: middle;"><h3 style="">' + formatDate(this.month, "yyyy年MM月") + "</h3></div>",
		e && (r += '       <a class="next-month" title="下一月"></a>'),
			r += '<div style="float: right;width: 47%;position: absolute;top: 0;right: 0;"><span class="btn btn-primary reception_button_set" style="margin-right:17%">批量设置接待</span><span class="btn btn-primary price_button_set" style="margin-right:7%">批量设置价格</span></div>',
			r += "\t</div>", r += '\t<div class="calendar-table-wrapper">',
			r += '  \t    <table cellpadding="4" cellspacing="0">',
			r += '\t\t    <thead><tr class="week"><th class="weekend">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="weekend">六</th></tr></thead>',
			r += "\t\t    <tbody>" + this._createTbody() + "</tbody>",
			r += "\t    </table>",
			r += "    </div>",
		this.opts.hideFooterButton || (r += '    <div class="calendar-foot-wrapper">',
			r += '        <button class="btn btn-reset">重置</button>',
			r += '        <button class="btn btn-confirm">确定</button>',
			r += '        <button class="btn btn-cancel">取消</button>',
			r += "    </div>"),
			r += "</div>",
			this.calendar.html(r),
			this.renderDataToTalbe()
	}, fn._createTbody = function() {
		for (var t = this._getMonthDays(), e = this.month.getDay(), a = 0, r = Math.ceil((t + e) / 7), n = "", o = "", c = formatDate(this.startDate, "yyyy-MM-dd"), d = formatDate(this.endDate, "yyyy-MM-dd"), i = 0; i < r; i++) {
			o += "<tr>";
			for (var l = 1; l <= 7; l++)(a = 7 * i + l - e) > 0 && a <= t ? (n = formatDate(this.month, "yyyy-MM-") + formatNumber(a), today == n && (a = "今天"), tomorrow == n && (a = "明天"), o += n >= c && n <= d ? '<td class="valid-hook" data-week="' + (l - 1) + '" data-id="' + n + '"><b>' + a + '</b><div class="data-hook"></div></td>' : '<td class="disabled"><b>' + a + "</b></td>") : o += "<td>&nbsp;</td>";
			o += "</tr>"
		}
		return o
	}, fn.renderDataToTalbe = function() {
		var t = this,
			e = null,
			a = "";
		this.calendar.find(".valid-hook").each(function() {
			if (e = t._getDateData($(this).data("id")), a = t.dayComplate().toString(), e) {
				for (var r in e) a = a.replace("{" + r + "}", e[r]);
				$(this).data("data", JSON.stringify(e)).find(".data-hook").html(a)
			} else $(this).data("data", "{}")
		})
	}, fn._getDateData = function(t) {
		for (var e = this.data, a = 0; a < e.length; a++) if (t == e[a].date) return e[a];
		return null
	}, fn._getMonthDays = function() {
		var t = this.month,
			e = formatDate(t, "yyyy"),
			a = formatDate(t, "MM");
		return 12 == a ? 31 : new Date(Date.parse(new Date(e, a, 1)) - ONE_DAY_MSEC).getDate()
	}, fn.initSettingWindow = function() {
		var t = "";
		t += '<div class="cddsw-container">', t += '   <div class="cddsw-head-wrapper">', t += '       <div class="cddsw-title">0000-00-00</div>', t += '       <a class="cddsw-close"><i></i></a>', t += "   </div>", t += '   <ul class="cddsw-form-wrapper clearfix">', t += this._createDaySetupInputGroup(), t += "   </ul>", t += '   <fieldset class="cddsw-batch-settings clearfix">', t += '       <legend class="bs-title"><b>批量设置</b></legend>', t += '       <div class="bs-content">', t += '           <lable class="bs-lable">日期范围</lable>', t += '           <div class="bs-options-wrapper">', t += '               <input class="itext" name="startDay" type="text">', t += '               <span class="white-space">-</span>', t += '               <input class="itext" name="endDay" type="text">', t += '               <label class="drw-enable"><input name="enableDateRange" type="checkbox"> 启用</label>', t += "           </div>", t += "       </div>", t += '       <div class="bs-content bs-week-chekbox">', t += '           <lable class="bs-lable">设置星期</lable>', t += '           <div class="bs-options-wrapper">', t += '               <label><input name="setWeek" type="checkbox" value="1"> 周一</label>', t += '               <label><input name="setWeek" type="checkbox" value="2"> 周二</label>', t += '               <label><input name="setWeek" type="checkbox" value="3"> 周三</label>', t += '               <label><input name="setWeek" type="checkbox" value="4"> 周四</label>', t += '               <label><input name="setWeek" type="checkbox" value="5"> 周五</label>', t += '               <label><input name="setWeek" type="checkbox" value="6"> 周六</label>', t += '               <label><input name="setWeek" type="checkbox" value="0"> 周日</label>', t += "           </div>", t += "       </div>", t += "   </fieldset>", t += '   <div class="cddsw-foot-wrapper">', t += '       <button class="btn-confirm">启用本设置</button>', t += '       <button class="btn-cancel">取消</button>', t += "   </div>", t += "</div>", this.settingWindow.html(t), $("body").append(this.settingWindow)
	}, fn._createDaySetupInputGroup = function() {
		for (var t = "", e = this.opts.config, a = 0; a < e.length; a++) {
			var r = e[a];
			t += "<li>", t += "   <label>" + r.name + "</label>", t += '   <input name="' + r.key + '" type="text">', t += "</li>"
		}
		return t
	}, fn.dayComplate = function() {
		var t = this.opts.show,
			e = "";
		if (t && t instanceof Array) for (var a = 0; a < t.length; a++) {
			var r = t[a];
			e += "<p>" + r.name + "{" + r.key + "}</p>"
		}
		return e
	}, fn.handleClickEvent = function() {
		var t = this;
		this.calendar.on("click", ".prev-month", function() {
			t._prevMonth()
		}), this.calendar.on("click", ".next-month", function() {
			t._nextMonth()
		}), this.calendar.on("click", ".btn-reset", function() {
			t.data = t._getOptionsData(), t.createCalendar(), t.opts.reset()
		}), this.calendar.on("click", ".btn-confirm", function() {
			t.opts.callback(t.data)
		}), this.calendar.on("click", ".btn-cancel", function() {
			t.opts.cancel()
		}), this.calendar.on("click", ".valid-hook", function() {
            if($(this).hasClass('valid-active')){
                $(this).removeClass('valid-active');
                alert('已取消。');
            }else{
                $(this).addClass('valid-active');
                var e = $(this).data("id"),
                    a = $(this).data("data");
                try {
                    a = JSON.parse(a)
                } catch (t) {
                    a = {}
                }
                t.opts.everyday ? t.opts.everyday(a) : (t.settingWindow.find('.cddsw-form-wrapper [type="text"]').val(""), t.settingWindow.find('[name="enableDateRange"]').prop("checked", !1), t.settingWindow.find('[name="setWeek"]').prop("checked", !1), $.each(a, function(e, a) {
                    t.settingWindow.find('[name="' + e + '"]').val(a)
                }), t.settingWindow.find(".cddsw-title").html(e), t.settingWindow.find('[name="startDay"], [name="endDay"]').val(e), t.settingWindow.show())
            }
		}), this.calendar.on("click", ".price_button_set", function() {
            // var e = $(this).data("id"),
            //     a = $(this).data("data");
            // try {
            //     a = JSON.parse(a)
            // } catch (t) {
            //     a = {}
            // }
            var e = today,
                a = {};
            t.opts.everyday ? t.opts.everyday(a) : (t.settingWindow.find('.cddsw-form-wrapper [type="text"]').val(""), t.settingWindow.find('[name="enableDateRange"]').prop("checked", !1), t.settingWindow.find('[name="setWeek"]').prop("checked", !1), $.each(a, function(e, a) {
                t.settingWindow.find('[name="' + e + '"]').val(a)
            }), t.settingWindow.find(".cddsw-title").html(e), t.settingWindow.find('[name="startDay"], [name="endDay"]').val(e), t.settingWindow.show())
        }), this.settingWindow.on("click", ".cddsw-close, .btn-cancel", function() {
			t.settingWindow.hide();
		}), this.settingWindow.on("click", ".btn-confirm", function() {
			var e = $(this).closest(".cddsw-container"),
				a = e.find(".cddsw-title").text(),
				r = {};
			e.find(".cddsw-form-wrapper [name]").each(function() {
				var t = $(this).attr("name"),
					e = $(this).val();
				r[t] = e
			}), r.date = a;
			var n = $(".cddsw-batch-settings"),
				o = n.find('[name="startDay"]').val(),
				c = n.find('[name="endDay"]').val(),
				d = n.find('[name="enableDateRange"]').is(":checked"),
				i = [];
			n.find('[name="setWeek"]:checked').each(function() {
				i.push($(this).val())
			});
			var l = [];
			if (d) {
				var s = t.handleSetDateRangeData(o, c);
				if (!s) return;
				if (l = s, 0 === i.length) return void t.handleThisData(r, l)
			} else {
				if (0 === i.length) return void t.handleThisData(r);
				l = t.handleSetDateRangeData(formatDate(t.startDate, "yyyy-MM-dd"), formatDate(t.endDate, "yyyy-MM-dd"))
			}
			var h = t.handleSetWeekData(i, l);
			h.length > 0 ? t.handleThisData(r, h) : t.opts.error({
				code: 3,
				msg: CODES[3].replace("{{text}}", i.join(","))
			})
		})
	}, fn._createDateRangeArr = function(t, e) {
		for (var a = [], r = Date.parse(this.dateToObject(t)), n = Date.parse(this.dateToObject(e)), o = Math.floor((n - r) / ONE_DAY_MSEC) + 1, c = 0; c < o; c++) {
			var d = new Date(r + ONE_DAY_MSEC * c);
			a.push(formatDate(d, "yyyy-MM-dd"))
		}
		return a
	}, fn.handleSetDateRangeData = function(t, e) {
		var a = [],
			r = isValid(t),
			n = isValid(e);
		return r ? r < today ? (this.opts.error({
			code: 5,
			msg: CODES[5]
		}), null) : n ? n < r ? (this.opts.error({
			code: 7,
			msg: CODES[7]
		}), null) : (r == n ? a.push(formatDate(this.dateToObject(r), "yyyy-MM-dd")) : a = this._createDateRangeArr(r, n), a) : (this.opts.error({
			code: 6,
			msg: CODES[6]
		}), null) : (this.opts.error({
			code: 4,
			msg: CODES[4]
		}), null)
	}, fn.handleSetWeekData = function(t, e) {
		var a = this,
			r = [];
		return $.each(e, function(e, n) {
			var o = a.dateToObject(n).getDay();
			t.join(",").indexOf(o) > -1 && r.push(n)
		}), r
	}, fn.handleThisData = function(t, e) {
		var a = e || [],
			r = a.length;
		if (0 === r) this._updateThisData(t);
		else for (var n = 0; n < r; n++) this._updateThisData(t, a[n]);
		this.data = this.sort(this.rmRepeat(this.data, "date")), this.renderDataToTalbe(), this.settingWindow.hide()
	}, fn._updateThisData = function(t, e) {
		var a = this,
			r = !1,
			n = {};
		n.date = e || t.date, $.each(t, function(t, e) {
			"date" != t && (n[t] = e)
		}), $.each(this.data, function(t, e) {
			if (n.date === e.date) return r = !0, a.data[t] = n, !1
		}), r || this.data.push(n)
	}, fn._getOptionsData = function() {
		var t = formatDate(this.startDate, "yyyy-MM-dd"),
			e = formatDate(this.endDate, "yyyy-MM-dd"),
			a = [];
		return $.each(this.opts.data, function(r, n) {
			n.date >= t && n.date <= e && a.push(n)
		}), this.sort(this.rmRepeat(a, "date"))
	}, fn.createStyleCode = function() {
		var style = this.opts.style || {},
			count = 0;
		for (var key in style) if (++count > 0) break;
		if (count) {
			var defaultStyle = {
				headerBgColor: "#098cc2",
				headerTextColor: "#fff",
				weekBgColor: "#098cc2",
				weekTextColor: "#fff",
				weekendBgColor: "#098cc2",
				weekendTextColor: "#fff",
				validDateTextColor: "#333",
				validDateBgColor: "#fff",
				validDateBorderColor: "#eee",
				validDateHoverBgColor: "#098cc2",
				validDateHoverTextColor: "#fff",
				invalidDateTextColor: "#ccc",
				invalidDateBgColor: "#fff",
				invalidDateBorderColor: "#eee",
				footerBgColor: "#fff",
				resetBtnBgColor: "#77c351",
				resetBtnTextColor: "#fff",
				resetBtnHoverBgColor: "#55b526",
				resetBtnHoverTextColor: "#fff",
				confirmBtnBgColor: "#098cc2",
				confirmBtnTextColor: "#fff",
				confirmBtnHoverBgColor: "#00649a",
				confirmBtnHoverTextColor: "#fff",
				cancelBtnBgColor: "#fff",
				cancelBtnBorderColor: "#bbb",
				cancelBtnTextColor: "#999",
				cancelBtnHoverBgColor: "#fff",
				cancelBtnHoverBorderColor: "#bbb",
				cancelBtnHoverTextColor: "#666"
			},
				concatStyle = $.extend({}, defaultStyle, this.opts.style),
				templateStyle = ".capricorncd-calendar-container .calendar-head-wrapper, .capricorncd-date-detailed-settings .cddsw-container .cddsw-head-wrapper{background-color: {headerBgColor}}.capricorncd-calendar-container .calendar-head-wrapper .calendar-month-title, .capricorncd-date-detailed-settings .cddsw-container .cddsw-head-wrapper .cddsw-title{color: {headerTextColor};}.capricorncd-calendar-container .calendar-table-wrapper table .week{background-color:{weekBgColor};color:{weekTextColor}};.capricorncd-calendar-container .calendar-table-wrapper table .week th.weekend{background-color:{weekendBgColor};color:{weekendTextColor}}.capricorncd-calendar-container .calendar-table-wrapper table td{color:{validDateTextColor};background-color:{validDateBgColor};border-bottom: 2px solid {validDateBorderColor};border-right: 2px solid {validDateBorderColor};}.capricorncd-calendar-container .calendar-table-wrapper table td.valid-hook:hover{background-color:{validDateHoverBgColor};}.capricorncd-calendar-container .calendar-table-wrapper table td.valid-hook:hover b, .capricorncd-calendar-container .calendar-table-wrapper table td.valid-hook:hover p{color: {validDateHoverTextColor}}.capricorncd-calendar-container .calendar-table-wrapper table td.disabled{color:{invalidDateTextColor};background-color:{invalidDateBgColor}; border-bottom: 1px solid {invalidDateBorderColor};border-right: 1px solid {invalidDateBorderColor};}.capricorncd-calendar-container .calendar-foot-wrapper, .capricorncd-date-detailed-settings .cddsw-foot-wrapper{background-color:{footerBgColor}}.capricorncd-calendar-container .calendar-foot-wrapper button.btn-reset{background-color: {resetBtnBgColor};border: 1px solid {resetBtnBgColor};color: {resetBtnTextColor}}.capricorncd-calendar-container .calendar-foot-wrapper button.btn-reset:hover{background-color: {resetBtnHoverBgColor};border: 1px solid {resetBtnHoverBgColor};color: {resetBtnHoverTextColor}}.capricorncd-calendar-container .calendar-foot-wrapper button.btn-confirm, .capricorncd-date-detailed-settings .cddsw-foot-wrapper button.btn-confirm {background-color: {confirmBtnBgColor};border: 1px solid {confirmBtnBgColor};color: {confirmBtnTextColor}}.capricorncd-calendar-container .calendar-foot-wrapper button.btn-confirm:hover, .capricorncd-date-detailed-settings .cddsw-foot-wrapper button.btn-confirm:hover {background-color: {confirmBtnHoverBgColor};border: 1px solid {confirmBtnHoverBgColor};color: {confirmBtnHoverTextColor}}.capricorncd-calendar-container .calendar-foot-wrapper button.btn-cancel, .capricorncd-date-detailed-settings .cddsw-foot-wrapper button.btn-cancel {background-color: {cancelBtnBgColor};color:{cancelBtnTextColor};border: 1px solid {cancelBtnBorderColor};}.capricorncd-calendar-container .calendar-foot-wrapper button.btn-cancel:hover, .capricorncd-date-detailed-settings .cddsw-foot-wrapper button.btn-cancel:hover {background-color: {cancelBtnHoverBgColor};border-color: {cancelBtnHoverBorderColor};color: {cancelBtnHoverTextColor}}",
				reg = null;
			for (var key in concatStyle) reg = eval("/{" + key + "}/g"), templateStyle = templateStyle.replace(reg, concatStyle[key]);
			$("head").append("<style>" + templateStyle + "</style>")
		}
	}, fn.sort = function(t) {
		if (!(t instanceof Array)) return this.opts.error({
			code: 8,
			msg: CODES[8]
		}), t;
		if (t.length < 1) return t;
		for (var e = 0, a = null, r = 0; r < t.length; r++) {
			e = r;
			for (var n = r + 1; n < t.length; n++) t[n].date < t[e].date && (e = n, a = t[r], t.splice(r, 1, t[n]), t.splice(n, 1, a))
		}
		return t
	}, fn.rmRepeat = function(t, e) {
		for (var a = {}, r = [], n = 0; n < t.length; n++) {
			var o = t[n];
			if (e) try {
				o = t[n][e]
			} catch (t) {}
			a[o] || (r.push(t[n]), a[o] = !0)
		}
		return r
	}, $.extend({
		CalendarPrice: function(t) {
			new CalendarPrice(t)
		}
	})
}(jQuery);