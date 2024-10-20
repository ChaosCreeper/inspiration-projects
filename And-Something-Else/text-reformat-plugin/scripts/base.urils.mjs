export function text_formatter(text) {
    // Trim whitespace from the start and end
    text = text.trim();

    if (text.length < 1) {
        return text;
    }

    // Replace newlines and carriage returns with spaces
    text = text.replace(/\s+/g, ' ');

    return text;
}
