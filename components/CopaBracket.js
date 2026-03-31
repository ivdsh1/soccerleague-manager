
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons.jsx';
import { AWAITING_OPPONENT_TEAM } from '../constants.js';
import LogoDisplay from './LogoDisplay.js';
import { useI18n } from '../lib/i18n.js';

const PlaceholderMatchItem = () => {
    const { t } = useI18n();
    const team = { ...AWAITING_OPPONENT_TEAM, name: t('awaiting_opponent') };
    return (
        React.createElement("div", { className: "flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800 opacity-60" },
            React.createElement("div", { className: "flex items-center justify-end w-2/5 text-right space-x-2" },
                React.createElement("span", { className: "font-semibold italic text-sm" }, team.name),
                React.createElement(LogoDisplay, { team: team, style: "emoji", className: "text-xl" })
            ),
            React.createElement("div", { className: "w-1/5 text-center" },
                React.createElement("span", { className: "text-gray-400 font-bold text-sm" }, "VS")
            ),
            React.createElement("div", { className: "flex items-center justify-start w-2/5 space-x-2" },
                React.createElement(LogoDisplay, { team: team, style: "emoji", className: "text-xl" }),
                React.createElement("span", { className: "font-semibold italic text-sm" }, team.name)
            )
        )
    );
};

const BracketMatchItem = ({ match, isUserMatch }) => {
    const { t } = useI18n();
    const highlightClass = isUserMatch ? 'bg-blue-900/50' : 'bg-gray-800';

    const renderCenterContent = () => {
        switch(match.status) {
            case 'PLAYED':
                const homeWinner = match.homeScore > match.awayScore || match.penaltyWinner === 'HOME';
                const awayWinner = match.awayScore > match.homeScore || match.penaltyWinner === 'AWAY';
                const wasPenalty = match.homeScore === match.awayScore && match.penaltyWinner;
                return (
                    React.createElement("div", { className: "flex flex-col items-center" },
                        React.createElement("div", { className: "flex items-center justify-center space-x-2" },
                            React.createElement("span", { className: `text-xl font-bold ${homeWinner ? 'text-white' : 'text-gray-500'}` }, match.homeScore),
                            React.createElement("span", { className: "text-gray-400" }, "-"),
                            React.createElement("span", { className: `text-xl font-bold ${awayWinner ? 'text-white' : 'text-gray-500'}` }, match.awayScore)
                        ),
                        wasPenalty && React.createElement("span", { className: "text-xs text-yellow-400 mt-0.5" }, `(${t('match.penalties').charAt(1).toUpperCase()})`)
                    )
                )
            case 'IN_PROGRESS':
                return React.createElement("span", { className: "text-sm font-semibold text-yellow-400" }, t('match.playing'));
            case 'SCHEDULED':
            default:
                 return React.createElement("span", { className: "text-gray-400 font-bold text-sm" }, "VS");
        }
    }

    return (
        React.createElement("div", 
            {
                className: `flex items-center justify-between p-3 rounded-lg border border-gray-700 ${highlightClass} transition-all duration-200`
            },
            React.createElement("div", { className: "flex items-center justify-end w-2/5 text-right space-x-2" },
                React.createElement("span", { className: `font-semibold truncate text-sm ${(match.status === 'PLAYED' && (match.awayScore > match.homeScore || match.penaltyWinner === 'AWAY')) ? 'text-gray-500' : 'text-white'}` }, match.homeTeam.name),
                React.createElement(LogoDisplay, { team: match.homeTeam, style: "emoji", className: "text-2xl" })
            ),
            React.createElement("div", { className: "w-1/5 text-center" },
                renderCenterContent()
            ),
            React.createElement("div", { className: "flex items-center justify-start w-2/5 space-x-2" },
                 React.createElement(LogoDisplay, { team: match.awayTeam, style: "emoji", className: "text-2xl" }),
                React.createElement("span", { className: `font-semibold truncate text-sm ${(match.status === 'PLAYED' && (match.homeScore > match.awayScore || match.penaltyWinner === 'HOME')) ? 'text-gray-500' : 'text-white'}` }, match.awayTeam.name)
            )
        )
    );
};


