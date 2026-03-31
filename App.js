import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState } from './types.js';
import { TEAMS, INITIAL_TACTIC, BENCH_LIMIT, CUP_ROUND_NAMES, SQUAD_SIZE_LIMIT, MIN_SQUAD_SIZE, INITIAL_BUDGET_MSSL, INITIAL_BUDGET_LA, AWAITING_OPPONENT_TEAM, PRIZE_MONEY, MATCH_EARNINGS, INITIAL_BUDGET_ISL } from './constants.js';
import SetupScreen from './components/SetupScreen.js';
import Dashboard from './components/Dashboard.js';
import { simulateMatchResult } from './services/geminiService.js';
import ExportSaveModal from './components/ExportSaveModal.js';
import ImportSaveModal from './components/ImportSaveModal.js';
import { ALLOWED_IPS } from './data/adminConfig.js';
import ResetConfirmationModal from './components/ResetConfirmationModal.js';
import SeasonEndModal from './components/SeasonEndModal.js';
import { useI18n } from './lib/i18n.js';
import MatchSimulatorModal from './components/MatchSimulatorModal.js';

const getAIStarters = (team) => {
    if (!team || !team.players || team.players.length === 0) return [];
    return [...team.players].sort((a, b) => b.skill - a.skill).slice(0, 4);
};

const simulateAIMatch = (match) => {
    const homeStarters = getAIStarters(match.homeTeam);
    const awayStarters = getAIStarters(match.awayTeam);

    // Sistema de W.O. robusto para evitar "jogadores fantasmas"
    if (homeStarters.length === 0 && awayStarters.length === 0) {
        return { homeScore: 0, awayScore: 0, events: [], penaltyWinner: undefined };
    }
    if (homeStarters.length === 0) {
        return { homeScore: 0, awayScore: 3, events: [{ minute: 1, type: 'GOAL', player: 'W.O.', team: 'AWAY', half: 1 }], penaltyWinner: 'AWAY' };
    }
    if (awayStarters.length === 0) {
        return { homeScore: 3, awayScore: 0, events: [{ minute: 1, type: 'GOAL', player: 'W.O.', team: 'HOME', half: 1 }], penaltyWinner: 'HOME' };
    }

    const homeSkill = homeStarters.reduce((sum, p) => sum + p.skill, 0);
    const awaySkill = awayStarters.reduce((sum, p) => sum + p.skill, 0);
    const totalSkill = homeSkill + awaySkill;

    const baseGoals = 2 + Math.floor(Math.random() * 4);
    const homeWeight = (homeSkill / totalSkill) + 0.1;
    const awayWeight = (awaySkill / totalSkill);

    let homeScore = Math.max(0, Math.round(baseGoals * homeWeight * (0.8 + Math.random() * 0.4)));
    let awayScore = Math.max(0, Math.round(baseGoals * awayWeight * (0.8 + Math.random() * 0.4)));

    const events = [];
    const addGoals = (score, teamType, players) => {
        for (let i = 0; i < score; i++) {
            const scorer = players[Math.floor(Math.random() * players.length)];
            const minute = Math.floor(Math.random() * 90) + 1;
            events.push({ 
                minute, 
                type: 'GOAL', 
                player: scorer.name, 
                playerId: scorer.id,
                team: teamType, 
                half: minute <= 45 ? 1 : 2 
            });
        }
    };

    addGoals(homeScore, 'HOME', homeStarters);
    addGoals(awayScore, 'AWAY', awayStarters);
    events.sort((a, b) => a.minute - b.minute);

    const isKnockout = ['CSL', 'CA', 'USL', 'ASL'].includes(match.competition);
    let penaltyWinner = undefined;
    if (isKnockout && homeScore === awayScore) {
        penaltyWinner = Math.random() > 0.5 ? 'HOME' : 'AWAY';
    }

    const stats = {
        homeShots: homeScore + Math.floor(Math.random() * 8),
        homeShotsOnGoal: homeScore + Math.floor(Math.random() * 3),
        homeFouls: Math.floor(Math.random() * 12),
        homePossession: 45 + Math.floor(Math.random() * 11),
        awayShots: awayScore + Math.floor(Math.random() * 8),
        awayShotsOnGoal: awayScore + Math.floor(Math.random() * 3),
        awayFouls: Math.floor(Math.random() * 12),
        awayPossession: 0 // calculated below
    };
    stats.awayPossession = 100 - stats.homePossession;

    const allStarters = [...homeStarters, ...awayStarters];
    const mvpPlayer = allStarters.length > 0 ? allStarters[Math.floor(Math.random() * allStarters.length)] : null;
    const mvp = mvpPlayer ? {
        player: mvpPlayer.name,
        team: homeStarters.some(p => p.id === mvpPlayer.id) ? 'HOME' : 'AWAY'
    } : null;

    const ironWallPlayer = homeStarters.find(p => p.position === 'DEF') || awayStarters.find(p => p.position === 'DEF') || allStarters[0];
    const awards = {
        ironWall: ironWallPlayer ? {
            player: ironWallPlayer.name,
            team: homeStarters.some(p => p.id === ironWallPlayer.id) ? 'HOME' : 'AWAY'
        } : null
    };

    return { homeScore, awayScore, events, penaltyWinner, stats, mvp, awards };
};

