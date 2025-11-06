document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang || 'en';
    const TEXTS = {
        en: {
            alert_select: 'Please select at least one image to resize.',
            alert_dims: 'Please enter valid width and height values.',
            alert_error: 'An error occurred while resizing. Please try again or check the file format.',
            resizing: 'Resizing...',
            resize: 'Resize',
            zip_name: 'resized_images.zip',
            alt_prefix: 'Resized'
        },
        tr: {
            alert_select: 'Lütfen yeniden boyutlandırmak için en az bir resim seçin.',
            alert_dims: 'Lütfen geçerli genişlik ve yükselik değerleri girin.',
            alert_error: 'Yeniden boyutlandırma sırasında bir hata oluştu. Lütfen tekrar deneyin veya dosya formatını kontrol edin.',
            resizing: 'Boyutlandırılıyor...',
            resize: 'Yeniden Boyutlandır',
            zip_name: 'boyutlandirilmis_resimler.zip',
            alt_prefix: 'Boyutlandırılan'
        }
    };
    const currentTexts = TEXTS[lang];
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileListContainer = document.getElementById('fileList');
    const fileListUl = fileListContainer.querySelector('ul');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const resizeButton = document.getElementById('resizeButton');
    const resultsContainer = document.getElementById('results');
    const resultList = document.getElementById('result-list');
    const downloadAllButton = document.getElementById('downloadAllButton');
    const downloadSeparateButton = document.getElementById('downloadSeparateButton');
    const aspectRatioLock = document.getElementById('aspectRatioLock');
    const aspectRatioButton = document.getElementById('aspectRatioButton');
    const iconLocked = document.getElementById('icon-locked');
    const iconUnlocked = document.getElementById('icon-unlocked');
    let selectedFiles = [];
    let resizedFiles = [];
    let originalAspectRatio = 0;
    let isCalculating = false;

    function showCustomAlert(message) {
        console.warn("UYARI:", message);
    }

    function handleFiles(files) {
        selectedFiles = [...files].filter(file => file.type.startsWith('image/'));
        fileListUl.innerHTML = '';
        if (selectedFiles.length > 0) {
            const firstFile = selectedFiles[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    originalAspectRatio = img.width / img.height;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(firstFile);
            fileListContainer.classList.remove('hidden');
            selectedFiles.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file.name;
                fileListUl.appendChild(li);
            });
        } else {
            fileListContainer.classList.add('hidden');
        }
    }

    function displayResults() {
        resultList.innerHTML = '';
        resizedFiles.forEach(file => {
            const resultItem = document.createElement('li');
            resultItem.innerHTML = `<a href="${file.dataURL}" download="${file.name}" class="text-blue-500 hover:underline">${file.name}</a>`;
            resultList.appendChild(resultItem);
        });
        if (resizedFiles.length > 0) resultsContainer.classList.remove('hidden');
    }

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-blue-500', 'bg-blue-50'); });
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('border-blue-500', 'bg-blue-50'); });
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('border-blue-500', 'bg-blue-50'); handleFiles(e.dataTransfer.files); });
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    aspectRatioButton.addEventListener('click', () => {
        aspectRatioLock.checked = !aspectRatioLock.checked;
        if (aspectRatioLock.checked) {
            aspectRatioButton.classList.remove('bg-gray-300');
            aspectRatioButton.classList.add('bg-blue-600');
            iconLocked.classList.remove('hidden');
            iconUnlocked.classList.add('hidden');
        } else {
            aspectRatioButton.classList.remove('bg-blue-600');
            aspectRatioButton.classList.add('bg-gray-300');
            iconLocked.classList.add('hidden');
            iconUnlocked.classList.remove('hidden');
        }
    });

    widthInput.addEventListener('input', () => {
        if (isCalculating || !aspectRatioLock.checked || originalAspectRatio === 0) return;
        isCalculating = true;
        const newWidth = parseInt(widthInput.value, 10);
        if (!isNaN(newWidth) && newWidth > 0) heightInput.value = Math.round(newWidth / originalAspectRatio);
        isCalculating = false;
    });

    heightInput.addEventListener('input', () => {
        if (isCalculating || !aspectRatioLock.checked || originalAspectRatio === 0) return;
        isCalculating = true;
        const newHeight = parseInt(heightInput.value, 10);
        if (!isNaN(newHeight) && newHeight > 0) widthInput.value = Math.round(newHeight * originalAspectRatio);
        isCalculating = false;
    });

    resizeButton.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return showCustomAlert(currentTexts.alert_select);
        const newWidth = parseInt(widthInput.value);
        const newHeight = parseInt(heightInput.value);
        if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) return showCustomAlert(currentTexts.alert_dims);

        dropZone.classList.add('is-loading');
        resultsContainer.classList.add('hidden');
        resultList.innerHTML = '';
        resizedFiles = [];
        resizeButton.disabled = true;
        resizeButton.textContent = currentTexts.resizing;

        try {
            const promises = selectedFiles.map(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = newWidth;
                            canvas.height = newHeight;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, newWidth, newHeight);
                            const dataURL = canvas.toDataURL(file.type);
                            const name = file.name.replace(/\.[^/.]+$/, '');
                            const ext = file.name.split('.').pop();
                            resizedFiles.push({ name: `${name}_${newWidth}x${newHeight}.${ext}`, dataURL });
                            resolve();
                        } catch (e) {
                            reject(new Error(`Canvas error for ${file.name}: ${e.message}`));
                        }
                    };
                    img.onerror = () => reject(new Error(`Could not load image: ${file.name}`));
                    img.src = event.target.result;
                };
                reader.onerror = () => reject(new Error(`Could not read file: ${file.name}`));
                reader.readAsDataURL(file);
            }));

            await Promise.all(promises);
            displayResults();
        } catch (error) {
            console.error("Resizing failed:", error);
            showCustomAlert(currentTexts.alert_error);
        } finally {
            resizeButton.disabled = false;
            resizeButton.textContent = currentTexts.resize;
            dropZone.classList.remove('is-loading');
        }
    });

    downloadSeparateButton.addEventListener('click', () => {
        resizedFiles.forEach((file, i) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = file.dataURL;
                link.download = file.name;
                link.click();
            }, i * 100);
        });
    });

    downloadAllButton.addEventListener('click', async () => {
        const zip = new JSZip();
        resizedFiles.forEach(file => {
            const base64 = file.dataURL.split(',')[1];
            zip.file(file.name, base64, { base64: true });
        });
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, currentTexts.zip_name);
    });
});
