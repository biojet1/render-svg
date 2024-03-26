import { launch, LaunchOptions, BrowserLaunchArgumentOptions } from "puppeteer";

export async function render_svg({
	uri,
	path,
	output,
	width,
	height,
	par,
	quality,
	puppeteer_options,
	type,
}: {
	uri?: string;
	path?: string;
	output?: string;
	width?: number;
	height?: number;
	par?: string;
	quality?: number;
	type?: "png" | "jpeg" | "webp";
	puppeteer_options?: BrowserLaunchArgumentOptions & LaunchOptions;
}) {
	if (!uri) {
		if (path) {
			const url = await import("url");
			uri = url.pathToFileURL(path).toString();
		}
	}
	if (!uri) {
		throw new Error(`No path or uri`);
	}
	if (!puppeteer_options) {
		puppeteer_options = {
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			timeout: 10000,
		};
	}
	const browser = await launch(puppeteer_options);

	const page = await browser.newPage();
	await page.goto(uri);
	let svg_rect = await page.evaluate(
		(w, h, a) => {
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
					root.width.baseVal.value =
						(h * root.width.baseVal.value) / root.height.baseVal.value;
					root.height.baseVal.value = h;
				}
			} else if (!h) {
				if (w) {
					root.height.baseVal.value =
						(w * root.height.baseVal.value) / root.width.baseVal.value;
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
				root.height.baseVal.value,
			];
		},
		width,
		height,
		par
	);

	process.stderr.write(`${svg_rect[2]}x${svg_rect[3]} ${uri} -> ${output}`);
	try {
		if (output == "-") {
			let bin = await page.screenshot({
				quality,
				encoding: "binary",
				type,
				clip: {
					x: svg_rect[0],
					y: svg_rect[1],
					width: svg_rect[2],
					height: svg_rect[3],
				},
				omitBackground: true,
			});
			process.stdout.write(bin);
		} else if (output) {
			await page.screenshot({
				path: output,
				clip: {
					x: svg_rect[0],
					y: svg_rect[1],
					width: svg_rect[2],
					height: svg_rect[3],
				},
				omitBackground: true,
			});
		} else {
			throw new Error(`No output`);
		}
	} finally {
		await browser.close();
	}
}
