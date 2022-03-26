import fs from "fs"
import { spawnSync } from "child_process"
import process from "process"
import toml from "toml"
import path from "path"
import { Plugin, PluginBuild, Message } from "esbuild"

const convertMessage = (message: string): Message => ({ pluginName: "es-gleam", location: null, notes: [], detail: null, text: `\nes-gleam:\n${message}` })

const compile = (gleam_dir: string, extra_args: string[]) => {
    const pwd: string = process.cwd()
    process.chdir(gleam_dir)
    const gleam = spawnSync("gleam", ["build", "--target", "javascript", ...extra_args])

    if (process.cwd() !== pwd) {
        process.chdir("..")
    }
    return { out: gleam.stdout, err: gleam.stderr }
}

const load_gleam_name = async (gleam_dir: string): Promise<string> => {
    const contents = await fs.promises.readFile(`${gleam_dir}/gleam.toml`, "utf8")
    const data = toml.parse(contents)
    const name = data.name
    return name
}

export interface EsGleamOptions { project_root: string, main_function: string, compile_args: string[] }

export function esgleam({ project_root, main_function, compile_args }: EsGleamOptions): Plugin {
    return {
        name: "esgleam",
        setup(build: PluginBuild) {
            build.onLoad({ filter: /\.gleam$/ }, async (args) => {
                if (project_root === undefined) {
                    project_root = "."
                }

                compile_args = compile_args || []
                const filename: string = path.basename(args.path).replace(".gleam", ".mjs")
                const project_name: string = await load_gleam_name(project_root)
                const build_path = `${project_root}/build/dev/javascript/${project_name}/dist`

                const { out: _, err } = compile(project_root, compile_args)
                if (err.length > 0) {
                    return { errors: [convertMessage(err.toString())] }
                }
                let contents = await fs.promises.readFile(`${build_path}/${filename}`, "utf8")

                if (main_function !== undefined) {
                    contents += `\n\n${main_function}();`
                }

                return { contents, loader: "js", resolveDir: build_path }
            })
        }
    }
}
