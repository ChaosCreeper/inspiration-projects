"use strict"
import {extract_all_text, is_empty_string, read_local_text} from "../scripts/base.utils.mjs";
import {$free_dictionary_api, $simple_wiktionary} from "../scripts/api.mjs";

const LOADING = "[...loading]";
const NOT_FOUND = "[Not Found]";
const fetch_by_source = {
    "free-dictionary": get_definition_by_free,
    "wiktionary": get_definition_by_wiki
}

async function get_definition_by_wiki(word){
    let json = await $simple_wiktionary(word);
    let definitions = json?.en[0]?.definitions;
    let res = []
    for (let row of definitions){
        let content = extract_all_text(row.definition);
        res.push(content);
        //console.log(content);
    }
    return res;

}

async function get_definition_by_free(value){
    let json = await $free_dictionary_api(value);
    if (json.title){
        //can not find the definition
        return {word: value, pronounce: NOT_FOUND, description: NOT_FOUND, audio: null};
    }else {
        let word = json[0]?.word;
        let pronounce = json[0].phonetic??NOT_FOUND;
        let definitions = [];
        let audio = json[0]?.phonetics[0]?.audio;
        const meaning_arr = json[0]?.meanings[0].definitions??[];
        for (let i = 0; i < meaning_arr.length??0; i++) {
            definitions.push(meaning_arr[i].definition);
        }
        return {word, pronounce, definitions, audio};
    }

}

async function is_basic_word(value) {
    const local_file = 'source/basic-English-list.txt';
    let raw_text = await read_local_text(local_file)
    return raw_text.match(value);
}

async function is_3000_word(value){
    const local_file = 'source/Oxford-3000-list.txt';
    let raw_text = await read_local_text(local_file);
    return raw_text.match(value);
}

async function is_5000_word(value){
    const local_file = 'source/Oxford-5000-list.txt';
    let raw_text = await read_local_text(local_file);
    return raw_text.match(value);
}

function get_tag(value){
    let tag_group = document.getElementsByClassName('word-group-content')[0];
    tag_group.innerHTML = '';
    is_basic_word(value).then(
        res => {
            if (res){
                let tagNode = get_tag_node("Basic");
                tag_group.append(tagNode);
            }
        }
    );
    is_3000_word(value).then(
        res => {
            if (res){
                let tagNode = get_tag_node("3000");
                tag_group.append(tagNode);
            }
        }
    );
    is_5000_word(value).then(
        res => {
            if (res){
                let tagNode = get_tag_node("5000");
                tag_group.append(tagNode);
            }
        }
    )
}

function get_tag_node(tag_text){
    let nodeElem = document.createElement("div");
    nodeElem.setAttribute("class", "word-tag");
    let nodeText = document.createElement("p")
    nodeText.setAttribute("class", "word-tag-text");
    nodeText.textContent = tag_text;
    nodeElem.append(nodeText);
    return nodeElem;
}

function add_explanation_of(source, header, definitions){
    const explanation_header = document.getElementById(header);
    if (!explanation_header){
        throw new Error(`header is missing: ${header}`);
    }
    for (let i = 0; i < definitions.length; i++) {
        //build the element
        const definition_elem = document.createElement("p");
        definition_elem.setAttribute("class", "definition-sentence");
        definition_elem.textContent = definitions[i];
        explanation_header.append(definition_elem);
    }
}

function get_definition(value, source) {
    const header = `${source}-definitions`;
    const explanation_header = document.getElementById(header);
    explanation_header.innerHTML = `<p class='definition-sentence'>${LOADING}</p>`;
    fetch_by_source[source](value).then(
        res => {
            explanation_header.innerHTML = '';
            switch_search_box_state();
            add_explanation_of(source, header, res);
        }
    );
}

function get_word_header(value) {
    document.getElementById("word").textContent = LOADING;
    document.getElementById("pronounce").textContent = LOADING;
    get_definition_by_free(value).then(
        res => {
            document.getElementById("word").textContent = res.word??value;
            document.getElementById("pronounce").textContent = res.pronounce??NOT_FOUND;
            if(res.audio){
                let audio = new Audio(res.audio);
                document.getElementById("audio-button").textContent ='聲';
                document.getElementById("audio-button").disabled = false;
                document.getElementById("audio-button").onclick = () => audio.play();
            }else {
                document.getElementById("audio-button").textContent = "無";
                document.getElementById("audio-button").disabled = true;
                document.getElementById("audio-button").onclick = null;
            }
        })
}

function switch_search_box_state() {
    let state = document.getElementById('param').disabled;
    document.getElementById('param').disabled = !state;
}

function search_word(word) {
    switch_search_box_state();
    if (!is_empty_string(word)){
        get_word_header(word);
        get_tag(word);
        get_definition(word, "wiktionary");
    }
}

let searchBoxElem = document.getElementById("param");
searchBoxElem.onkeydown = (e) => {
    if (e.code !== "Enter"){
        return;
    }
    let value = searchBoxElem.value;
    search_word(value);
}


chrome.storage.session.get('lastWord', ({ lastWord }) => {
    search_word(lastWord);
});

chrome.storage.session.onChanged.addListener((changes) => {
    const lastWordChange = changes['lastWord'];

    if (!lastWordChange) {
        return;
    }
    searchBoxElem.value = lastWordChange.newValue;
    search_word(lastWordChange.newValue);
});