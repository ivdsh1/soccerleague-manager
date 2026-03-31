import { GoogleGenAI } from "@google/genai";
import { POSITION_NAMES_PLURAL } from '../constants.js';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock data for Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_key" });

const MOCK_HALF_DELAY = 100;
const MOCK_SUMMARY_DELAY = 50;

const getAIBotStarters = (team) => {
    const playersByPosition = {
        DEF: team.players.filter((p) => p.position === 'DEF').sort((a,b) => b.skill - a.skill),
        MC: team.players.filter((p) => p.position === 'MC').sort((a,b) => b.skill - a.skill),
        ATA: team.players.filter((p) => p.position === 'ATA').sort((a,b) => b.skill - a.skill),
    };
    const starters = [
        ...playersByPosition.DEF.slice(0, 1),
        ...playersByPosition.MC.slice(0, 2),
        ...playersByPosition.ATA.slice(0, 1),
    ];
    const allPlayers = [...team.players].sort((a, b) => b.skill - a.skill);
    const starterIds = new Set(starters.map(p => p.id));
    let i = 0;
    while(starters.length < 4 && i < allPlayers.length) {
        if(!starterIds.has(allPlayers[i].id)) {
            starters.push(allPlayers[i]);
            starterIds.add(allPlayers[i].id);
        }
        i++;
    }
    return starters.slice(0,4);
};

const mockHalfResult = (half, homeStarters, awayStarters) => {
    const generateEvents = (score, teamType, starters, oppStarters, half) => {
        const events = [];
        if (starters.length === 0) return events;

        for(let i=0; i<score; i++){
            const minute = half === 1 ? Math.floor(Math.random() * 45) + 1 : Math.floor(Math.random() * 45) + 46;
            
            if (Math.random() < 0.1 && oppStarters.length > 0) { 
                const scoringPlayer = oppStarters[Math.floor(Math.random() * oppStarters.length)];
                events.push({ minute, type: 'OWN_GOAL', player: scoringPlayer.name, team: teamType, half });
            } else {
                 const scorer = starters[Math.floor(Math.random() * starters.length)];
                 let assistPlayer;
                 if (Math.random() < 0.4) {
                    const potentialAssisters = starters.filter(p => p.id !== scorer.id);
                    if(potentialAssisters.length > 0) {
                        assistPlayer = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)].name;
                    }
                 }
                 events.push({ minute, type: 'GOAL', player: scorer.name, assistPlayer, team: teamType, half});
            }
        }
        return events;
    };
    
    const homeScore = Math.floor(Math.random() * 3);
    const awayScore = Math.floor(Math.random() * 3);
    let events = [];
    events.push(...generateEvents(homeScore, 'HOME', homeStarters, awayStarters, half));
    events.push(...generateEvents(awayScore, 'AWAY', awayStarters, homeStarters, half));

    const allStarters = [...homeStarters, ...awayStarters];
    if (allStarters.length > 0) {
        const numCards = Math.floor(Math.random() * 4); // 0 to 3 cards per half
        for (let i = 0; i < numCards; i++) {
            const player = allStarters[Math.floor(Math.random() * allStarters.length)];
            const minute = half === 1 ? Math.floor(Math.random() * 45) + 1 : Math.floor(Math.random() * 45) + 46;
            const team = homeStarters.some(p => p.id === player.id) ? 'HOME' : 'AWAY';
            const type = Math.random() > 0.9 ? 'RED_CARD' : 'YELLOW_CARD'; // 10% chance of red
            events.push({ minute, type, player: player.name, team, half });
        }
    }

    events.sort((a,b) => a.minute - b.minute);
    return { events };
};

