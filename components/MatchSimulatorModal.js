import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { XMarkIcon, PlayIcon, ForwardIcon, StarIcon, ChartBarIcon, PauseIcon, ShieldCheckIcon, TrophyIcon, ArrowsRightLeftIcon } from './icons/Icons.jsx';
import LogoDisplay from './LogoDisplay.js';
import { BENCH_LIMIT } from '../constants.js';
import { simulateMatchHalf, generateMatchSummary, simulateMatchResult } from '../services/geminiService.js';
import { useI18n } from '../lib/i18n.js';

const getEventIcon = (type) => {
    switch (type) {
        case 'GOAL': return '⚽';
        case 'OWN_GOAL': return '🥅';
        case 'YELLOW_CARD': return '🟨';
        case 'RED_CARD': return '🟥';
        case 'SUBSTITUTION': return '🔄';
        default: return '⏱️';
    }
};

// --- Post Match Report Component ---
const PostMatchReport = ({ summary, match, onContinue, isHistory }) => {
    const { t } = useI18n();

    const getScorersForTeam = (events, targetTeam) => {
        const scorerMap = new Map();
        if (!events) return [];

        const goalEvents = events.filter(e => {
            return (e.type === 'GOAL' && e.team === targetTeam) || (e.type === 'OWN_GOAL' && e.team !== targetTeam);
        });

        for (const event of goalEvents) {
            const isOwnGoal = event.type === 'OWN_GOAL';
            const playerName = isOwnGoal ? `${event.player} (GC)` : event.player;
            scorerMap.set(playerName, (scorerMap.get(playerName) || 0) + 1);
        }
        
        return Array.from(scorerMap.entries())
            .map(([name, goals]) => ({ name, goals }))
            .sort((a, b) => b.goals - a.goals);
    };

    const homeScorers = getScorersForTeam(summary.events, 'HOME');
    const awayScorers = getScorersForTeam(summary.events, 'AWAY');
    
    const stats = summary.stats || {
        homeShots: 0, homeShotsOnGoal: 0, homeFouls: 0, homePossession: 50,
        awayShots: 0, awayShotsOnGoal: 0, awayFouls: 0, awayPossession: 50
    };

    const AwardCard = ({ title, icon, children, highlight }) => (
        React.createElement("div", { className: `p-3 rounded-lg text-center ${highlight ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-gray-900'}` },
            React.createElement("h4", { className: `text-sm font-bold uppercase flex items-center justify-center ${highlight ? 'text-yellow-300' : 'text-gray-300'}` }, 
                icon, " ", title
            ),
            React.createElement("div", { className: "mt-2" }, children)
        )
    );

    const mvpTeam = summary.mvp?.team === 'HOME' ? match.homeTeam : match.awayTeam;
    const ironWallTeam = summary.awards?.ironWall?.team === 'HOME' ? match.homeTeam : match.awayTeam;

    const renderAwardWinner = (player, team) => (
         React.createElement("div", { className: "flex items-center justify-center space-x-2" },
            React.createElement(LogoDisplay, { team: team, style: "emoji", className: "text-2xl" }),
            React.createElement("p", { className: "text-md font-bold text-white truncate" }, player)
        )
    );

    return (
        React.createElement("div", { className: "p-4 text-white flex flex-col space-y-4" },
            React.createElement("h3", { className: "text-xl font-semibold text-center text-white" }, t('match.summary.title')),
            
            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 items-start" },
                // Home Stats
                React.createElement("div", { className: "bg-gray-900 p-3 rounded-lg text-center order-2 lg:order-1" },
                    React.createElement(LogoDisplay, { team: match.homeTeam, style: "emoji", className: "text-4xl mx-auto mb-2" }),
                    React.createElement("h4", { className: "font-bold truncate" }, match.homeTeam.name),
                    React.createElement("div", { className: "text-left mt-3 text-sm space-y-2" },
                        React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, t('match.summary.shots'), ":"), React.createElement("span", { className: "font-bold" }, stats.homeShots)),
                        React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, t('match.summary.shots_on_goal'), ":"), React.createElement("span", { className: "font-bold" }, stats.homeShotsOnGoal)),
                        React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, t('match.summary.fouls'), ":"), React.createElement("span", { className: "font-bold" }, stats.homeFouls)),
                        homeScorers.length > 0 && React.createElement("div", { className: "pt-2 mt-2 border-t border-gray-700/50" },
                            React.createElement("h5", { className: "font-bold text-gray-300 mb-1" }, t('match.summary.goals')),
                            homeScorers.map(scorer => (
                                React.createElement("div", { key: scorer.name, className: "flex justify-between items-center" },
                                    React.createElement("span", { className: "truncate" }, scorer.name),
                                    scorer.goals > 1 && React.createElement("span", { className: "font-bold ml-2" }, scorer.goals)
                                )
                            ))
                        )
                    )
                ),

                // Awards
                React.createElement("div", { className: "space-y-3 order-1 lg:order-2" },
                    React.createElement(AwardCard, { title: t('match.summary.mvp'), icon: React.createElement(StarIcon, { className: "w-4 h-4 mr-1" }), highlight: true },
                        summary.mvp ? renderAwardWinner(summary.mvp.player, mvpTeam) : React.createElement("p", {className: "text-gray-400 text-sm"}, "-")
                    ),
                    React.createElement(AwardCard, { title: t('match.summary.iron_wall'), icon: React.createElement(ShieldCheckIcon, { className: "w-4 h-4 mr-1" }), highlight: true },
                        summary.awards?.ironWall ? renderAwardWinner(summary.awards.ironWall.player, ironWallTeam) : React.createElement("p", {className: "text-gray-400 text-sm"}, "-")
                    )
                ),

                // Away Stats
                React.createElement("div", { className: "bg-gray-900 p-3 rounded-lg text-center order-3 lg:order-3" },
                    React.createElement(LogoDisplay, { team: match.awayTeam, style: "emoji", className: "text-4xl mx-auto mb-2" }),
                    React.createElement("h4", { className: "font-bold truncate" }, match.awayTeam.name),
                    React.createElement("div", { className: "text-left mt-3 text-sm space-y-2" },
                        React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, t('match.summary.shots'), ":"), React.createElement("span", { className: "font-bold" }, stats.awayShots)),
                        React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, t('match.summary.shots_on_goal'), ":"), React.createElement("span", { className: "font-bold" }, stats.awayShotsOnGoal)),
                        React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, t('match.summary.fouls'), ":"), React.createElement("span", { className: "font-bold" }, stats.awayFouls)),
                        awayScorers.length > 0 && React.createElement("div", { className: "pt-2 mt-2 border-t border-gray-700/50" },
                            React.createElement("h5", { className: "font-bold text-gray-300 mb-1" }, t('match.summary.goals')),
                            awayScorers.map(scorer => (
                                React.createElement("div", { key: scorer.name, className: "flex justify-between items-center" },
                                    React.createElement("span", { className: "truncate" }, scorer.name),
                                    scorer.goals > 1 && React.createElement("span", { className: "font-bold ml-2" }, scorer.goals)
                                )
                            ))
                        )
                    )
                )
            ),
            
            React.createElement("div", { className: "bg-gray-900 p-3 rounded-lg" },
                React.createElement("h4", { className: "font-bold text-center mb-2 flex items-center justify-center text-sm" }, 
                    React.createElement(ChartBarIcon, { className: "w-4 h-4 mr-1" }), t('match.summary.general_stats')
                ),
                React.createElement("div", { className: "space-y-3 text-sm" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "flex justify-between items-center text-xs mb-1 px-2" },
                            React.createElement("span", null, `${stats.homePossession}%`),
                            React.createElement("span", { className: "font-semibold text-gray-400" }, t('match.summary.possession')),
                            React.createElement("span", null, `${stats.awayPossession}%`)
                        ),
                        React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-2.5" },
                            React.createElement("div", { className: "bg-blue-600 h-2.5 rounded-l-full", style: { width: `${stats.homePossession}%` } })
                        )
                    )
                )
            ),
            
             React.createElement("div", { className: "text-center pt-2" },
                React.createElement("button", { 
                    onClick: onContinue,
                    className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                }, isHistory ? t('close') : t('match.summary.continue'))
            )
        )
    );
};

