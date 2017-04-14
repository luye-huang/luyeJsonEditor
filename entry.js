/**
 * Created by luye on 07/04/2017.
 */
import JsonEditor from './luyeJsonEditor/luyeJsonEditor';
import './luyeJsonEditor/luyeJsonEditor.less';

console.log('haddfdfdwwferwesqqq11a');
// if (module.hot) {
//   module.hot.accept();
// };
const param = {
  dom: document.getElementById('json-editor'),
  layer:1
};
const editor = new JsonEditor(param);