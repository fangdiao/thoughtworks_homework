const moment = require('moment');
const { _data } = require('./dataHandle');

const summary = {
  action() {
    console.log(`收入汇总\n---`)
    allPrice = 0;
    //遍历存储数据对象
    for (let i in _data) {
      allPrice += this.calculate(i, _data[i]);
    }
    return console.log(`---\n总计: ${allPrice}元`);
  },
  calculate(type, obj) {
    let { booked, cancleBooked } = obj;
    let totalPrice = 0;
    //将去取消订单对象做标记并合并到订单对象
    if (cancleBooked.length) {
      cancleBooked.map(i => i.isCancle = true);
      booked = booked.concat(cancleBooked);
    }
    //排序
    booked.sort((a,b) => a.startTime > b.startTime);

    console.log(`场地:${type}`);
    //遍历订单对象，打印每条订单信息
    if (booked.length) {
      booked.map(i => {
        totalPrice += i.price;
        let date = `${moment(i.startTime).format('YYYY-MM-DD')}`;
        let time = `${moment(i.startTime).format('HH')}:00~${moment(i.endTime).format('HH')}:00`;
        let price = i.isCancle ? `违约金 ${i.price}元` : `${i.price}元`;
        console.log(`${date} ${time} ${price}`)
      });
    }
    console.log(`小计: ${totalPrice}元\n`);
    return totalPrice;
  }
};

module.exports = summary;