const TimelineEvent = ({ event }) => {
    const isHome = event.team === 'HOME';
    const eventText = event.type === 'GOAL' ? `${event.player}${event.assistPlayer ? ` (${event.assistPlayer})` : ''}` : event.player;
    
    return (
        React.createElement("div", { className: "grid grid-cols-11 items-center gap-x-2 text-sm" },
            isHome ? (
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "col-span-5 flex items-center justify-end space-x-2 text-right" },
                        React.createElement("span", { className: "text-white truncate font-semibold" }, eventText),
                        React.createElement("span", { className: "text-lg flex-shrink-0" }, getEventIcon(event.type))
                    ),
                    React.createElement("div", { className: "col-span-1 text-center font-mono text-xs text-gray-400" }, `${event.minute}'`),
                    React.createElement("div", { className: "col-span-5" })
                )
            ) : (
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "col-span-5" }),
                    React.createElement("div", { className: "col-span-1 text-center font-mono text-xs text-gray-400" }, `${event.minute}'`),
                    React.createElement("div", { className: "col-span-5 flex items-center justify-start space-x-2 text-left" },
                        React.createElement("span", { className: "text-lg flex-shrink-0" }, getEventIcon(event.type)),
                        React.createElement("span", { className: "text-white truncate font-semibold" }, eventText)
                    )
                )
            )
        )
    );
};


