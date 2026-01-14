
function createResultCard(dataURL, altText, fileName) {
    const resultItem = document.createElement('div');
    resultItem.className = 'bg-gray-50 rounded-lg p-4 shadow-sm text-center';
    
    resultItem.innerHTML = `
        <div class="result-image-container mb-4 mx-auto">
            <img src="${dataURL}" alt="${altText}" class="result-image">
        </div>
        <p class="text-center text-sm text-gray-600 mt-2 truncate" title="${fileName}">${fileName}</p>
    `;
    
    return resultItem;
}

sure = 850