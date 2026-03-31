import React from 'react';
import { XMarkIcon, TrophyIcon, ArrowUpIcon, ArrowDownIcon } from './icons/Icons.jsx';
import LogoDisplay from './LogoDisplay.js';
import { useI18n } from '../lib/i18n.js';

const Section = ({title, children}) => (
    React.createElement("div", { className: "bg-gray-900/50 p-3 md:p-4 rounded-lg" },
        React.createElement("h3", { className: "text-lg font-semibold text-white mb-3 text-center" }, title),
        React.createElement("div", { className: "space-y-2" },
            children
        )
    )
);

const ChampionItem = ({ champion, competition }) => {
    const { t } = useI18n();
    return (
        champion && (
            React.createElement("div", { className: "flex items-center space-x-3 text-yellow-300" },
                React.createElement(TrophyIcon, { className: "w-5 h-5 flex-shrink-0" }),
                React.createElement("span", { className: "font-semibold w-16" }, `${t(`dashboard.tabs.${competition}`)}:`),
                React.createElement(LogoDisplay, { team: champion, style: "emoji", className: "text-xl" }),
                React.createElement("span", { className: "font-bold" }, champion.name)
            )
        )
    );
}

const TeamMovementItem = ({ team, type }) => (
    React.createElement("div", { className: `flex items-center space-x-2 ${type === 'promo' ? 'text-green-400' : 'text-red-400'}` },
        type === 'promo' ? React.createElement(ArrowUpIcon, { className: "w-4 h-4 flex-shrink-0" }) : React.createElement(ArrowDownIcon, { className: "w-4 h-4 flex-shrink-0" }),
        React.createElement(LogoDisplay, { team: team, style: "emoji", className: "text-lg" }),
        React.createElement("span", null, team.name)
    )
);

const AwardWinnerCard = ({ winner, title, icon }) => {
    const { t } = useI18n();
    return (
        React.createElement("div", { className: "bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30 text-center flex flex-col" },
            React.createElement("h4", { className: "text-lg font-bold text-yellow-300" }, `${icon} ${title} ${icon}`),
            React.createElement("div", { className: "mt-2 flex-grow" },
                React.createElement("p", { className: "text-xl font-bold text-white" }, winner.playerName),
                React.createElement("div", { className: "flex items-center justify-center space-x-2 text-sm text-gray-300" },
                    React.createElement(LogoDisplay, { team: { emoji: winner.teamEmoji, name: winner.teamName, logo: ''}, style: "emoji" }),
                    React.createElement("span", null, winner.teamName),
                    React.createElement("span", null, "•"),
                    React.createElement("span", null, t('season_end.age_years', { age: winner.age }))
                ),
                React.createElement("div", { className: "mt-3 pt-3 border-t border-yellow-500/20 grid grid-cols-3 gap-2 text-sm" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-gray-400" }, t('season_end.matches')),
                        React.createElement("p", { className: "font-bold text-white" }, winner.seasonStats.matchesPlayed)
                    ),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-gray-400" }, t('season_end.goals')),
                        React.createElement("p", { className: "font-bold text-white" }, winner.seasonStats.goals)
                    ),
                     React.createElement("div", null,
                        React.createElement("p", { className: "text-gray-400" }, t('season_end.assists')),
                        React.createElement("p", { className: "font-bold text-white" }, winner.seasonStats.assists)
                    )
                )
            )
        )
    );
};


const SeasonEndModal = ({ summary, onClose }) => {
    const { t } = useI18n();
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-auto flex flex-col max-h-[90vh]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center flex-shrink-0" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('season_end.title', { year: summary.year })),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),

                React.createElement("div", { className: "p-4 md:p-6 space-y-4 overflow-y-auto" },
                    React.createElement("p", { className: "text-center text-gray-400 text-sm" }, t('season_end.subtitle')),
                    
                     React.createElement(Section, { title: t('season_end.individual_awards_title') },
                        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                            summary.ballonDorWinner ? (
                                React.createElement(AwardWinnerCard, { winner: summary.ballonDorWinner, title: t('season_end.ballon_dor_title'), icon: "🥇" })
                            ) : React.createElement("div", { className: "text-gray-500 text-center p-4" }, t('season_end.no_ballon_dor')),
                            summary.goldenBoyWinner ? (
                                React.createElement(AwardWinnerCard, { winner: summary.goldenBoyWinner, title: t('season_end.golden_boy_title'), icon: "🌟" })
                             ) : React.createElement("div", { className: "text-gray-500 text-center p-4" }, t('season_end.no_golden_boy'))
                        )
                    ),

                    React.createElement(Section, { title: t('season_end.champions_title') },
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2" },
                            React.createElement(ChampionItem, { champion: summary.msslChampion, competition: "MSSL" }),
                            React.createElement(ChampionItem, { champion: summary.islChampion, competition: "ISL" }),
                            React.createElement(ChampionItem, { champion: summary.laChampion, competition: "LA" }),
                            React.createElement(ChampionItem, { champion: summary.cslChampion, competition: "CSL" }),
                            React.createElement(ChampionItem, { champion: summary.uslChampion, competition: "USL" }),
                            React.createElement(ChampionItem, { champion: summary.aslChampion, competition: "ASL" }),
                            React.createElement(ChampionItem, { champion: summary.caChampion, competition: "CA" })
                        )
                    ),

                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement(Section, { title: t('season_end.promo_relegation_title') },
                            React.createElement("h4", { className: "font-semibold text-gray-400" }, "MSSL ↔️ ISL"),
                            summary.promotedToMssl.map(team => React.createElement(TeamMovementItem, { key: team.id, team, type: 'promo' })),
                            summary.relegatedToIsl.map(team => React.createElement(TeamMovementItem, { key: team.id, team, type: 'releg' })),
                            React.createElement("h4", { className: "font-semibold text-gray-400 pt-2 mt-2 border-t border-gray-700" }, "ISL ↔️ LA"),
                            summary.promotedToIsl.map(team => React.createElement(TeamMovementItem, { key: team.id, team, type: 'promo' })),
                            summary.relegatedToLa.map(team => React.createElement(TeamMovementItem, { key: team.id, team, type: 'releg' }))
                        )
                    )
                ),

                React.createElement("div", { className: "p-4 bg-gray-900/50 text-center mt-auto flex-shrink-0" },
                    React.createElement("button", { onClick: onClose, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors text-lg" },
                        t('season_end.start_new_season')
                    )
                )
            )
        )
    );
};

export default SeasonEndModal;