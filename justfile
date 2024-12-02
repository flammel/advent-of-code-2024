[private]
default:
    just --list --unsorted

run FILE:
    deno run --allow-read=.inputs {{FILE}}

test FILE:
    deno test {{FILE}}

format:
    deno fmt

lint:
    deno lint