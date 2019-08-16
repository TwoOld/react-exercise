// 自定义中间件
// 有两个参数：getState，dispatch
export default function() {
  // 返回真正的中间件任务执行函数
  return next => action => {
    // 执行中间件任务
    console.log(`${action.type} 执行了！！！`)

    // 执行下一个中间件
    return next(action)
  }
}
