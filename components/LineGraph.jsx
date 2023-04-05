import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import React, { useCallback, useRef } from 'react';

const colors = [
  "#ffe0a1",
  "#ffd780",
  "#ffc961",
  "#ffb740",
  "#ffa621",
  "#ff9503",
  "#e68a00",
  "#cc7a00",
  "#b36b00",
  "#995c00",
  "#7f4d00",
  "#663d00",
  "#ffb8a1",
  "#ffa380",
  "#ff8361",
  "#ff6440",
  "#ff461f",
  "#e63503",
  "#cc2d00",
  "#b32400"
];


const LineGraph = ({ title, labels, data, forecast }) => {
  let ref = useRef(null);

  const label = data.length;

  const forecastDatasets = forecast.map((forecastArray, i) => {
    const forecastIndex = [];
    for (let i = 0; i < forecastArray.length; i++) {
        forecastIndex.push((i + data.length).toString());
    }
    const forecastData = forecastIndex.map((x, i) => ({ x: x, y: forecastArray[i] }));
    return {
      label: `Forecast #  ${(i + 1).toString()}`,
      data: forecastData,
      pointBackgroundColor: colors[i % colors.length],
      pointBorderColor: colors[i % colors.length],
      pointRadius: 5,
      borderWidth: 1,
      fill: false
    };
  });

  const downloadChart = useCallback(() => {
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = ref.current.toBase64Image();
    link.click();
  }, []);

  const options = {
    // maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    layout: {
      padding: 50
    },
    plugins: {
        legend: {
            display: true,
            labels: {
                boxWidth: 0,
            },
        },
    },
    scales: {
      y: {
        min: 0,
      }
    }
  };

  return (
    <>
      <br /> 
      <button type="button" className="btn btn-outline-secondary btn-sm margin-left" onClick={downloadChart}>Download Chart</button>
      <h3 className="metrics-card-center">{title}</h3>
      <Line
        ref={ref}
        data={{
          "labels": labels,
          "datasets": [
            {
              "label": "Historical Data",
              "data": data,
              "cubicInterpolationMode": "monotone",
              "backgroundColor": ["#000080"],
              "borderColor": ["#000080"],
              "pointRadius": 1,
              "order": 2 // add order property
            },
            ...forecastDatasets
          ]
        }}
        options={options}
      />
    </>
  );
};

export default LineGraph;
