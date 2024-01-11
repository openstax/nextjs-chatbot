

export function countWords(str: string) {
    return str.match(/\b\S+\b/g)?.length || 0;
}

export function countWordsAndSentences(str: string) {
    return {
        words: countWords(str),
        sentences: str.split(/[\.!\?]+\s/g).filter(Boolean).length
    };
}
