

import {dataSource} from './data';
const $ = require('jquery');
const _ = require('lodash');
const separator = 'Æता';
let relationDict = new Map();
const rowElement = $('<div class="editor-row"></div>');
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
    this.render();
    console.log(this.container);
    this.param.dom.html(this.container)
  }
  
  init() {
    this.metadata = _.cloneDeep(this.param.data);
    this.container = $('<div class="editor-container"></div>');
    this.layer = 0;
    var that = this;
    this.rowObjectBuilder = new Proxy(rowElement, {
      get: function (target, property) {
        return function (a) {
          console.log(a);
          console.log(target);
          console.log(property);
        }
      }
    });
  }
  
  render(data = this.metadata, dom = this.container) {
    console.log(data);
    const that = this;
    // this.rowBuilder.append(2);
    _.forIn(data, function (value, key) {
      if (value.constructor == Object) {
        const $row = $(`<div class="editor-row ${key}">${key}:</div>`);
        dom.append($row);
        that.render(value, $row);
      }
      else if (value.constructor == Array) {
      }
      else {
        const $row = $(`<div class="editor-row ${key}">${key}:${value}</div>`).data('isObj',false);
        dom.append($row);
      }
    })
    // this.dom.html(this.container);
  }
}