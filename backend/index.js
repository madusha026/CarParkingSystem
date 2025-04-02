const express =   require('express');
const cors =   require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const app =  express();

app.use(cors());
app.use(express.json());


const ML_API_URL = 'http://127.0.0.1:5000/detect';


const port  = process.env.PORT || 5001;
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})