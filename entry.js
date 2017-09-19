/**
 * Created by luye on 07/04/2017.
 */
import JsonEditor from './luyeJsonEditor/luyeJsonEditor';

// if (module.hot) {
//   module.hot.accept();
// };
const param = {
  dom: document.getElementById('json-editor'),
  layer:1
};
const editor = new JsonEditor(param);