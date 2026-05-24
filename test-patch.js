async function testPatch() {
  try {
    console.log("Fetching locations...");
    const resGet = await fetch('http://localhost:3005/locations');
    const locations = await resGet.json();
    
    if (locations.length === 0) {
      console.log("No locations found.");
      return;
    }

    const loc = locations[0];
    console.log("Testing PATCH on location:", loc.locationId);

    const submissionData = { ...loc, imageUrl: "https://chihuahuenos.s3.amazonaws.com/test.jpg" };

    const resPatch = await fetch(`http://localhost:3005/locations/${loc.locationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });

    console.log("PATCH status:", resPatch.status);
    const result = await resPatch.text();
    console.log("Response:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

testPatch();
