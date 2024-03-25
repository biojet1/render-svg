import { launch, LaunchOptions, BrowserLaunchArgumentOptions } from "puppeteer";

export function main() {
	const args = process.argv.slice(2);
	return import('yargs')
		.then((yargs) => yargs.default(args)).then((yinst) => {
			return yinst
				.strict()
				.help()
				.version()
				.demand(1)
				.options({
					width: {
						describe: 'set width',
						type: 'number',
					},
					height: {
						describe: 'set height',
						type: 'number',
					},
					par: {
						describe: 'set preserveAspectRatio',
						type: 'string',
					},
					quality: {
						describe: 'Quality of the image, between 0-100. Not applicable to png images',
						type: 'number',
					},
					type: {
						describe: `image type if piping to stdout `,
						choices: ['png', 'jpeg', 'webp']
					},

				}).argv;
		}).then((opt) => {
			let src = `${opt._[0]}`;
			let uri = undefined;
			let path = undefined;
			if (src.indexOf('://') < 0) {
				path = src;
			} else {
				uri = src;
			}
			function tp(x: string) {
				if (x.startsWith('p')) {
					return 'png';
				} else if (x.startsWith('j')) {
					return 'jpeg';
				} else if (x.startsWith('w')) {
					return 'webp';
				}
				return undefined;
			}

			return render_svg({
				uri, path,
				output: opt._[1] ? `${opt._[1]}` : undefined,
				quality: opt.quality,
				type: opt.type ? tp(opt.type) : undefined,
			})
		})
		;
}

export async function render_svg({
	uri, path, output, width, height, par, quality,
	puppeteer_options, type

}: {
	uri?: string,
	path?: string,
	output?: string,
	width?: number,
	height?: number,
	par?: string,
	quality?: number,
	type?: 'png' | 'jpeg' | 'webp';
	puppeteer_options?: BrowserLaunchArgumentOptions & LaunchOptions
}) {
	if (!uri) {
		if (path) {
			const url = await import('url');
			uri = url.pathToFileURL(path).toString();
		}
	}
	if (!uri) {
		return;
	}
	if (!puppeteer_options) {
		puppeteer_options = {
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			timeout: 10000,
		}
	}
	const browser = await launch(puppeteer_options);

	const page = await browser.newPage();
	await page.goto(uri);
	let svg_rect = await page.evaluate((w, h, a) => {
		var root = document.rootElement as SVGSVGElement;
		if (!(root.viewBox.baseVal.width > 0)) {
			let { value } = root.width.baseVal;
			if (value > 0) {
				root.viewBox.baseVal.width = value;
			}
		}
		if (!(root.viewBox.baseVal.height > 0)) {
			let { value } = root.height.baseVal;
			if (value > 0) {
				root.viewBox.baseVal.height = value;
			}
		}
		if (a) {
			root.setAttribute("preserveAspectRatio", a);
		}
		if (!w) {
			if (h) {
				root.width.baseVal.value = h * root.width.baseVal.value / root.height.baseVal.value
				root.height.baseVal.value = h;
			}
		} else if (!h) {
			if (w) {
				root.height.baseVal.value = w * root.height.baseVal.value / root.width.baseVal.value
				root.width.baseVal.value = w;
			}
		} else {
			root.width.baseVal.value = w;
			root.height.baseVal.value = h;
		}
		return [
			root.x.baseVal.value,
			root.y.baseVal.value,
			root.width.baseVal.value,
			root.height.baseVal.value
		]
	}, width, height, par);

	process.stderr.write(`${svg_rect[2]}x${svg_rect[3]} ${uri} -> ${output}`);

	if (output == '-') {
		let bin = await page.screenshot({
			quality,
			encoding: 'binary',
			type,
			clip: { x: svg_rect[0], y: svg_rect[1], width: svg_rect[2], height: svg_rect[3] },
			omitBackground: true
		});
		process.stdout.write(bin);
	} else if (output) {
		await page.screenshot({
			path: output,
			clip: { x: svg_rect[0], y: svg_rect[1], width: svg_rect[2], height: svg_rect[3] },
			omitBackground: true
		});
	}

	await browser.close();
};

