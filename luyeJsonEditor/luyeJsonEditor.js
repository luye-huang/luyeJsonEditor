/**
 * Created by luye on 07/04/2017.
 */
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
    this.rowBuilder = new Proxy(rowElement, {
      get: function (target, property) {
        return function (a) {
          
          console.log(a);
          console.log(target);
          console.log(property);
        }
      }
    });
    // this.rowProcessor
  }
  
  render(data = this.metadata, dom = this.container) {
    console.log(data);
    const that = this;
    const children = [];
    // this.rowBuilder.append(2);
    _.forIn(data, function (value, key) {
      if (value.constructor == Object) {
        const $row = $(`<div class="editor-row ${key}">${key}:</div>`).data('isObj',true);
        children.push($row);
        dom.append($row);
        that.render(value, $row);
      }
      else if (value.constructor == Array) {
      }
      else {
        const $row = $(`<div class="editor-row ${key}">${key}:${value}</div>`).data('isObj',false);
        children.push($row);
        dom.append($row);
      }
    })
    
    data.constructor == Object && dom.click(() => {
      if(!$(event.target).data('isObj'))return;
      console.log(event.target);
      console.log(data);
      console.log(dom);
      console.log(children);
      event.stopPropagation();
      _.each(children, (child) => {
        child.toggleClass('inv');
      });
      // children.remove();
    });
    // this.dom.html(this.container);
  }
}