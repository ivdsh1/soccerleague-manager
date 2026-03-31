import { PLAYERS } from './players.js';

// This file defines the teams and their player rosters using player keys from players.js
// All player data is now managed in data/players.js for easy configuration.
const TEAMS_ROSTERS = [
    // Mid-Season SoccerLeague (MSSL) - 8 teams
    { id: 201, name: 'Sombrial', emoji: '👻', division: 'MSSL', logo: '', playerKeys: ['capivara_new', 'fernandes_new', 'nicolas_new', 'general201', 'snow201', 'gabrielchefao_new'] },
    { id: 202, name: 'Paulistano', emoji: '🏛️', division: 'MSSL', logo: '', playerKeys: ['neseig202', 'valladas202', 'vinicin207', 'haru_new'] },
    { id: 204, name: 'Canamerica City', emoji: '🏙️', division: 'MSSL', logo: '', playerKeys: ['yaahzy204', 'kayon204', 'gaifa204', 'gual_new', 'big204'] },
    { id: 205, name: 'Yokoshima', emoji: '⛩️', division: 'MSSL', logo: '', playerKeys: ['chicolego205', 'fire205', 'brabon205', 'rafao205', 'shadow_new'] },
    { id: 206, name: 'Hohen', emoji: '🏰', division: 'MSSL', logo: '', playerKeys: ['clayton208', 'pequi208', 'qkly206', 'pedrin206', 'meressonn206', 'vezinn_new', 'vinibento_new'] },
    { id: 207, name: 'ColdnessZ', emoji: '❄️', division: 'MSSL', logo: '', playerKeys: ['cactoil207', 'laufeyy206', 'felpy207', 'ugo207', 'parry207'] },
    { id: 208, name: 'Cuiabá', emoji: '🦜', division: 'MSSL', logo: '', playerKeys: ['mistercat109', 'ratao208', 'mgr_new', 'evil208', 'duque208', 'smurf208'] },
    { id: 209, name: 'União Redterno', emoji: '🦅', division: 'MSSL', logo: '', playerKeys: ['ilutt209', 'wdarkiih209', 'duffandrey209', 'matinho209', 'fait_new', 'ydustin209'] },
    
    // Intermediatte SoccerLeague (ISL) - 8 teams
    { id: 101, name: 'Akrious FC', emoji: '🤖', division: 'ISL', logo: '', playerKeys: ['akrious202', 'mascari109', 'thorium25101', 'marcelokalel101', 'liuil114', 'koouzin115', 'lucasmalz101'] },
    { id: 102, name: 'Atlético de Ferro', emoji: '🔩', division: 'ISL', logo: '', playerKeys: ['hyosaki_new', 'crazy102', 'mdx102', 'jogos12102', 'guto102'] },
    { id: 103, name: 'Katze', emoji: '🐈', division: 'ISL', logo: '', playerKeys: ['patinbw109', 'versed103', 'pinguino109', 'filipe7103', 'ownu110', 'guigp105', 'podequeijo104'] },
    { id: 203, name: 'Chapecoense', emoji: '💚', division: 'ISL', logo: '', playerKeys: ['pedrophes_new', 'silex_new', 'amv110', 'zeujhuan_new', 'dino203', 'tokkyo204', 'fabu_new', 'jaker203', 'gustavo203'] },
    { id: 107, name: 'FK Kros', emoji: '👑', division: 'ISL', logo: '', playerKeys: ['maki107', 'tonii107', 'ronaldo107', 'nikolas_tesla_new', 'george107'] },
    { id: 108, name: 'Itapipoca', emoji: '🍿', division: 'ISL', logo: '', playerKeys: ['lucasine206', 'bgustas_new', 'whitezin108', 'renan108', '7tec114', 'tenorio108', '7leo103'] },
    { id: 112, name: 'Los Totos', emoji: '🤷‍♂️', division: 'ISL', logo: '', playerKeys: ['ensona112', 'amik202', 'caki112', 'nauz109', 'martin112', 'joako112', 'toto106', 'eljota114', 'void202'] },
    { id: 113, name: 'Project Icarus', emoji: '🕊️', division: 'ISL', logo: '', playerKeys: ['sonho106', 'scizonbr110', 'tutulindo_new', 'qualquer114', 'wilmihyo_new', 'nubx_new'] },

    // Liga Amadora (LA) - 8 teams
    { id: 105, name: 'Canamerica Villa', emoji: '🏡', division: 'LA', logo: '', playerKeys: ['lipexmota105', 'presstart110', '021santos105', 'zeroy104', 'tampa771104', 'ratusa114', 'caxetaskills105'] },
    { id: 106, name: 'Time dos Aposentados', emoji: '👴', division: 'LA', logo: '', playerKeys: ['koringa203', 'shinitz113', 'vinis_new', 'lipmagnific_new', 'dream201', 'thematt201'] },
    { id: 109, name: 'FK Kros B', emoji: '🎭', division: 'LA', logo: '', playerKeys: ['franz107', 'p3tkov_new', 'alex109', 'isma103', 'gintokiiz_new'] },
    { id: 110, name: 'AD Confiança', emoji: '🤝', division: 'LA', logo: '', playerKeys: ['birobiro111', 'cirilo_gg_new', 'vhkx114', 'zecalagoa110', 'bito_new'] },
    { id: 111, name: 'Wolflacks', emoji: '🐺', division: 'LA', logo: '', playerKeys: ['sxpearl_new', 'dye_new', 'lgd101', 'maxsteel_new', 'pedrol_new'] },
    { id: 114, name: 'Celtic', emoji: '🍀', division: 'LA', logo: '', playerKeys: ['clover111', 'gabrielyta_new', 'matheusmito104', 'bernas_new', 'astro114'] },
    { id: 115, name: 'Terninhos', emoji: '🤵', division: 'LA', logo: '', playerKeys: ['ivan115', 'seisdasaff115', 'dripph115', 'vibes115', 'patodeterno115', 'r0pheus108', 'batatafeijao_new'] },
    { id: 116, name: 'Atlas FC', emoji: '🦁', division: 'LA', logo: '', playerKeys: ['nzxx116', 'dorazk116', 'krozz116', 'alvez116', 'goulart116', 'yoshi116', 'ym10116', 'neymarcrc116'] }
];

let playerIdCounter = 1000;

export const TEAMS_WITH_IDS = TEAMS_ROSTERS.map(teamConfig => {
    const teamPlayers = teamConfig.playerKeys.map(key => {
        const player = PLAYERS[key];
        if (!player) {
            console.warn(`Player with key "${key}" not found for team "${teamConfig.name}".`);
            return null;
        }
        return {
            ...player,
            id: playerIdCounter++, // Assign a unique numeric ID for game logic
        };
    }).filter(p => p !== null);

    return {
        id: teamConfig.id,
        name: teamConfig.name,
        emoji: teamConfig.emoji,
        division: teamConfig.division,
        logo: teamConfig.logo,
        players: teamPlayers,
    };
});