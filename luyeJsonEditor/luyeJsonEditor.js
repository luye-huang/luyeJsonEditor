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
            const node = $(`<div class="editor-row" id="${id}" type="obj" style="margin-left:${layer * 24}px" layer="${layer}">
                <button class="front-btn row-btn-obj">+</button><span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell">${txt}</span>
                <button class="btn-del">Delete</button></div>`);
            parentNode.append(node);
            relations.set(id, value);
            that.attachModifyCellEvents(node.find('span[class*="editor-cell-"]'));
            that.attachToggleObjectEvents(parentNode.find('button.row-btn-obj'));
            that.attachDeleteEvents(parentNode.find('button.btn-del'));
          }
        }
        else if (property == 'str') {
          return function (parentNode, key, value, layer) {
            const id = [parentNode.attr('id'), key].join(separator);
            const node = $(`<div class="editor-row" id="${id}" type="str" style="margin-left:${layer * 24 + 24}px" layer="${layer}">
                <span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell editor-cell-value">${value}</span>
                <button class="btn-del">Delete</button></div>`);
            parentNode.append(node);
            that.attachModifyCellEvents(node.find('span[class*="editor-cell-"]'));
            that.attachDeleteEvents(parentNode.find('button.btn-del'));
          }
        }
        else if (property == 'arr') {
          return function (parentNode, key, value, layer) {
            const txt = `[0-${value.length}]`;
            const id = [parentNode.attr('id'), key].join(separator);
            const node = $(`<div class="editor-row" id="${id}" type="arr" style="margin-left:${layer * 24}px" layer="${layer}">
                <button class="front-btn row-btn-arr">+</button><span class="editor-cell">${key}</span><span class="editor-cell">${txt}</span>
                <button class="btn-del">Delete</button></div>`);
            parentNode.append(node);
            relations.set(id, value);
            that.attachModifyCellEvents(node.find('span[class*="editor-cell-"]'));
            that.attachToggleObjectEvents(parentNode.find('button.row-btn-arr'));
            that.attachDeleteEvents(parentNode.find('button.btn-del'));
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

  updateData({data = this.metadata, keys, operation, value, isKey = false}) {
    const len = keys.length;
    if (operation == 'modify') {
      if (len < 2) {
        if (isKey) {
          const temp = data[keys[0]];
          data[value] = temp;
        }
        else {
          data[keys[0]] = value;
        }
      }
      else {
        this.updateData({data: data[keys[0]], keys: keys.splice(1), operation, isKey, value});
      }
    }
    else if (operation == 'delete') {
      if (len == 2) {
        const [key,...tail] = keys;
        const obj = data[key]
        delete obj[tail];
      }
      else if (len == 1) {
        delete data[keys[0]];
      }
      else {

      }
    }
    console.log(this.metadata);
    console.log(this.param.data);
    return this.metadata !== this.param.data;
  }

  updateDeletedDom(node) {
    console.log(node);
    if (node.parent().attr('type') == 'arr') {
      const index = Number.parseInt(node.find('.editor-cell-key').text());
      const rows = Array.from(node.siblings('.editor-row'));
      rows.filter((row)=>Number.parseInt($(row).find('.editor-cell-key').text()) > index).map((row)=> {
        const decreasedValue = Number.parseInt($(row).find('.editor-cell-key').text()) - 1;
        let id = $(row).attr('id').split(separator);
        id.pop();
        id.push(decreasedValue);
        // id = id.splice(id.length - 1, 1, decreasedValue);
        console.log(id);
        $(row).attr('id', id.join(separator));
        $(row).find('.editor-cell-key').text(decreasedValue);
      });
      console.log(index);
    }
    node.remove();
    // node.parent().find('button.front-btn').trigger('click');
    // node.parent().find('button.front-btn').trigger('click');
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

  attachDeleteEvents(node) {
    const that = this;
    node.off('click');
    node.click(function () {
      console.log($(this));
      const $parent = $(this).parent();
      new Promise((resolve, reject)=> {
        if (that.updateData({
            keys: $parent.attr('id').split(separator).splice(1),
            operation: 'delete'
          })) {
          resolve();
        }
        else {
          alert('deleting fails');
        }
      }).then(that.updateDeletedDom($parent));

    });
  }

  attachModifyCellEvents(node) {
    const that = this;
    node.off('dblclick');
    node.dblclick(function () {
      if (!$(this).has('input').length) {
        const cellValue = $(this).text();
        $(this).html(`<input value="${cellValue}" autofocus/><button>确定</button>`);
      }
      $(this).find('button').off('click');
      $(this).find('button').click(function () {
        const cellValue = $(this).prev().val();
        const $parent = $(this).parent();
        $parent.html(cellValue);
        console.log($parent.closest('div').attr('id').split(separator).shift());
        // specify param data?
        that.updateData({
          keys: $parent.closest('div').attr('id').split(separator).splice(1),
          operation: 'modify',
          value: cellValue,
          isKey: $parent.hasClass('editor-cell-key')
        });
      });
    });
  }

  unfoldAttrs(layer = 3) {
    (this.param.layer || this.param.layer === 0) && (layer = this.param.layer);
    for (let i = 1; i <= layer; i++) {
      console.log(this.container.find('.editor-row[layer="' + i + '"] button'));
      this.container.find('.editor-row[layer="' + i + '"] button.front-btn').trigger('click');
    }
  }

  attachSubmitEvent(btn) {
    btn.click(()=>console.log(this.metadata))
  }
}
