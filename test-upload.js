const fs = require('fs');

async function testUpload() {
  try {
    fs.writeFileSync('dummy.jpg', 'fake image content');
    const fileBuffer = fs.readFileSync('dummy.jpg');
    
    // In Node 20, we can use global FormData and Blob
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', blob, 'dummy.jpg');

    console.log("Sending request to http://localhost:3005/uploads/image...");
    const res = await fetch('http://localhost:3005/uploads/image', {
      method: 'POST',
      body: formData
    });

    const json = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", json);
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

testUpload();
