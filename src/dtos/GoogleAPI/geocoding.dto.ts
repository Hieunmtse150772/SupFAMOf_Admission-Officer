import geocodingI from "models/geocoding.model";

export interface geocodingDto {
    results: Array<geocodingI>;
    status?: string
}