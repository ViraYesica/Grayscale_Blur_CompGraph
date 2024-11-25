document.getElementById('convert').addEventListener('click', function() {
    const fileInput = document.getElementById('upload');
    const filter = document.getElementById('filter').value;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (fileInput.files.length === 0) {
        alert("Please upload an image file.");
        return;
    }

    const file = fileInput.files[0];
    const img = new Image();
    img.onload = function() {
        document.getElementById('originalImage').src = img.src;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (filter === 'grayscale') {
            grayscale(imageData);
        } else if (filter === 'blur') {
            // Menerapkan blur beberapa kali untuk efek yang lebih kuat
            for (let i = 0; i < 15; i++) { // Ubah jumlah iterasi untuk meningkatkan blur
                blur(imageData);
            }
        }
        ctx.putImageData(imageData, 0, 0);
        
        document.getElementById('convertedImage').src = canvas.toDataURL();
        document.getElementById('results').style.display = 'block';
    };
    img.src = URL.createObjectURL(file);
});

function grayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
    }
}

function blur(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const tempData = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = (y * width + x) * 4;
            
            const rSum = 
                data[i - 4 - width * 4] + data[i - 4 + width * 4] + 
                data[i + 4 - width * 4] + data[i + 4 + width * 4] + 
                data[i - 4] + data[i + 4] + 
                data[i - width * 4] + data[i + width * 4] +
                data[i - 4 - 2 * width * 4] + data[i + 4 - 2 * width * 4] + 
                data[i - 4 + 2 * width * 4] + data[i + 4 + 2 * width * 4]; 

            const gSum = 
                data[i - 4 - width * 4 + 1] + data[i - 4 + width * 4 + 1] + 
                data[i + 4 - width * 4 + 1] + data[i + 4 + width * 4 + 1] + 
                data[i - 4 + 1] + data[i + 4 + 1] + 
                data[i - width * 4 + 1] + data[i + width * 4 + 1] +
                data[i - 4 - 2 * width * 4 +  1] + data[i + 4 - 2 * width * 4 + 1] + 
                data[i - 4 + 2 * width * 4 + 1] + data[i + 4 + 2 * width * 4 + 1];

            const bSum = 
                data[i - 4 - width * 4 + 2] + data[i - 4 + width * 4 + 2] + 
                data[i + 4 - width * 4 + 2] + data[i + 4 + width * 4 + 2] + 
                data[i - 4 + 2] + data[i + 4 + 2] + 
                data[i - width * 4 + 2] + data[i + width * 4 + 2] +
                data[i - 4 - 2 * width * 4 + 2] + data[i + 4 - 2 * width * 4 + 2] + 
                data[i - 4 + 2 * width * 4 + 2] + data[i + 4 + 2 * width * 4 + 2];

            const r = rSum / 12; 
            const g = gSum / 12;
            const b = bSum / 12;

            tempData[i] = r;
            tempData[i + 1] = g;
            tempData[i + 2] = b;
            tempData[i + 3] = data[i + 3];
        }
    }
    for (let i = 0; i < data.length; i++) {
        data[i] = tempData[i];
    }
}