const mockSummaryResult = (allEvents, homeTeam, awayTeam, homeStarters, awayStarters) => {
    const homeScore = allEvents.filter(e => (e.type === 'GOAL' && e.team === 'HOME') || (e.type === 'OWN_GOAL' && e.team === 'AWAY')).length;
    const awayScore = allEvents.filter(e => (e.type === 'GOAL' && e.team === 'AWAY') || (e.type === 'OWN_GOAL' && e.team === 'HOME')).length;
    
    let mvpPlayer = null;
    let mvpTeam = 'HOME';
    const allStarters = [...homeStarters, ...awayStarters];
    if (allStarters.length > 0) {
        mvpPlayer = allStarters[Math.floor(Math.random() * allStarters.length)];
        mvpTeam = homeStarters.some(p => p.id === mvpPlayer.id) ? 'HOME' : 'AWAY';
    }

    const homePossession = 40 + Math.floor(Math.random() * 21); // 40-60
    const homeShots = homeScore + Math.floor(Math.random() * 5);
    const awayShots = awayScore + Math.floor(Math.random() * 5);

    return { 
        homeScore, 
        awayScore,
        stats: {
            homePossession,
            awayPossession: 100 - homePossession,
            homeShots,
            awayShots,
            homeShotsOnGoal: homeScore + Math.floor(Math.random() * 3),
            awayShotsOnGoal: awayScore + Math.floor(Math.random() * 3),
            homeFouls: Math.floor(Math.random() * 10),
            awayFouls: Math.floor(Math.random() * 10),
        },
        mvp: {
            player: mvpPlayer?.name || 'N/A',
            team: mvpTeam,
        },
        awards: {
            topScorers: [{ player: mvpPlayer?.name || 'N/A', goals: 2, team: mvpTeam }],
            assistKings: [{ player: mvpPlayer?.name || 'N/A', assists: 1, team: mvpTeam }],
            ironWall: { player: homeStarters.find(p => p.position === 'DEF')?.name || 'N/A', team: 'HOME' }
        }
    };
};

const getTeamInfo = (team, tactic, squad) => {
    const counts = squad.reduce((acc, p) => {
        acc[p.position] = (acc[p.position] || 0) + 1;
        return acc;
    }, {});
    
    const formationStr = `${counts['DEF'] || 0}-${counts['MC'] || 0}-${counts['ATA'] || 0}`;
    const compositionStr = Object.entries(counts)
        .map(([pos, count]) => `${POSITION_NAMES_PLURAL[pos]}: ${count}`)
        .join(', ');

    return {
        name: team.name,
        skill: team.skill,
        tactic: `${formationStr} ${tactic.style}`,
        composition: `(${compositionStr})`,
        starters: squad.map(p => ({ name: p.name, skill: p.skill }))
    };
};

const buildHalfPrompt = (
    homeTeamInfo, awayTeamInfo, competition, half, firstHalfResult = null
) => {
    const minuteRange = half === 1 ? "1 a 45" : "46 a 90";
    const halfField = half === 1 ? `"half": 1` : `"half": 2`;
    let contextInstructions = `Simule os eventos de futebol APENAS para o ${half}º tempo (minutos ${minuteRange}). Todos os eventos devem ter ${halfField}.`;
    
    if (half === 2 && firstHalfResult) {
        const firstHalfScore = firstHalfResult.events.reduce((acc, e) => {
            if(e.type === 'GOAL' && e.team === 'HOME') acc.home++;
            if(e.type === 'OWN_GOAL' && e.team === 'AWAY') acc.home++;
            if(e.type === 'GOAL' && e.team === 'AWAY') acc.away++;
            if(e.type === 'OWN_GOAL' && e.team === 'HOME') acc.away++;
            return acc;
        }, { home: 0, away: 0 });
        contextInstructions += `\nCONTEXTO DO 1º TEMPO: O placar está ${homeTeamInfo.name} ${firstHalfScore.home} - ${firstHalfScore.away} ${awayTeamInfo.name}. Continue a partida a partir daqui.`;
    }

    const homeStartersText = homeTeamInfo.starters.map(p => `${p.name} (Habilidade: ${p.skill})`).join(', ');
    const awayStartersText = awayTeamInfo.starters.map(p => `${p.name} (Habilidade: ${p.skill})`).join(', ');
    
    const eventsSchema = `{ "minute": number, "type": "'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'OWN_GOAL'", "player": string, "assistPlayer"?: string, "team": "'HOME' | 'AWAY'", "half": ${half} }`;

    return `
    Você é um simulador de partidas de futebol de 4 contra 4. Sua tarefa é gerar os eventos para um tempo de um jogo e retornar **exclusivamente um objeto JSON válido**.

    ${contextInstructions}

    DADOS DA PARTIDA:
    - Time da Casa: ${homeTeamInfo.name} (Hab. Média: ${homeTeamInfo.skill}, Tática: ${homeTeamInfo.tactic}) | Titulares: ${homeStartersText}
    - Time Visitante: ${awayTeamInfo.name} (Hab. Média: ${awayTeamInfo.skill}, Tática: ${awayTeamInfo.tactic}) | Titulares: ${awayStartersText}

    REGRAS:
    1. O resultado deve refletir a habilidade GERAL e INDIVIDUAL dos jogadores. Jogadores com alta habilidade têm muito mais chance de participar de eventos.
    2. Gere um número realista de eventos para 45 minutos. Pode haver tempos sem nenhum evento. Inclua gols, cartões e substituições.
    3. Gere eventos de cartão (amarelo/vermelho) de forma realista. Defensores e meio-campistas têm maior probabilidade de recebê-los.
    4. Os nomes dos jogadores em "player" e "assistPlayer" DEVEM ser EXATAMENTE um dos nomes dos titulares listados.
    5. Sua resposta deve ser APENAS o objeto JSON, no formato: \`{ "events": [${eventsSchema}, ...] }\`.

    Agora, gere o JSON para o ${half}º tempo da partida.
    `;
};

