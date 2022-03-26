import process from "process"
import es_gleam from "../index"
import esbuild from "esbuild"

esbuild.build({
    entryPoints: ["src/example.gleam"],
    bundle: true,
    platform: "node",
    outfile: "out.js",
    plugins: [es_gleam({ project_root: ".", main_function: "main", compile_args: ["--warnings-as-errors"] })],
}).catch(() => process.exit(1))