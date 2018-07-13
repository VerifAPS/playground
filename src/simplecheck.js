import $ from 'jquery';
import _ from 'lodash';

import 'jquery-ui/ui/widgets/button';


const KIT_SERVICE_HOST = "http://localhost:3000";


const SIMPLE_CHECK = [
    {
        id: 'SyntaxAndNames',
        name: 'Check Syntax and Names',
        desc: '...',
        url: KIT_SERVICE_HOST + '/syntax'
    },
];

let btnRun;
let cboChecks;
let resultDiv;

import {stCodeEditor} from "./steditor";

function runCurrentCheck(evt) {
    let v = cboChecks.val();
    let item = _.find(SIMPLE_CHECK, item => item.id = v);
    console.log(item);


    let code = stCodeEditor.getDoc().getValue();

    $.post(item.url, code, function (data) {
        resultDiv.html(data);

    }).fail(function () {
        resultDiv.html("Error");
    });
}

$(function () {
    resultDiv = $('div#check-results');

    cboChecks = $('select#checks');


    _.forEach(SIMPLE_CHECK, item => {
        let opt = document.createElement("option");
        opt.text = item.name;
        opt.value = item.id;
        cboChecks.append(opt);
    });


    btnRun = $('button#run-check');
    btnRun.button();

    btnRun.bind('click', runCurrentCheck);
});