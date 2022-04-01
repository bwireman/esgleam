import process from "process"
import esbuild from "esbuild"
import esgleam from "../dist/index.js"

esbuild.build({
    entryPoints: ["src/example.gleam"],
    bundle: true,
    platform: "node",
    outfile: "out.js",
    plugins: [esgleam.esgleam({ project_root: ".", main_function: "main", compile_args: ["--warnings-as-errors"] })],
}).catch(() => process.exit(1))