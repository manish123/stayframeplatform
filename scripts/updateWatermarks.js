const fs = require('fs');
const path = require('path');

// Path to the mockTemplates file
const filePath = path.join(__dirname, '../src/data/mockTemplates.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Define the new watermark configuration
const newWatermarkConfig = `{
      id: uuidv4(),
      type: 'watermark',
      name: 'Watermark',
      content: 'Powered by StayFrame.fyi',
      x: 1080 - 400 - 20,
      y: 1080 - 40 - 20,
      width: 400, 
      height: 40, 
      fontFamily: 'Arial, sans-serif',
      fontSize: 24, 
      fontWeight: 'bold',
      color: 'rgba(0, 0, 0, 0.8)',
      textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
      opacity: 0.9,
      rotation: 0,
      textAlign: 'right',
      locked: true,
    } as WatermarkCanvasElement`;

// Create a regex to find all watermark configurations
const watermarkRegex = /\{\s*id: [^,]+,\s*type: 'watermark',[^}]+\} as WatermarkCanvasElement/g;

// Replace all watermark configurations with the new one
const updatedContent = content.replace(watermarkRegex, newWatermarkConfig);

// Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent, 'utf8');

console.log('All watermarks have been updated successfully!');
