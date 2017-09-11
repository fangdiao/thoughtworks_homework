const dataHandle = require('./dataHandle');
const moment = require('moment');
const message = require('./message');

let checkLine =  {
  //检查输入信息个数
  get(line) {
      //以空格分开生成一个数组对象
    args = line.split(/\s/);
    //输入以空格分开的四个或五个参数为预定或取消预定
    if (args.length === 4 || args.length === 5) {
      return this.checkFormat(args);
    } else {
      return message('invalid');
    }
  },
  //信息基本格式检查
  checkFormat(args) {
    let success = 0;
    args.map((i, index) => {
      let flag = false;
      switch(index) {
        case 0:
          //用户名不为空
          flag = !!i.replace(/\s/, '').length;
          break;
        case 1:
          //创建日期年份大于2017，月份01-12，日份01-31
          flag =/[2-9]\d(1[7-9]|[2-9][0-9])\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])/.test(i) && i.length === 10;
          break;
        case 2:
          //预约开始时间为09点到21点,结束时间为10点到22点
          flag = /(09|1\d|2[0-1])\:00\~(1\d|2[0-2])\:00/.test(i) && i.length === 11;
          break;
        case 3:
          //场地为ABCD其中之一
          flag = /[A-D]/.test(i) && i.length === 1;
          break;
      }
      success = flag ? ++success : success;
    });
    if (success === 4 && (args.length === 4 || (args.length === 5 && args[4] === 'C'))) {
      return this.checkDate(args);
    } else {
      return message('invalid');
    }
  },
  //日期范围合法检查
  checkDate(args) {
    //检验日期是否合法
    let dateIsValid = moment(args[1], "YYYY-MM-DD").isValid();
    //结束时间大于开始间
    let hoursTime = args[2].match(/\d+(?=\:)/g);
    let stratTimeNumber = hoursTime[0];
    let endTimeNumber = hoursTime[1];
    let hoursTimeIsValid = stratTimeNumber < endTimeNumber;
    //开始时间大于当前时间
    let createTime = moment().valueOf();
    let startTime = moment(`${args[1]}-${stratTimeNumber}`, "YYYY-MM-DD-HH").valueOf();
    let startTimeIsValid = createTime < startTime;
    if (dateIsValid && hoursTimeIsValid && startTimeIsValid) {
      return this.generateObj(args, startTime, endTimeNumber);
    } else {
      return message('invalid');
    }
  },
  //所有检查完毕生成一个约定好的对象,传递给dataHandle处理
  generateObj(args, startTime, endTimeNumber) {
    let username = args[0];
    let address = args[3];
    let isCancle = args.length === 5 ? true : false;
    let endTime = moment(`${args[1]}-${endTimeNumber}`, 'YYYY-MM-DD-HH').valueOf();
    let obj = { username, startTime, endTime };
    return dataHandle.get(obj, address, isCancle);
  }
}

module.exports = checkLine;
