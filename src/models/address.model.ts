type addressI = {
    description: string,
    place_id: string,
    reference: string,
    structured_formatting: {
        main_text: string,
        main_text_matched_substrings: [
            {
                length: 11,
                offset: 0
            }
        ],
        secondary_text: string
    }
}
export default addressI;
