import { createHash } from 'crypto';

/**
 * Gets the discriminator for a given Anchor instruction.
 * The discriminator is the first 8 bytes of the SHA-256 hash of the instruction name.
 *
 * @param instructionName - The name of the instruction.
 * @returns A Promise that resolves with a Buffer containing the 8-byte discriminator.
 */
function getInstructionDiscriminator(instructionName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        if (!instructionName) {
            return reject("Instruction name is required.");
        }

        try {
            // Create a SHA-256 hash of the instruction name
            const hash = createHash('sha256').update(instructionName).digest();
            // Take the first 8 bytes of the hash
            const discriminator = hash.slice(0, 8);
            resolve(discriminator);
        } catch (error) {
            reject(`Error calculating discriminator: ${error}`);
        }
    });
}

// Main function to run the process
function main() {
    // Get the instruction name from the command-line arguments
    let instructionName = process.argv[2];
    // instructionName = "global" + instructionName;

    getInstructionDiscriminator(instructionName)
        .then(discriminator => {
            console.log(`Discriminator for instruction "${instructionName}":`, discriminator.toString('hex'));
            const decimalArray = Array.from(discriminator).map(byte => byte);
            console.log(`Discriminator for instruction "${instructionName}":`, decimalArray);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Run the main function
main();
