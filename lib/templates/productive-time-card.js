"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductiveCard = void 0;
const card_1 = require("./card");
const d3 = __importStar(require("d3"));
const d3Axis = __importStar(require("d3-axis"));
function createProductiveCard(chartData, theme, utcOffset) {
    const title = 'Commits ' + '(UTC ' + (utcOffset >= 0 ? '+' : '') + utcOffset.toFixed(2) + ')';
    const card = new card_1.Card(title, 340, 200, theme);
    const svg = card.getSVG();
    const chartWidth = card.width - 60;
    const chartHeight = 100;
    const bottomScaleBand = d3.scaleBand().range([0, chartWidth]).padding(0.1);
    const bottomAxis = d3Axis.axisBottom(bottomScaleBand);
    if (chartData.length != 24) {
        throw Error('productive time array size should be 24');
    }
    bottomScaleBand.domain(chartData.map(function (_, index, __) {
        return index;
    }));
    const yMax = Math.max(...chartData.map(function (d) {
        return d;
    }));
    const y = d3.scaleLinear().range([chartHeight, 0]);
    y.domain([0, yMax]);
    y.nice();
    const chartPanel = svg
        .append('g')
        .attr('color', theme.chart)
        .attr('transform', `translate(${(card.width - chartWidth) / 2 + 5},${card.yPadding / 2})`);
    const xAxis = bottomAxis.tickValues([0, 6, 12, 18, 23]);
    // Add the X Axis
    const g = chartPanel.append('g').attr('color', theme.text).attr('transform', `translate(0,${chartHeight})`);
    g.call(xAxis);
    // custom x axis, here is svg magic
    // Add more space for first bar
    g.select('.domain').attr('d', `M${0 - bottomScaleBand(1) + bottomScaleBand(0) + bottomScaleBand.bandwidth()},0.5H${chartWidth}.5`);
    // Add the Y Axis
    chartPanel
        .append('g')
        .attr('color', theme.text)
        // Add gap before first bar
        .attr('transform', `translate(${0 - bottomScaleBand(1) + bottomScaleBand(0) + bottomScaleBand.bandwidth()},0)`)
        .call(d3.axisLeft(y).ticks(5));
    const bars = chartPanel
        .selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', theme.chart)
        .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))')
        .attr('x', function (_, index) {
        return bottomScaleBand(index);
    })
        .attr('y', chartHeight)
        .attr('width', bottomScaleBand.bandwidth())
        .attr('height', 0);
    bars.nodes().forEach((node, index) => {
        const bar = d3.select(node);
        const value = Number(chartData[index]);
        const targetY = y(value);
        const targetH = chartHeight - targetY;
        const begin = `${0.2 + index * 0.04}s`;
        bar.append('animate')
            .attr('attributeName', 'y')
            .attr('from', `${chartHeight}`)
            .attr('to', `${targetY}`)
            .attr('dur', '0.8s')
            .attr('begin', begin)
            .attr('fill', 'freeze');
        bar.append('animate')
            .attr('attributeName', 'height')
            .attr('from', '0')
            .attr('to', `${targetH}`)
            .attr('dur', '0.8s')
            .attr('begin', begin)
            .attr('fill', 'freeze');
    });
    chartPanel
        .append('g')
        .append('text')
        .text('per day hour')
        .attr('y', 130)
        .attr('x', 220)
        .style('fill', theme.text)
        .style('font-size', `10px`);
    return card.toString();
}
exports.createProductiveCard = createProductiveCard;
