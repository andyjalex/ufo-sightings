import * as d3 from "d3";



export default class D3Chart {
  constructor(element) {
    console.log(element)
    let vis = this;
    vis.margin = {
        left: 50,
        right: 50,
        top: 28,
        bottom: 64
      }
    vis.height = 350 - vis.margin.top - vis.margin.bottom
		vis.width = 800 - vis.margin.left - vis.margin.right

    vis.svg = d3
      .select(element)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + (vis.width + vis.margin.left + vis.margin.right) + " " + (vis.height + vis.margin.top + vis.margin.bottom))
      .style("background-color", "grey")
      .style("border-radius", "25px")
      .style("", "grey")
      .classed("svg-content", true)
      .append("g")
      .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

    // set the colour scale
    vis.color = d3.scaleOrdinal(d3.schemeCategory10);

    vis.xLabel = vis.svg
      .append("text")
      .attr("x", vis.width / 2)
      .attr("y", vis.height + 50)
      .attr("text-anchor", "middle");

    vis.svg
      .append("text")
      .attr("x", -(vis.height / 2))
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("No. Sightings")
      .attr("transform", "rotate(-90)");

    vis.xAxisGroup = vis.svg
      .append("g")
      .attr("transform", `translate(0, ${vis.height})`);

    vis.yAxisGroup = vis.svg.append("g");
  }

  //will accept week number
  update(data) {
    const vis = this;
    console.log("update", data);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.sightings) * 0.95,
        d3.max(data, (d) => d.sightings),
      ])
      .range([vis.height, 0]);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.weekDayName))
      .range([0, vis.width])
      .padding(0.4);

    const xAxisCall = d3.axisBottom(x);
    vis.xAxisGroup
      .transition()
      .duration(500)
      .call(xAxisCall)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    const yAxisCall = d3.axisLeft(y);
    vis.yAxisGroup.transition().duration(500).call(yAxisCall);

    // === GRID LINES (one grid group) ===
    let grid = vis.svg.select(".grid");

    // If it doesn't exist yet, append it
    if (grid.empty()) {
      grid = vis.svg.append("g").attr("class", "grid");
    }

    // Always update the grid
    grid
      .transition()
      .duration(500)
      .call(d3.axisLeft(y).tickSize(-vis.width).tickFormat(""));

    // == BARS DATA JOIN ==
    const rects = vis.svg.selectAll("rect").data(data, (d) => d.weekDayName);

    // EXIT
    rects
      .exit()
      .transition()
      .duration(500)
      .attr("height", 0)
      .attr("y", vis.height)
      .remove();

    // UPDATE
    rects
      .transition()
      .duration(500)
      .attr("x", (d) => x(d.weekDayName))
      .attr("y", (d) => y(d.sightings))
      .attr("width", x.bandwidth)
      .attr("height", (d) => vis.height - y(d.sightings));

    // ENTER

    rects
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.weekDayName))
      .attr("width", x.bandwidth)
      .attr("fill", (d, i) => vis.color(i))
      .attr("y", vis.height)
      .transition()
      .duration(500)
      .attr("height", (d) => vis.height - y(d.sightings))
      .attr("y", (d) => y(d.sightings));

    // Remove existing labels first
    //vis.svg.selectAll('.bar1-label').remove();

    const labels = vis.svg.selectAll(".bar1-label").data(data, (d) => d.weekDayName);

    // EXIT
    labels
      .exit()
      .transition()
      .duration(500)
      .attr("height", 0)
      .attr("y", vis.height)
      .remove();

    //update
    labels
      .transition()
      .duration(500)
      .attr("y", (d) => y(d.sightings) - 8)
      .attr("x", (d) => x(d.weekDayName) + x.bandwidth() / 2)
      .text((d) => d.sightings)

    //Enter
    labels
      .enter()
      .append("text")
      .attr("class", "bar1-label")
      .text((d) => d.sightings)
      .attr("y", vis.height)
      .attr("x", (d) => x(d.weekDayName) + x.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .transition()
      .duration(500)
      .attr("height", (d) => vis.height - y(d.sightings))
      .attr("y", (d) =>  y(d.sightings) - 8)
  }
}
