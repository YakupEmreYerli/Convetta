/**
 * Ingilizce metinler ayni zamanda sozluk semasini tanimlar: Dictionary tipi
 * buradan turetiliyor, bu yuzden yeni bir anahtar eklendiginde Turkce dosyasi
 * derleme hatasi verir ve ceviri unutulamaz.
 */
export const en = {
	meta: {
		title: 'Free Online Image Converter — JPG, PNG, WEBP & GIF | Convetta',
		description:
			'Convert JPG, PNG, WEBP and GIF images online for free. Convert several files at once and download them as a ZIP. JPG, PNG and WEBP never leave your browser.'
	},
	nav: {
		home: 'Homepage',
		converter: 'Converter',
		resizer: 'Resizer',
		themeToggle: 'Toggle between light and dark theme',
		language: 'Language'
	},
	hero: {
		title: 'Free Online Image Converter',
		subtitle: 'Convert JPG, PNG, WEBP and GIF in seconds. No account, nothing to install.'
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
		unavailable: 'The server is busy right now. Wait a moment and try again.',
		zip: 'The ZIP file could not be created.',
		clipboard: 'The pasted content is not an image. Copy an image and try again.'
	},
	resizer: {
		metaTitle: 'Free Online Image Resizer — Resize JPG, PNG & WEBP | Convetta',
		metaDescription:
			'Resize JPG, PNG and WEBP images online for free. Set the width and height in pixels, keep the aspect ratio locked so nothing stretches, and resize a whole batch at once — all inside your browser.',
		title: 'Free Online Image Resizer',
		subtitle: 'Set a new width and height in pixels. Nothing is uploaded — resizing runs in your browser.',
		resultsSubtitle: 'Download your resized files here.',
		width: 'Width (px)',
		height: 'Height (px)',
		lockRatio: 'Lock aspect ratio',
		lockRatioOn: 'Aspect ratio locked — the other side follows automatically.',
		lockRatioOff: 'Aspect ratio unlocked — entering both sides freely can stretch the image.',
		originalSize: 'Original: {width} × {height} px',
		resize: 'Resize',
		resizing: 'Resizing…',
		results: 'Resized Images',
		invalidSize: 'Enter a width and height between 1 and 10000 pixels.',
		trust: [
			{
				title: 'Nothing is uploaded',
				body: 'Every resize is done by your own browser. Your images are never sent to us, so there is nothing for us to store.'
			},
			{
				title: 'Proportions kept',
				body: 'The aspect ratio is locked by default and read from your first image, so typing one side fills in the other.'
			},
			{
				title: 'Whole batches at once',
				body: 'Resize any number of images to the same dimensions and download them together as a ZIP.'
			}
		],
		how: {
			title: 'How to resize an image',
			steps: [
				{
					title: 'Add your image',
					body: 'Drag it onto the drop zone, browse for it, or paste it from the clipboard. Up to 20 MB per file.'
				},
				{
					title: 'Enter the new dimensions',
					body: 'Type the width in pixels. With the lock on, the height is worked out for you from the original proportions.'
				},
				{
					title: 'Resize and download',
					body: 'Save the result, or take the whole batch as a single ZIP. New dimensions are added to the file name.'
				}
			]
		},
		aspect: {
			title: 'What does “keep aspect ratio” mean?',
			body: 'The aspect ratio is the relationship between an image’s width and its height. Keeping it locked while you resize is what stops the picture from being stretched or squashed: a 1920 × 1080 image is 16:9, and 1280 × 720 is the same 16:9, which is why it still looks right. Convetta reads the ratio from the first image you add and keeps it locked unless you turn the lock off.',
			exampleTitle: 'The same proportions at different sizes',
			columns: {
				original: 'Original',
				resized: 'Resized to',
				ratio: 'Aspect ratio',
				use: 'Typical use'
			},
			rows: [
				{ original: '1920 × 1080', resized: '1280 × 720', ratio: '16:9', use: 'Widescreen photos and video stills' },
				{ original: '1200 × 1200', resized: '600 × 600', ratio: '1:1', use: 'Square profile and product images' },
				{ original: '1080 × 1350', resized: '720 × 900', ratio: '4:5', use: 'Portrait social posts' },
				{ original: '3000 × 2000', resized: '1500 × 1000', ratio: '3:2', use: 'Photos straight from a camera' }
			]
		},
		dimensions: {
			title: 'What image dimensions actually are',
			body: 'Dimensions describe how many pixels wide and tall an image is. A 1920 × 1080 image is 1920 pixels across and 1080 pixels down. Changing the dimensions changes how much detail the image contains — it does not change the file format, and it is not the same thing as compressing the file.',
			sections: [
				{
					heading: 'Resizing is not converting',
					body: 'Resizing changes the pixel dimensions. Converting changes the file format, for example PNG to JPG or JPG to WEBP. Convetta keeps the format when it resizes: a JPG stays a JPG and a WEBP stays a WEBP. Anything else is saved as PNG so that no quality is thrown away in the process.'
				},
				{
					heading: 'Resizing is not compressing',
					body: 'Compression shrinks the file size in KB or MB while leaving the width and height alone. Resizing shrinks the width and height, which usually reduces the file size as a side effect. If an image is too big in pixels, resize it. If the dimensions are right but the file is still heavy, that is a compression problem.'
				}
			],
			convertLink: 'Need a different file format? Use the image converter'
		},
		faq: {
			title: 'Frequently Asked Questions',
			items: [
				{
					q: 'Are my images uploaded when I resize them?',
					a: 'No. Resizing is done entirely by your own browser with the Canvas API, so the image never leaves your device. There is no upload step at all, which is also why resizing keeps working on a poor connection.'
				},
				{
					q: 'Does resizing an image reduce quality?',
					a: 'Making an image smaller usually looks fine, because you are asking for fewer pixels than the original has — Convetta uses high-quality smoothing when scaling down. Making an image larger than its original size is a different matter: resizing cannot invent detail that was never captured, so an enlarged image tends to look soft.'
				},
				{
					q: 'How do I resize an image without stretching it?',
					a: 'Leave the aspect ratio lock on, which is how Convetta starts. Type the width you want and the height is calculated from the original proportions. Turn the lock off only when you deliberately want dimensions that do not match the original shape.'
				},
				{
					q: 'Can I resize several images at once?',
					a: 'Yes. Every selected image is resized to the same width and height in one pass, and you can download the results individually or as a single ZIP. The aspect ratio lock follows the first image you added, so a mixed batch is best resized with the lock off.'
				},
				{
					q: 'Which formats can I resize?',
					a: 'JPG, PNG, WEBP, GIF, BMP and AVIF, up to 20 MB each. JPG and WEBP files come back in the same format; everything else is returned as PNG.'
				},
				{
					q: 'Can I resize to exact pixel dimensions?',
					a: 'Yes. Width and height are entered in pixels and any whole number from 1 to 10000 is accepted. Turn the lock off first if the exact size you need has different proportions from the original.'
				},
				{
					q: 'What is the difference between resizing and compressing?',
					a: 'Resizing changes the pixel dimensions, such as 1920 × 1080 down to 1280 × 720. Compressing reduces the file size in KB or MB while keeping those dimensions. Resizing an image smaller normally reduces the file size too, but it is not the same operation.'
				}
			]
		}
	},
	privacy: {
		metaTitle: 'Privacy Policy — Convetta',
		metaDescription: 'How Convetta handles your images and data.',
		title: 'Privacy Policy',
		updated: 'Last updated: {date}',
		sections: [
			{
				heading: 'Your images',
				body: 'JPEG, PNG and WEBP conversions and all resizing happen entirely inside your browser. Those files are never uploaded, never stored and never seen by us. GIF, ICO and PDF conversions have no browser encoder: the file is sent to our server over an encrypted connection, converted in memory, returned to you and discarded. GIF and PDF are streamed straight through the converter and never touch the disk. ICO is the single exception, because that encoder cannot write to a stream: the result is written to a temporary file that is deleted as soon as your download has been sent. Nothing is written to a database or kept after the request.'
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
	trust: {
		title: 'Why use Convetta?',
		items: [
			{
				title: 'Private by design',
				body: 'JPG, PNG and WEBP conversions run inside your browser. Those files are never uploaded, so there is nothing for us to store.'
			},
			{
				title: 'Built for batches',
				body: 'Add as many images as you like, convert them in one pass and download the whole set as a single ZIP.'
			},
			{
				title: 'No account, no install',
				body: 'Free to use with no sign-up and nothing to download. Works in any modern desktop or mobile browser.'
			}
		]
	},
	how: {
		title: 'How to convert an image',
		steps: [
			{
				title: 'Add your images',
				body: 'Drag files onto the drop zone, browse for them, or paste an image straight from the clipboard. Up to 20 MB per file.'
			},
			{
				title: 'Choose the target format',
				body: 'Pick JPG, PNG, WEBP, GIF, ICO or PDF. Each option says whether it is produced in your browser or on our server.'
			},
			{
				title: 'Convert',
				body: 'Every selected file is converted in one pass and the original proportions are always preserved.'
			},
			{
				title: 'Download',
				body: 'Save the files one by one, or take the whole batch as a single ZIP.'
			}
		]
	},
	guide: {
		title: 'Choose the right image format',
		intro:
			'The right target format depends on one question: do you need transparency, animation, or the smallest possible file? Here is what each format Convetta produces actually gives you.',
		columns: {
			format: 'Format',
			bestFor: 'Best for',
			transparency: 'Transparency',
			compression: 'Compression',
			where: 'Converted'
		},
		inBrowser: 'In your browser',
		onServer: 'On our server',
		rows: [
			{
				format: 'JPG',
				bestFor: 'Photographs and photo-heavy pages',
				transparency: 'No — transparent areas become white',
				compression: 'Lossy'
			},
			{
				format: 'PNG',
				bestFor: 'Screenshots, logos, line art, sharp edges',
				transparency: 'Yes, with soft edges',
				compression: 'Lossless'
			},
			{
				format: 'WEBP',
				bestFor: 'Websites that want smaller files at the same quality',
				transparency: 'Yes, with soft edges',
				compression: 'Lossy'
			},
			{
				format: 'GIF',
				bestFor: 'Very simple graphics with few colours',
				transparency: 'On or off only, no soft edges',
				compression: 'Lossless, limited to 256 colours'
			},
			{
				format: 'ICO',
				bestFor: 'Favicons and Windows application icons',
				transparency: 'Yes',
				compression: 'Lossless, scaled down to 256 px'
			},
			{
				format: 'PDF',
				bestFor: 'Sending an image on as a document',
				transparency: 'Flattened',
				compression: 'The image is embedded as it is'
			}
		],
		note: 'Convetta produces still images. Converting an animated GIF to JPG, PNG or WEBP keeps its first frame.',
		resizeLink: 'Only need different dimensions? Use the image resizer'
	},
	processing: {
		title: 'How Convetta handles your files',
		sections: [
			{
				heading: 'In your browser — JPG, PNG, WEBP',
				body: 'Your browser decodes the image and re-encodes it with the Canvas API. The file is never sent anywhere, which is also why the conversion keeps working on a slow connection. Every resize works the same way.'
			},
			{
				heading: 'On our server — GIF, ICO, PDF',
				body: 'No browser can encode these three, so the image travels over an encrypted connection to our server and is converted with ImageMagick. GIF and PDF are streamed straight through the converter and never touch the disk. ICO is the exception: that encoder cannot write to a stream, so the result goes to a temporary file that is deleted as soon as your download is sent. Nothing is written to a database and we keep no copy.'
			},
			{
				heading: 'The limits we actually enforce',
				body: '20 MB per file, checked in your browser before anything is sent. Server-side conversions are cut off after 20 seconds, are limited to 30 requests per minute per IP address, and are checked byte by byte to confirm the upload really is an image.'
			},
			{
				heading: 'What we do not do',
				body: 'No account, no tracking or advertising cookies, and no third-party scripts, fonts or analytics. Your language and theme choice stay in your own browser.'
			}
		],
		privacyLink: 'Read the full privacy policy'
	},
	faq: {
		title: 'Frequently Asked Questions',
		items: [
			{
				q: 'Are my files uploaded to a server?',
				a: 'It depends on the target format. JPG, PNG and WEBP are encoded by your own browser, so those files never leave your device. GIF, ICO and PDF have no browser encoder: the image is sent to our server over an encrypted connection, converted in memory, returned to you and discarded. We keep no copy of it and store nothing in a database.'
			},
			{
				q: 'What is the maximum file size?',
				a: '20 MB per image. Your browser checks the size before anything is uploaded, so an oversized file is rejected immediately instead of failing halfway through. There is no limit on how many images you convert.'
			},
			{
				q: 'Which formats can I convert between?',
				a: 'You can upload JPG, PNG, WEBP, GIF, BMP and AVIF files, and convert them to JPG, PNG, WEBP, GIF, ICO or PDF.'
			},
			{
				q: 'Will converting PNG to JPG remove transparency?',
				a: 'Yes. JPG has no transparency channel, so every transparent area is filled with white before encoding. If you need to keep transparency, convert to PNG or WEBP instead.'
			},
			{
				q: 'Does converting reduce image quality?',
				a: 'PNG is lossless: the pixels come out exactly as they went in. JPG and WEBP are lossy formats, so some image data is discarded by design — Convetta encodes them at quality 92, which is high enough that the difference is hard to see at normal viewing size. Converting the same file back and forth between lossy formats will degrade it each time.'
			},
			{
				q: 'Can I convert several images at once?',
				a: 'Yes. Select or drop as many images as you like and they are converted in one pass. When they are ready you can download them individually or as a single ZIP.'
			},
			{
				q: 'Is Convetta free?',
				a: 'Yes, and there is no account to create. The only limits are technical ones: 20 MB per file, and server-side conversions are rate limited so that one visitor cannot take over the queue.'
			},
			{
				q: 'Does it work on phones and tablets?',
				a: 'Yes. The converter runs in any modern mobile browser. Very large images are limited by the memory your phone can give the browser rather than by Convetta.'
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
