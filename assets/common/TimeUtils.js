export default class TimeUtils {

    constructor() {
    }

    countdown(self, endTime) {

        var that = this;

        var EndTime = endTime;
        var NowTime = new Date().getTime();
        var second = EndTime - NowTime || [];

        var timer = setInterval(function () {
            second -= 1000;

            // 渲染倒计时时钟
            self.setData({
                clock: that.dateformat(second),
                second: second
            });

            if (second <= 0) {
                console.log('剩余时间：' + second);
                clearInterval(timer);
                self.setData({
                    clock: "已经截止",
                    second: 0,
                });
            }

        }, 1000);
    }


    /* 毫秒级倒计时 */
    //   countdown(self,endTime) {
    //     var that = this;
    //   // 渲染倒计时时钟
    //     var EndTime = endTime
    //     var NowTime = new Date().getTime();
    //     var second = EndTime - NowTime || [];
    //     var timer = setInterval(function () {
    //       second -= 10;
    //       // 渲染倒计时时钟
    //       self.setData({
    //         clock: that.dateformat(second),
    //         second: second
    //       });
    //       if (second <= 0) {
    //         console.log('剩余时间：' + second);
    //         clearInterval(timer);
    //         self.setData({
    //           clock: "已经截止",
    //           second: 0,
    //         });
    //       }
    //     }, 10);
    // }

    dateformat(micro_second) {
        // 总秒数
        var second = Math.floor(micro_second / 1000);
        // 天数
        var day = Math.floor(second / 3600 / 24);
        // 小时
        var hr = Math.floor(second / 3600 % 24);
        // 分钟
        var min = Math.floor(second / 60 % 60);
        // 秒
        var sec = Math.floor(second % 60);
        // 毫秒位，保留2位
        var micro_sec = Math.floor((micro_second % 1000) / 10);
        if ((hr + '').length == 1) {
            hr = "0" + hr;
        }

        if ((min + '').length == 1) {
            min = "0" + min;
        }

        if ((sec + '').length == 1) {
            sec = "0" + sec;
        }
        return day + "天" + hr + ":" + min + ":" + sec;
    }


    //数据转化
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    /**
     * 时间戳转化为年 月 日 时 分 秒
     * number: 传入时间戳
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
     */
    formatTime(number, format) {

        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        var date = new Date(number);
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));

        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    }

    /**
     * 获取随机文件名称
     * @param path 路径
     */
    getRandomFileName(path) {
        let delimiter = '';//分隔符
        let result = '';
        //生成随机名称
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        let arr = [year, month, day, hour, minute, second];
        let time = arr.map((value, i) => {
            if (value < 10) {
                return '0' + value;
            } else {
                return value + '';
            }
        }).join(delimiter);
        let random = delimiter + Math.round(1 + Math.random() * 100000);

        if (path === 'jpg') {
            return time + random + '.jpg'
        }

        let index = path.lastIndexOf('.');
        result = time + random + path.substr(index);
        return result;
    }

    /**
     * 获取今天的日期
     */
    getToday() {
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = '0' + month;
        } else {
            month = month + '';
        }
        if (day < 10) {
            day = '0' + day;
        } else {
            day = day + '';
        }
        let now = date.getFullYear() + '-' + month + '-' + day;
        return now;
    }

    /**
     * 获取我的动态中的日期
     * @param time
     * @returns {*}
     */
    getDynamicDay(time) {
        var currentday = this.formatTime(new Date().getTime(), 'D')
        var date = new Date(time);
        var timeDay = this.formatTime(time, 'D')
        var result = {
            today: false,
            name: '',
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        if (timeDay == currentday) {
            result.today = true;
            result.name = '今天';
        }

        return result
    }

    getDayName(time) {
        var currentday = this.formatTime(new Date().getTime(), 'D')
        var timeDay = this.formatTime(time, 'D')
        let currentHms = this.formatTime(time, 'h:m:s')
        var showHint
        if (timeDay == currentday) {
            showHint = '今天 ' + currentHms
        } else if (timeDay - 1 == currentday) {
            showHint = '明天 ' + currentHms
        } else {
            showHint = this.formatTime(time, 'M月D号 h:m:s')
        }
        return showHint
    }

    /**
     * 格式化timestap
     * @param dateTimeStamp 要转换的时间缀
     * @returns {*}
     */
    formatTimestap(dateTimeStamp) {
        var result;
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            return;
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
            if (monthC <= 12)
                result = "" + parseInt(monthC) + "月前";
            else {
                result = "" + parseInt(monthC / 12) + "年前";
            }
        }
        else if (weekC >= 1) {
            result = "" + parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
            result = "" + parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = "" + parseInt(hourC) + "小时前";
        }
        else if (minC >= 1) {
            result = "" + parseInt(minC) + "分钟前";
        } else {
            result = "刚刚";
        }

        return result;
    };

    // 通过getDay的值switch今天是星期几
    getDate(date) {
        let str = '(周'
        switch (date) {
            case 0:
                str += "日";
                break;
            case 1:
                str += "一";
                break;
            case 2:
                str += "二";
                break;
            case 3:
                str += "三";
                break;
            case 4:
                str += "四";
                break;
            case 5:
                str += "五";
                break;
            case 6:
                str += "六";
                break;
        }
        return str + ')'
    }
    getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }
    // 获取未来的时间戳
    getTimestamp (day) {
        let a = new Date()
        a.setDate(a.getDate() + day)
        return a
    }
    // 获取时间选择器的日期名称
    getPickerDayName(time) {
        var currentday = this.formatTime(new Date().getTime(), 'D')
        var timeDay = this.formatTime(time, 'D')
        let currentHms = this.formatTime(time, 'h:m:s')
        let timeDate = time.getDay()
        var showHint
        if (timeDay == currentday) {
            showHint = '今天 ' + this.getDate(timeDate)
        } else if (timeDay - 1 == currentday) {
            showHint = '明天 ' + this.getDate(timeDate)
        } else if (timeDay - 2 == currentday) {
            showHint = '后天' + this.getDate(timeDate)
        } else {
            showHint = this.formatTime(time, 'M月D日')
        }
        return showHint
    }
}
