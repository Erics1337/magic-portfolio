const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const QUALITY = 80; // Adjust quality (0-100)
const MAX_WIDTH = 1920; // Max width for large images

async function processImage(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    if (!IMAGE_EXTENSIONS.includes(ext)) return;

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Skip if image is already smaller than MAX_WIDTH
        if (metadata.width <= MAX_WIDTH) return;

        let processedImage = image
            .resize(MAX_WIDTH, null, {
                fit: 'inside',
                withoutEnlargement: true
            });

        // Process based on format
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                processedImage = processedImage.jpeg({ quality: QUALITY });
                break;
            case '.png':
                processedImage = processedImage.png({ quality: QUALITY });
                break;
            case '.webp':
                processedImage = processedImage.webp({ quality: QUALITY });
                break;
        }

        // Save with optimized- prefix
        const dir = path.dirname(inputPath);
        const filename = path.basename(inputPath);
        const outputPath = path.join(dir, `optimized-${filename}`);
        await processedImage.toFile(outputPath);

        // Get file sizes for comparison
        const inputStats = await fs.stat(inputPath);
        const outputStats = await fs.stat(outputPath);
        const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);

        console.log(`Optimized ${filename}`);
        console.log(`Original size: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB`);
        console.log(`New size: ${(outputStats.size / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Saved: ${savings}%\n`);

        // Replace original with optimized version
        await fs.unlink(inputPath);
        await fs.rename(outputPath, inputPath);

    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}

async function processDirectory(directory) {
    try {
        const entries = await fs.readdir(directory, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else if (entry.isFile()) {
                await processImage(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${directory}:`, error);
    }
}

// Start processing from the public directory
const PUBLIC_DIR = path.join(__dirname, '../public');
processDirectory(PUBLIC_DIR)
    .then(() => console.log('Image optimization complete!'))
    .catch(console.error);
