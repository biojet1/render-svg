# SVGRast

```
svgrast <svg> <output>

convert svg file to png, webp, jpeg

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --width    set width                                                  [number]
  --height   set height                                                 [number]
  --par      set preserveAspectRatio                                    [string]
  --quality  Quality of the image, between 0-100. Not applicable to png images
                                                                        [number]
  --type     image type if piping to stdout     [choices: "png", "jpeg", "webp"]
  --bgcolor  set backgroung color                                       [string]
```

## Installation

```
npm i -g https://github.com/biojet1/svgrast
```

## Usage

```
npx svgrast https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/car.svg car.webp
```
