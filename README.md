# esgleam

An [esbuild](https://esbuild.github.io/) plugin for [gleam](gleam.run/) ✨

---
Gleam is a beautiful little language that compiles to JS and to Erlang. Esbuild is an excellent little js bundler. It's a great match! 🌸

## Usage

```shell
# install
npm i --save-dev esgleam
# or
yarn add --dev esgleam 
```

in conjunction with esbuild

```javascript
// add to your esbuild config file
// more info @ https://esbuild.github.io/plugins/#using-plugins
import esbuild from "esbuild"
import esgleam from "esgleam"

esbuild.build({
    entryPoints: ['./src/main.gleam'],
    bundle: true,
    outfile: 'out.js',
    plugins: [esgleam.esgleam({ main_function: "main", project_root: "." })],
}).catch(() => process.exit(1))
```

### Options

```typescript
export interface EsGleamOptions {
    // path to the root of the gleam project
    // default: "."
    project_root: string;
    // if defined the output file will call this function with no args
    // useful for bundled js files
    main_function: string;
    // other flags to be passed to the gleam compiler
    compile_args: string[];
}

export declare function esgleam({ project_root, main_function, compile_args }: EsGleamOptions): Plugin;
```
