//http://codemirror.net/demo/simplemode.html
const REKEYWORDS = /(?:ANY|ANY_BIT|ANY_DATE|ANY_DERIVED|VAR_OUTPUT|ANY_ELEMENTARY|ANY_INT|ANY_NUM|ANY_REAL|ANY_STRING|ARRAY|BOOL|BYTE|DATE_AND_TIME|DINT|DWORD|INT|LINT|LREAL|LWORD|REAL|SINT|STRING|TIME|TIME_OF_DAY|TOD|UDINT|UINT|ULINT|USINT|WORD|WSTRING|AT|BY|CASE|COLON|CONFIGURATION|CONSTANT|DATE|DO|DT|ELSE|ELSIF|END_CASE|END_CONFIGURATION|END_FOR|END_FUNCTION|END_FUNCTION_BLOCK|END_IF|END_PROGRAM|END_REPEAT|END_RESOURCE|END_STRUCT|END_TYPE|END_VAR|END_WHILE|EXIT|FOR|FUNCTION|FUNCTION_BLOCK|F_EDGE|IF|INTERVAL|NIL|NON_RETAIN|OF|ON|PRIORITY|PROGRAM|READ_ONLY|READ_WRITE|REPEAT|RESOURCE|RETAIN|RETURN|RIGHT_ARROW|R_EDGE|SINGLE|STRUCT|TASK|THEN|TO|TYPE|UNTIL|VAR|VAR_ACCESS|VAR_CONFIG|VAR_EXTERNAL|VAR_GLOBAL|VAR_INPUT|VAR_IN_OUT|VAR_TEMP|WHILE|WITH)\b/;

const RETOD = /(TIME_OF_DAY|TOD)#[012][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9]{,3})/;
const RENUMBER = /\b[0-9]+\\(\\.[0-9]+\\)?\b/;

import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';

export default function defineStMode() {
    CodeMirror.defineSimpleMode("st", {
        // The start state contains the rules that are intially used
        start: [
            // The regex matches the token, the token property contains the type
            {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
            {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
            {
                regex: REKEYWORDS,
                token: "keyword"
            },
            {regex: /true|false|null/i, token: "atom"},
            {
                regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
                token: "number"
            },
            {regex: /\{.*?\}/, token: 'hint'},
            {regex: /\/\/.*/, token: "comment"},
            //{regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
            // A next property will cause the mode to move to a different state
            {regex: /\/\*/, token: "comment", next: "comment"},
            {regex: /\(\*/, token: "comment", next: "commentRound"},
            //{regex: /[-+\/*=<>!]+/, token: "operator"},
            // indent and dedent properties guide autoindentation
            //{regex: /[\{\[\(]/, indent: true},
            //{regex: /[\}\]\)]/, dedent: true},
            {regex: /[\w][\w\d]*/, token: "variable"},
        ],
        commentRound: [
            {regex: /.*?\*\)/, token: "comment", next: "start"},
            {regex: /.*/, token: "comment"}
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