import mongoose from "mongoose";
import PokemonSchema from "../schema/pokemon.schema.js";

const PokemonModel = mongoose.model("Pokemon", PokemonSchema)

export function insertPokemon(pokemon) {
    return PokemonModel.create(pokemon);
}

export function getAllPokemon() {
    return PokemonModel.find().exec();
}

export function findPokemonByType(type) {
    return PokemonModel.find({
        type: type
    }).exec()
}

export function findPokemonByOwner(owner) {
    return PokemonModel.find({
        owner: owner
    }).exec()
}

export function findPokemonById(id) {
    return PokemonModel.findById(id).exec();
}

export function deletePokemon(id) {
    return PokemonModel.findByIdAndDelete(id);
}