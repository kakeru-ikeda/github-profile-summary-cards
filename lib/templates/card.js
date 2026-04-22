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
exports.Card = void 0;
const d3 = __importStar(require("d3"));
const jsdom_1 = require("jsdom");
class Card {
    constructor(title = 'Title', width = 1280, height = 1024, theme, xPadding = 30, yPadding = 40) {
        this.title = title;
        this.width = width;
        this.height = height;
        this.xPadding = xPadding;
        this.yPadding = yPadding;
        // use fake dom let us can get html element
        const fakeDom = new jsdom_1.JSDOM('<!DOCTYPE html><html><body></body></html>');
        this.body = d3.select(fakeDom.window.document).select('body');
        this.svg = this.body
            .append('div')
            .attr('class', 'container')
            .append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
        this.svg.append('style').html(`* {
          font-family: 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        text { animation: fadeIn 0.8s ease-out both; }
        .card-title { animation: slideInLeft 0.6s ease-out both; }`);
        const strokeWidth = 1;
        this.svg
            .append('rect')
            .attr('x', 1)
            .attr('y', 1)
            .attr('rx', 5)
            .attr('ry', 5)
            // 100% - 2px to show borderline
            .attr('height', `${((height - 2 * strokeWidth) / height) * 100}%`)
            // 100% - 2px to show borderline
            .attr('width', `${((width - 2 * strokeWidth) / width) * 100}%`)
            .attr('stroke', `${theme.stroke}`)
            .attr('stroke-width', strokeWidth)
            .attr('fill', `${theme.background}`)
            .attr('stroke-opacity', `${theme.strokeOpacity}`);
        const isEmptyTitle = this.title == '';
        if (!isEmptyTitle) {
            this.svg
                .append('text')
                .attr('class', 'card-title')
                .attr('x', this.xPadding)
                .attr('y', this.yPadding)
                .style('font-size', `22px`)
                .style('fill', `${theme.title}`)
                .text(this.title);
        }
        this.svg = this.svg.append('g').attr('transform', 'translate(0,40)');
    }
    getSVG() {
        return this.svg;
    }
    toString() {
        return this.body.select('.container').html();
    }
}
exports.Card = Card;