const buildSummaryPrompt = (allEvents, homeTeamInfo, awayTeamInfo, competition, isKnockout) => {
    const homeScore = allEvents.filter(e => (e.type === 'GOAL' && e.team === 'HOME') || (e.type === 'OWN_GOAL' && e.team === 'AWAY')).length;
    const awayScore = allEvents.filter(e => (e.type === 'GOAL' && e.team === 'AWAY') || (e.type === 'OWN_GOAL' && e.team === 'HOME')).length;

    let knockoutInstructions = '';
    if (isKnockout && homeScore === awayScore) {
        knockoutInstructions = `5. Esta é uma partida de mata-mata que terminou empatada. Você DEVE decidir um vencedor nos pênaltis. Adicione um campo \`"penaltyWinner": "HOME" | "AWAY"\` ao JSON de resposta.`;
    }

    const jsonExample = `
    {
      "homeScore": ${homeScore},
      "awayScore": ${awayScore},
      "stats": {
        "homePossession": 58, "awayPossession": 42,
        "homeShots": 14, "awayShots": 9,
        "homeShotsOnGoal": 7, "awayShotsOnGoal": 4,
        "homeFouls": 8, "awayFouls": 12
      },
      "mvp": { "player": "Rivaldo 116", "team": "HOME" },
      "awards": {
        "topScorers": [{ "player": "Rivaldo 116", "goals": 2, "team": "HOME" }],
        "assistKings": [{ "player": "Neymar 203", "assists": 1, "team": "AWAY" }],
        "ironWall": { "player": "Gualbosh 204", "team": "HOME" }
      },
      "penaltyWinner": null
    }
    `.trim();
    
    return `
    Você é um analista de futebol. Com base nos eventos de uma partida 4x4, sua tarefa é gerar um resumo estatístico completo em um **objeto JSON válido**.

    DADOS DA PARTIDA:
    - Time da Casa: ${homeTeamInfo.name} | Titulares: ${homeTeamInfo.starters.map(p=>p.name).join(', ')}
    - Time Visitante: ${awayTeamInfo.name} | Titulares: ${awayTeamInfo.starters.map(p=>p.name).join(', ')}
    - Eventos do Jogo: ${JSON.stringify(allEvents)}

    REGRAS:
    1. Analise os eventos para determinar o placar final.
    2. Gere estatísticas (posse, chutes, chutes a gol, faltas) consistentes com os eventos e o placar. O time vencedor geralmente domina as estatísticas.
    3. Escolha o MVP (Most Valuable Player) da partida. O MVP deve ser um jogador com impacto decisivo (gols, assistências).
    4. Determine as premiações: 'topScorers' (maior artilheiro), 'assistKings' (maior assistente) e 'ironWall' (o melhor defensor, geralmente do time que venceu ou sofreu menos gols). Pode haver múltiplos vencedores para artilheiros e assistentes.
    ${knockoutInstructions}
    6. Sua resposta deve ser APENAS o objeto JSON, sem formatação markdown.

    EXEMPLO DE RESPOSTA JSON VÁLIDA:
    ${jsonExample}
    
    Agora, gere o JSON do resumo da partida.
    `;
}

