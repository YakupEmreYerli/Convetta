<?php

header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer");

ob_clean();

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

function sendError($message, $httpCode = 400, $logMessage = '') {
    http_response_code($httpCode);
    header('Content-Type: text/plain');

    if ($httpCode >= 500) {
        error_log($logMessage);
        echo 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    } else {
        echo $message;
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['dosya'])) {
    if (!isset($_POST['format'])) {
        sendError('Hedef format belirtilmedi.');
    }
    $targetFormat = strtolower($_POST['format']);
    $originalFileName = basename($_FILES['dosya']['name']);
    $safeFileExt = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

    $safeFileName = preg_replace('/[^A-Za-z0-9\._-]/', '', $originalFileName);
    $safeFileExt = strtolower(pathinfo($safeFileName, PATHINFO_EXTENSION));

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

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $inputFile);
    finfo_close($finfo);

    if (!array_key_exists($safeFileExt, $supportedFormats) || !in_array($mimeType, $supportedFormats)) {
        sendError('Lütfen geçerli bir görsel veya PDF dosyası yükleyin.');
    }

    $originalFileSavedName = uniqid() . '.' . $safeFileExt;
    $originalFileSavedPath = $uploadDir . $originalFileSavedName;

    if (!move_uploaded_file($inputFile, $originalFileSavedPath)) {
        sendError('Orijinal dosya sunucuya kaydedilemedi.', 500);
    }

    $outputFile = $uploadDir . 'output_' . uniqid() . '.' . $targetFormat;

    try {
        $image = new Imagick();
        
        $image->setResourceLimit(Imagick::RESOURCETYPE_MEMORY, 256);
        $image->setResourceLimit(Imagick::RESOURCETYPE_MAP, 512);
        
        if ($mimeType === 'application/pdf') {
            $image->readImage($originalFileSavedPath . '[0]');
        } else {
            $image->readImage($originalFileSavedPath);
        }

        if (in_array($safeFileExt, ['png', 'gif', 'webp']) && $image->getImageAlphaChannel()) {
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
        sendError('Sunucu hatası.', 500, 'Imagick hatası: ' . $e->getMessage());
    }
} else {
    sendError('Geçersiz istek. Lütfen bir dosya yükleyin.');
}

?>
