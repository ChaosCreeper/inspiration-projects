export async function $simple_wiktionary(value){
    let search_url = `https://en.wiktionary.org/api/rest_v1/page/definition/${value}`;
    let resp = await $base_request_template(search_url);
    return await resp.json();
}
export async function $free_dictionary_api(value){
    const search_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${value}`;
    let resp = await $base_request_template(search_url);
    return await resp.json();
}

async function $base_request_template(url) {
    let resp = await fetch(url);
    if (!resp.ok){
        // console.log(resp.content);
        console.error("HTTP-Error: " + resp.status);
    }
    return resp;
}

