import {Card} from './card';
import {Theme} from '../const/theme';
import * as d3 from 'd3';
import * as d3Axis from 'd3-axis';

export function createProductiveCard(chartData: number[], theme: Theme, utcOffset: number) {
    const title = 'Commits ' + '(UTC ' + (utcOffset >= 0 ? '+' : '') + utcOffset.toFixed(2) + ')';
    const card = new Card(title, 340, 200, theme);
    const svg = card.getSVG();

    const chartWidth = card.width - 60;
    const chartHeight = 100;
    const bottomScaleBand = d3.scaleBand<number>().range([0, chartWidth]).padding(0.1);
    const bottomAxis: d3Axis.Axis<number> = d3Axis.axisBottom(bottomScaleBand);

    if (chartData.length != 24) {
        throw Error('productive time array size should be 24');
    }

    bottomScaleBand.domain(
        chartData.map(function (_: number, index: number, __: number[]) {
            return index;
        })
    );

    const yMax = Math.max(
        ...chartData.map(function (d: number) {
            return d;
        })
    );

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
    g.select('.domain').attr(
        'd',
        `M${0 - bottomScaleBand(1)! + bottomScaleBand(0)! + bottomScaleBand.bandwidth()},0.5H${chartWidth}.5`
    );

    // Add the Y Axis
    chartPanel
        .append('g')
        .attr('color', theme.text)
        // Add gap before first bar
        .attr(
            'transform',
            `translate(${0 - bottomScaleBand(1)! + bottomScaleBand(0)! + bottomScaleBand.bandwidth()},0)`
        )
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
            return bottomScaleBand(index)!;
        })
        .attr('y', chartHeight)
        .attr('width', bottomScaleBand.bandwidth())
        .attr('height', 0);

    bars.nodes().forEach((node: any, index: number) => {
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
