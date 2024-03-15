import addressI from "models/address.model";

export interface addressDto {
    predictions: Array<addressI>;
    status?: string
}