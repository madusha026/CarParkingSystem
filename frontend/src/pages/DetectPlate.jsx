import React, { useState, useEffect ,  useRef} from 'react';
import axios from 'axios';

const DetectPlate = () => {
    const [imageupload, setImageUpload] = useState(null);
    const [plateNumber, setPlateNumber] = useState(null);
    const [driverName, setDriverName] = useState(null);
    const [vehicleType, setVehicleType] = useState(null);
    const [error, setError] = useState('');
    const [qrcode, setQRCode] = useState(null);
    const [QRCodeComponent, setQRCodeComponent] = useState(null); // State to store dynamically imported QRCode

    const fileInputRef = useRef(null);


    useEffect(() => {
        // Dynamically import the QRCode component
        import('qrcode.react').then((module) => {
            setQRCodeComponent(module.QRCode);
        }).catch((error) => {
            console.error('Error loading QRCode component:', error);
        });
    }, []);

    const handleImageUpload = (e) => {
        setImageUpload(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageupload) {
            alert('Please upload an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageupload);

        try {
            const response = await axios.post('http://127.0.0.1:5000/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const result = response.data.results[0];
            if (result && result.text) {
                setPlateNumber(result.text);
                await savePlateToDatabase(result.text);
            } else {
                setError('No plate detected');
            }
        } catch (error) {
            console.error('Error detecting plate:', error);
            setError('Error detecting plate');
        }
    };

    const savePlateToDatabase = async (plateNumber) => {
        try {
            console.log('Saving plate to database...');
            await axios.post('http://localhost:5001/api/save-plate', { plateNumber: plateNumber });
        } catch (error) {
            console.error('Error saving plate number to database:', error);
        }
    };

    const handleGenerateQRCode = async () => {
        const qrData = {
            plate_number: plateNumber,
            driver_name: driverName,
            vehicle_type: vehicleType,
        };
        setQRCode(JSON.stringify(qrData));
        try {
            const response = await axios.post('http://localhost:5001/api/generate-qrcode', qrData, {
                responseType: 'blob',
            });
            const pdfBlob = response.data;
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'car_parking_qr.pdf';
            link.click();

            setDriverName('');
            setVehicleType('');
            setPlateNumber(null);
            setImageUpload(null);
            setQRCode(null);

            // Reset file input field (clear the uploaded file)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
        } catch (error) {
            console.error('Error generating QR code and PDF:', error);
            setError('Error generating QR code and PDF');
        }
    };

    return (
        <div>
            <h1>Detect Plate</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageUpload}  ref={fileInputRef}/>
                <button type="submit">Detect Plate</button>
            </form>
            {plateNumber && (
                <div>
                    <h2>Detected Plate Number: {plateNumber}</h2>
                    <input
                        type="text"
                        placeholder="Driver Name"
                        onChange={(e) => setDriverName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Vehicle Type"
                        onChange={(e) => setVehicleType(e.target.value)}
                    />
                    <button onClick={handleGenerateQRCode}>Generate QR & PDF</button>

                    {qrcode && QRCodeComponent && (
                        <QRCodeComponent value={qrcode} />
                    )}
                </div>
            )}

            {error && <div style={{ color: 'red' }}><p>{error}</p></div>}
        </div>
    );
};

export default DetectPlate;
