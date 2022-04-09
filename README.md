# esgleam

An [esbuild](https://esbuild.github.io/) plugin for [gleam](gleam.run/) ✨

![npm](https://img.shields.io/npm/dt/esgleam)
[![commits](https://img.shields.io/github/last-commit/bwireman/esgleam)](https://github.com/bwireman/esgleam/commit/main)
[![mit](https://img.shields.io/github/license/bwireman/esgleam?color=brightgreen)](https://github.com/bwireman/esgleam/blob/main/LICENSE)
![gleam js](https://img.shields.io/badge/%20gleam%20%E2%9C%A8-js%20%F0%9F%8C%B8-pink)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](http://makeapullrequest.com)

---

Gleam is a beautiful little language that compiles to JS and to Erlang. Esbuild is an excellent little js bundler. It's a great match! 🌸

## Usage

```shell
# install
npm i --save-dev esgleam esbuild
# or
yarn add --dev esgleam esbuild
```

in conjunction with esbuild
> more info @ https://esbuild.github.io/plugins/#using-plugins

```javascript
// add to your esbuild config file
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
    project_root?: string;
    // if defined the output file will call this function with no args
    // useful for bundled js files
    main_function?: string;
    // other flags to be passed to the gleam compiler
    compile_args?: string[];
}
```
