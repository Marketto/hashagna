import rollupPluginTs from "@wessberg/rollup-plugin-ts";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";
import tsconfig from "./tsconfig.json";
import license from "rollup-plugin-license";
import path from "path";

const SRC_PATH = 'src';
const baseConf = {
    external: [
        ...Object.keys(pkg.dependencies || {}),
    ],
    input: path.join(SRC_PATH, "index.ts"),
    output: {
        exports: "named",
        globals: {
        },
        name: "hashagna",
        sourcemap: true,
    },
    plugins: [
        license({
            banner: {
                content: {
                    file: path.join(".", "src/banner"),
                },
            },
            cwd: __dirname,
        }),
    ],
};

export default [
    {
        ...baseConf,
        output: {
            ...baseConf.output,
            format: "esm",
            file: pkg.module,
        },
        plugins: [
            ...baseConf.plugins,
            rollupPluginTs({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    module: "ESNext",
                    target: "ESNext",
                    declaration: true,
                },
            }),
        ],
    },
    {
        ...baseConf,
        output: {
            ...baseConf.output,
            format: "amd",
            file: pkg.browser,
        },
        plugins: [
            ...baseConf.plugins,
            rollupPluginTs({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    module: "amd",
                    target: "es5",
                    declaration: false,
                },
            }),
            uglify()
        ],
    },
    {
        ...baseConf,
        output: {
            ...baseConf.output,
            format: "iife",
            file: 'dist/hashagna.iife.min.js',
            outro: 'window.HashagnaHttpClient = exports.HashagnaHttpClient;' 
        },
        plugins: [
            ...baseConf.plugins,
            rollupPluginTs({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    module: "none",
                    target: "es3",
                    declaration: false,
                },
            }),
            uglify()
        ],
    },
];
