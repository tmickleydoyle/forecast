import LineGraph from './LineGraph';
import CodeBoxPopover from './CodeBoxPopover';
import React, { useState } from 'react';

import codeSnippet from '../data/code_snippet';
import about from '../data/about';

const ForecastInput = () => {
    const [inputData, setInputData] = useState('');
    const [windowSize, setWindowSize] = useState();
    const [predictions, setPredictions] = useState([]);
    const [forecastRange, setForecastRange] = useState();
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
                <form onSubmit={handleSubmit}>
                    <label>
                        <input style={{ width: '30%' }}
                            id="inputData"
                            type="text"
                            value={inputData}
                            onChange={(event) => setInputData(event.target.value)}
                            placeholder="Input Data (comma-separated): 1,2,3,2,1,2,3,2,1,2,3,2"
                        />
                    </label>
                    <label>
                        <input style={{ width: '20%' }}
                            id="windowSize"
                            type="number"
                            value={windowSize}
                            onChange={(event) => setWindowSize(event.target.value)}
                            placeholder="Lookback Window (default: 1)"
                        />
                    </label>
                    <label>
                        <input style={{ width: '20%' }}
                            id="forecastRange"
                            type="number"
                            value={forecastRange}
                            onChange={(event) => setForecastRange(event.target.value)}
                            placeholder="Prediction Range (default: 5)"
                        />
                    </label>
                    <button className='custombutton' type="submit" title="Each submit produces a new forecast">Submit</button>
                </form>
                <div>
                    <CodeBoxPopover buttonTitle='Lookback Window Example' codeSnippet={codeSnippet} language="language-javascript" />
                </div>
                <br />
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
