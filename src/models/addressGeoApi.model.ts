type addressGeoApiI = {
    type: string,
    properties: {
        datasource: {
            sourcename: string,
            attribution: string,
            license: string,
            url: string
        },
        name: string,
        country: string,
        country_code: string,
        state: string,
        city: string,
        postcode: string,
        district: string,
        neighbourhood: string,
        suburb: string,
        street: string,
        lon: number,
        lat: number,
        formatted: string,
        address_line1: string,
        address_line2: string,
        category: string,
        timezone: {
            name: string,
            offset_STD: string,
            offset_STD_seconds: string,
            offset_DST: string,
            offset_DST_seconds: number
        },
        place_id: string,
    }
}
export default addressGeoApiI;
