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
exports.createStatsCard = void 0;
const card_1 = require("./card");
const icon_1 = require("../const/icon");
const d3 = __importStar(require("d3"));
function createStatsCard(title, statsData, theme) {
    const card = new card_1.Card(title, 340, 200, theme);
    const svg = card.getSVG();
    const panel = svg.append('g').attr('transform', `translate(30,20)`);
    const labelHeight = 14;
    const iconGroups = panel
        .selectAll(null)
        .data(statsData)
        .enter()
        .append('g')
        .attr('class', 'stats-icon')
        .attr('transform', (d) => `translate(0,${labelHeight * d.index * 1.8})`)
        .attr('width', labelHeight)
        .attr('height', labelHeight)
        .attr('fill', theme.icon)
        .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))')
        .html((d) => d.icon);
    iconGroups.nodes().forEach((node, index) => {
        const g = d3.select(node);
        const yPos = labelHeight * index * 1.8;
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
    const labels = panel
        .selectAll(null)
        .data(statsData)
        .enter()
        .append('text')
        .attr('class', 'stats-label')
        .text((d) => `${d.name}`)
        .attr('x', labelHeight * 1.5)
        .attr('y', (d) => labelHeight * d.index * 1.8 + labelHeight)
        .style('fill', theme.text)
        .style('font-size', `${labelHeight}px`)
        .style('font-weight', '500');
    labels.nodes().forEach((node, index) => {
        const t = d3.select(node);
        const begin = `${index * 0.08 + 0.1}s`;
        t.append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '0;1')
            .attr('dur', '0.6s')
            .attr('begin', begin)
            .attr('fill', 'freeze');
    });
    const values = panel
        .selectAll(null)
        .data(statsData)
        .enter()
        .append('text')
        .attr('class', 'stats-value')
        .attr('x', 130)
        .attr('y', (d) => labelHeight * d.index * 1.8 + labelHeight)
        .style('fill', theme.text)
        .style('font-size', `${labelHeight}px`)
        .style('font-weight', '600');
    values.nodes().forEach((node, index) => {
        const t = d3.select(node);
        const data = statsData[index];
        const finalValue = data.value;
        const numericMatch = finalValue.match(/^(-?\d+)(.*)$/);
        const begin = `${index * 0.08 + 0.2}s`;
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
                .attr('begin', `${index * 0.08 + 0.2 + stepDur * i}s`)
                .attr('fill', 'freeze');
        }
    });
    const panelForGitHubLogo = svg.append('g').attr('transform', `translate(220,20)`);
    const logoGroup = panelForGitHubLogo
        .append('g')
        .attr('transform', `scale(6)`)
        .style('fill', theme.icon)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))')
        .html(icon_1.Icon.GITHUB);
    logoGroup
        .append('animate')
        .attr('attributeName', 'opacity')
        .attr('values', '0;1')
        .attr('dur', '0.8s')
        .attr('begin', '0.2s')
        .attr('fill', 'freeze');
    return card.toString();
}
exports.createStatsCard = createStatsCard;