// --- Live Match View Components ---
const LiveMatchView = ({ match, onQuickSim, onSimulateHalf, onGenerateSummary, onScoreUpdate, initialLiveState, onLiveStateUpdate, onContinueFromReport, setGoalAnimation, isUserHome }) => {
    const { t } = useI18n();
    const [phase, setPhase] = useState(initialLiveState?.phase || 'PRE_MATCH');
    const [homeStarters, setHomeStarters] = useState(initialLiveState?.homeStarters || []);
    const [awayStarters, setAwayStarters] = useState(initialLiveState?.awayStarters || []);
    const [homeBench, setHomeBench] = useState(initialLiveState?.homeBench || []);
    const [awayBench, setAwayBench] = useState(initialLiveState?.awayBench || []);
    const [timeline, setTimeline] = useState(initialLiveState?.timeline || []);
    const [score, setScore] = useState(initialLiveState?.score || { home: 0, away: 0 });
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isPaused, setIsPaused] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [fullSummary, setFullSummary] = useState(initialLiveState?.summary || null);

    const loadingMessages = useMemo(() => [
        t('match.loading.tactic'),
        t('match.loading.warmup'),
        t('match.loading.crowd'),
        t('match.loading.probabilities'),
        t('match.loading.pitch'),
    ], [t]);

    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setCurrentLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 1800);
            return () => clearInterval(interval);
        }
    }, [isLoading, loadingMessages]);


    useEffect(() => {
        onScoreUpdate(score);
    }, [score, onScoreUpdate]);

    useEffect(() => {
        if (phase === 'POST_MATCH') return; // Don't save state if we are just showing the final report.
        onLiveStateUpdate({
            match, phase, timeline, score,
            homeStarters, awayStarters, homeBench, awayBench,
            summary: fullSummary, isLive: true,
        });
    }, [match, phase, timeline, score, homeStarters, awayStarters, homeBench, awayBench, fullSummary, onLiveStateUpdate]);


    const runSimulation = useCallback(async () => {
        setIsLoading(true);
        const firstHalf = await onSimulateHalf(1, homeStarters, awayStarters);
        setTimeline(firstHalf.events);
        
        setIsPaused(false);
        setPhase('PLAYING');
        setIsLoading(false);
    }, [onSimulateHalf, homeStarters, awayStarters]);

    const runSecondHalf = useCallback(async () => {
        setIsLoading(true);
        const secondHalf = await onSimulateHalf(2, homeStarters, awayStarters, { events: timeline });
        setTimeline(prev => [...prev, ...secondHalf.events]);
        
        setIsPaused(false);
        setPhase('PLAYING');
        setIsLoading(false);
    }, [onSimulateHalf, homeStarters, awayStarters, timeline]);

    const finishMatch = useCallback(async () => {
        setIsLoading(true);
        const summary = await onGenerateSummary(timeline, homeStarters, awayStarters);
        const finalScore = { home: summary.homeScore, away: summary.awayScore };
        setFullSummary(summary);
        setScore(finalScore);
        
        onLiveStateUpdate({
            match, phase: 'POST_MATCH', timeline, score: finalScore,
            homeStarters, awayStarters, homeBench, awayBench,
            summary: { ...summary, events: timeline }, isLive: true
        });
        
        setPhase('POST_MATCH');
        setIsLoading(false);
    }, [onGenerateSummary, timeline, homeStarters, awayStarters, match, onLiveStateUpdate, homeBench, awayBench]);

    // The main playback effect
    useEffect(() => {
        if (isPaused || phase !== 'PLAYING') return;

        const currentMinute = timeline.filter(e => e.processed).reduce((max, e) => Math.max(max, e.minute), 0);
        const remainingEvents = timeline.filter(e => !e.processed).sort((a,b) => a.minute - b.minute);

        if (remainingEvents.length === 0) {
            const lastEvent = timeline[timeline.length - 1];
            if (lastEvent?.half === 1) {
                setPhase('HALF_TIME');
                setIsPaused(true);
            } else {
                finishMatch();
            }
            return;
        }

        const nextEvent = remainingEvents[0];
        const timeToNextEvent = (nextEvent.minute - currentMinute) * (1000 / playbackSpeed);

        const timer = setTimeout(() => {
            setTimeline(prev => prev.map(e => e === nextEvent ? { ...e, processed: true } : e));
            if (nextEvent.type === 'GOAL' || nextEvent.type === 'OWN_GOAL') {
                setScore(s => ({ ...s, [nextEvent.team.toLowerCase()]: s[nextEvent.team.toLowerCase()] + 1 }));
                setGoalAnimation({ text: nextEvent.type === 'GOAL' ? t('match.goal_shout') : t('match.own_goal_shout') });
                setTimeout(() => setGoalAnimation(null), 2500);
            }
        }, Math.max(50, timeToNextEvent));

        return () => clearTimeout(timer);
    }, [timeline, isPaused, playbackSpeed, phase, finishMatch, t, setGoalAnimation]);

    const handleSubstitution = (playerOut, playerIn, teamType) => {
        if (teamType === 'home') {
            setHomeStarters(prev => [...prev.filter(p => p.id !== playerOut.id), playerIn]);
            setHomeBench(prev => [...prev.filter(p => p.id !== playerIn.id), playerOut]);
        } else {
            setAwayStarters(prev => [...prev.filter(p => p.id !== playerOut.id), playerIn]);
            setAwayBench(prev => [...prev.filter(p => p.id !== playerIn.id), playerOut]);
        }
    };
    
    // UI Components
    const SubsPanel = ({ starters, bench, onSub, teamType }) => {
        const [playerToSubOut, setPlayerToSubOut] = useState(null);

        const handleSelect = (player, isStarter) => {
            if (isStarter) {
                setPlayerToSubOut(player);
            } else if (playerToSubOut) {
                onSub(playerToSubOut, player, teamType);
                setPlayerToSubOut(null);
            }
        };

        const PlayerPill = ({ player, isStarter,isSelected }) => (
            React.createElement("button", { 
                onClick: () => handleSelect(player, isStarter),
                className: `p-2 rounded-lg text-xs w-full text-left ${
                    isSelected ? 'bg-yellow-500 text-black' :
                    isStarter ? 'bg-gray-700' : 'bg-gray-600'
                }`
            }, 
            React.createElement("p", {className: "font-bold"}, player.name),
            React.createElement("p", {className: "text-gray-300"}, `Hab: ${player.skill}`)
            )
        );

        return (
            React.createElement("div", { className: "bg-gray-900 p-2 rounded-lg" },
                React.createElement("h4", { className: "text-center font-bold text-sm mb-2" }, t('match.starters')),
                React.createElement("div", { className: "grid grid-cols-2 gap-2 mb-2" }, starters.map(p => React.createElement(PlayerPill, { key: p.id, player: p, isStarter: true, isSelected: p.id === playerToSubOut?.id }))),
                React.createElement("h4", { className: "text-center font-bold text-sm mb-2" }, t('match.bench')),
                 React.createElement("div", { className: "grid grid-cols-2 gap-2" }, bench.map(p => React.createElement(PlayerPill, { key: p.id, player: p, isStarter: false, isSelected: false })))
            )
        );
    };

    if (phase === 'POST_MATCH' && fullSummary) {
        return React.createElement(PostMatchReport, { summary: { ...fullSummary, events: timeline }, match, onContinue: onContinueFromReport, isHistory: false });
    }
    
    if (isLoading) {
        return (
            React.createElement("div", { className: "flex flex-col items-center justify-center h-[30rem]" },
                React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }),
                React.createElement("p", { className: "mt-4 text-lg text-gray-300 transition-opacity duration-500" }, currentLoadingMessage)
            )
        );
    }

    if (phase === 'PRE_MATCH' || phase === 'HALF_TIME') {
        const userStarters = isUserHome ? homeStarters : awayStarters;
        const userBench = isUserHome ? homeBench : awayBench;
        const userTeamType = isUserHome ? 'home' : 'away';
         return (
            React.createElement("div", { className: "p-4 h-[30rem] flex flex-col justify-between items-center" },
                 React.createElement("h3", { className: "text-2xl font-bold" }, phase === 'PRE_MATCH' ? t('match.pre_match') : t('match.half_time')),
                 React.createElement("div", { className: "w-full max-w-sm" },
                    React.createElement(SubsPanel, { starters: userStarters, bench: userBench, onSub: handleSubstitution, teamType: userTeamType })
                 ),
                 React.createElement("button", { onClick: phase === 'PRE_MATCH' ? runSimulation : runSecondHalf, className: "bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg" },
                    phase === 'PRE_MATCH' ? t('match.start_match') : t('match.start_second_half')
                 )
            )
         );
    }
    
    const processedEvents = timeline.filter(e => e.processed);
    
    return (
        React.createElement("div", { className: "p-2 md:p-4 h-[30rem] flex flex-col" },
            React.createElement("div", { className: "flex-grow overflow-y-auto pr-2 space-y-2 no-scrollbar" },
                processedEvents.map((event, i) => React.createElement(TimelineEvent, { key: i, event: event }))
            ),
             React.createElement("div", { className: "flex-shrink-0 pt-3 mt-3 border-t border-gray-700 flex items-center justify-center space-x-2 md:space-x-4" },
                React.createElement("button", { onClick: () => setIsPaused(!isPaused), className: "p-2 bg-gray-700 rounded-full" }, 
                    isPaused ? React.createElement(PlayIcon, {className:"w-5 h-5"}) : React.createElement(PauseIcon, {className:"w-5 h-5"}) 
                ),
                [1,2,3].map(speed => (
                    React.createElement("button", { 
                        key: speed, 
                        onClick: () => setPlaybackSpeed(speed),
                        className: `px-3 py-1 rounded-full text-sm font-bold ${playbackSpeed === speed ? 'bg-blue-600' : 'bg-gray-700'}`
                    }, `${speed}x`)
                )),
                React.createElement("button", { onClick: onQuickSim, className: "p-2 bg-gray-700 rounded-full" }, 
                    React.createElement(ForwardIcon, { className: "w-5 h-5" })
                )
            )
        )
    );
};


