import rollupPluginTs from "@wessberg/rollup-plugin-ts";
import pkg from "./package.json";
import tsconfig from "./tsconfig.json";
import license from "rollup-plugin-license";
import path from "path";

const baseConf = {
    external: [
        ...Object.keys(pkg.dependencies || {}),
    ],
    input: "src/index.ts",
    output: {
        exports: "named",
        globals: {
        },
        name: "Hashagna",
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

const rollupModuleConf = rollupPluginTs({
    tsconfig: {
        ...tsconfig.compilerOptions,
        module: "ESNext",
        target: "ESNext",
    },
});

const rollupBrowserConf = rollupPluginTs({
    tsconfig: {
        ...tsconfig.compilerOptions,
        module: "es2015",
        target: "ES2015",
    },
});

export default [
    {
        ...baseConf,
        output: {
            ...baseConf.output,
            file: pkg.module,
            format: "esm",
        },
        plugins: [
            rollupModuleConf,
            ...baseConf.plugins,
        ],
    },
    {
        ...baseConf,
        output: {
            ...baseConf.output,
            file: pkg.main, //bundle.min
            format: "iife",
        },
        plugins: [
            rollupBrowserConf,
            ...baseConf.plugins,
        ],
    },
];
