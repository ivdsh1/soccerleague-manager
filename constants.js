import { TEAMS_WITH_IDS } from './data/teams.js';

export const SQUAD_SIZE_LIMIT = 35;
export const MIN_SQUAD_SIZE = 4;
export const INITIAL_BUDGET_MSSL = 150000000;
export const INITIAL_BUDGET_ISL = 85000000;
export const INITIAL_BUDGET_LA = 20000000;

export const ELO_TIERS = [
    { nameKey: 'elo.master', icon: '🏆', min: 95, color: 'text-amber-300' },
    { nameKey: 'elo.netherite', icon: '🔥', min: 90, color: 'text-red-500' },
    { nameKey: 'elo.obsidian', icon: '🧱', min: 80, color: 'text-purple-400' },
    { nameKey: 'elo.diamond', icon: '💎', min: 70, color: 'text-sky-400' },
    { nameKey: 'elo.emerald', icon: '💚', min: 60, color: 'text-emerald-400' },
    { nameKey: 'elo.gold', icon: '🟡', min: 50, color: 'text-yellow-400' },
    { nameKey: 'elo.silver', icon: '⚪', min: 30, color: 'text-gray-300' },
    { nameKey: 'elo.bronze', icon: '🟤', min: 15, color: 'text-orange-400' },
    { nameKey: 'elo.iron', icon: '⚙️', min: 0, color: 'text-stone-400' },
];

export const getEloFromSkill = (skill) => {
    return ELO_TIERS.find(tier => skill >= tier.min) || ELO_TIERS[ELO_TIERS.length - 1];
};


export const TEAMS = TEAMS_WITH_IDS.map(t => {
    const playersWithValueAndSalary = t.players.map((p) => {
        const value = p.marketValue ?? Math.floor(Math.pow(p.skill, 2.3) * 20);
        return {
            ...p,
            value,
            salary: Math.floor(value / 150) + 500,
        };
    });

    const avgSkill = playersWithValueAndSalary.length > 0
        ? Math.round(playersWithValueAndSalary.reduce((sum, p) => sum + p.skill, 0) / playersWithValueAndSalary.length)
        : 0;

    return {
        ...t,
        players: playersWithValueAndSalary,
        skill: avgSkill,
    };
});


export const TACTIC_STYLES = ['Equilibrado', 'Contra-Ataque', 'Ofensivo', 'Defensivo'];

export const INITIAL_TACTIC = {
  style: 'Equilibrado',
};

export const POSITION_NAMES = {
    DEF: 'Defensor',
    MC: 'Meio-Campo',
    ATA: 'Atacante'
};

export const POSITION_NAMES_PLURAL = {
    DEF: 'Defensores',
    MC: 'Meio-Campistas',
    ATA: 'Atacantes'
};

export const BENCH_LIMIT = 5;
export const CUP_ROUND_NAMES = {
    16: 'Oitavas de Final',
    8: 'Quartas de Final',
    4: 'Semifinal',
    2: 'Final'
};

export const AWAITING_OPPONENT_TEAM = {
    id: 0,
    name: 'Aguardando Oponente',
    logo: '❓',
    emoji: '❓',
    players: [],
    skill: 0,
    division: 'LA',
    played: 0,
    wins: 0, draws: 0, losses: 0,
    goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
    points: 0,
    budget: 0,
};

export const PRIZE_MONEY = {
  MSSL_CHAMPION: 15000000,
  MSSL_RUNNER_UP: 8000000,
  ISL_CHAMPION: 7500000,
  ISL_RUNNER_UP: 4000000,
  LA_CHAMPION: 1000000,
  USL_CHAMPION: 5000000,
  ASL_CHAMPION: 2500000,
  CSL_CHAMPION: 10000000,
  CA_CHAMPION: 500000,
};

export const MATCH_EARNINGS = {
    MSSL: { win: 200000, draw: 75000 },
    ISL: { win: 100000, draw: 35000 },
    LA: { win: 50000, draw: 15000 },
    CSL: { win: 150000, draw: 0 },
    USL: { win: 150000, draw: 0 },
    ASL: { win: 150000, draw: 0 },
    CA: { win: 40000, draw: 0 }
};