/**
 * Created by luye on 2017/4/12.
 */

import {dataSource} from './data';
const $ = require('jquery');
const _ = require('lodash');
const separator = 'Æता';
let relationDict = new Map();
const rowElement = $('<div class="editor-row"><div class="editor-cell"></div></div>');
export default class LuyeJsonEditor {
  constructor(param) {
    this.param = {};
    Object.assign(this.param, param);
    if (!(this.param.dom instanceof $)) {
      this.param.dom = $(this.param.dom);
    }
    if (!this.param.data) {
      this.param.data = dataSource;
    }
    this.init();
    this.createDomBuilders();
    this.render();
    this.attachToggleObjectsEvents();
    this.param.dom.html(this.container);
  }

  init() {
    this.metadata = _.cloneDeep(this.param.data);
    this.container = $('<div class="editor-container"></div>');
    this.layer = 0;
    this.currentKey = '';
    // this.rowProces
  }

  createDomBuilders() {
    const that = this;
    this.rowObjectBuilder = new Proxy(rowElement, {
      get: function (target, property) {
        return function (parentNode, key, nodeID) {
          const node = $('<div class="editor-row"></div>');
          node.attr({'id': nodeID, 'type': 'obj'}).append(`<div class="icon-unfold"></div><div class="editor-cell">${key}</div>`);
          console.log(parentNode);
          parentNode.append(node);
          
          relationDict.get(parentNode) && relationDict.get(parentNode).add(target);
          return node;
        }
      }
    });
    this.rowStringBuilder = new Proxy(rowElement, {
      get: function (target, property) {
        return function (parentNode, key, value, nodeID) {
          const txt = key + ':' + value;
          target.attr({'id': nodeID, 'type': 'obj'}).text(txt);
          var _target = target;
          parentNode.append(`<div class="editor-row" id="${nodeID}" type="str"><div class="editor-cell">${txt}</div></div>`);
        }
      }
    });
  }

  render(data = this.metadata, node = this.container) {
    const that = this;
    this.layer ++;
    _.forIn(data, function (value, key) {
      if (value.constructor == Object) {
        relationDict.set(node, new Set());
        that.currentKey = [that.currentKey, key].join(separator);
        that.render(value, that.rowObjectBuilder.create(node, key, that.currentKey));
      }
      else if (value.constructor == Array) {
      }
      else {
        that.rowStringBuilder.create(node, key, value, that.currentKey);
      }
    })
    this.layer --;
  }

  attachToggleObjectsEvents(){
    $('.icon-unfold').click(function(){
      console.log(relationDict.get($(this).closest()));
    });
  }
}


// import {dataSource} from './data';
// const $ = require('jquery');
// const _ = require('lodash');
// const separator = 'Æता';
// let relationDict = new Map();
// const rowElement = $('<div class="editor-row"></div>');
// export default class LuyeJsonEditor {
//   constructor(param) {
//     this.param = {};
//     Object.assign(this.param, param);
//     if (!(this.param.dom instanceof $)) {
//       this.param.dom = $(this.param.dom);
//     }
//     if (!this.param.data) {
//       this.param.data = dataSource;
//     }
//     this.init();
//     this.render();
//     console.log(this.container);
//     this.param.dom.html(this.container)
//   }
//
//   init() {
//     this.metadata = _.cloneDeep(this.param.data);
//     this.container = $('<div class="editor-container"></div>');
//     this.layer = 0;
//     var that = this;
//     this.rowObjectBuilder = new Proxy(rowElement, {
//       get: function (target, property) {
//         return function (a) {
//           console.log(a);
//           console.log(target);
//           console.log(property);
//         }
//       }
//     });
//   }
//
//   render(data = this.metadata, dom = this.container) {
//     console.log(data);
//     const that = this;
//     // this.rowBuilder.append(2);
//     _.forIn(data, function (value, key) {
//       if (value.constructor == Object) {
//         const $row = $(`<div class="editor-row ${key}">${key}:</div>`);
//         dom.append($row);
//         that.render(value, $row);
//       }
//       else if (value.constructor == Array) {
//       }
//       else {
//         const $row = $(`<div class="editor-row ${key}">${key}:${value}</div>`).data('isObj',false);
//         dom.append($row);
//       }
//     })
//     // this.dom.html(this.container);
//   }
// }