export const App = () => {
    const { t, locale, setLocale } = useI18n();
    const [gameState, setGameState] = useState(GameState.SETUP);
    const [managerName, setManagerName] = useState('');
    const [userTeamId, setUserTeamId] = useState(null);
    const [userTeam, setUserTeam] = useState(null);
    const [msslTable, setMsslTable] = useState([]);
    const [islTable, setIslTable] = useState([]);
    const [laTable, setLaTable] = useState([]);
    const [msslFixtures, setMsslFixtures] = useState([]);
    const [islFixtures, setIslFixtures] = useState([]);
    const [laFixtures, setLaFixtures] = useState([]);
    const [uslFixtures, setUslFixtures] = useState([]);
    const [aslFixtures, setAslFixtures] = useState([]);
    const [cslFixtures, setCslFixtures] = useState([]);
    const [caFixtures, setCaFixtures] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [currentRound, setCurrentRound] = useState(1);
    const [squad, setSquad] = useState({ starters: [], bench: [], reserves: [] });
    const [tactic, setTactic] = useState(INITIAL_TACTIC);
    const [season, setSeason] = useState(1);
    const [gamePhase, setGamePhase] = useState('REGULAR_SEASON');
    const [isSimulating, setIsSimulating] = useState(false);
    const [playerStats, setPlayerStats] = useState([]);
    const [seasonHistory, setSeasonHistory] = useState([]);
    const [notification, setNotification] = useState(null);
    const [aiNews, setAiNews] = useState([]);
    const [matchToPlay, setMatchToPlay] = useState(null);
    const [ongoingLiveMatch, setOngoingLiveMatch] = useState(null);
    const [userMatchJustFinished, setUserMatchJustFinished] = useState(null);
    const [selectedTeamForInspector, setSelectedTeamForInspector] = useState(null);

    const updateTeamInTables = useCallback((teamId, updater) => {
        setMsslTable(prev => prev.map(t => t.id === teamId ? updater(t) : t));
        setIslTable(prev => prev.map(t => t.id === teamId ? updater(t) : t));
        setLaTable(prev => prev.map(t => t.id === teamId ? updater(t) : t));
        if (userTeamId === teamId) {
            setUserTeam(prev => updater(prev));
        }
    }, [userTeamId]);

    const updateAllTeamsInTables = useCallback((updater) => {
        setMsslTable(prev => prev.map(t => updater(t)));
        setIslTable(prev => prev.map(t => updater(t)));
        setLaTable(prev => prev.map(t => updater(t)));
        setUserTeam(prev => updater(prev));
    }, []);

    const showNotification = useCallback((message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    }, []);

    const allTableSetters = { MSSL: setMsslTable, ISL: setIslTable, LA: setLaTable };
    const allFixtureSetters = { 
        MSSL: setMsslFixtures, ISL: setIslFixtures, LA: setLaFixtures, 
        USL: setUslFixtures, ASL: setAslFixtures, CSL: setCslFixtures, CA: setCaFixtures 
    };

    const updateAllFixturesWithTeamData = useCallback((teamId, updatedTeam) => {
        Object.values(allFixtureSetters).forEach(setter => {
            setter(prev => prev.map(f => {
                if (f.status === 'PLAYED') return f;
                let home = f.homeTeam;
                let away = f.awayTeam;
                let changed = false;
                if (home.id === teamId) { home = updatedTeam; changed = true; }
                if (away.id === teamId) { away = updatedTeam; changed = true; }
                return changed ? { ...f, homeTeam: home, awayTeam: away } : f;
            }));
        });
    }, []);

    const handleAILifecycle = useCallback(() => {
        const news = [];
        
        ['MSSL', 'ISL', 'LA'].forEach(div => {
            allTableSetters[div](prevTable => {
                return prevTable.map(team => {
                    if (team.id === userTeamId) return team;

                    let updatedTeam = { ...team };
                    const actionRoll = Math.random();

                    // IA - Empréstimos em crise
                    if (updatedTeam.budget < -500000 && !updatedTeam.loan) {
                        const principal = 2500000;
                        const totalOwed = principal * 1.30;
                        const loan = { principal, totalOwed, repaymentPerRound: totalOwed / 20, roundsRemaining: 20 };
                        
                        news.push(`🏦 Financeiro: ${updatedTeam.name} tomou um empréstimo para cobrir dívidas.`);
                        updatedTeam.budget += principal;
                        updatedTeam.loan = loan;
                        updateAllFixturesWithTeamData(updatedTeam.id, updatedTeam);
                    }

                    // IA - Mercado dinâmico (Venda)
                    if (actionRoll < 0.05 && updatedTeam.players.length > MIN_SQUAD_SIZE) {
                        const sortedPlayers = [...updatedTeam.players].sort((a,b) => a.skill - b.skill);
                        const toSell = sortedPlayers[0];
                        const newPlayers = updatedTeam.players.filter(p => p.id !== toSell.id);
                        
                        generateNews('MARKET', `${updatedTeam.name} dispensou ${toSell.name} para reduzir a folha.`);
                        updatedTeam.budget += toSell.value;
                        updatedTeam.players = newPlayers;
                        updateAllFixturesWithTeamData(updatedTeam.id, updatedTeam);
                    }

                    if (actionRoll > 0.98) {
                        generateNews('INFO', `${updatedTeam.name} está treinando intensamente para o próximo jogo.`);
                    }

                    return updatedTeam;
                });
            });
        });

        if (news.length > 0) {
            setAiNews(prev => [...news, ...prev].slice(0, 15));
        }
    }, [userTeamId, updateAllFixturesWithTeamData]);

    const handleTakeLoan = useCallback((option) => {
        if (userTeam.loan) {
            showNotification("Você já possui um empréstimo ativo!");
            return;
        }

        const totalOwed = Math.floor(option.principal * (1 + option.interest));
        const loan = {
            principal: option.principal,
            totalOwed,
            repaymentPerRound: Math.floor(totalOwed / option.duration),
            roundsRemaining: option.duration
        };

        setUserTeam(prev => ({
            ...prev,
            budget: prev.budget + option.principal,
            loan: loan
        }));

        setMsslTable(prev => prev.map(t => t.id === userTeamId ? { ...t, budget: t.budget + option.principal, loan: loan } : t));
        setIslTable(prev => prev.map(t => t.id === userTeamId ? { ...t, budget: t.budget + option.principal, loan: loan } : t));
        setLaTable(prev => prev.map(t => t.id === userTeamId ? { ...t, budget: t.budget + option.principal, loan: loan } : t));

        showNotification(`Empréstimo de ${option.principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} contratado!`);
    }, [userTeam, userTeamId, showNotification]);

    const generateKnockout = (teams, competition, round = 8) => {
        const fixtures = [];
        const n = teams.length;
        
        if (round === 8) {
            if (n === 8) {
                // Quarter-finals
                for (let i = 0; i < 4; i++) {
                    fixtures.push({
                        id: `cup-${competition}-${season}-${round}-${i}`,
                        round,
                        status: 'SCHEDULED',
                        competition,
                        homeTeam: teams[i],
                        awayTeam: teams[n - 1 - i]
                    });
                }
            } else if (n === 6) {
                // USL Special: 2 byes (top 2), 2 matches
                fixtures.push({
                    id: `cup-${competition}-${season}-${round}-0`,
                    round,
                    status: 'SCHEDULED',
                    competition,
                    homeTeam: teams[2],
                    awayTeam: teams[5]
                });
                fixtures.push({
                    id: `cup-${competition}-${season}-${round}-1`,
                    round,
                    status: 'SCHEDULED',
                    competition,
                    homeTeam: teams[3],
                    awayTeam: teams[4]
                });
            }
        } else if (round === 4) {
            // Semi-finals
            for (let i = 0; i < n / 2; i++) {
                fixtures.push({
                    id: `cup-${competition}-${season}-${round}-${i}`,
                    round,
                    status: 'SCHEDULED',
                    competition,
                    homeTeam: teams[i * 2],
                    awayTeam: teams[i * 2 + 1]
                });
            }
        } else if (round === 2) {
            // Final
            fixtures.push({
                id: `cup-${competition}-${season}-${round}-0`,
                round,
                status: 'SCHEDULED',
                competition,
                homeTeam: teams[0],
                awayTeam: teams[1]
            });
        }
        return fixtures;
    };

    const generateNews = useCallback((type, text) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAiNews(prev => [{ type, text, time }, ...prev].slice(0, 20));
    }, []);

    useEffect(() => {
        if (aiNews.length === 0) {
            generateNews('INFO', "Bem-vindo à nova temporada da Soccer League!");
            generateNews('INFO', "MSSL, ISL e LA estão prontas para começar.");
            generateNews('MARKET', "Fique de olho no mercado de transferências!");
        }
    }, [aiNews.length, generateNews]);

    const handleExecuteCommand = (cmd) => {
        const parts = cmd.trim().split(/\s+/);
        const action = parts[0].toLowerCase();

        if (action === 'help') {
            if (isAdmin) {
                return 'Comandos Admin: budget <id|all> <valor>, skill <id|all> <valor>, win <id|all>, lose <id|all>, rich <id|all>, news <texto>, admin, advance, reset, help';
            }
            return 'Comandos: key <codigo>, joke, fortune, ping, echo <texto>, whoami, team, stats, roll, coin, magic8, quote, weather, love, hack, dance, admin, help';
        }

        if (action === 'ping') return 'Pong! 🏓';
        if (action === 'echo') return parts.slice(1).join(' ') || 'Eco... eco... eco...';
        
        if (action === 'whoami') {
            return `Você é ${managerName}, treinador da equipe ${userTeam.name}. Nível de habilidade da equipe: ${userTeam.skill}.`;
        }

        if (action === 'team') {
            return `Equipe: ${userTeam.name} (${userTeam.emoji})\nDivisão: ${userTeam.division}\nOrçamento: $${userTeam.budget.toLocaleString()}\nJogadores: ${userTeam.players.length}`;
        }

        if (action === 'stats') {
            const userStats = playerStats.filter(s => s.statsBySeason[season]?.teamId === userTeamId);
            const topScorer = [...userStats].sort((a, b) => (b.statsBySeason[season]?.total.goals || 0) - (a.statsBySeason[season]?.total.goals || 0))[0];
            return topScorer ? `Artilheiro do time: ${topScorer.playerName} (${topScorer.statsBySeason[season].total.goals} gols)` : 'Nenhuma estatística disponível ainda.';
        }

        if (action === 'roll') {
            const sides = parseInt(parts[1]) || 6;
            return `🎲 Você rolou um D${sides} e tirou: ${Math.floor(Math.random() * sides) + 1}`;
        }

        if (action === 'coin') {
            return `🪙 Cara ou Coroa? Deu: ${Math.random() > 0.5 ? 'CARA' : 'COROA'}`;
        }

        if (action === 'magic8') {
            const answers = ["Sim", "Não", "Talvez", "Perunte novamente mais tarde", "Com certeza", "Sem chance", "É provável", "Não conte com isso"];
            return `🔮 A bola 8 diz: ${answers[Math.floor(Math.random() * answers.length)]}`;
        }

        if (action === 'quote') {
            const quotes = [
                "O futebol é a coisa mais importante entre as coisas menos importantes. - Arrigo Sacchi",
                "Não é apenas um jogo, é uma paixão.",
                "O futebol é simples, mas é difícil jogar de forma simples. - Johan Cruyff",
                "Vencer não é tudo, é a única coisa. - Bill Shankly",
                "O futebol é um jogo de erros. Quem cometer o menor erro, vence. - Pelé"
            ];
            return `💬 ${quotes[Math.floor(Math.random() * quotes.length)]}`;
        }

        if (action === 'weather') {
            const weathers = ["Ensolarado ☀️", "Nublado ☁️", "Chuvoso 🌧️", "Tempestade ⛈️", "Nevando ❄️", "Neblina 🌫️"];
            return `🌤️ Previsão para o próximo jogo: ${weathers[Math.floor(Math.random() * weathers.length)]}`;
        }

        if (action === 'love') {
            return `❤️ Eu amo o ${userTeam.name}! Vamos para a glória! 🏆`;
        }

        if (action === 'hack') {
            return "💻 [HACKING IN PROGRESS...]\n[####################] 100%\n[ACCESS GRANTED]\nBrincadeira! Você não tem permissão para hackear o sistema. 😉";
        }

        if (action === 'dance') {
            return "💃 (•_•) / ( •_•)>⌐■-■ / (⌐■_■) 🕺\nO treinador está comemorando a vitória!";
        }

        if (action === 'joke') {
            const jokes = [
                "Por que o treinador de futebol foi ao banco? Para pegar seus 'centavos' de volta!",
                "O que um goleiro disse para o outro? 'Pega essa!'",
                "Por que os jogadores de futebol são ótimos em festas? Porque eles sabem como 'dar um passe'!",
                "Qual é o chá favorito dos jogadores? O chá-mpions League!",
                "Por que o campo de futebol estava molhado? Porque os jogadores estavam 'driblando' muito!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        if (action === 'fortune') {
            const fortunes = [
                "Uma grande vitória está no seu horizonte.",
                "Cuidado com as lesões no próximo treino.",
                "Um olheiro está de olho no seu atacante estrela.",
                "Sua tática atual trará frutos inesperados.",
                "O próximo clássico será decidido nos acréscimos."
            ];
            return fortunes[Math.floor(Math.random() * fortunes.length)];
        }

        if (action === 'admin') {
            const newState = !isAdmin;
            setIsAdmin(newState);
            return newState 
                ? 'Acesso administrativo concedido! Digite "help" para ver os novos comandos.' 
                : 'Modo administrador desativado.';
        }

        if (action === 'key') {
            const code = parts[1]?.toLowerCase();
            if (code === 'pascoa') {
                setUserTeam(prev => ({ ...prev, budget: prev.budget + 500000 }));
                return 'Feliz Páscoa! +$500.000 adicionados ao seu orçamento.';
            }
            if (code === 'natal') {
                setUserTeam(prev => ({ ...prev, budget: prev.budget + 1000000 }));
                return 'Feliz Natal! +$1.000.000 adicionados ao seu orçamento.';
            }
            if (code === 'anonovo') {
                setUserTeam(prev => ({ ...prev, budget: prev.budget + 2000000 }));
                return 'Feliz Ano Novo! +$2.000.000 adicionados ao seu orçamento.';
            }
            if (code === 'soccerleague') {
                setUserTeam(prev => ({ ...prev, budget: prev.budget + 5000000 }));
                return 'Código promocional ativado! +$5.000.000 adicionados ao seu orçamento.';
            }
            return 'Código inválido.';
        }

        if (isAdmin) {
            const target = parts[1];
            const value = parseFloat(parts[2]);

            if (action === 'budget') {
                if (target === 'all') {
                    updateAllTeamsInTables(t => ({ ...t, budget: value }));
                    return `Orçamento de todos os times definido para $${value.toLocaleString()}.`;
                }
                updateTeamInTables(target, t => ({ ...t, budget: value }));
                return `Orçamento do time ${target} definido para $${value.toLocaleString()}.`;
            }

            if (action === 'skill') {
                if (target === 'all') {
                    updateAllTeamsInTables(t => ({ ...t, skill: value }));
                    return `Habilidade de todos os times definida para ${value}.`;
                }
                updateTeamInTables(target, t => ({ ...t, skill: value }));
                return `Habilidade do time ${target} definida para ${value}.`;
            }

            if (action === 'win') {
                if (target === 'all') {
                    updateAllTeamsInTables(t => ({ ...t, budget: t.budget + 1000000 }));
                    return 'Todos os times ganharam $1.000.000.';
                }
                updateTeamInTables(target, t => ({ ...t, budget: t.budget + 1000000 }));
                return `Time ${target} ganhou $1.000.000.`;
            }

            if (action === 'lose') {
                if (target === 'all') {
                    updateAllTeamsInTables(t => ({ ...t, budget: Math.max(0, t.budget - 1000000) }));
                    return 'Todos os times perderam $1.000.000.';
                }
                updateTeamInTables(target, t => ({ ...t, budget: Math.max(0, t.budget - 1000000) }));
                return `Time ${target} perdeu $1.000.000.`;
            }

            if (action === 'rich') {
                if (target === 'all') {
                    updateAllTeamsInTables(t => ({ ...t, budget: 1000000000 }));
                    return 'Todos os times agora são bilionários!';
                }
                updateTeamInTables(target, t => ({ ...t, budget: 1000000000 }));
                return `Time ${target} agora é bilionário!`;
            }

            if (action === 'news') {
                const newsText = parts.slice(1).join(' ');
                setAiNews(prev => [newsText, ...prev].slice(0, 20));
                return 'Notícia adicionada ao feed.';
            }

            if (action === 'advance') {
                handleSimulateSeason();
                return 'Simulando restante da temporada...';
            }

            if (action === 'reset') {
                handleResetGame();
                return 'Jogo resetado.';
            }
        }

        return `Comando desconhecido: ${action}. Digite "help" para ver os comandos disponíveis.`;
    };

    const handleMatchComplete = useCallback((match, result) => {
        const fixtureSetter = allFixtureSetters[match.competition];
        const tableSetter = allTableSetters[match.competition];

        fixtureSetter(prev => prev.map(f => f.id === match.id ? { ...f, ...result, status: 'PLAYED' } : f));

        if (tableSetter) {
            tableSetter(prev => prev.map(t => {
                if (t.id === match.homeTeam.id || t.id === match.awayTeam.id) {
                    const isHome = t.id === match.homeTeam.id;
                    const myScore = isHome ? result.homeScore : result.awayScore;
                    const oppScore = isHome ? result.awayScore : result.homeScore;
                    return {
                        ...t,
                        played: t.played + 1,
                        goalsFor: t.goalsFor + myScore,
                        goalsAgainst: t.goalsAgainst + oppScore,
                        goalDifference: t.goalDifference + (myScore - oppScore),
                        points: t.points + (myScore > oppScore ? 3 : myScore === oppScore ? 1 : 0),
                        wins: t.wins + (myScore > oppScore ? 1 : 0),
                        draws: t.draws + (myScore === oppScore ? 1 : 0),
                        losses: t.losses + (myScore < oppScore ? 1 : 0)
                    };
                }
                return t;
            }).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference));
        }

        // Generate News for significant events
        if (result.homeScore > 3 || result.awayScore > 3) {
            generateNews('MATCH', `Goleada! ${match.homeTeam.name} ${result.homeScore} x ${result.awayScore} ${match.awayTeam.name} pela ${match.competition}.`);
        } else if (result.homeScore === result.awayScore && result.homeScore >= 2) {
            generateNews('MATCH', `Empate emocionante entre ${match.homeTeam.name} e ${match.awayTeam.name} (${result.homeScore}x${result.awayScore}).`);
        }

        const isUserMatch = match.homeTeam.id === userTeamId || match.awayTeam.id === userTeamId;
        if (isUserMatch) {
            setUserTeam(prev => {
                const payroll = prev.players.reduce((s, p) => s + p.salary, 0);
                let prize = 0;
                const earnings = MATCH_EARNINGS[match.competition];
                if (earnings) {
                    const win = (result.homeScore > result.awayScore && match.homeTeam.id === userTeamId) || (result.awayScore > result.homeScore && match.awayTeam.id === userTeamId);
                    prize = win ? earnings.win : (result.homeScore === result.awayScore ? (earnings.draw || 0) : 0);
                }
                return { ...prev, budget: prev.budget + prize - payroll };
            });
            setUserMatchJustFinished(match);
        }

        // Update Player Stats
        setPlayerStats(prev => {
            const newStats = [...prev];
            const updateStat = (playerId, playerName, teamId, teamName, teamEmoji, teamLogo, statKey, competition) => {
                let pStat = newStats.find(s => s.playerId === playerId);
                if (!pStat) {
                    pStat = {
                        playerId,
                        playerName,
                        career: { total: { goals: 0, assists: 0, matchesPlayed: 0, ownGoals: 0 } },
                        statsBySeason: {}
                    };
                    newStats.push(pStat);
                }

                if (!pStat.career[competition]) pStat.career[competition] = { goals: 0, assists: 0, matchesPlayed: 0, ownGoals: 0 };
                if (!pStat.statsBySeason[season]) {
                    pStat.statsBySeason[season] = {
                        teamId, teamName, teamEmoji, teamLogo,
                        total: { goals: 0, assists: 0, matchesPlayed: 0, ownGoals: 0 }
                    };
                }
                if (!pStat.statsBySeason[season][competition]) pStat.statsBySeason[season][competition] = { goals: 0, assists: 0, matchesPlayed: 0, ownGoals: 0 };

                pStat.career.total[statKey]++;
                pStat.career[competition][statKey]++;
                pStat.statsBySeason[season].total[statKey]++;
                pStat.statsBySeason[season][competition][statKey]++;
            };

            const getAIStarters = (team) => [...team.players].sort((a,b) => b.skill - a.skill).slice(0, 4);
            const homeStarters = match.homeTeam.id === userTeamId ? squad.starters : getAIStarters(match.homeTeam);
            const awayStarters = match.awayTeam.id === userTeamId ? squad.starters : getAIStarters(match.awayTeam);

            homeStarters.forEach(p => updateStat(p.id, p.name, match.homeTeam.id, match.homeTeam.name, match.homeTeam.emoji, match.homeTeam.logo, 'matchesPlayed', match.competition));
            awayStarters.forEach(p => updateStat(p.id, p.name, match.awayTeam.id, match.awayTeam.name, match.awayTeam.emoji, match.awayTeam.logo, 'matchesPlayed', match.competition));

            result.events.forEach(event => {
                if (event.type === 'GOAL') {
                    const team = event.team === 'HOME' ? match.homeTeam : match.awayTeam;
                    updateStat(event.playerId, event.player, team.id, team.name, team.emoji, team.logo, 'goals', match.competition);
                    if (event.assistPlayerId) {
                        updateStat(event.assistPlayerId, event.assistPlayer, team.id, team.name, team.emoji, team.logo, 'assists', match.competition);
                    }
                } else if (event.type === 'OWN_GOAL') {
                    const team = event.team === 'HOME' ? match.homeTeam : match.awayTeam;
                    updateStat(event.playerId, event.player, team.id, team.name, team.emoji, team.logo, 'ownGoals', match.competition);
                }
            });

            return newStats;
        });
    }, [userTeamId, season, squad.starters]);

    const handleSimulateSeason = useCallback(async () => {
        setIsSimulating(true);
        
        const simulateAll = () => {
            let matchesSimulated = false;
            
            // Loop until no more matches are scheduled (this handles newly generated cup rounds)
            while (true) {
                const allFixtures = [
                    ...msslFixtures, ...islFixtures, ...laFixtures,
                    ...uslFixtures, ...aslFixtures, ...cslFixtures, ...caFixtures
                ].filter(f => f.status === 'SCHEDULED');

                if (allFixtures.length === 0) break;
                matchesSimulated = true;

                const rounds = [...new Set(allFixtures.map(f => f.round))].sort((a, b) => a - b);
                
                for (const round of rounds) {
                    const roundFixtures = allFixtures.filter(f => f.round === round);
                    for (const match of roundFixtures) {
                        const result = simulateAIMatch(match);
                        handleMatchComplete(match, result);
                    }
                    if (round >= currentRound) setCurrentRound(round + 1);
                    handleAILifecycle();
                }
                
                // We need to break if we are in a phase where no more matches can be generated
                // but for now the useEffect handles generation. 
                // In a real async environment we might need to wait or trigger generation manually.
                // Since we are in a single execution block, we'll assume the state updates 
                // will be visible in the next iteration if we were using a more reactive approach.
                // For this sim, we'll just do one pass of all CURRENTLY scheduled.
                break; 
            }
            return matchesSimulated;
        };

        simulateAll();
        setIsSimulating(false);
        showNotification(t('notification.season_simulated'));
    }, [msslFixtures, islFixtures, laFixtures, uslFixtures, aslFixtures, cslFixtures, caFixtures, handleMatchComplete, handleAILifecycle, currentRound, showNotification, t]);

    useEffect(() => {
        if (!userMatchJustFinished) return;
        const match = userMatchJustFinished;
        setUserMatchJustFinished(null);

        const simRemaining = async () => {
            setIsSimulating(true);
            const remaining = [...msslFixtures, ...islFixtures, ...laFixtures, ...uslFixtures, ...aslFixtures, ...cslFixtures, ...caFixtures]
                .filter(f => f.round === match.round && f.competition === match.competition && f.status === 'SCHEDULED');
            
            remaining.forEach(m => handleMatchComplete(m, simulateAIMatch(m)));
            if (['MSSL', 'ISL', 'LA'].includes(match.competition) && match.round === currentRound) {
                setCurrentRound(r => r + 1);
                handleAILifecycle();
            }
            setIsSimulating(false);
        };
        simRemaining();
    }, [userMatchJustFinished, msslFixtures, islFixtures, laFixtures, handleMatchComplete, handleAILifecycle, currentRound]);

    const handleStartGame = (name, team) => {
        setManagerName(name);
        const init = (t, div, bud) => ({ ...t, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, division: div, budget: bud, loan: null });
        const mssl = TEAMS.filter(t => t.division === 'MSSL').map(t => init(t, 'MSSL', INITIAL_BUDGET_MSSL));
        const isl = TEAMS.filter(t => t.division === 'ISL').map(t => init(t, 'ISL', INITIAL_BUDGET_ISL));
        const la = TEAMS.filter(t => t.division === 'LA').map(t => init(t, 'LA', INITIAL_BUDGET_LA));
        
        setMsslTable(mssl); setIslTable(isl); setLaTable(la);
        setUserTeamId(team.id); 
        const selected = [...mssl, ...isl, ...la].find(t => t.id === team.id);
        setUserTeam(selected);
        
        const starters = [...selected.players].sort((a,b) => b.skill - a.skill).slice(0, 4);
        const rest = selected.players.filter(p => !starters.some(s => s.id === p.id));
        setSquad({ starters, bench: rest.slice(0, BENCH_LIMIT), reserves: rest.slice(BENCH_LIMIT) });

        const gen = (teams) => {
            const fixtures = [];
            const n = teams.length;
            for(let r=0; r < (n-1)*2; r++){
                for(let i=0; i<n/2; i++){
                    const h = teams[i], a = teams[n-1-i];
                    fixtures.push({ id: `f-${h.id}-${a.id}-${r}-${Math.random().toString(36).substr(2, 5)}`, round: r+1, status: 'SCHEDULED', competition: h.division, homeTeam: r < (n-1) ? h : a, awayTeam: r < (n-1) ? a : h });
                }
                teams.splice(1, 0, teams.pop());
            }
            return fixtures;
        };

        setMsslFixtures(gen([...mssl])); setIslFixtures(gen([...isl])); setLaFixtures(gen([...la]));

        // Initialize Player Stats
        const allPlayers = [...mssl, ...isl, ...la].flatMap(t => {
            t.players.forEach(p => {
                if (!p.teamHistory) p.teamHistory = [t.name];
            });
            return t.players;
        });
        const initialStats = allPlayers.map(p => ({
            playerId: p.id,
            playerName: p.name,
            career: { total: { goals: 0, assists: 0, matchesPlayed: 0, ownGoals: 0 } },
            statsBySeason: {}
        }));
        setPlayerStats(initialStats);

        setGameState(GameState.DASHBOARD);
    };

    const [showSeasonEndModal, setShowSeasonEndModal] = useState(false);
    const [seasonSummary, setSeasonSummary] = useState(null);

    const handleEndSeason = useCallback(() => {
        const msslChampion = msslTable[0];
        const islChampion = islTable[0];
        const laChampion = laTable[0];

        // Cups (simplified for now, usually the last played match in that competition)
        const getCupWinner = (fixtures) => {
            const final = fixtures.filter(f => f.status === 'PLAYED').sort((a,b) => b.round - a.round)[0];
            if (!final) return null;
            return final.homeScore > final.awayScore ? final.homeTeam : final.awayTeam;
        };

        const summary = {
            year: season + 2024,
            msslChampion,
            islChampion,
            laChampion,
            cslChampion: getCupWinner(cslFixtures),
            uslChampion: getCupWinner(uslFixtures),
            aslChampion: getCupWinner(aslFixtures),
            caChampion: getCupWinner(caFixtures),
            promotedToMssl: islTable.slice(0, 2),
            relegatedToIsl: msslTable.slice(-2),
            promotedToIsl: laTable.slice(0, 2),
            relegatedToLa: islTable.slice(-2),
            msslTable: [...msslTable],
            islTable: [...islTable],
            laTable: [...laTable]
        };

        // Individual Awards
        const allStats = [...playerStats];
        const getWinner = (stats) => [...stats].sort((a,b) => (b.statsBySeason[season]?.total.goals || 0) - (a.statsBySeason[season]?.total.goals || 0))[0];
        
        const bestPlayer = getWinner(allStats.filter(s => s.statsBySeason[season]));
        if (bestPlayer) {
            summary.ballonDorWinner = {
                playerName: bestPlayer.playerName,
                teamName: bestPlayer.statsBySeason[season].teamName,
                teamEmoji: bestPlayer.statsBySeason[season].teamEmoji,
                age: 25, // Placeholder
                seasonStats: bestPlayer.statsBySeason[season].total
            };
        }

        const youngPlayers = allStats.filter(s => s.statsBySeason[season]); // Simplified: everyone is young for now
        const bestYoung = getWinner(youngPlayers);
        if (bestYoung) {
            summary.goldenBoyWinner = {
                playerName: bestYoung.playerName,
                teamName: bestYoung.statsBySeason[season].teamName,
                teamEmoji: bestYoung.statsBySeason[season].teamEmoji,
                age: 20, // Placeholder
                seasonStats: bestYoung.statsBySeason[season].total
            };
        }

        setSeasonSummary(summary);
        setShowSeasonEndModal(true);
    }, [season, msslTable, islTable, laTable, cslFixtures, uslFixtures, aslFixtures, caFixtures, playerStats]);

    const handleStartNewSeason = useCallback(() => {
        if (!seasonSummary) return;

        setSeasonHistory(prev => [seasonSummary, ...prev]);
        setSeason(prev => prev + 1);
        setCurrentRound(1);
        setGamePhase('REGULAR_SEASON');
        setShowSeasonEndModal(false);

        // Handle Promotions/Relegations in TEAMS and reset tables
        // This is a bit complex, for now let's just reset the current tables with some logic
        const updateTeams = (table, newDiv) => table.map(t => ({ ...t, division: newDiv, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }));

        const newMssl = [
            ...updateTeams(msslTable.slice(0, -2), 'MSSL'),
            ...updateTeams(islTable.slice(0, 2), 'MSSL')
        ];
        const newIsl = [
            ...updateTeams(msslTable.slice(-2), 'ISL'),
            ...updateTeams(islTable.slice(2, -2), 'ISL'),
            ...updateTeams(laTable.slice(0, 2), 'ISL')
        ];
        const newLa = [
            ...updateTeams(islTable.slice(-2), 'LA'),
            ...updateTeams(laTable.slice(2), 'LA')
        ];

        setMsslTable(newMssl);
        setIslTable(newIsl);
        setLaTable(newLa);

        // Update user team if it was promoted/relegated
        const allNew = [...newMssl, ...newIsl, ...newLa];
        const updatedUserTeam = allNew.find(t => t.id === userTeamId);
        if (updatedUserTeam) setUserTeam(updatedUserTeam);

        // Regenerate Fixtures
        const gen = (teams) => {
            const fixtures = [];
            const n = teams.length;
            for(let r=0; r < (n-1)*2; r++){
                for(let i=0; i<n/2; i++){
                    const h = teams[i], a = teams[n-1-i];
                    fixtures.push({ id: `f-${h.id}-${a.id}-${r}-${Math.random().toString(36).substr(2, 5)}`, round: r+1, status: 'SCHEDULED', competition: h.division, homeTeam: r < (n-1) ? h : a, awayTeam: r < (n-1) ? a : h });
                }
                teams.splice(1, 0, teams.pop());
            }
            return fixtures;
        };

        setMsslFixtures(gen([...newMssl]));
        setIslFixtures(gen([...newIsl]));
        setLaFixtures(gen([...newLa]));
        
        // Reset cups
        setUslFixtures([]); setAslFixtures([]); setCslFixtures([]); setCaFixtures([]);

    }, [seasonSummary, userTeamId, msslTable, islTable, laTable]);

    const handleSwitchTeam = useCallback((newTeamId) => {
        const allTeams = [...msslTable, ...islTable, ...laTable];
        const newTeam = allTeams.find(t => t.id === newTeamId);
        if (!newTeam) return;

        setUserTeamId(newTeamId);
        setUserTeam(newTeam);
        
        const starters = [...newTeam.players].sort((a,b) => b.skill - a.skill).slice(0, 4);
        const rest = newTeam.players.filter(p => !starters.some(s => s.id === p.id));
        setSquad({ starters, bench: rest.slice(0, BENCH_LIMIT), reserves: rest.slice(BENCH_LIMIT) });
        
        showNotification(t('notification.team_switched', { teamName: newTeam.name }));
    }, [msslTable, islTable, laTable, showNotification, t]);

    useEffect(() => {
        const allFixtures = [...msslFixtures, ...islFixtures, ...laFixtures, ...uslFixtures, ...aslFixtures, ...cslFixtures, ...caFixtures];
        const anyScheduled = allFixtures.some(f => f.status === 'SCHEDULED');
        
        if (!anyScheduled && allFixtures.length > 0) {
            if (gamePhase === 'REGULAR_SEASON') {
                // Generate Tournaments
                const usl = generateKnockout([...msslTable.slice(0, 3), ...islTable.slice(0, 3)], 'USL', 8);
                const csl = generateKnockout([...laTable.slice(0, 2), ...msslTable.slice(0, 3), ...islTable.slice(0, 3)], 'CSL', 8);
                const asl = generateKnockout([...laTable], 'ASL', 8);
                
                setUslFixtures(usl);
                setCslFixtures(csl);
                setAslFixtures(asl);
                
                setGamePhase('CUP_PHASE');
                showNotification("Ligas encerradas! Iniciando torneios USL, CSL e ASL.");
            } else if (gamePhase === 'CUP_PHASE') {
                // Advance rounds for cups
                const advanceCup = (fixtures, competition, setter) => {
                    const playedMatches = fixtures.filter(f => f.competition === competition && f.status === 'PLAYED');
                    if (playedMatches.length === 0) return false;

                    const currentRound = Math.min(...fixtures.map(f => f.round));
                    const roundMatches = fixtures.filter(f => f.round === currentRound);
                    const allRoundPlayed = roundMatches.every(m => m.status === 'PLAYED');

                    if (allRoundPlayed) {
                        if (currentRound === 2) return true; // Final finished

                        const winners = roundMatches.map(m => m.penaltyWinner === 'HOME' || (m.homeScore > m.awayScore && !m.penaltyWinner) ? m.homeTeam : m.awayTeam);
                        
                        let nextTeams = winners;
                        if (competition === 'USL' && currentRound === 8) {
                            // USL Special: Top 2 got byes
                            nextTeams = [...msslTable.slice(0, 2), ...winners];
                        }

                        const nextRound = currentRound / 2;
                        const nextFixtures = generateKnockout(nextTeams, competition, nextRound);
                        setter(prev => [...prev, ...nextFixtures]);
                        return false;
                    }
                    return false;
                };

                const uslDone = advanceCup(uslFixtures, 'USL', setUslFixtures);
                const aslDone = advanceCup(aslFixtures, 'ASL', setAslFixtures);
                const cslDone = advanceCup(cslFixtures, 'CSL', setCslFixtures);
                const caDone = caFixtures.length === 0 || advanceCup(caFixtures, 'CA', setCaFixtures);

                if (uslDone && aslDone && cslDone && caDone) {
                    setGamePhase('SEASON_END');
                    showNotification(t('notification.season_ended'));
                }
            }
        }
    }, [msslFixtures, islFixtures, laFixtures, uslFixtures, aslFixtures, cslFixtures, caFixtures, gamePhase, msslTable, islTable, laTable, showNotification, t, season]);

    const handlePlayerSale = (player) => {
        if (userTeam.players.length <= MIN_SQUAD_SIZE) return showNotification(t('notification.min_squad_reached', { min: MIN_SQUAD_SIZE }));
        const updated = { ...userTeam, budget: userTeam.budget + player.value, players: userTeam.players.filter(p => p.id !== player.id) };
        setUserTeam(updated);
        allTableSetters[userTeam.division](prev => prev.map(t => t.id === userTeam.id ? updated : t));
        setSquad(prev => ({ starters: prev.starters.filter(p => p.id !== player.id), bench: prev.bench.filter(p => p.id !== player.id), reserves: prev.reserves.filter(p => p.id !== player.id) }));
        updateAllFixturesWithTeamData(userTeam.id, updated);
        showNotification(t('notification.player_sold', { playerName: player.name }));
    };

    const handlePlayerPurchase = (player, sellerTeamId) => {
        if (userTeam.budget < player.value) return showNotification(t('notification.insufficient_funds'));
        if (userTeam.players.length >= SQUAD_SIZE_LIMIT) return showNotification(t('notification.squad_limit_reached'));

        const seller = [...msslTable, ...islTable, ...laTable].find(t => t.id === sellerTeamId);
        const updatedPlayer = { 
            ...player, 
            teamHistory: [userTeam.name, ...(player.teamHistory || [])].slice(0, 10) 
        };
        const updatedSeller = { ...seller, budget: seller.budget + player.value, players: seller.players.filter(p => p.id !== player.id) };
        const updatedBuyer = { ...userTeam, budget: userTeam.budget - player.value, players: [...userTeam.players, updatedPlayer] };

        allTableSetters[seller.division](prev => prev.map(t => t.id === seller.id ? updatedSeller : t));
        allTableSetters[userTeam.division](prev => prev.map(t => t.id === userTeam.id ? updatedBuyer : t));
        setUserTeam(updatedBuyer);
        setSquad(prev => ({ ...prev, reserves: [...prev.reserves, updatedPlayer] }));
        updateAllFixturesWithTeamData(seller.id, updatedSeller);
        updateAllFixturesWithTeamData(userTeamId, updatedBuyer);
        showNotification(t('notification.player_hired', { playerName: player.name }));
    };

    return React.createElement(React.Fragment, null,
        gameState === GameState.SETUP ?
            React.createElement(SetupScreen, { onStartGame: handleStartGame, teams: TEAMS, onShowImportModal: () => {} }) :
            React.createElement(Dashboard, {
                managerName, userTeam, season, msslTable, islTable, laTable, 
                msslFixtures, islFixtures, laFixtures,
                uslFixtures, aslFixtures, cslFixtures, caFixtures,
                currentRound, isSimulating, gamePhase,
                onMatchComplete: handleMatchComplete, squad, onSquadChange: setSquad, tactic, onTacticChange: setTactic,
                onPlayerPurchase: handlePlayerPurchase, onPlayerSale: handlePlayerSale, squadSizeLimit: SQUAD_SIZE_LIMIT, playerStats,
                aiNews, ongoingLiveMatch, setMatchToPlay, seasonHistory,
                selectedTeamForInspector, setSelectedTeamForInspector,
                onSwitchTeam: handleSwitchTeam,
                onAdvanceSeason: handleEndSeason,
                onSimulateRemaining: handleSimulateSeason,
                onTakeLoan: handleTakeLoan,
                isAdmin, isTerminalOpen, 
                onOpenTerminal: () => setIsTerminalOpen(true),
                onCloseTerminal: () => setIsTerminalOpen(false),
                onExecuteCommand: handleExecuteCommand
            }),
        matchToPlay && React.createElement(MatchSimulatorModal, {
            match: matchToPlay, onClose: () => setMatchToPlay(null), onMatchComplete: handleMatchComplete, userTeamId: userTeam?.id, userSquad: squad,
            initialLiveState: ongoingLiveMatch, onLiveStateUpdate: setOngoingLiveMatch,
            onSimulateSeason: handleSimulateSeason
        }),
        showSeasonEndModal && seasonSummary && React.createElement(SeasonEndModal, {
            summary: seasonSummary,
            onClose: handleStartNewSeason
        }),
        notification && React.createElement("div", { className: "fixed bottom-5 right-5 bg-blue-600 text-white py-3 px-6 rounded-xl shadow-2xl z-[100] animate-fade-in-out font-bold border-2 border-white/20" }, notification)
    );
};