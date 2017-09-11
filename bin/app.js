const readline = require('readline');
const checkLine = require('./checkLine');
const summary = require('./summary');
let app = {
  //启动
  action() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });
    rl.prompt();
    rl.on('line', (line) => {
      //输入非空执行主函数
      if (line) {
        this.main(line);
      }
      rl.prompt();
    }).on('close', () => {
      console.log('再见!');
      process.exit(0);
    });
  },
  //程序主要逻辑
  main(line) {
    //输入一个空格,打印总收入
    if (line.length === 1 && !line.replace(/\s/, '')) {
      return summary.action();
    } else {
      return checkLine.get(line);
    }
  },
}
//启动程序
app.action();
