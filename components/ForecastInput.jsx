import LineGraph from './LineGraph';
import CodeBoxPopover from './CodeBoxPopover';
import React, { useState } from 'react';

import about from '../data/about';

const ForecastInput = () => {
    const [inputData, setInputData] = useState('');
    const [windowSize, setWindowSize] = useState();
    const [predictions, setPredictions] = useState([]);
    const [forecastRange, setForecastRange] = useState();
    const [l1Regularization, setL1Regularization] = useState();
    const [l2Regularization, setL2Regularization] = useState();
    const [running, setRunning] = useState(false);
    const [indexes, setIndexes] = useState([]);
    const [input, setInput] = useState([]);
    const [lowQuality, setLowQuality] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLowQuality();
        try {
            setRunning(true);
            setIndexes([]);
            setInput([]);
            const graphData = inputData.trim().split(',').map(Number);
            const inputIndexes = Array.from(graphData, (_, i) => i);
            const predictMLPResponse = await fetch('/api/forecast', {
                method: 'POST',
                body: JSON.stringify({ inputData, windowSize, forecastRange }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { prediction, low_model_quality } = await predictMLPResponse.json();
            setLowQuality(low_model_quality);
            setRunning(false);
            if (low_model_quality !== true) {
                setPredictions(predictions => [...predictions, prediction]);
            }
            setIndexes(inputIndexes);
            setInput(graphData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClearPrediction = async (event) => {
        event.preventDefault();
        try {
            setPredictions([]);
            setLowQuality();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='centertexts'>
                <br />
                <div>
                    <CodeBoxPopover buttonTitle='About for App' codeSnippet={about} language="language-html" />
                </div>
                <br />
                <h1>General Trend Forecast</h1>
                <p style={{ fontSize: '18px' }}>The model utilizes a rolling window of numbers in order to predict the next numbers in the sequence.</p>
                <br />
                <form onSubmit={handleSubmit} style={{ padding: '10px', margin: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                        <label htmlFor="inputData">Input Data (comma-separated):</label>
                        <input
                            id="inputData"
                            type="text"
                            value={inputData}
                            onChange={(event) => setInputData(event.target.value)}
                            placeholder="1,2,3,2,1,2,3,2,1,2,3,2"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                        <label htmlFor="windowSize">Lookback Window (default: 1):</label>
                        <input
                            id="windowSize"
                            type="number"
                            value={windowSize}
                            onChange={(event) => setWindowSize(event.target.value)}
                            placeholder="1"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                        <label htmlFor="forecastRange">Prediction Range (default: 5):</label>
                        <input
                            id="forecastRange"
                            type="number"
                            value={forecastRange}
                            onChange={(event) => setForecastRange(event.target.value)}
                            placeholder="5"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                        <label htmlFor="l1Regularization">L1 Regularization (default: 0.005):</label>
                        <input
                            id="l1Regularization"
                            type="decimal"
                            value={l1Regularization}
                            onChange={(event) => setL1Regularization(event.target.value)}
                            placeholder="0.005"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="l2Regularization">L2 Regularization (default: 0.001):</label>
                        <input
                            id="l2Regularization"
                            type="decimal"
                            value={l2Regularization}
                            onChange={(event) => setL2Regularization(event.target.value)}
                            placeholder="0.001"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>


                <br />
                <button className="custombutton" type="submit" title="Each submit produces a new forecast">Submit</button>
                </form>
                <form onSubmit={handleClearPrediction}>
                    <button className='custombutton' type="submit" title="Clear forecasts">Clear Forecasts</button>
                </form>
                <br />
                {lowQuality === true && (
                    <div className="notification">
                        <p>Model quality is low. Please adjust the Lookback Window. Forecasted values will not be plotted.</p>
                    </div>
                )}         
                {inputData === '' && (
                    <div>
                        <h2>Prediction:</h2>
                        <p style={{ fontSize: '24px' }}>Enter data to predict.</p>
                    </div>
                )}
                {running === true && inputData !== '' && (
                    <div>
                        <h2>Prediction:</h2>
                        <p style={{ fontSize: '24px' }}>Training...</p>
                    </div>
                )}
                {predictions && running === false && inputData !== '' && (
                    <>
                        <div>
                            <h2>Prediction:</h2>
                        </div>
                        <br />
                        <div>
                            <LineGraph title={`Line Graph with Forecast`} labels={indexes} data={input} forecast={predictions} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ForecastInput;
