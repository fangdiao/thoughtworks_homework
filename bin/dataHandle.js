const message = require('./message');
const moment = require('moment');

let dataHandle = {
  //存储所有数据
  _data: {
    'A': {
      'booked': [
        // {
        //   'username': 'user111',
        //   'price': 100,
        //   'startTime': 1409500800000,
        //   'endTime': 1530374400000
        // }
      ],
      'cancleBooked': []
    },
    'B': {
      'booked': [],
      'cancleBooked': []
    },
    'C': {
      'booked': [],
      'cancleBooked': []
    },
    'D': {
      'booked': [],
      'cancleBooked': []
    }
  },
  //判断预定或取消预定
  get(obj, address, isCancle) {
    return isCancle ? this.cancleBooked(obj, address) : this.book(obj, address);
  },
  //下订单
  book(obj, address) {
    let { _data } =  this;
    let { booked } = _data[address];
    //判断时间是否冲突
    isConflict = !!!booked.find(i => !(obj.startTime > i.endTime || obj.endTime < i.startTime));
    if (isConflict) {
      let price = this.getPrice(obj);
      obj = Object.assign(obj, { price });
      booked = booked.concat([obj]);
      this._data[address] = Object.assign(_data[address], { booked });
      return message('success');
    } else {
      return message('exist');
    }
  },
  //取消订单
  cancleBooked(obj, address) {
    let { _data } = this;
    let { booked, cancleBooked } = _data[address];
    //判断是否存在订单
    item = booked.find(i => i.startTime === obj.startTime && i.endTime === obj.endTime);
    if (item) {
      booked = booked.filter(i => i.startTime !== item.startTime);
      let { price } = item;
      let week = moment(item['startTime']).weekday();
      let rate = week === 0 || week === 6 ? 0.25 : 0.5;
      price = price * rate;
      item =  Object.assign(item, {price });
      cancleBooked = cancleBooked.concat([item]);
      this._data[address] = Object.assign(_data[address], { booked }, { cancleBooked });
      return message('success');
    } else {
      return message('notExist');
    }
  },
  //计算价格
  getPrice(obj) {
    let startTimeNumber =Number(moment(obj['startTime']).format('HH'));
    let endTimeNumber = Number(moment(obj['endTime']).format('HH'));
    //判断是否为周末
    let week = moment(obj['startTime']).weekday();
    let isWeek = week === 0 || week === 6;
    //根据开始结束时间生成一个数组,如20到22则数组为[20, 21, 22]
    let timeArray = [];
    for (let i = startTimeNumber; i <= endTimeNumber; i++) {
      timeArray = timeArray.concat([i]);
    }
    //筛选数组,与timeArray匹配
    let firstArray = [9, 10, 11, 12];
    let secondArray = [12, 13, 14, 15, 16, 17 ,18];
    let thirdArray = isWeek ? [18, 19, 20, 21, 22] : [18, 19, 20];
    let fourthArray = isWeek ? [] : [20, 21, 22];

    let singlePrice = isWeek ? [40, 50, 60, 0] : [30, 50, 80, 60];

    let firstPrice = this.getTimeNumber(timeArray, firstArray) * singlePrice[0];
    let secondPrice = this.getTimeNumber(timeArray, secondArray) * singlePrice[1];
    let thirdPrice = this.getTimeNumber(timeArray, thirdArray) * singlePrice[2];
    let fourthPrice = this.getTimeNumber(timeArray, fourthArray) * singlePrice[3];

    let price = firstPrice + secondPrice + thirdPrice + fourthPrice;
    return price;
  },
  //计算每段时间个数
  getTimeNumber(timeArray, pickArray) {
    let length = timeArray.filter(i => pickArray.find( o => o === i)).length;
    length === 0 ? 0 : --length;
    return length;
  },
}

module.exports = dataHandle;
