import { Schema } from "mongoose";

const PokemonSchema = new Schema({
    name: String,
    type: String,
    health: {
        type: Number,
        min: 0,
        max: 1000
    },
    creationDate: {
        type: Number,
        default: Date.now
    },
    state: {
        type: String,
        default: "wild",
    }, // free, captured
    owner: String
}, {
    collection: "pokemonfall2025"
})

export default PokemonSchema;