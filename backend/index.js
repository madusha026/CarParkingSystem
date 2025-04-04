const express =   require('express');
const cors =   require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const plateRoutes = require('./routes/plateRoutes');

const app =  express();

app.use(cors());
app.use(express.json());


app.use('/api', plateRoutes); 

mongoose.connect('mongodb://localhost:27017/carpark', 
    //{ useNewUrlParser: true, useUnifiedTopology: true }
    )
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));


const port  = process.env.PORT || 5001;
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})