const parseJsonResponse = (text) => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const matchResult = jsonStr.match(fenceRegex);
    if (matchResult && matchResult[2]) {
        jsonStr = matchResult[2].trim();
    }
    return JSON.parse(jsonStr);
};

export const simulateMatchHalf = async ({
    half, match, userTactic, userSquad, isUserHome, firstHalfResult = null,
    homeStarters, awayStarters
}) => {
    const isUserTeam = (teamId) => (isUserHome && teamId === match.homeTeam.id) || (!isUserHome && teamId === match.awayTeam.id);
    const getSquad = (team) => isUserTeam(team.id) ? userSquad : getAIBotStarters(team);
    
    const homeSquad = homeStarters || getSquad(match.homeTeam);
    const awaySquad = awayStarters || getSquad(match.awayTeam);
    
    if (!process.env.API_KEY) {
        console.log(`Using mock simulation for half ${half}.`);
        return new Promise(resolve => setTimeout(() => resolve(mockHalfResult(half, homeSquad, awaySquad)), MOCK_HALF_DELAY));
    }

    const homeTeamInfo = getTeamInfo(match.homeTeam, userTactic, homeSquad);
    const awayTeamInfo = getTeamInfo(match.awayTeam, userTactic, awaySquad);

    const prompt = buildHalfPrompt(homeTeamInfo, awayTeamInfo, match.competition, half, firstHalfResult);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json" }
        });
        return parseJsonResponse(response.text);
    } catch (error) {
        console.error(`Error calling Gemini API for half ${half}, returning mock data.`, error);
        return mockHalfResult(half, homeSquad, awaySquad);
    }
};

export const generateMatchSummary = async ({
    allEvents, match, userTactic, userSquad, isUserHome, homeStarters, awayStarters
}) => {
     if (!process.env.API_KEY) {
        console.log("Using mock summary.");
        return new Promise(resolve => setTimeout(() => resolve(mockSummaryResult(allEvents, match.homeTeam, match.awayTeam, homeStarters, awayStarters)), MOCK_SUMMARY_DELAY));
    }

    const homeTeamInfo = getTeamInfo(match.homeTeam, userTactic, homeStarters);
    const awayTeamInfo = getTeamInfo(match.awayTeam, userTactic, awayStarters);
    const isKnockout = ['CSL', 'CA', 'USL', 'ASL'].includes(match.competition);

    const prompt = buildSummaryPrompt(allEvents, homeTeamInfo, awayTeamInfo, match.competition, isKnockout);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json" }
        });
        const parsedData = parseJsonResponse(response.text);

        const homeScore = allEvents.filter(e => (e.type === 'GOAL' && e.team === 'HOME') || (e.type === 'OWN_GOAL' && e.team === 'AWAY')).length;
        const awayScore = allEvents.filter(e => (e.type === 'GOAL' && e.team === 'AWAY') || (e.type === 'OWN_GOAL' && e.team === 'HOME')).length;


        if (isKnockout && homeScore === awayScore && !parsedData.penaltyWinner) {
            console.warn("Gemini API did not provide a penalty winner for a knockout draw. Deciding randomly.");
            parsedData.penaltyWinner = Math.random() > 0.5 ? 'HOME' : 'AWAY';
        }
        return parsedData;

    } catch (error) {
        console.error("Error calling Gemini API for summary, returning mock data.", error);
        return mockSummaryResult(allEvents, match.homeTeam, match.awayTeam, homeStarters, awayStarters);
    }
};

// Kept for quick sim functionality
export const simulateMatchResult = async (match, userTactic, userSquad, isUserHome) => {
    console.log("Performing quick simulation...");
    const homeStarters = isUserHome ? userSquad : getAIBotStarters(match.homeTeam);
    const awayStarters = !isUserHome ? userSquad : getAIBotStarters(match.awayTeam);

    const firstHalfResult = mockHalfResult(1, homeStarters, awayStarters);
    const secondHalfResult = mockHalfResult(2, homeStarters, awayStarters);

    const allEvents = [...firstHalfResult.events, ...secondHalfResult.events].sort((a,b) => a.minute - b.minute);

    const summary = await generateMatchSummary({ allEvents, match, userTactic, homeStarters, awayStarters });
    
    // Combine all data into a single object for handleMatchComplete
    return {
        ...summary,
        events: allEvents,
    };
};
