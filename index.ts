import fs from "fs"
import { spawnSync } from "child_process"
import process from "process"
import toml from "toml"
import path from "path"
import { Plugin, PluginBuild, Message } from "esbuild"

const PLUGIN_NAME = "esgleam"

const convertMessage = (message: string): Message => ({ pluginName: PLUGIN_NAME, location: null, notes: [], detail: null, text: `\n${PLUGIN_NAME}:\n${message}` })

const compile = (gleam_dir: string, extra_args: string[]) => {
    const pwd: string = process.cwd()
    process.chdir(gleam_dir)
    const gleam = spawnSync("gleam", ["build", "--target", "javascript", ...extra_args])

    if (process.cwd() !== pwd) {
        process.chdir("..")
    }

    return { out: gleam.stdout, stderr: gleam.stderr, err: gleam.error }
}

const load_gleam_name = async (gleam_dir: string): Promise<string> => {
    const contents = await fs.promises.readFile(`${gleam_dir}/gleam.toml`, "utf8")
    const data = toml.parse(contents)
    const name = data.name
    return name
}

export interface EsGleamOptions { project_root?: string, main_function?: string, compile_args?: string[] }
export function esgleam(opts: EsGleamOptions | undefined = undefined): Plugin {
    return {
        name: PLUGIN_NAME,
        setup(build: PluginBuild) {
            build.onLoad({ filter: /\.gleam$/ }, async (args) => {
                const project_root = opts?.project_root ?? "."
                const compile_args = opts?.compile_args ?? []

                const filename: string = path.basename(args.path).replace(".gleam", ".mjs")
                const project_name: string = await load_gleam_name(project_root)
                const build_path = `${project_root}/build/dev/javascript/${project_name}/dist`

                const { out: _, stderr, err } = compile(project_root, compile_args)
                if (stderr && stderr.length > 0) {
                    return { errors: [convertMessage(stderr.toString())] }
                }

                if (err && err?.message.length > 0) {
                    return { errors: [convertMessage(`Error running gleam: ${err.message}`)] }
                }

                let contents = await fs.promises.readFile(`${build_path}/${filename}`, "utf8")
                if (opts?.main_function !== undefined) {
                    contents += `\n\n${opts.main_function}();`
                }

                return { contents, loader: "js", resolveDir: build_path }
            })
        }
    }
}
