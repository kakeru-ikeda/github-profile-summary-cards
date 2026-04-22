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
exports.createDetailCard = void 0;
const card_1 = require("./card");
const d3 = __importStar(require("d3"));
function createDetailCard(title, userDetails, contributionsData, theme) {
    const card = new card_1.Card(title, 700, 200, theme);
    const svg = card.getSVG();
    // draw icon
    const panel = svg.append('g').attr('transform', `translate(30,30)`);
    const labelHeight = 14;
    const iconGroups = panel
        .selectAll(null)
        .data(userDetails)
        .enter()
        .append('g')
        .attr('transform', d => {
        const y = labelHeight * d.index * 2;
        return `translate(0,${y})`;
    })
        .attr('width', labelHeight)
        .attr('height', labelHeight)
        .attr('fill', theme.icon)
        .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))')
        .html(d => d.icon);
    iconGroups.nodes().forEach((node, index) => {
        const g = d3.select(node);
        const yPos = labelHeight * index * 2;
        const begin = `${index * 0.08}s`;
        g.append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0;1')
            .attr('dur', '0.6s')
            .attr('begin', begin)
            .attr('fill', 'freeze');
        g.append('animateTransform')
            .attr('attributeName', 'transform')
            .attr('type', 'translate')
            .attr('values', `-16,${yPos};0,${yPos}`)
            .attr('dur', '0.6s')
            .attr('begin', begin)
            .attr('fill', 'freeze');
    });
    const valueTexts = panel
        .selectAll(null)
        .data(userDetails)
        .enter()
        .append('text')
        .attr('x', labelHeight * 1.5)
        .attr('y', d => labelHeight * d.index * 2 + labelHeight)
        .style('fill', theme.text)
        .style('font-size', `${labelHeight}px`);
    valueTexts.nodes().forEach((node, index) => {
        const t = d3.select(node);
        const data = userDetails[index];
        const finalValue = data.value;
        const numericMatch = finalValue.match(/^(-?\d+)(.*)$/);
        const begin = `${index * 0.08 + 0.15}s`;
        t.append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0;1')
            .attr('dur', '0.6s')
            .attr('begin', begin)
            .attr('fill', 'freeze');
        if (!numericMatch) {
            t.text(finalValue);
            return;
        }
        const targetNum = parseInt(numericMatch[1], 10);
        const suffix = numericMatch[2];
        const steps = Math.min(20, Math.max(8, Math.abs(targetNum)));
        t.text(`0${suffix}`);
        const dur = 1.2;
        const stepDur = dur / steps;
        for (let i = 1; i <= steps; i++) {
            const v = Math.round((targetNum * i) / steps);
            t.append('set')
                .attr('attributeName', 'textContent')
                .attr('to', `${v}${suffix}`)
                .attr('begin', `${index * 0.08 + 0.15 + stepDur * i}s`)
                .attr('fill', 'freeze');
        }
    });
    // process chart data
    const lineChartData = [];
    const formatter = d3.timeFormat('%Y-%m');
    for (const data of contributionsData) {
        const formatDate = formatter(data.date);
        // Fix: Append day to ensure valid ISO 8601 date (YYYY-MM-DD) for reliable parsing
        data.date = new Date(`${formatDate}-01`);
        const lastIndex = lineChartData.length - 1;
        if (lineChartData.length == 0 || lineChartData[lastIndex].date.getTime() !== data.date.getTime()) {
            lineChartData.push({
                contributionCount: data.contributionCount,
                date: data.date
            }); // use new object
        }
        else {
            lineChartData[lastIndex].contributionCount += data.contributionCount;
        }
    }
    // prepare chart data
    const chartRightMargin = 30;
    const chartWidth = card.width - 2 * card.xPadding - chartRightMargin - 230;
    const chartHeight = card.height - 2 * card.yPadding - 10;
    const x = d3.scaleTime().range([0, chartWidth]);
    x.domain(d3.extent(lineChartData, function (d) {
        return d.date;
    }));
    // eslint-disable-next-line prefer-spread
    const yMax = Math.max.apply(Math, lineChartData.map(function (o) {
        return o.contributionCount;
    }));
    const y = d3.scaleLinear().range([chartHeight, 0]);
    y.domain([0, yMax]);
    y.nice();
    const valueline = d3
        .area()
        .x(function (d) {
        return x(d.date);
    })
        .y0(y(0))
        .y1(function (d) {
        return y(d.contributionCount);
    })
        .curve(d3.curveMonotoneX);
    const chartPanel = svg
        .append('g')
        .attr('color', theme.chart)
        .attr('transform', `translate(${card.width - chartWidth - card.xPadding + 5},10)`);
    // draw chart line
    chartPanel
        .append('path')
        .data([lineChartData])
        .attr('transform', `translate(${-chartRightMargin},0)`)
        .attr('stroke', theme.chart)
        .attr('fill', theme.chart)
        .attr('opacity', 0)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))')
        .attr('d', valueline)
        .append('animate')
        .attr('attributeName', 'opacity')
        .attr('values', '0;1')
        .attr('dur', '1.0s')
        .attr('begin', '0.4s')
        .attr('fill', 'freeze');
    // Add the X Axis
    const xAxis = d3
        .axisBottom(x)
        .tickFormat(d3.timeFormat('%y/%m'))
        .tickValues(lineChartData
        .filter((_, i) => {
        return i % 2 === 0;
    })
        .map(d => {
        return d.date;
    }));
    chartPanel
        .append('g')
        .attr('color', theme.text)
        .attr('transform', `translate(${-chartRightMargin},${chartHeight})`)
        .call(xAxis);
    // Add the Y Axis
    chartPanel
        .append('g')
        .attr('color', theme.text)
        .attr('transform', `translate(${chartWidth - chartRightMargin},0)`)
        .call(d3.axisRight(y).ticks(8));
    // hard code this coordinate becuz I'm too lazy
    chartPanel
        .append('g')
        .append('text')
        .text('contributions in the last year')
        .attr('y', title.length > 30 ? 140 : -15) // if the title is too long, then put text to the bottom
        .attr('x', 230)
        .style('fill', theme.text)
        .style('font-size', `10px`);
    return card.toString();
}
exports.createDetailCard = createDetailCard;
