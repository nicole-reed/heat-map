import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import * as d3 from 'd3';
import { color } from 'd3';

function App() {

  const [data, setData] = useState([])

  useEffect(async () => {
    try {
      const heatMapData = await axios.get('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')

      setData(heatMapData.data.monthlyVariance)
    } catch (error) {
      console.log('error fetching data:\n', error)
    }
  }, [])

  useEffect(() => {
    if (data.length) {
      const w = 1050;
      const h = 650;
      const padding = 60;
      const minYear = d3.min(data, (d) => d.year);
      const maxYear = d3.max(data, (d) => d.year);
      const minTemp = d3.min(data, (d) => 8.66 + d.variance);
      const maxTemp = d3.max(data, (d) => 8.66 + d.variance);
      const temps = data.map((d) => d.variance);
      const minVar = d3.min(data, (d) => d.variance);
      const maxVar = d3.max(data, (d) => d.variance);
      const tempDifs = (d3.max(temps) - d3.min(temps)) / 9;


      console.log(data)
      console.log('min', minVar)
      console.log('max', maxVar)
      console.log(tempDifs)

      const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, w - padding]);


      const yScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => d.month) - 1, d3.max(data, (d) => d.month)])
        .range([h - padding, padding]);

      const colors = ['#00008b', '#5e5ece', '#58ccf3', '#94f3b8ee', '#f5f5b8', '#f8cf60', '#ffa500', '#f33d3dc5', '#8b0000'];

      // const colors = ['#8b0000', '#f33d3dc5', '#ffa500', '#f8cf60', '#f5f5b8', '#94f3b8ee', '#58ccf3', '#5e5ece', '#00008b'];
      const colorScale = d3.scaleQuantize()
        .domain([d3.min(data, (d) => d.variance), d3.max(data, (d) => d.variance)])
        .range(colors);



      const svg = d3.select('#chart')
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.month))
        .attr("width", (d) => (w - padding) / (maxYear - minYear))
        .attr("height", (h - padding) / 13)
        .attr('class', 'cell')
        .attr('data-month', (d) => d.month)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => 8.66 + d.variance)
        .style('fill', (d) => colorScale(d.variance))
        .append("title")
        .attr('id', 'tooltip')
        .attr('data-year', (d) => d.year)
        .text((d) => `${d.year}\nTemp: ${(8.66 + d.variance).toFixed(2)}℃\n`)


      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))


      const tickLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      const yAxisScale = d3.scaleLinear()
        .domain([.5, 12.5])
        .range([h - padding, padding]);

      const yAxis = d3.axisLeft(yAxisScale)
        .tickSizeOuter(0)
        .tickFormat((d, i) => tickLabels[i])


      svg.append("g")
        .attr('id', 'x-axis')
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

      svg.append("g")
        .attr('id', 'y-axis')
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

      svg.append('text')
        .attr('id', 'title')
        .attr('x', padding)
        .attr('y', (h - h) + 45)
        .text('Global Land-Surface Temp 1753-2015')
        .style('font-size', '30px')

      svg.append('text')
        .attr('id', 'description')
        .attr('x', w - (w / 4))
        .attr('y', (h - h) + 45)
        .text('Base temperature: 8.66℃')

      const legend = svg.append('g')
        .attr('id', 'legend')

      const legendColors = [];
      for (let i = 0; i < 9; i++) {
        legendColors.push(d3.min(temps) + ((tempDifs * i) + (tempDifs / 2)));
      };

      legend.selectAll('rect')
        .data(legendColors)
        .enter()
        .append('rect')
        .attr('x', (d, i) => padding + (30 * i))
        .attr('y', (h - padding) + 30)
        .attr('val', d => d)
        .attr('class', 'legend-cell')
        .attr('width', 30)
        .attr('height', 10)
        .style('fill', d => colorScale(d));


      const legendTicks = [];
      for (let i = 0; i < 10; i++) {
        legendTicks.push(d3.min(temps) + (tempDifs * i))
      };
      console.log(legendTicks)

      const legendScale = d3.scaleLinear()
        .domain([legendTicks[0], legendTicks[legendTicks.length - 1]])
        .range([padding, padding + (30 * 9)])

      const legendAxis = d3.axisBottom(legendScale)
        .tickValues(legendTicks)
        .tickFormat(d3.format('.1f'))


      legend.append('g')
        .attr('id', 'legend-axis')
        .attr("transform", `translate(0, ${h - 20})`)
        .call(legendAxis);

      legend.append('text')
        .attr('id', 'legend')
        .attr('x', 350)
        .attr('y', (h - padding) + 43)
        .text('Variance From Base Temp')









    }
  }, [data])


  return (
    <div className="App">

      <div id="chart"></div>

    </div>
  );
}

export default App;
