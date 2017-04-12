/**
 * Created by luye on 07/04/2017.
 */
// var mock = require('mockjs');
var Mock = require('mockjs');
export const dataSource = Mock.mock({
  res: 'ok',
  obj:{
    aa: 'a',
    bb:'bb'
  },
  'list|1-40': [{      //数据模板
    'id|+1': 1,
    'email': '@EMAIL',
    'regexp3': /\d{5,10}/
  }]
});