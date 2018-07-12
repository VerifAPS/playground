import {Grid, Data, Formatters} from 'slickgrid-es6';
//import { options, columns } from './grid-config';
import $ from "jquery";


/*
import "slickgrid-es6/dist/slick.grid.variables.scss";
import "slickgrid-es6/dist/slick.grid.scss";
import "slickgrid-es6/dist/slick-default-theme.scss";
*/

const options = {};

var columns = [
    {id: "title", name: "Title", field: "title"}
];

const gridColumns = [{
    id: "%",
    name: "% Complete",
    field: "percentComplete",
    formatter: Formatters.PercentCompleteBar
}, ...columns]; // some column def

const dataView = new Data.DataView();
//dataView.setItems([1,2,3,4]); // some data

$(window).ready(function () {
    const grid = new Grid('#gtt', dataView, columns, options);
});

/*
//---------------------------------------------------------------------------

var grid;
var columns = [
    {id: "title", name: "Title", field: "title"},
    {id: "duration", name: "Duration", field: "duration"},
    {id: "%", name: "% Complete", field: "percentComplete"},
    {id: "start", name: "Start", field: "start"},
    {id: "finish", name: "Finish", field: "finish"},
    {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
];

var options = {
    enableCellNavigation: true,
    enableColumnReorder: false
};

$(function () {
    var data = [];
    for (var i = 0; i < 500; i++) {
        data[i] = {
            title: "Task " + i,
            duration: "5 days",
            percentComplete: Math.round(Math.random() * 100),
            start: "01/01/2009",
            finish: "01/05/2009",
            effortDriven: (i % 5 == 0)
        };
    }

    grid = new Slick.Grid("#gtt", data, columns, options)
});*/