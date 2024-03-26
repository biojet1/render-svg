/// <reference types="node" />
import { LaunchOptions, BrowserLaunchArgumentOptions } from "puppeteer";
export declare function render_svg({ uri, path, output, width, height, par, quality, puppeteer_options, type, }: {
    uri?: string;
    path?: string;
    output?: string;
    width?: number;
    height?: number;
    par?: string;
    quality?: number;
    type?: "png" | "jpeg" | "webp";
    puppeteer_options?: BrowserLaunchArgumentOptions & LaunchOptions;
}): Promise<Buffer | undefined>;
