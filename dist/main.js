import { render_svg } from './index.js';
export function main() {
    const args = process.argv.slice(2);
    return import('yargs')
        .then((yargs) => yargs.default(args)).then((yinst) => {
        return yinst
            .usage('$0 <svg> <output>', 'convert svg file to png, webp, jpeg ')
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
        let src = opt.svg;
        // console.log(opt);
        let uri = undefined;
        let path = undefined;
        let output = opt.output;
        if (src.indexOf('://') < 0) {
            path = src;
        }
        else {
            uri = src;
        }
        function tp(x) {
            if (x.startsWith('p')) {
                return 'png';
            }
            else if (x.startsWith('j')) {
                return 'jpeg';
            }
            else if (x.startsWith('w')) {
                return 'webp';
            }
            return undefined;
        }
        return render_svg({
            uri, path,
            output,
            quality: opt.quality,
            type: opt.type ? tp(opt.type) : undefined,
        });
    });
}
//# sourceMappingURL=main.js.map