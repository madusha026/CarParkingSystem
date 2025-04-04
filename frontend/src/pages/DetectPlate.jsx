import React, { useState } from 'react';
import axios from 'axios';


const DetectPlate = () => {

    const [imageupload, setImageUpload] = useState(null);
    const [plateNumber, setPlateNumber] = useState(null);
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        setImageUpload(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!imageupload) {
            alert('Please upload an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageupload);

        try{
            const response = await axios.post('http://127.0.0.1:5000/detect', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response from ML model:', response.data);

            const result = response.data.results[0];  
            if(result && result.text) {
                setPlateNumber(result.text);
                await savePlateToDatabase(result.text);
                
            } else {
                setError('No plate detected');
            }
        }
        catch (error) {
            console.error('Error detecting plate:', error);
            setError('Error detecting plate');
        };
    }

        const savePlateToDatabase = async (plateNumber) => {
            try {
                console.log('Saving plate to database...');
              await axios.post('http://localhost:5001/api/save-plate', { plate_number: plateNumber });
            } catch (error) {
              console.error('Error saving plate number to database:', error);
            }
          };

    return (
        <div>
            <h1>Detect Plate</h1>
            <form onSubmit= {handleSubmit} >
                <input type="file" accept="image/*" onChange= {handleImageUpload}  />
                <button type="submit">Detect Plate</button>
            </form>
            {plateNumber && (
        <div>
          <h2>Detected Plate Number:</h2>
          <p>{plateNumber}</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
        </div>
    );


}

export default DetectPlate;