const BracketDisplay = ({ cupFixtures, userTeamId, title }) => {
    const { t } = useI18n();

    const allCupRoundsData = useMemo(() => {
        const rounds = [...new Set(cupFixtures.map(m => m.round))].sort((a,b) => b-a); // e.g. [16, 8, 4, 2]
        if (rounds.length === 0) return [{ round: 16, name: t('cup.round.16') }]; // Default if empty
        return rounds.map(r => ({ round: r, name: t(`cup.round.${r}`) || `${t('cup.round.prefix')} ${r}`}));
    }, [cupFixtures, t]);

    const [viewedRoundIndex, setViewedRoundIndex] = useState(0);

    const viewedRoundInfo = allCupRoundsData[viewedRoundIndex];

    const matchesToShow = useMemo(() => 
        viewedRoundInfo ? cupFixtures.filter(m => m.round === viewedRoundInfo.round) : [], 
    [cupFixtures, viewedRoundInfo]);
    
    // When fixtures update (e.g. historical view selected), reset to first round
    useEffect(() => {
        setViewedRoundIndex(0);
    }, [cupFixtures]);


    const handlePrev = () => setViewedRoundIndex(i => Math.max(i - 1, 0));
    const handleNext = () => setViewedRoundIndex(i => Math.min(i + 1, allCupRoundsData.length - 1));

    const renderMatchList = () => {
        if (!viewedRoundInfo) {
            return React.createElement("p", { className: "text-center text-gray-500 py-8" }, "Chaveamento da Copa ainda não definido.");
        }
        if (matchesToShow.length > 0) {
            return (
                React.createElement("div", { className: "space-y-2" },
                    matchesToShow.map(match => {
                        const isUserMatch = match.homeTeam.id === userTeamId || match.awayTeam.id === userTeamId;
                        return React.createElement(BracketMatchItem, { key: match.id, match: match, isUserMatch: isUserMatch });
                    })
                )
            );
        } else {
            const numPlaceholders = (viewedRoundInfo.round > 0) ? viewedRoundInfo.round / 2 : 0;
            if (numPlaceholders === 0) {
                 return React.createElement("p", { className: "text-center text-gray-500 py-8" }, "Chaveamento da Copa ainda não definido.");
            }
            return (
                 React.createElement("div", { className: "space-y-2" },
                    Array.from({ length: numPlaceholders }).map((_, index) => (
                        React.createElement(PlaceholderMatchItem, { key: index })
                    ))
                )
            );
        }
    };

    return (
        React.createElement("div", { className: "bg-gray-800 rounded-lg shadow-lg p-4" },
            React.createElement("h1", { className: "text-3xl font-bold mb-6 text-center" }, title),
             React.createElement("div", { className: "flex items-center justify-between p-3 bg-gray-900 rounded-md mb-4" },
                React.createElement("button", { onClick: handlePrev, disabled: viewedRoundIndex <= 0, className: "p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors" },
                    React.createElement(ChevronLeftIcon, { className: "w-6 h-6" })
                ),
                React.createElement("h2", { className: "text-xl font-bold text-center" },
                    viewedRoundInfo?.name || 'Fase'
                ),
                React.createElement("button", { onClick: handleNext, disabled: viewedRoundIndex >= allCupRoundsData.length - 1, className: "p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors" },
                    React.createElement(ChevronRightIcon, { className: "w-6 h-6" })
                )
            ),
            
            React.createElement("div", { className: "space-y-6" },
                renderMatchList()
            )
        )
    );
};


const CopaBracket = ({ cupFixtures, userTeamId, title }) => {
    // This component is now simplified to just display the bracket. 
    // The history/tabs logic is moved up to Dashboard/SeasonView.
    return (
        React.createElement(BracketDisplay, { cupFixtures: cupFixtures, userTeamId: userTeamId, title: title })
    );
};


export default CopaBracket;
