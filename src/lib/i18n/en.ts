/**
 * Ingilizce metinler ayni zamanda sozluk semasini tanimlar: Dictionary tipi
 * buradan turetiliyor, bu yuzden yeni bir anahtar eklendiginde Turkce dosyasi
 * derleme hatasi verir ve ceviri unutulamaz.
 */
export const en = {
	meta: {
		title: 'Convetta — Free Online Image Converter',
		description:
			'Convert JPG, PNG and WEBP images right in your browser. No uploads, no sign-up, completely free.'
	},
	nav: {
		home: 'Homepage',
		converter: 'Converter',
		resizer: 'Resizer',
		themeToggle: 'Toggle between light and dark theme',
		language: 'Language'
	},
	hero: {
		title: 'Convert Your Images Instantly',
		subtitle: 'Convert JPG, PNG, WEBP, and GIF in seconds.'
	},
	drop: {
		label: 'Choose images to convert',
		title: 'Drag and drop files here or',
		browse: 'click to browse',
		paste: 'or paste from the clipboard',
		hint: 'JPG, PNG, WEBP and GIF up to 20 MB each',
		pasted: '{count} image(s) added from the clipboard.'
	},
	files: {
		heading: 'Selected Files:',
		remove: 'Remove {name}',
		clear: 'Remove all',
		count: '{count} file(s) selected',
		preview: 'Preview of {name}'
	},
	options: {
		format: 'Choose Target Format:',
		quality: 'Quality',
		qualityHint: 'Applies to JPEG and WEBP output.',
		inBrowser: 'Converted in your browser',
		onServer: 'Processed on our server',
		serverNote:
			'GIF, ICO and PDF have no browser encoder, so those files are converted on our server and deleted immediately afterwards.'
	},
	actions: {
		convert: 'Convert',
		converting: 'Converting…',
		downloadAll: 'Download All as ZIP',
		downloadSeparate: 'Download as Separate Files',
		zipping: 'Building ZIP…',
		download: 'Download',
		downloadFile: 'Download {name}'
	},
	results: {
		title: 'Converted Images',
		subtitle: 'Download your converted files here.',
		empty: 'Your converted files will appear here.',
		progress: 'Converting {done} of {total}…',
		done: '{count} file(s) converted successfully.',
		failed: '{count} file(s) could not be converted.'
	},
	errors: {
		noFiles: 'Please select at least one file first.',
		notImage: 'This file is not an image.',
		unsupported: 'This image type is not supported.',
		tooLarge: 'File is too large (20 MB maximum).',
		decode: 'The image could not be read. It may be corrupted.',
		encode: 'Your browser cannot produce this format.',
		server: 'Server-side conversion failed. Please try again.',
		zip: 'The ZIP file could not be created.',
		clipboard: 'The pasted content is not an image. Copy an image and try again.'
	},
	resizer: {
		metaTitle: 'Convetta — Free Online Image Resizer',
		metaDescription:
			'Resize JPG, PNG and WEBP images in your browser. Keep the aspect ratio, batch resize and download as ZIP.',
		title: 'Resize Your Images',
		subtitle: 'Adjust image dimensions in seconds.',
		resultsSubtitle: 'Download your resized files here.',
		width: 'Width (px)',
		height: 'Height (px)',
		lockRatio: 'Lock aspect ratio',
		resize: 'Resize',
		resizing: 'Resizing…',
		results: 'Resized Images',
		invalidSize: 'Enter a width and height between 1 and 10000 pixels.'
	},
	privacy: {
		metaTitle: 'Privacy Policy — Convetta',
		metaDescription: 'How Convetta handles your images and data.',
		title: 'Privacy Policy',
		updated: 'Last updated: {date}',
		sections: [
			{
				heading: 'Your images',
				body: 'JPEG, PNG and WEBP conversions and all resizing happen entirely inside your browser. Those files are never uploaded, never stored and never seen by us. GIF, ICO and PDF conversions have no browser encoder: the file is sent to our server over an encrypted connection, converted in memory, returned to you and discarded. Nothing is written to a database or a permanent disk.'
			},
			{
				heading: 'Data we collect',
				body: 'We do not require an account and we do not use tracking or advertising cookies. Your language and theme preference are stored in your browser with localStorage and never leave your device. Our server keeps short-lived request logs (IP address, time, requested path) for security and rate limiting.'
			},
			{
				heading: 'Third parties',
				body: 'Convetta loads no third-party scripts, fonts or analytics. Everything the page needs is served from our own domain.'
			},
			{
				heading: 'Contact',
				body: 'For any question about this policy, write to support@convetta.com.'
			}
		]
	},
	notFound: {
		title: 'Page not found',
		body: 'The page you are looking for does not exist or has moved.',
		home: 'Back to the converter'
	},
	faq: {
		title: 'Frequently Asked Questions',
		items: [
			{
				q: 'Is my data safe? Are my files uploaded to a server?',
				a: 'Your privacy is our priority. Most conversions (like PNG to JPG) happen directly in your browser. For formats the browser cannot produce (GIF, ICO, PDF), your file is processed on our server and is permanently deleted immediately after conversion. We never store or share your files.'
			},
			{
				q: 'What image formats are supported for conversion?',
				a: 'Our online image converter supports the most popular formats, including JPG, PNG, GIF, and WEBP. You can convert your files to and from any of these formats.'
			},
			{
				q: 'Is this online image converter completely free?',
				a: 'Yes, Convetta is a completely free online tool. There are no hidden fees, subscriptions, or usage limits for converting your images.'
			},
			{
				q: 'Can I convert multiple images at once?',
				a: 'Absolutely! You can select and convert multiple images at the same time. This bulk conversion feature allows you to process your images quickly and efficiently.'
			},
			{
				q: 'Will the quality of my images decrease after conversion?',
				a: 'We use advanced algorithms to ensure the highest possible quality. While some formats (like JPG) are naturally lossy, we minimize any quality decrease. For formats like PNG, the conversion is lossless, preserving the original quality.'
			},
			{
				q: 'What is the maximum file size I can convert?',
				a: 'To ensure fast performance for all users, there might be a reasonable file size limit for uploads. Most images intended for web use fall well within this limit.'
			},
			{
				q: 'Do I need to install any software or application?',
				a: 'No, you do not need to install anything. Convetta works entirely in your web browser. This makes the process fast, secure, and accessible from any device.'
			},
			{
				q: 'What is the WEBP format and what are its advantages?',
				a: 'WEBP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web. WEBP images are significantly smaller than JPGs and PNGs, leading to faster website load times.'
			},
			{
				q: 'How can I download all my converted files together?',
				a: "After the conversion is complete, we provide a 'Download All as ZIP' button. Clicking this button will compress all your converted images into a single ZIP file for easy downloading."
			},
			{
				q: 'Does the converter work on mobile phones and tablets?',
				a: 'Yes, our image converter is fully responsive and designed to work seamlessly on all modern devices, including smartphones, tablets, and desktop computers.'
			},
			{
				q: 'Why use an online converter instead of desktop software?',
				a: "Online converters offer great convenience. There's no need for installation or updates, you can access them from anywhere, and they don't use up your computer's resources. They are perfect for quick and easy conversion tasks."
			},
			{
				q: 'How is my privacy protected during conversion?',
				a: 'Your privacy is paramount. Since most conversions happen client-side (in your browser), your files don\'t even leave your computer. For server-side conversions, files are deleted instantly after processing. We do not log, store, or view your images.'
			}
		]
	},
	footer: {
		rights: '© {year} Convetta. All rights reserved.',
		support: 'Need help?',
		privacy: 'Privacy Policy'
	}
};

export type Dictionary = typeof en;
