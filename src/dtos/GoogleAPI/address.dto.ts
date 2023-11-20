import addressI from "models/address.model";

export interface addressDto {
    results: Array<addressI>;
    status?: string
}