function hexStringToDecimalArray(hexString: string): string[] {
    // Remove any potential "0x" prefix
    const cleanedHexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

    // Validate that the input is a valid hex string
    if (!/^[0-9a-fA-F]+$/.test(cleanedHexString)) {
        throw new Error('Invalid hex string');
    }

    // Split the hex string into pairs of characters (bytes)
    const byteArray = cleanedHexString.match(/.{1,2}/g) || [];

    // Convert each hex pair to a decimal string
    const decimalArray = byteArray.map(byte => parseInt(byte, 16).toString());

    return decimalArray;
}

// Example usage:
// Main function to run the process
function main() {
    // Get the instruction name from the command-line arguments
    let hexString = process.argv[2];
    const decimalArray = hexStringToDecimalArray(hexString);
    console.log(decimalArray);
}

// Run the main function
main();