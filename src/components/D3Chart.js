import * as d3 from "d3";

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element) {
    const vis = this;
    vis.svg = d3
      .select(element)
      .append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .style("background-color", "grey")
      .style("border-radius", "25px")
      .style("", "grey")
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    vis.xLabel = vis.svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 50)
      .attr("text-anchor", "middle");

    vis.svg
      .append("text")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("No. Sightings")
      .attr("transform", "rotate(-90)");

    vis.xAxisGroup = vis.svg
      .append("g")
      .attr("transform", `translate(0, ${HEIGHT})`);

    vis.yAxisGroup = vis.svg.append("g");
    d3.json(
      "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings"
    ).then((dataset) => {
      this.wrangleData(dataset);
    });
  }

  getWeekStartDate(date) {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    return new Date(date.setDate(diff));
  }
  getWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));

    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const diff = (tempDate - week1) / (1000 * 60 * 60 * 24);
    return 1 + Math.floor(diff / 7);
  }

  wrangleData = (data) => {
    let vis = this;
    console.log(data);

    //create date field
    //create weekdayName field
    //create week number
    const newData = data.map((item) => {
      const [day, month, year] = item.date.split("/");
      const date = new Date(year, month - 1, day);
      const weekDayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const weekNumber = this.getWeekNumber(date);
      const weekStartDate = this.getWeekStartDate(new Date(date));
      return {
        sightings: item.sightings,
        date: date,
        weekNumber: weekNumber,
        weekStartDate: weekStartDate,
        weekDayName: weekDayName,
      };
    });
    console.log(newData);
    vis.data = newData;
    this.update();
  };

  //will accept week number
  update() {
    const vis = this;
    console.log("update", vis.data);
    vis.xLabel.text(`date`);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(vis.data, (d) => d.sightings) * 0.95,
        d3.max(vis.data, (d) => d.sightings),
      ])
      .range([HEIGHT, 0]);

    const x = d3
      .scaleBand()
      .domain(vis.data.map((d) => d.weekDayName))
      .range([0, WIDTH])
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

    // DATA JOIN
    const rects = vis.svg.selectAll("rect").data(vis.data);

    // EXIT
    rects
      .exit()
      .transition()
      .duration(500)
      .attr("height", 0)
      .attr("y", HEIGHT)
      .remove();

    // UPDATE
    rects
      .transition()
      .duration(500)
      .attr("x", (d) => x(d.weekDayName))
      .attr("y", (d) => y(d.sightings))
      .attr("width", x.bandwidth)
      .attr("height", (d) => HEIGHT - y(d.sightings));

    // ENTER
    rects
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.weekDayName))
      .attr("width", x.bandwidth)
      .attr("fill", "white")
      .attr("y", HEIGHT)
      .transition()
      .duration(500)
      .attr("height", (d) => HEIGHT - y(d.sightings))
      .attr("y", (d) => y(d.sightings));
  }
}
