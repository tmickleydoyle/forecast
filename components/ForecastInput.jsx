import { useState } from 'react';
import LineGraph from './LineGraph';

const ForecastInput = () => {
    const [inputData, setInputData] = useState('');
    const [windowSize, setWindowSize] = useState();
    const [prediction, setPrediction] = useState('');
    const [forecastRange, setForecastRange] = useState();
    const [running, setRunning] = useState(false);
    const [indexes, setIndexes] = useState([]);
    const [input, setInput] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            const { prediction } = await predictMLPResponse.json();
            setPrediction(prediction);
            setRunning(false);
            setIndexes(inputIndexes);
            setInput(graphData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='centertexts'>
            <br />
            <h1>MLP Forecast</h1>
            <p style={{ fontSize: '18px' }}>The model utilizes a rolling window of numbers in order to predict the next number in the sequence.</p>
            <br />
            <form onSubmit={handleSubmit}>
                <label>
                    <input style={{ width: '30%' }}
                        id="inputData"
                        type="text"
                        value={inputData}
                        onChange={(event) => setInputData(event.target.value)}
                        placeholder="Enter data (comma-separated): 1,2,3,2,1,2,3,2,1,2,3,2"
                    />
                </label>
                <label>
                    <input style={{ width: '20%' }}
                        id="windowSize"
                        type="number"
                        value={windowSize}
                        onChange={(event) => setWindowSize(event.target.value)}
                        placeholder="Input Size (default: 1)"
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
            {inputData === '' && running === false && (
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
            {prediction && running === false && inputData !== '' && (
                <>
                    <div>
                        <h2>Prediction:</h2>
                    </div>
                    <br />
                    <div>
                        <LineGraph title={`Line Graph with Forecast`} labels={indexes} data={input} forecast={prediction} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ForecastInput;
