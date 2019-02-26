import Chart from "chart.js";
import "chartjs-plugin-labels";
import { capitalizeText } from "../../util/TextUtil";

const COLORS = ["#3EABAB", "#FF96AC", "#3B5F5F", "#F3BBC8", "#FAE6EB"];

export default class TopTagsChart {
  constructor(canvas, props) {
    const data = this.formatData(props);
    this.chart = new Chart(canvas.getContext("2d"), {
      data,
      type: "pie",
      options: {
        color: COLORS,
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        plugins: {
          labels: {
            render: "label",
            fontSize: 14,
            fontColor: "#000",
            fontFamily: '"Work Sans", Arial, sans-serif'
          }
        },
        responsive: true,
        tooltips: {
          enabled: false
        }
      }
    });
  }

  formatData({ tags }) {
    return {
      datasets: [
        {
          data: tags.map(t => t.count),
          backgroundColor: COLORS
        }
      ],
      labels: tags.map(t => t.text).map(capitalizeText)
    };
  }
}
