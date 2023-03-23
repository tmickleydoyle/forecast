import { useState } from 'react';

const ForecastInput = () => {
    const [inputData, setInputData] = useState('');
    const [prediction, setPrediction] = useState('');
    const [running, setRunning] = useState(false);

    const handleSubmit = async (event) => {
    event.preventDefault();
        try {
            setRunning(true);
            const predictMLPResponse = await fetch('/api/forecast', {
                method: 'POST',
                body: JSON.stringify({ inputData }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { prediction } = await predictMLPResponse.json();
            setPrediction(prediction);
            setRunning(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='centertexts'>
            <br />
            <h1>MLP Forecast</h1>
            <p style={{ fontSize: '18px' }}>The model utilizes a rolling window of five numbers in order to predict the next number in the sequence.</p>
            <br />
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        id="inputData"
                        type="text"
                        value={inputData}
                        onChange={(event) => setInputData(event.target.value)}
                        placeholder="Enter data (comma-separated): 5,4,6,7,5,6"
                    />
                </label>
                <button className='custombutton' type="submit">Submit</button>
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
                <div>
                <h2>Prediction:</h2>
                <p style={{ fontSize: '24px' }}>{prediction.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default ForecastInput;
