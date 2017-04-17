/**
 * Created by luye on 2017/4/12.
 */

import {dataSource} from './data';
const $ = require('jquery');
const cloneDeep = require('lodash.clonedeep');
const loEach = require('lodash.foreach');
// const separator = 'Æता';
const separator = '-';
const relations = new Map();

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
    this.renderBoard();
    this.param.dom.html(this.container);
    this.attachSubmitEvent(this.container.find('.btn-submit'));
    // this.attachModifyCellEvents();
    this.unfoldAttrs();
  }

  init() {
    this.metadata = cloneDeep(this.param.data);
    this.container = $('<div class="editor-container" layer="0"></div>');
    this.layer = 0;
    this.currentKey = '';
  }

  createDomBuilders() {
    const that = this;
    this.rowBuilder = new Proxy({}, {
      get: function (target, property) {
        if (property == 'obj') {
          return function (parentNode, key, value, layer) {
            const txt = `{...}`;
            const id = [parentNode.attr('id'), key].join(separator);
            const node = $(`<div class="editor-row" id="${id}" type="obj" style="margin-left:${layer * 24}px" layer="${layer}"><button class="row-btn row-btn-obj">+</button><span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell editor-cell-value">${txt}</span></div>`);
            parentNode.append(node);
            relations.set(id, value);
            that.attachModifyCellEvents(node.find('span[class*="editor-cell-"]'));
            that.attachToggleObjectEvents(parentNode.find('button'));
          }
        }
        else if (property == 'str') {
          return function (parentNode, key, value, layer) {
            const id = [parentNode.attr('id'), key].join(separator);
            const node = $(`<div class="editor-row" id="${id}" type="str" style="margin-left:${layer * 24 + 24}px" layer="${layer}"><span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell editor-cell-value">${value}</span></div>`);
            parentNode.append(node);
            that.attachModifyCellEvents(parentNode.find('.editor-cell'));
          }
        }
        else if (property == 'arr') {
          return function (parentNode, key, value, layer) {
            const txt = `[0-${value.length}]`;
            const id = [parentNode.attr('id'), key].join(separator);
            const node = $(`<div class="editor-row" id="${id}" type="arr" style="margin-left:${layer * 24}px" layer="${layer}"><button class="row-btn row-btn-arr">+</button><span class="editor-cell">${key}</span><span class="editor-cell editor-cell-value">${txt}</span></div>`);
            parentNode.append(node);
            relations.set(id, value);
            that.attachModifyCellEvents(node.find('span[class*="editor-cell-"]'));
            that.attachToggleObjectEvents(parentNode.find('button'));
          }
        }
      }
    });
  }

  renderJson(data = this.metadata, node = this.container) {
    const that = this;
    let layer = Number.parseInt(node.attr('layer'));
    layer++;
    loEach(data, function (value, key) {
      if (value.constructor == Object) {
        that.rowBuilder.obj(node, key, value, layer);
      }
      else if (value.constructor == Array) {
        that.rowBuilder.arr(node, key, value, layer);
      }
      else {
        that.rowBuilder.str(node, key, value, layer);
      }
    })
  }

  renderBoard() {
    this.container.append(`<div class="json-dashboard"><button></button><button class="btn-submit">submit</button></div>`);
    this.attachSubmitEvent(this.container.find('.btn-submit'));
  }

  updateData(data, keys, operation, isKey, value) {
    const len = keys.length;
    if (len < 2) {
      if(isKey){
        if (operation == 'modify') {
          const temp = data[keys[0]];
          data[value] = temp;
        }
      }
      else{
        if (operation == 'modify') {
          data[keys[0]] = value;
        }
      }
    }
    else{
      this.updateData(data[keys[0]], keys.splice(1), operation, isKey, value);
    }
    console.log(this.metadata);
    console.log(this.param.data);
  }

  attachToggleObjectEvents(node) {
    var that = this;
    node.off('click');
    node.click(function () {
      const parentNode = $(this).parent();
      const txt = $(this).text() == '+' ? '-' : '+';
      $(this).text(txt);
      if (txt == '-') {
        let currentKey = parentNode.attr('id');
        const data = relations.get(currentKey);
        that.renderJson(data, parentNode);
      }
      else {
        $(this).siblings('.editor-row').remove();
      }
    });
  }

  attachToggleArrayEvents() {
    var that = this;
    $('.row-btn-arr').click(function () {
      const parentNode = $(this).parent();
      const txt = $(this).text() == '+' ? '-' : '+';
      $(this).text(txt);
      if (txt == '-') {
        let currentKey = parentNode.attr('id');
        const data = relations.get(currentKey);
        that.renderJson(data, parentNode);
      }
    });
  }

  attachModifyCellEvents(node) {
    const that = this;
    node.off('dblclick');
    node.dblclick(function () {
      const cellValue = $(this).text();
      $(this).html(`<input value="${cellValue}"/><button>确定</button>`);
      $(this).find('button').off('click');
      $(this).find('button').click(function () {
        const cellValue = $(this).prev().val();
        const $parent = $(this).parent()
        $parent.html(cellValue);
        console.log($parent.closest('div').attr('id').split(separator).shift());
        that.updateData(that.metadata, $parent.closest('div').attr('id').split(separator).splice(1), 'modify', $parent.hasClass('editor-cell-key'), cellValue);
      });
    });
  }

  unfoldAttrs(layer = 3) {
    this.param.layer && (layer = this.param.layer);
    for (let i = 1; i <= layer; i++) {
      console.log(this.container.find('.editor-row[layer="' + i + '"] button'));
      this.container.find('.editor-row[layer="' + i + '"] button').trigger('click');
    }
  }

  attachSubmitEvent(btn) {
    btn.click(()=>console.log(this.metadata))
  }
}
