const fs = require('fs');

// Read the CSV file
fs.readFile('src/data.csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Split the file into lines
    const lines = data.trim().split('\n');

    // Extract the header and data rows
    const headers = lines[0].split(',');
    const rows = lines.slice(1);

    // Find the index of the 'sebi_license_number' column
    const sebiLicenseIndex = headers.indexOf('sebi_license_number');

    if (sebiLicenseIndex === -1) {
        console.error('SEBI license number column not found');
        return;
    }

    // Create a map to count occurrences of each SEBI license number
    const licenseCount = {};
    const duplicates = [];

    rows.forEach((line) => {
        const columns = line.split(',');
        const licenseNumber = columns[sebiLicenseIndex];

        if (licenseCount[licenseNumber]) {
            licenseCount[licenseNumber]++;
        } else {
            licenseCount[licenseNumber] = 1;
        }
    });

    // Find all duplicate SEBI license numbers
    for (const [licenseNumber, count] of Object.entries(licenseCount)) {
        if (count > 1) {
            duplicates.push(licenseNumber);
        }
    }

    // Print out the duplicate SEBI license numbers and their corresponding rows
    if (duplicates.length > 0) {
        console.log('Duplicate SEBI License Numbers:');
        duplicates.forEach((duplicate) => {
            console.log(`License Number: ${duplicate}`);
            rows.forEach((line) => {
                if (line.includes(duplicate)) {
                    console.log(line);
                }
            });
        });
    } else {
        console.log('No duplicate SEBI license numbers found.');
    }
});