const MatchSimulatorModal = ({ match, userTeamId, onClose, onMatchComplete, userSquad, initialLiveState, onLiveStateUpdate, onSimulateSeason }) => {
    const { t } = useI18n();
    const [view, setView] = useState(match.status === 'PLAYED' ? 'SUMMARY' : 'OPTIONS');
    const [summary, setSummary] = useState(match.status === 'PLAYED' ? { homeScore: match.homeScore, awayScore: match.awayScore, events: match.events || [], penaltyWinner: match.penaltyWinner, stats: match.stats, mvp: match.mvp, awards: match.awards } : null);
    const [isLoading, setIsLoading] = useState(false);
    const [score, setScore] = useState(match.status === 'PLAYED' ? { home: match.homeScore, away: match.awayScore } : (initialLiveState?.score || null));
    const [goalAnimation, setGoalAnimation] = useState(null);
    
    useEffect(() => {
        if (match.status === 'PLAYED') return;
        if (initialLiveState) {
            setView('LIVE');
            setScore(initialLiveState.score);
        }
    }, [initialLiveState]);
    
    const isUserMatch = match.homeTeam.id === userTeamId;
    const isUserHome = match.homeTeam.id === userTeamId;

    const handleQuickSim = useCallback(async () => {
        setIsLoading(true);
        const simResult = await simulateMatchResult(match, { style: 'Equilibrado'}, userSquad.starters, isUserHome);
        setScore({ home: simResult.homeScore, away: simResult.awayScore });
        setSummary(simResult);
        setIsLoading(false);
    }, [match, userSquad.starters, isUserHome]);
    
    const handleReportContinue = useCallback(() => {
        if(summary && match.status !== 'PLAYED') {
            onMatchComplete(match, summary);
        }
        onClose();
    }, [match, summary, onMatchComplete, onClose]);
    
    const onSimulateHalfForChild = useCallback((half, home, away, context) => 
        simulateMatchHalf({ 
            half, 
            match, 
            userTactic: { style: 'Equilibrado' }, 
            userSquad: isUserHome ? home : away,
            isUserHome,
            homeStarters: home,
            awayStarters: away,
            firstHalfResult: context 
        }), [match, isUserHome]);

    const onGenerateSummaryForChild = useCallback((events, home, away) => 
        generateMatchSummary({ 
            allEvents: events, 
            match, 
            userTactic: { style: 'Equilibrado' },
            userSquad: isUserHome ? home : away,
            isUserHome,
            homeStarters: home, 
            awayStarters: away 
        }), [match, isUserHome]);

    const getAIBotStarters = (team) => {
        return [...team.players].sort((a,b) => b.skill - a.skill).slice(0,4);
    };

    const homeStarters = isUserHome ? userSquad.starters : getAIBotStarters(match.homeTeam);
    const awayStarters = !isUserHome ? userSquad.starters : getAIBotStarters(match.awayTeam);
    const homeBench = isUserHome ? [...userSquad.bench, ...userSquad.reserves] : match.homeTeam.players.filter(p => !homeStarters.some(s => s.id === p.id));
    const awayBench = !isUserHome ? [...userSquad.bench, ...userSquad.reserves] : match.awayTeam.players.filter(p => !awayStarters.some(s => s.id === p.id));

    const renderContent = () => {
        if (isLoading) {
            return (
                React.createElement("div", { className: "flex flex-col items-center justify-center h-[30rem]" },
                    React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }),
                    React.createElement("p", { className: "mt-4 text-lg text-gray-300" }, t('match.simulating'))
                )
            );
        }

        if (summary) {
            return React.createElement(PostMatchReport, { summary, match, onContinue: handleReportContinue, isHistory: match.status === 'PLAYED' });
        }

        if (view === 'LIVE') {
            return React.createElement(LiveMatchView, { 
                match, 
                onQuickSim: handleQuickSim,
                onSimulateHalf: onSimulateHalfForChild,
                onGenerateSummary: onGenerateSummaryForChild,
                onScoreUpdate: setScore,
                initialLiveState: initialLiveState ? { ...initialLiveState, homeStarters, awayStarters, homeBench, awayBench } : { homeStarters, awayStarters, homeBench, awayBench },
                onLiveStateUpdate: onLiveStateUpdate,
                onContinueFromReport: handleReportContinue,
                setGoalAnimation: setGoalAnimation,
                isUserHome: isUserHome,
            });
        }

        // Default to 'OPTIONS' view
        return (
            React.createElement("div", { className: "p-8 text-center h-[30rem] flex flex-col justify-center items-center space-y-6" },
                React.createElement("h3", { className: "text-2xl font-bold" }, t('match.options')),
                React.createElement("div", { className: "flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4" },
                    React.createElement("button", { onClick: () => setView('LIVE'), className: "flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-base w-48" },
                        React.createElement(PlayIcon, { className: "w-5 h-5" }),
                        React.createElement("span", null, t('match.play_match'))
                    ),
                    React.createElement("button", { onClick: handleQuickSim, className: "flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors text-base w-48" },
                        React.createElement(ForwardIcon, { className: "w-5 h-5" }),
                        React.createElement("span", null, t('match.quick_sim'))
                    ),
                    React.createElement("button", { 
                        onClick: () => {
                            onSimulateSeason();
                            onClose();
                        }, 
                        className: "flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg transition-colors text-base w-48" 
                    },
                        React.createElement(TrophyIcon, { className: "w-5 h-5" }),
                        React.createElement("span", null, t('match.simulate_season'))
                    )
                )
            )
        );
    };

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden" },
                React.createElement("div", { className: "p-4 md:p-6 border-b border-gray-700 relative" },
                    React.createElement("div", { className: "flex items-center justify-center" },
                        React.createElement("div", { className: "flex-1 flex items-center justify-end text-right space-x-3 min-w-0" },
                            React.createElement("span", { className: "text-lg md:text-xl font-bold truncate" }, match.homeTeam.name),
                            React.createElement(LogoDisplay, { team: match.homeTeam, style: "emoji", className: "text-4xl" })
                        ),
                        React.createElement("div", { className: "w-32 flex-shrink-0 text-center flex flex-col items-center mx-2" },
                            score ? (
                                React.createElement("span", { className: "text-3xl md:text-4xl font-bold tracking-wider" }, `${score.home} - ${score.away}`)
                            ) : (
                                React.createElement("span", { className: "text-3xl md:text-4xl font-bold tracking-wider" }, "VS")
                            )
                        ),
                        React.createElement("div", { className: "flex-1 flex items-center justify-start space-x-3 min-w-0" },
                            React.createElement(LogoDisplay, { team: match.awayTeam, style: "emoji", className: "text-4xl" }),
                            React.createElement("span", { className: "text-lg md:text-xl font-bold truncate" }, match.awayTeam.name)
                        )
                    ),
                    React.createElement("button", { onClick: onClose, className: "absolute top-3 right-3 text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                
                React.createElement("div", { className: "h-[32rem] relative overflow-y-auto no-scrollbar" },
                    goalAnimation && (
                        React.createElement("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 pointer-events-none" },
                            React.createElement("h2", { 
                                className: "text-7xl md:text-8xl font-black text-white animate-fade-in-out",
                                style: { WebkitTextStroke: '2px black', textShadow: '0 0 20px rgba(255,255,255,0.8)' }
                            }, goalAnimation.text)
                        )
                    ),
                    renderContent()
                )
            )
        )
    );
};

export default MatchSimulatorModal;