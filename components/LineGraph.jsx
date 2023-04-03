import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

import React, { useCallback, useRef } from 'react';

const LineGraph = ({ title, labels, data, forecast }) => {
    let ref = useRef(null);

    const downloadChart = useCallback(() => {
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = ref.current.toBase64Image();
        link.click();
    }, [])

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
                display: false
            }
        },
        scales: {
            y: {
                min: 0,
            }
        }
    }

    return (
        <>
            <br /> 
            <button type="button" className="btn btn-outline-secondary btn-sm margin-left" onClick={downloadChart}>Download Chart</button>
            <h3 className="metrics-card-center">{title}</h3>
            <Line
                ref={ref}
                data={
                    {
                        "labels": labels,
                        "datasets": [
                            {
                                "label": "Y Values",
                                "data": data,
                                "cubicInterpolationMode": "monotone",
                                "backgroundColor": ["#000080"],
                                "borderColor": ["#000080"],
                                "pointRadius": 1
                            },
                            {
                                "data": [{
                                    x: `${data.length}`,
                                    y: forecast
                                }],
                                "label": "Forecast",
                                "pointBackgroundColor": "#FFDB58",
                                "pointBorderColor": "#FFDB58",
                                "pointRadius": 25
                            },
                            {
                                "data": [{
                                    x: `${labels.length + 1}`,
                                    y: Math.max(...data) + 1
                                }],
                                " ": 'rgba(255, 0, 0, 0)',
                                "pointBorderColor": 'rgba(255, 0, 0, 0)',
                            }
                        ]
                    }
                }
                options={options}
            />
        </>
    )

}

export default LineGraph