const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());

app.post('/api/data', (req, res) => {
  const data = req.body;
  console.log(data);
    const filePath = path.join(__dirname, 'dummy.geojson');

    // Check if the file already exists
    if (!fs.existsSync(filePath)) {
    // If the file doesn't exist, create a new geojson object
    const geoJsonObj = {
        type: 'FeatureCollection',
        features: []
    };

    // Write the new object to the file
    fs.writeFileSync(filePath, JSON.stringify(geoJsonObj));
    }

    // Read the existing geojson file
    const existingGeoJson = JSON.parse(fs.readFileSync(filePath));

    // Check if the feature already exists
    const featureExists = existingGeoJson.features.some(feature => feature.properties.name === JSON.parse(req.body.featureJSON).feature.properties.name);

    if (featureExists) {
      // If the feature already exists, return an error response
      res.status(400).send('Feature already exists');
    } else {
      // If the feature doesn't exist, add it to the features array
      existingGeoJson.features.push(JSON.parse(req.body.featureJSON).feature);

      // Write the updated object back to the file
      fs.writeFileSync(filePath, JSON.stringify(existingGeoJson));

      // Send a success response
      res.status(200).send('Feature added successfully');
    }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
