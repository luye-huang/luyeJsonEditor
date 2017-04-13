/**
 * Created by luye on 2017/4/12.
 */

import {dataSource} from './data';
const $ = require('jquery');
const forIn= require('lodash.forin');
const cloneDeep= require('lodash.clonedeep');
const separator = 'Æता';
const dict = new Map();
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
    this.renderJson();
    this.attachToggleObjectsEvents();
    this.param.dom.html(this.container);
    this.attachToggleObjectsEvents();
    this.attachModifyCellEvents();
  }

  init() {
    this.metadata = cloneDeep(this.param.data);
    this.container = $('<div class="editor-container"></div>');
    this.layer = 0;
    this.currentKey = '';
    // this.rowProces
  }

  createDomBuilders() {
    const that = this;
    this.rowBuilder = new Proxy(rowElement, {
      get: function (target, property) {
        if(property == 'obj'){
          return function (parentNode, key, nodeID, layer) {
            const node = $('<div class="editor-row" id="${nodeID}" style="left:${layer*24}px"></div>');
            node.attr({'id': nodeID, 'type': 'obj'}).append(`<button class="row-btn">+</button><span class="editor-cell">${key}</span>`);
            console.log(parentNode);
            parentNode.append(node);
            return node;
          }
        }
        else if(property == 'str'){
          return function (parentNode, key, value, nodeID, layer) {
            const node = `<div class="editor-row" id="${nodeID}" type="str" style="left:${layer*24}px"><span class="editor-cell">${key}</span><span class="editor-cell">${value}</span></div>`;
            parentNode.append(node);
            return node;
          }
        }
        else if(property == 'arr'){
          return function (parentNode, key, value, nodeID, layer) {
            const txt = key + ':' + value;
            target.attr({'id': nodeID, 'type': 'arr'}).text(txt);
            parentNode.append(`<div class="editor-row" id="${nodeID}" type="str" style="left:${layer*24}px"><span class="editor-cell">${key}</span><span class="editor-cell">${value}</span></div>`);
          }
        }
      }
    });
  }

  renderJson(data = this.metadata, node = this.container) {
    const that = this;
    this.layer ++;
    forIn(data, function (value, key) {
      if (value.constructor == Object) {
        that.currentKey = [that.currentKey, key].join(separator);
        that.renderJson(value, that.rowBuilder.obj(node, key, that.currentKey, that.layer));
      }
      else if (value.constructor == Array) {
        that.currentKey = [that.currentKey, key].join(separator);
        that.rowBuilder.arr(node, key, value, that.currentKey, that.layer);
        // const nodeID='';
        // const arrayNode = $(`<div class="editor-row" id="${nodeID}" type="arr" style="left:${that.layer*24}px"><span class="editor-cell">${key}</span></div>`);
        // that.layer++;
        // for(let item of value){
        //   if(item.constructor == Object){
        //     that.renderJson(item, that.rowBuilder.obj(arrayNode, key, that.currentKey, that.layer));
        //   }
        //   else{
        //     that.rowBuilder.str(node, key, value, that.currentKey, that.layer);
        //   }
        // }
        // node.append(arrayNode);
        // that.layer--;
        // that.rowBuilder.arr(node, key, value, that.currentKey, that.layer);
      }
      else {
        that.rowBuilder.str(node, key, value, that.currentKey, that.layer);
      }
    })
    this.layer --;
  }

  attachToggleObjectsEvents(){
    $('.row-btn').click(function(){
      $(this).siblings('.editor-row').toggle();
      const txt = $(this).text()=='+'?'-':'+';
      $(this).text(txt);
    });
  }

  attachModifyCellEvents(){
    $('.editor-cell').dblclick(function(){
      const cellValue = $(this).text();
      $(this).html(`<input value="${cellValue}"/><button>确定</button>`);
      $(this).find('button').click(function(){
        const cellValue = $(this).prev().val();
        $(this).parent().html(cellValue);
      });
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