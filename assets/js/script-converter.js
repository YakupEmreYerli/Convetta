document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileListDiv = document.getElementById('fileList');
    const fileListUl = fileListDiv.querySelector('ul');
    const formatSelect = document.getElementById('formatSelect');
    const convertButton = document.getElementById('convertButton');
    const resultsDiv = document.getElementById('results');
    const resultList = document.getElementById('result-list');
    const downloadAllButton = document.getElementById('downloadAllButton');
    const downloadSeparateButton = document.getElementById('downloadSeparateButton');
    let selectedFiles = [];

    function showCustomAlert(message) {
        console.warn("UYARI:", message);
    }

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-blue-500', 'bg-blue-50'); });
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('border-blue-500', 'bg-blue-50'); });
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('border-blue-500', 'bg-blue-50'); handleFiles(e.dataTransfer.files); });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        selectedFiles = Array.from(files);
        fileListUl.innerHTML = '';
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                const li = document.createElement('li');
                li.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                fileListUl.appendChild(li);
            });
            fileListDiv.classList.remove('hidden');
        } else {
            fileListDiv.classList.add('hidden');
        }
    }

    convertButton.addEventListener('click', async () => {
        if (selectedFiles.length === 0) {
            showCustomAlert('Lütfen önce bir dosya seçin.');
            return;
        }

        const targetFormat = formatSelect.value;
        convertButton.disabled = true;
        convertButton.textContent = 'Dönüştürülüyor...';
        resultList.innerHTML = '';

        const conversionPromises = selectedFiles.map(file => {
            // Artık tüm dönüşümler sunucuda yapılıyor
            return convertOnServer(file, targetFormat);
        });

        await Promise.all(conversionPromises);

        convertButton.disabled = false;
        convertButton.textContent = 'Dönüştür';

        if (resultList.children.length > 0) {
            resultsDiv.classList.remove('hidden');
        }
    });

    function convertOnServer(file, format) {
        return new Promise(async (resolve) => {
            const formData = new FormData();
            formData.append('dosya', file);
            formData.append('format', format);

            try {
                const response = await fetch('../assets/php/convert.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || `Sunucu Hatası: ${response.status}`);
                }

                const blob = await response.blob();
                const newFileName = file.name.split('.').slice(0, -1).join('.') + `.${format}`;
                const downloadUrl = URL.createObjectURL(blob);
                displayResult(newFileName, downloadUrl);

            } catch (error) {
                displayError(file.name, error.message);
            }
            resolve();
        });
    }

    function displayResult(fileName, downloadUrl) {
        const resultCard = `<div class="bg-gray-50 p-4 rounded-lg flex items-center justify-between"><p class="text-gray-700 font-medium truncate">${fileName}</p><a href="${downloadUrl}" download="${fileName}" class="ml-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600">İndir</a></div>`;
        resultList.innerHTML += resultCard;
    }

    function displayError(fileName, errorMessage) {
        const errorCard = `<div class="bg-red-50 p-4 rounded-lg"><p class="text-red-700 font-medium">${fileName} - Hata: ${errorMessage}</p></div>`;
        resultList.innerHTML += errorCard;
    }

    downloadAllButton.addEventListener('click', async () => {
        const downloadLinks = resultList.querySelectorAll('a');
        if (downloadLinks.length === 0) {
            return showCustomAlert("İndirilecek dosya bulunmuyor.");
        }

        if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
            return showCustomAlert("Zip indirme kütüphaneleri (JSZip/FileSaver) bulunamadı.");
        }

        const zip = new JSZip();

        const promises = Array.from(downloadLinks).map(link =>
            fetch(link.href)
            .then(response => response.blob())
            .then(blob => {
                zip.file(link.download, blob);
            })
            .catch(error => {
                console.error("Zip'e dosya eklenirken hata:", link.download, error);
            })
        );

        await Promise.all(promises);

        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "convetta-images.zip");
        });
    });

    downloadSeparateButton.addEventListener('click', () => {
        const downloadLinks = resultList.querySelectorAll('a');
        if (downloadLinks.length === 0) {
            showCustomAlert("İndirilecek dosya bulunmuyor.");
            return;
        }
        downloadLinks.forEach(link => {
            link.click();
        });
    });
});