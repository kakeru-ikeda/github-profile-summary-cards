import {Theme} from '../const/theme';
import * as d3 from 'd3';
import {JSDOM} from 'jsdom';
export class Card {
    title: string;
    width: number;
    height: number;
    xPadding: number;
    yPadding: number;
    body: d3.Selection<d3.ContainerElement, any, null, undefined>;
    svg: d3.Selection<SVGSVGElement, any, null, undefined>;
    constructor(title = 'Title', width = 1280, height = 1024, theme: Theme, xPadding = 30, yPadding = 40) {
        this.title = title;
        this.width = width;
        this.height = height;
        this.xPadding = xPadding;
        this.yPadding = yPadding;
        // use fake dom let us can get html element
        const fakeDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        this.body = d3.select(fakeDom.window.document).select('body');
        this.svg = this.body
            .append('div')
            .attr('class', 'container')
            .append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
        this.svg.append('style').html(
            `* {
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
        .card-title { animation: slideInLeft 0.6s ease-out both; }`
        );
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
        this.svg = this.svg.append<SVGSVGElement>('g').attr('transform', 'translate(0,40)');
    }

    getSVG() {
        return this.svg;
    }

    toString() {
        return this.body.select('.container').html();
    }
}
