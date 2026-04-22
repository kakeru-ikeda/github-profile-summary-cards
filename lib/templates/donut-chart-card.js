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
exports.createDonutChartCard = void 0;
const card_1 = require("./card");
const d3 = __importStar(require("d3"));
function createDonutChartCard(title, data, theme) {
    const pie = d3.pie().value(function (d) {
        return d.value;
    });
    const pieData = pie(data);
    const card = new card_1.Card(title, 340, 200, theme);
    const margin = 10;
    const radius = (Math.min(card.width, card.height) - 2 * margin - card.yPadding) / 2;
    const arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(radius / 2);
    const svg = card.getSVG();
    // draw language node
    const panel = svg.append('g').attr('transform', `translate(${card.xPadding + margin},${0})`);
    const labelHeight = 14;
    const legendRects = panel
        .selectAll(null)
        .data(pieData)
        .enter()
        .append('rect')
        .attr('y', d => labelHeight * d.index * 1.8 + card.height / 2 - radius - 12)
        .attr('width', labelHeight)
        .attr('height', labelHeight)
        .attr('fill', pieData => pieData.data.color)
        .attr('stroke', `${theme.background}`)
        .style('stroke-width', '1px')
        .style('opacity', 0);
    legendRects.nodes().forEach((node, index) => {
        d3.select(node)
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0;1')
            .attr('dur', '0.5s')
            .attr('begin', `${0.2 + index * 0.06}s`)
            .attr('fill', 'freeze');
    });
    const legendTexts = panel
        .selectAll(null)
        .data(pieData)
        .enter()
        .append('text')
        .text(d => {
        return d.data.name;
    })
        .attr('x', labelHeight * 1.2)
        .attr('y', d => labelHeight * d.index * 1.8 + card.height / 2 - radius)
        .style('fill', theme.text)
        .style('font-size', `${labelHeight}px`)
        .style('opacity', 0);
    legendTexts.nodes().forEach((node, index) => {
        d3.select(node)
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0;1')
            .attr('dur', '0.5s')
            .attr('begin', `${0.25 + index * 0.06}s`)
            .attr('fill', 'freeze');
    });
    // draw pie chart
    const g = svg
        .append('g')
        .attr('transform', `translate( ${card.width - radius - margin - card.xPadding}, ${(card.height - card.yPadding) / 2} )`)
        .selectAll('.arc')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'arc');
    const piePaths = g
        .append('path')
        .attr('d', arc)
        .style('fill', function (pieData) {
        return pieData.data.color;
    })
        .attr('stroke', `${theme.background}`)
        .style('stroke-width', '2px')
        .style('opacity', 0)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))');
    piePaths.nodes().forEach((node, index) => {
        const path = d3.select(node);
        path.append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0;1')
            .attr('dur', '0.8s')
            .attr('begin', `${0.15 + index * 0.08}s`)
            .attr('fill', 'freeze');
        path.append('animateTransform')
            .attr('attributeName', 'transform')
            .attr('type', 'scale')
            .attr('values', '0.6;1')
            .attr('dur', '0.8s')
            .attr('begin', `${0.15 + index * 0.08}s`)
            .attr('fill', 'freeze');
    });
    return card.toString();
}
exports.createDonutChartCard = createDonutChartCard;
