type geocodingI = {
    address_components:
    [
        {
            long_name: string,
            short_name: string,
            types:
            [
                string
            ]
        },
        {
            long_name: string,
            short_name: string,
            types:
            [
                string,
                string,
                string
            ]
        },
        {
            long_name: string,
            short_name: string,
            types:
            [
                string,
                string
            ]
        },
        {
            long_name: string,
            short_name: string,
            types:
            [
                string,
                string
            ]
        },
        {
            long_name: string,
            short_name: string,
            types:
            [
                string,
                string
            ]
        }
    ],
    formatted_address: string,
    geometry:
    {
        location:
        {
            lat: number,
            lng: number
        },
        location_type: string,
        viewport:
        {
            northeast:
            {
                lat: number,
                lng: number
            },
            southwest:
            {
                lat: number,
                lng: number
            }
        }
    },
    partial_match: boolean,
    place_id: number,
    types:
    [
        string
    ]
}
export default geocodingI;
