// PureCSS styles
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-min.css';
import 'purecss/build/buttons-min.css';
import 'purecss/build/forms-min.css';
import 'purecss/build/menus-core-min.css';
import 'purecss/build/menus-horizontal-min.css';
import 'purecss/build/menus-dropdown-min.css';

import './style.scss';

// Libraries

import _ from 'lodash';
import $ from 'jquery';

window.jQuery = window.$ = global.$ = global.jQuery = $;

import {getExamples, getExample} from './examples/examples.js'

import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/tabs';
import 'jquery-ui/ui/widgets/accordion';

import 'jquery-ui/themes/base/all.css';

import './simplecheck';
import {stCodeEditor} from './steditor';
import {ttEditor} from './tt/index';

/**
 * This function calculates the layout.
 */
function layoutEditor() {
    let headerHeight = $('#header').height();
    let viewportHeight = $(window).height();
    let editorDiv = $('#editor').width();
    stCodeEditor.setSize(editorDiv, viewportHeight - headerHeight - 10);
}

function showExamples() {
    const cboExample = $("#examples");
    cboExample.bind('change', () => {
        let selected = cboExample.val();
        let ex = getExample(selected);
        stCodeEditor.getDoc().setValue(ex.content);
    });

    const examples = getExamples();
    console.log(examples)
    _.forEach(examples, function (value) {
        let opt = document.createElement("option");
        opt.text = value.name;
        cboExample.append(opt)
    });
}

function toggleDiv(id) {
    $(id).toggle
}


$(function () {
    //Activate tabs
    $("#tabs").tabs();

    $("#tt-accordion").accordion({
        heightStyle: "content",
        collapsible: true
    });


    //layouting editor
    $(window).resize(layoutEditor);
    layoutEditor();

    //
    showExamples()
});

