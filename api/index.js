const express = require('express');
const Knex = require('knex');
const levenshtein = require('js-levenshtein');

const MAX_LETTERS = 100;
const ALLOWED_CHAR_DIFF_PER_TEN_CHARS = 2;


const knex = Knex(require('../knexfile'));

const server = express();
server.use(express.urlencoded({extended:true}));

const router = express.Router();
server.use('/api', router);

router.post('/submit', async (req, res) => {
    const thought = req.body.thought;

    if (thought.length > MAX_LETTERS) {
        res.json({error: 'too, too many letters'});
        return;
    }

    const thought_clean = thought.replace(/\W/g, '', thought.toLowerCase());
    const length = thought_clean.length;
    const created = knex.raw('NOW()');

    const thoughtId = (await knex('thoughts').insert({thought, thought_clean, length, created, uid: null}))[0];

    // build uid
    let uid = thoughtId;
    for (let i=0; i<10; i++) {
        const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
        uid += chars[Math.floor(Math.random() * chars.length)];
    }
    await knex('thoughts').where('id', thoughtId).update({uid});

    // save words
    const words = thought.replace(/[^ \w]/g, '', thought.toLowerCase()).split(/ +/);
    for (let word of words) {
        let savedWordId, savedWordCount, savedWord = await knex('words').where('word', word);
        if (savedWord.length) {
            savedWordId = savedWord[0].id;
            savedWordCount = savedWord[0].count;
        } else {
            savedWordId = (await knex('words').insert({word, count: 0}))[0];
            savedWordCount = 0;
        }
        await knex('words').where('id', savedWordId).update({count: savedWordCount+1});
    }

    const minScore = thought_clean.length * ALLOWED_CHAR_DIFF_PER_TEN_CHARS / 10;
    const minScoreWithPartial1 = thought_clean.length * (ALLOWED_CHAR_DIFF_PER_TEN_CHARS + 1) / 10;
    const minScoreWithPartial2 = thought_clean.length * (ALLOWED_CHAR_DIFF_PER_TEN_CHARS + 2) / 10;

    // Grab some random substrings to test against other thoughts as a rough heuristic to limit detailed comparisons
    const substringLength = 3;
    const substringCount = 4;
    const substrings = [];
    for (let i=0; i<substringCount; i++) {
        substrings.push(thought_clean.substr(Math.floor(Math.random()*(thought_clean.length-substringCount)), substringLength));
    }

    let query = knex.select('*').from('thoughts').whereRaw('ABS(length - ?) <= ?', [thought_clean.length, minScoreWithPartial2]);
    query = query.where((builder) => {
        for (let sub of substrings) {
            builder.orWhere('thought_clean', 'like', `%${sub}%`);
        }
    });
    console.log(query.toString());
    const otherThoughts = await query;
    let matches = 0, partial1 = 0, partial2 = 0;
    for (let other of otherThoughts) {
        if (other.id%1000===0) console.log(other.id);
        const score = levenshtein(thought_clean, other.thought_clean, minScoreWithPartial2);
        if (score <= minScore) {
            await knex('matches').insert({
                'thought_id_1': thoughtId,
                'thought_id_2': other.id
            });
            await knex('matches').insert({
                'thought_id_1': other.id,
                'thought_id_2': thoughtId
            });
            matches++;
        } else if (score <= minScoreWithPartial1) {
            partial1++;
        } else if (score <= minScoreWithPartial2) {
            partial2++;
        }
        await knex('partials').insert({
            'thought_id': thoughtId,
            '1': partial1,
            '2': partial2
        });
    }

    res.json({matches, partial1, partial2});
});

router.get('/test', async (req, res) => {
    const test = 'twas brillig in the slithy toves did gyre and gimble in the wabe';
    const thoughts = await knex.select('*').from('thoughts');
    const results = [];
    for (let thought of thoughts) {
        results.push(levenshtein(test, thought.thought));
    }
    res.send(results.length + ' ... ' + results.join(' '));
});

router.get('/thought/:thoughtId', (req, res) => {
    res.send('hi');
});

router.get('/meta', async (req, res) => {
    const data = {}

    const thoughtCount = await knex('thoughts').count();
    data['thoughtCount'] = Object.values(thoughtCount[0])[0];

    const matchCount = await knex('matches').count(knex.raw('distinct thought_id_1'));
    data['matchCount'] = Object.values(matchCount[0])[0];

    const words = await knex('words').select('word').whereRaw('length(word) > 3').orderBy('count', 'desc').limit(20);
    data['words'] = words.map(row => row.word);

    const random = await knex('thoughts').select('thought').whereRaw('length(thought) > 15').orderByRaw('rand()').limit(1);
    data['random'] = random[0].thought;

    res.json(data);
});






// Start the server
const port = process.env.API_PORT || 3000;
server.listen(port);
console.log('listening on ' + port);