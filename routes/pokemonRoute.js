const express = require('express');
const axios = require('axios');
const router = express.Router();
const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 3600, 
    checkperiod: 600, 
    useClones: false, 
    maxKeys: 1000 
  });

router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const cacheKey = `pokemon:${name.toLowerCase()}`;
    console.log(cacheKey)

    try {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log(`Cache hit for ${cacheKey}`);
            return res.json(cachedData);
        }
        console.log(`Cache miss for ${cacheKey}`);
        
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

        const { id, name: pokemonName, height, weight, abilities, types, sprites, moves, stats } = response.data;
        

        const pokemonData = {
            id,
            name: pokemonName,
            height,
            weight,
            abilities: abilities.map(ability => ability.ability.name),
            types: types.map(type => type.type.name),
            sprites,
            moves,
            stats
        };

        const moveData = moves.map(move => {
            return {
                name: move.move.name,
                
            };
        });

        
        pokemonData.moves = moveData;

        const dreamWorldSprite = sprites.other.dream_world.front_default;

        
        pokemonData.dreamWorldSprite = dreamWorldSprite;

      
        cache.set(cacheKey, pokemonData);
        res.json(pokemonData); 
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        res.status(500).json({ error: 'Failed to fetch Pokémon data' });
    }
});

module.exports = router;