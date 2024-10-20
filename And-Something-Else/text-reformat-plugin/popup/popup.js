"use strict";
import {text_formatter} from '../scripts/base.urils.mjs'

const input_typing = document.getElementById("input-typing");
const output_typing = document.getElementById("output-typing");
const format_click = document.getElementById("format-click");
const copy_click = document.getElementById("copy-click");

function get_format_text() {
    let text = input_typing.value;
    output_typing.value = text_formatter(text);
}

format_click.onclick = get_format_text;
copy_click.onclick = async () => {
    await navigator.clipboard.writeText(output_typing.value);
}