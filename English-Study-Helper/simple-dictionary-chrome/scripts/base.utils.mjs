export function is_empty_string(value) {
    if (!value){
        return true;
    }else {
        if (typeof value === "string"){
            return value.trim() === "";
        }else {
            throw new Error(`Expected a string, but got ${typeof value}`);
        }
    }
}


export function extract_all_text(htmlString) {
    // Create a temporary DOM element to parse the HTML string
    let tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    // Use textContent to get the plain text inside the element
    return tempElement.textContent || tempElement.innerText || '';
}

export async function read_local_text(local_file){
    let resp = await fetch(local_file);
    return await resp.text();
}