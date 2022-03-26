import gleam/io
import gleam/string

external fn yellow(String) -> String =
  "colors" "yellow"

external fn pink(String) -> String =
  "colors" "brightMagenta"

external fn bg_black(String) -> String =
  "colors" "bgBlack"

pub fn main() {
  let first =
    "Hello from esbuild"
    |> yellow()

  let second =
    "gleam! ✨"
    |> pink()

  string.concat([first, " & ", second])
  |> bg_black()
  |> io.println()
}
