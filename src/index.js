// PureCSS styles
require('purecss/build/pure-min.css');
require('purecss/build/grids-min.css');
require('purecss/build/buttons-min.css');
require('purecss/build/forms-min.css');

import './style.scss';
import _ from 'lodash';
import $ from 'jquery';

console.log("Hello World")

import {getExamples, getExample} from './examples/examples.js'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import CodeMirror from 'codemirror';
import defineStMode from './stmode.js';

defineStMode();

function layoutEditor() {
    let headerHeight = $('#header').height();
    let viewportHeight = $(window).height();
    let editorDiv = $('#editor').width();
    myCodeMirror.setSize(editorDiv, viewportHeight - headerHeight - 10);
}

$(window).resize(layoutEditor);

let myCodeMirror = CodeMirror(document.getElementById("editor"), {
    lineNumbers: true,
    gutter: ["gutter-errors", "gutter-warnings"],
    mode: "st"
});
layoutEditor();

const cboExample = document.getElementById("examples");
cboExample.onchange = function (evt) {
    let selected = cboExample.options[cboExample.selectedIndex].text;
    let ex = getExample(selected);
    myCodeMirror.getDoc().setValue(ex.content);
};

const examples = getExamples();
console.log(examples)
_.forEach(examples, function (value) {
    let opt = document.createElement("option");
    opt.text = value.name;
    cboExample.appendChild(opt)
});


