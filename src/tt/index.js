//http://codemirror.net/demo/simplemode.html
const REKEYWORDS = /(?:table|row|group|options|g?var|state|input|output|as|omega|>>|function)\b/;

const RE_ST_OPEN_BLOCK = /(?:[{])/;
const RE_ST_CLOSE_BLOCK = /(?:[}])/;


import 'codemirror/addon/mode/simple';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import CodeMirror from 'codemirror';
import $ from 'jquery';

function defineTestTableMode() {
    CodeMirror.defineSimpleMode("testtable", {
        // The start state contains the rules that are intially used
        start: [
            // The regex matches the token, the token property contains the type
            {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},

            {regex: /(TIME_OF_DAY|TOD)#\d{1,2}:\d{1,2}:\d{1,2}(\.[0-9]{,3})/, token: "atom"},
            {regex: /(DATE)#\d+-\d+-\d+/, token: "atom"},
            {regex: /(TIME|T)#((\d|[_])+(ms|s|m|h))*/, token: "atom"},
            {regex: /(DATE_AND_TIME|DT)#\d+-\d+-\d+-\d{1,2}:\d{1,2}:\d{1,2}(\.[0-9]{,3})/, token: "atom"},

            {regex: REKEYWORDS, token: "keyword"},
            {regex: RE_ST_OPEN_BLOCK, token: "keyword", indent: true},
            {regex: RE_ST_CLOSE_BLOCK, token: "keyword", dedent: true},

            {regex: /true|false|null/i, token: "atom"},
            //{regex: /(U?[SLD]?INT#)?((1[06]|8|2)#)?[_\d]+/i, token: "number"},
            {regex: /((1[06]|8|2)#)?[_\d]+/i, token: "number"},

            //{regex: /(L?REAL#)?[\d_]+\.[\d_]+(e\d+)?/i, token: "number"},
            {regex: /[\d_]+\.[\d_]+(e\d+)?/i, token: "number"},

            {regex: /\/\/.*$/, token: "comment"},
            {regex: /\/\*/, token: "comment", next: "comment"},


            // A next property will cause the mode to move to a different state
            {regex: /`[^`]`/, token: "comment", token: "string"},

            {regex: /[\w][\w\d]*/, token: "variable"},
        ],
        // The multi-line comment state.
        comment: [
            {regex: /.*?\*\//, token: "comment", next: "start"},
            {regex: /.*/, token: "comment"}
        ],
        // The meta property contains global information about the mode. It
        // can contain properties like lineComment, which are supported by
        // all modes, and also directives like dontIndentStates, which are
        // specific to simple modes.
        meta: {
            dontIndentStates: ["comment"],
            lineComment: "//"
        }
    });
}

export let ttEditor;
$(function () {
    defineTestTableMode();
    ttEditor = CodeMirror(document.getElementById("tt-editor"), {
        lineNumbers: true,
        gutter: ["gutter-errors", "gutter-warnings"],
        mode: "testtable"
    });
    ttEditor.getDoc().setValue("table name {\n}")
});

