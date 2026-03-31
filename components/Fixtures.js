
import React, { useState, useMemo, useEffect } from 'react';
import LogoDisplay from './LogoDisplay.js';
import { ChevronRightIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const FixtureItem = ({ match, onSelect, isClickable, isUserMatch, t }) => {
    const highlightClass = isUserMatch ? 'bg-blue-900/50' : 'bg-gray-800';
    let cursorClass = isClickable ? 'cursor-pointer' : 'cursor-default';
    let borderClass = 'border-gray-700';

    if (match.status === 'SCHEDULED' && isUserMatch) {
        borderClass = 'border-blue-500 animate-pulse';
    } else if (match.status === 'IN_PROGRESS') {
        borderClass = 'border-yellow-500';
    }

    const getMatchTournamentInfo = (match) => {
        switch (match.competition) {
            case 'MSSL': 
            case 'ISL': 
            case 'LA': 
                return `${t(`competition.${match.competition}`)} - ${t('league.round.prefix')} ${match.round}`;
            case 'CSL':
            case 'CA':
            case 'USL':
            case 'ASL':
                const roundName = match.round === 16 ? t('cup.round.16') : match.round === 8 ? t('cup.round.8') : match.round === 4 ? t('cup.round.4') : match.round === 2 ? t('cup.round.2') : `${t('cup.round.prefix')} ${match.round}`;
                return `${t(`competition.${match.competition}`)} - ${roundName}`;
            default: return `${t('league.round.prefix')} ${match.round}`;
        }
    };

    const hoverClass = isClickable ? (isUserMatch ? 'hover:bg-blue-800/50' : 'hover:bg-gray-700') : '';

    const renderCenterContent = () => {
        switch(match.status) {
            case 'PLAYED':
                const wasPenalty = match.homeScore === match.awayScore && match.penaltyWinner;
                return (
                    React.createElement("div", { className: "flex flex-col items-center" },
                        React.createElement("span", { className: "text-2xl font-bold" }, `${match.homeScore} - ${match.awayScore}`),
                        wasPenalty && React.createElement("span", { className: "text-xs text-yellow-400 mt-1" }, t('match.penalties'))
                    )
                );
            case 'IN_PROGRESS':
                return React.createElement("span", { className: "text-lg font-semibold text-yellow-400 animate-pulse" }, t('match.playing'));
            case 'SCHEDULED':
                 return React.createElement("span", { className: "text-gray-400 font-bold" }, "VS");
        }
    }

    return (
        React.createElement("div", 
            {
                onClick: isClickable ? onSelect : undefined,
                className: `flex items-center justify-between p-4 rounded-lg border ${highlightClass} ${cursorClass} ${borderClass} ${hoverClass} transition-all duration-200`
            },
            React.createElement("div", { className: "flex-1 flex items-center justify-end text-right space-x-3 min-w-0" },
                React.createElement("span", { className: "font-semibold truncate" }, match.homeTeam.name),
                React.createElement(LogoDisplay, { team: match.homeTeam, style: "emoji", className: "text-3xl" })
            ),
            React.createElement("div", { className: "w-32 flex-shrink-0 text-center flex flex-col items-center mx-2" },
                renderCenterContent(),
                React.createElement("span", { className: "text-xs text-gray-400 mt-1" }, getMatchTournamentInfo(match))
            ),
            React.createElement("div", { className: "flex-1 flex items-center justify-start space-x-3 min-w-0" },
                React.createElement(LogoDisplay, { team: match.awayTeam, style: "emoji", className: "text-3xl" }),
                React.createElement("span", { className: "font-semibold truncate" }, match.awayTeam.name)
            )
        )
    );
};

const Fixtures = ({ allFixtures, userTeam, onSelectMatch }) => {
    const { t } = useI18n();
    const [scope, setScope] = useState('USER');
    const [viewMode, setViewMode] = useState('UPCOMING');

    const matchesToDisplay = useMemo(() => {
        const sourceMatches = scope === 'USER'
            ? allFixtures.filter(m => m.homeTeam.id === userTeam.id || m.awayTeam.id === userTeam.id)
            : allFixtures;

        if (viewMode === 'UPCOMING') {
            return sourceMatches
                .filter(m => m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS')
                .sort((a, b) => a.id - b.id);
        } else { // 'RESULTS'
            return sourceMatches
                .filter(m => m.status === 'PLAYED')
                .sort((a, b) => b.id - a.id);
        }
    }, [allFixtures, userTeam.id, scope, viewMode]);

    const groupedMatches = useMemo(() => {
        const competitionOrder = ['MSSL', 'ISL', 'LA', 'CSL', 'USL', 'ASL', 'CA'];
        const groups = new Map();

        for (const match of matchesToDisplay) {
            if (!groups.has(match.competition)) {
                groups.set(match.competition, []);
            }
            groups.get(match.competition).push(match);
        }
        
        return Array.from(groups.entries()).sort(([compA], [compB]) => {
            return competitionOrder.indexOf(compA) - competitionOrder.indexOf(compB);
        });
    }, [matchesToDisplay]);

    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        const initialSections = {};
        groupedMatches.forEach(([comp]) => {
            initialSections[comp] = true;
        });
        setOpenSections(initialSections);
    }, [viewMode, scope, groupedMatches]);


    const toggleSection = (competition) => {
        setOpenSections(prev => ({ ...prev, [competition]: !prev[competition] }));
    };

    return (
        React.createElement("div", { className: "space-y-4" },
            React.createElement("div", { className: "mb-2 flex justify-center p-1 space-x-2 bg-gray-800 rounded-lg" },
                React.createElement("button",
                    {
                        onClick: () => setScope('USER'),
                        className: `px-4 py-2 text-sm font-semibold rounded-md transition-colors w-1/2 ${
                            scope === 'USER' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`
                    },
                    t('fixtures.my_matches')
                ),
                React.createElement("button",
                    {
                        onClick: () => setScope('ALL'),
                        className: `px-4 py-2 text-sm font-semibold rounded-md transition-colors w-1/2 ${
                            scope === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`
                    },
                    t('fixtures.all_matches')
                )
            ),
             React.createElement("div", { className: "mb-4 flex justify-center p-1 space-x-2 bg-gray-800 rounded-lg" },
                React.createElement("button",
                    {
                        onClick: () => setViewMode('UPCOMING'),
                        className: `px-4 py-2 text-sm font-semibold rounded-md transition-colors w-1/2 ${
                            viewMode === 'UPCOMING' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`
                    },
                    t('fixtures.upcoming')
                ),
                React.createElement("button",
                    {
                        onClick: () => setViewMode('RESULTS'),
                        className: `px-4 py-2 text-sm font-semibold rounded-md transition-colors w-1/2 ${
                            viewMode === 'RESULTS' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`
                    },
                    t('fixtures.results')
                )
            ),
            
            groupedMatches.length > 0 ? (
                React.createElement("div", { className: "space-y-4" },
                    groupedMatches.map(([competition, matches]) => (
                        React.createElement("div", { key: competition, className: "bg-gray-800/50 rounded-lg overflow-hidden" },
                            React.createElement("button", 
                                {
                                    onClick: () => toggleSection(competition), 
                                    className: "w-full flex justify-between items-center p-3 bg-gray-700/50 hover:bg-gray-700 transition-colors"
                                },
                                React.createElement("h3", { className: "text-lg font-semibold" }, t(`competition.${competition}`)),
                                React.createElement(ChevronRightIcon, { className: `w-5 h-5 transition-transform duration-200 ${openSections[competition] ? 'transform rotate-90' : ''}` })
                            ),
                            openSections[competition] && (
                                React.createElement("div", { className: "p-3 space-y-3" },
                                    matches.map(match => {
                                        const isUserMatch = match.homeTeam.id === userTeam.id || match.awayTeam.id === userTeam.id;
                                        const isClickable = match.status === 'PLAYED';
                                        return (
                                            React.createElement(FixtureItem,
                                                {
                                                    key: `${match.id}-${match.competition}-${match.round}`,
                                                    match: match,
                                                    onSelect: () => onSelectMatch(match),
                                                    isClickable: isClickable,
                                                    isUserMatch: isUserMatch,
                                                    t: t
                                                }
                                            )
                                        );
                                    })
                                )
                            )
                        )
                    ))
                )
            ) : (
                React.createElement("p", { className: "text-center text-gray-500 py-8" },
                    viewMode === 'UPCOMING' ? t('fixtures.no_upcoming') : t('fixtures.no_results')
                )
            )
        )
    );
};

export default Fixtures;
