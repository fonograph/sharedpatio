/**
* To run: npx babel-node scripts/createMissingTestTakerData.js
*/

const Knex = require('knex');
const knex = Knex(require('../knexfile'));

async function run() {
    const thoughts = await knex('thoughts').select('*');
    for (let thought of thoughts) {
        const matches = await knex('matches').select('*').where('thought_id_1', thought.id).orWhere('thought_id_2', thought.id);
        if (matches.length > 0) {
            await knex('thoughts').where('id', thought.id).update('matched', true);
        }
    }
}

run().then(() => {
    console.log('complete');
    process.exit();
}, (e) => {
    console.log('error', e);
    process.exit(1);
});