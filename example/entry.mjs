import process from "process"
import esbuild from "esbuild"
import esgleam from "../dist/index.js"

esbuild.build({
    entryPoints: ["src/example.gleam"],
    bundle: true,
    platform: "node",
    outfile: "out.js",
    plugins: [esgleam.esgleam({ main_function: "main" })],
}).catch(() => process.exit(1))