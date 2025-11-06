<?php

ob_clean();

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

function sendError($message, $httpCode = 400) {
    http_response_code($httpCode);
    header('Content-Type: text/plain');
    echo $message;
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['dosya'])) {
    if (!isset($_POST['format'])) {
        sendError('Hedef format belirtilmedi.');
    }
    $targetFormat = strtolower($_POST['format']);
    $originalFileName = $_FILES['dosya']['name'];
    $originalFileExt = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

    $supportedFormats = [
        'ico' => 'image/x-icon',
        'pdf' => 'application/pdf',
        'gif' => 'image/gif',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'bmp' => 'image/bmp',
        'tiff' => 'image/tiff',
    ];

    if (!array_key_exists($targetFormat, $supportedFormats)) {
        sendError('Desteklenmeyen veya geçersiz hedef formatı.');
    }

    if ($_FILES['dosya']['error'] !== UPLOAD_ERR_OK) {
        sendError('Dosya yükleme hatası: ' . $_FILES['dosya']['error'], 500);
    }

    $inputFile = $_FILES['dosya']['tmp_name'];

    $originalFileSavedName = uniqid() . '_' . $originalFileName;
    $originalFileSavedPath = $uploadDir . $originalFileSavedName;

    if (!move_uploaded_file($inputFile, $originalFileSavedPath)) {
        sendError('Orijinal dosya sunucuya kaydedilemedi.', 500);
    }

    $outputFile = $uploadDir . 'output_' . uniqid() . '.' . $targetFormat;

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $originalFileSavedPath);
    finfo_close($finfo);

    if (!array_key_exists($originalFileExt, $supportedFormats) && !in_array($mimeType, $supportedFormats)) {
        unlink($originalFileSavedPath);
        sendError('Lütfen geçerli bir görsel veya PDF dosyası yükleyin.');
    }

    try {
        $image = new Imagick();
        if ($mimeType === 'application/pdf') {
            $image->readImage($originalFileSavedPath . '[0]');
        } else {
            $image->readImage($originalFileSavedPath);
        }

        if (in_array($originalFileExt, ['png', 'gif', 'webp']) && $image->getImageAlphaChannel()) {
            $image->setImageAlphaChannel(Imagick::ALPHACHANNEL_ACTIVATE);
        }

        if ($targetFormat === 'ico') {
            $width = $image->getImageWidth();
            $height = $image->getImageHeight();
            $maxDimension = 256;
            if ($width > $maxDimension || $height > $maxDimension) {
                $ratio = min($maxDimension / $width, $maxDimension / $height);
                $newWidth = (int) ($width * $ratio);
                $newHeight = (int) ($height * $ratio);
                $image->resizeImage($newWidth, $newHeight, Imagick::FILTER_LANCZOS, 1);
            }
        }

        $image->setFormat(strtoupper($targetFormat));

        if (!$image->writeImage($outputFile)) {
            throw new Exception(strtoupper($targetFormat) . ' dosyası yazılamadı.');
        }

        header('Content-Type: ' . $supportedFormats[$targetFormat]);
        readfile($outputFile);

        $image->destroy();
        unlink($outputFile);
        unlink($originalFileSavedPath);

        exit;

    } catch (Exception $e) {
        if (file_exists($originalFileSavedPath)) {
            unlink($originalFileSavedPath);
        }
        if (file_exists($outputFile)) {
            unlink($outputFile);
        }
        sendError('Sunucu hatası: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Geçersiz istek. Lütfen bir dosya yükleyin.');
}

?>
