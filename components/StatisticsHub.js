

import React, { useState, useMemo, useEffect } from 'react';
import LogoDisplay from './LogoDisplay.js';
import { useI18n } from '../lib/i18n.js';

// --- Sub-components for Hall of Fame ---

// This component is a copy of the TableDisplay logic from the old LeagueTable.tsx
const HistoryTableDisplay = ({table, userTeamId, division, title}) => {
    const { t } = useI18n();
    
    const legendItems = [];
    if (division === 'MSSL') {
        legendItems.push({ colorClass: 'border-yellow-400', text: t('season_end.champion') });
        legendItems.push({ colorClass: 'border-red-500', text: t('season_end.relegation_isl') });
    } else if (division === 'ISL') {
        legendItems.push({ colorClass: 'border-green-500', text: t('season_end.promotion_mssl') });
        legendItems.push({ colorClass: 'border-red-500', text: t('season_end.relegation_la') });
    } else if (division === 'LA') {
        legendItems.push({ colorClass: 'border-green-500', text: t('season_end.promotion_isl') });
    }
    
    return (
     React.createElement("div", { className: "bg-gray-800 rounded-lg shadow-lg overflow-hidden" },
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("h3", { className: "text-lg font-semibold p-4 bg-gray-700/50" }, title),
            React.createElement("table", { className: "w-full text-sm text-left text-gray-300" },
                React.createElement("thead", { className: "text-xs text-gray-400 uppercase bg-gray-700" },
                    React.createElement("tr", null,
                        React.createElement("th", { scope: "col", className: "px-4 py-3 text-center" }, t('table.pos')),
                        React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('table.team')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.pts_long') }, t('table.pts_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.p_long') }, t('table.p_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.w_long') }, t('table.w_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.d_long') }, t('table.d_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.l_long') }, t('table.l_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.gf_long') }, t('table.gf_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.ga_long') }, t('table.ga_abbr')),
                        React.createElement("th", { scope: "col", className: "px-2 py-3 text-center", title: t('table.gd_long') }, t('table.gd_abbr'))
                    )
                ),
                React.createElement("tbody", null,
                    table.map((team, index) => {
                        let rowClass = 'border-b border-gray-700';
                        if (team.id === userTeamId) rowClass += ' bg-blue-900/50';
                        else rowClass += ' bg-gray-800';
                        
                        let posClass = 'px-4 py-4 text-center font-medium border-l-4';
                        
                        const isTopTwo = index < 2;
                        const isBottomTwo = index >= table.length - 2;

                        if (division === 'MSSL') {
                            if (index === 0) posClass += ' border-yellow-400';
                            else if (isBottomTwo) posClass += ' border-red-500';
                            else posClass += ' border-transparent';
                        } else if (division === 'ISL') {
                            if (isTopTwo) posClass += ' border-green-500';
                            else if (isBottomTwo) posClass += ' border-red-500';
                            else posClass += ' border-transparent';
                        } else if (division === 'LA') {
                            if (isTopTwo) posClass += ' border-green-500';
                            else posClass += ' border-transparent';
                        } else {
                            posClass += ' border-transparent';
                        }
                        
                        return (
                            React.createElement("tr", { key: `${team.id}-${index}`, className: rowClass },
                                React.createElement("td", { className: posClass }, index + 1),
                                React.createElement("td", { className: "px-6 py-4 font-semibold text-white" },
                                    React.createElement("div", { className: "flex items-center space-x-3" },
                                        React.createElement(LogoDisplay, { team: team, style: "emoji", className: "text-xl w-6 text-center" }),
                                        React.createElement("span", null, team.name)
                                    )
                                ),
                                React.createElement("td", { className: "px-2 py-4 text-center font-bold text-white" }, team.points),
                                React.createElement("td", { className: "px-2 py-4 text-center" }, team.played),
                                React.createElement("td", { className: "px-2 py-4 text-center text-green-400" }, team.wins),
                                React.createElement("td", { className: "px-2 py-4 text-center text-yellow-400" }, team.draws),
                                React.createElement("td", { className: "px-2 py-4 text-center text-red-400" }, team.losses),
                                React.createElement("td", { className: "px-2 py-4 text-center" }, team.goalsFor),
                                React.createElement("td", { className: "px-2 py-4 text-center" }, team.goalsAgainst),
                                React.createElement("td", { className: "px-2 py-4 text-center" }, team.goalDifference)
                            )
                        );
                    })
                )
            )
        ),
        legendItems.length > 0 && table.length > 0 && (
            React.createElement("div", { className: "p-3 bg-gray-900/50 text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1" },
                React.createElement("span", { className: "font-semibold mr-2" }, "Legenda:"),
                legendItems.map(item => (
                    React.createElement("div", { key: item.text, className: "flex items-center space-x-2" },
                        React.createElement("div", { className: `w-1 h-3 border-l-4 ${item.colorClass}` }),
                        React.createElement("span", null, item.text)
                    )
                ))
            )
        )
    )
    );
}

const HallOfFameView = ({ seasonHistory, userTeamId }) => {
    const { t } = useI18n();
    const [selectedHistory, setSelectedHistory] = useState(null);

    const handleSelectHistory = (year) => {
        const historyItem = seasonHistory.find(h => h.year === year);
        setSelectedHistory(historyItem || null);
    }

    const AwardWinnerLine = ({ winner, awardName, icon }) => (
         React.createElement("li", { className: "flex items-center space-x-2 text-sm" },
            React.createElement("span", { title: awardName }, icon),
            winner ? (
                React.createElement("span", null, `${winner.playerName} (`, React.createElement(LogoDisplay, { team: {emoji: winner.teamEmoji, name: winner.teamName, logo:''}, style: "emoji" }), ` ${winner.teamName})`)
            ) : React.createElement("span", { className: "text-gray-500" }, "N/A")
        )
    );
    
    return (
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
            React.createElement("div", { className: "md:col-span-1 bg-gray-800 p-4 rounded-lg" },
                React.createElement("h2", { className: "text-lg font-semibold mb-3" }, t('stats.past_seasons')),
                seasonHistory.length > 0 ? (
                    React.createElement("ul", { className: "space-y-2" },
                        seasonHistory.map(h => (
                            React.createElement("li", { key: h.year },
                                React.createElement("button", 
                                    {
                                        onClick: () => handleSelectHistory(h.year),
                                        className: `w-full text-left p-3 rounded-md transition-colors ${selectedHistory?.year === h.year ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`
                                    },
                                    React.createElement("div", { className: "font-semibold mb-2" }, t('stats.season_year', { year: h.year })),
                                    React.createElement("div", { className: "text-xs space-y-1" },
                                        React.createElement("p", null, t('stats.trophy_mssl', { champion: h.msslChampion?.name || 'N/A' })),
                                        React.createElement("p", null, t('stats.trophy_isl', { champion: h.islChampion?.name || 'N/A' })),
                                        React.createElement("p", null, t('stats.trophy_la', { champion: h.laChampion?.name || 'N/A' })),
                                        React.createElement(AwardWinnerLine, { winner: h.ballonDorWinner, awardName: t('stats.ballon_dor'), icon: "🥇" }),
                                        React.createElement(AwardWinnerLine, { winner: h.goldenBoyWinner, awardName: t('stats.golden_boy'), icon: "🌟" })
                                    )
                                )
                            )
                        ))
                    )
                ) : (
                    React.createElement("p", { className: "text-gray-400" }, t('stats.no_seasons_completed'))
                )
            ),
            React.createElement("div", { className: "md:col-span-2 space-y-6" },
                selectedHistory ? (
                    React.createElement(React.Fragment, null,
                        selectedHistory.msslTable.length > 0 &&
                            React.createElement("div", null,
                                React.createElement("h2", { className: "text-xl font-bold mb-2" }, t('stats.final_table_title', { division: 'MSSL', year: selectedHistory.year })),
                                React.createElement(HistoryTableDisplay, { table: selectedHistory.msslTable, userTeamId: userTeamId, division: 'MSSL', title: "MSSL" })
                            ),
                        selectedHistory.islTable.length > 0 &&
                            React.createElement("div", null,
                                React.createElement("h2", { className: "text-xl font-bold mb-2" }, t('stats.final_table_title', { division: 'ISL', year: selectedHistory.year })),
                                React.createElement(HistoryTableDisplay, { table: selectedHistory.islTable, userTeamId: userTeamId, division: 'ISL', title: "ISL" })
                            ),
                        selectedHistory.laTable.length > 0 &&
                             React.createElement("div", null,
                                React.createElement("h2", { className: "text-xl font-bold mb-2" }, t('stats.final_table_title', { division: 'LA', year: selectedHistory.year })),
                                React.createElement(HistoryTableDisplay, { table: selectedHistory.laTable, userTeamId: userTeamId, division: 'LA', title: "LA" })
                            ),
                        React.createElement("div", { className: "pt-4 border-t border-gray-700" },
                            React.createElement("h2", { className: "text-xl font-bold mb-4" }, t('season_end.season_results_title', { year: selectedHistory.year })),
                            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                                React.createElement("div", null,
                                    React.createElement("h3", { className: "text-lg font-semibold mb-2" }, t('stats.promo_relegation')),
                                    React.createElement("ul", { className: "bg-gray-900 rounded-md p-3 space-y-2" },
                                        React.createElement("li", { className: "text-gray-400 font-bold text-sm" }, "MSSL ↔️ ISL"),
                                        selectedHistory.promotedToMssl.map(team => (
                                            React.createElement("li", { key: team.id, className: "flex items-center space-x-2 text-green-400" }, React.createElement("span", null, "🔼"), React.createElement(LogoDisplay, { team: team, style: "emoji" }), React.createElement("span", null, team.name))
                                        )),
                                        selectedHistory.relegatedToIsl.map(team => (
                                            React.createElement("li", { key: team.id, className: "flex items-center space-x-2 text-red-400" }, React.createElement("span", null, "🔽"), React.createElement(LogoDisplay, { team: team, style: "emoji" }), React.createElement("span", null, team.name))
                                        )),
                                        React.createElement("li", { className: "text-gray-400 font-bold text-sm pt-2" }, "ISL ↔️ LA"),
                                         selectedHistory.promotedToIsl.map(team => (
                                            React.createElement("li", { key: team.id, className: "flex items-center space-x-2 text-green-400" }, React.createElement("span", null, "🔼"), React.createElement(LogoDisplay, { team: team, style: "emoji" }), React.createElement("span", null, team.name))
                                        )),
                                        selectedHistory.relegatedToLa.map(team => (
                                            React.createElement("li", { key: team.id, className: "flex items-center space-x-2 text-red-400" }, React.createElement("span", null, "🔽"), React.createElement(LogoDisplay, { team: team, style: "emoji" }), React.createElement("span", null, team.name))
                                        ))
                                    )
                                ),
                                 React.createElement("div", null,
                                    React.createElement("h3", { className: "text-lg font-semibold mb-2" }, t('stats.individual_awards')),
                                    React.createElement("ul", { className: "bg-gray-900 rounded-md p-3 space-y-2" },
                                        React.createElement(AwardWinnerLine, { winner: selectedHistory.ballonDorWinner, awardName: t('stats.ballon_dor'), icon: "🥇" }),
                                        React.createElement(AwardWinnerLine, { winner: selectedHistory.goldenBoyWinner, awardName: t('stats.golden_boy'), icon: "🌟" })
                                    )
                                )
                            )
                        )
                    )
                ) : (
                        React.createElement("div", { className: "flex items-center justify-center h-full bg-gray-800 rounded-lg p-8" },
                        React.createElement("p", { className: "text-gray-400" }, t('stats.select_season_details'))
                    )
                )
            )
        )
    );
};


const StatisticsHub = ({ playerStats, allTeams, userTeamId, seasonHistory, season, initialTab }) => {
    const { t } = useI18n();
    const [view, setView] = useState(initialTab || 'PLAYERS');

    useEffect(() => {
        if (initialTab) setView(initialTab);
    }, [initialTab]);

    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('ALL');
    const [sortConfig, setSortConfig] = useState({ key: 'goals', direction: 'desc' });
    const [competitionFilter, setCompetitionFilter] = useState('total');
    const [seasonFilter, setSeasonFilter] = useState('career');
    
    const displayedStats = useMemo(() => {
        const teamMap = new Map(allTeams.map(t => [t.id, t]));

        // 1. Prepare data based on season filter
        let preparedStats = [];
        for (const pStat of playerStats) {
            if (seasonFilter === 'career') {
                const seasonStats = pStat.statsBySeason;
                const currentSeasonTeamId = seasonStats[season]?.teamId;
                let teamForCareer = teamMap.get(currentSeasonTeamId || 0);
                
                if (!teamForCareer) {
                    const sortedSeasonKeys = Object.keys(seasonStats).map(Number).sort((a,b) => a - b);
                    if (sortedSeasonKeys.length > 0) {
                        const lastSeasonKey = sortedSeasonKeys[sortedSeasonKeys.length - 1];
                        const lastSeasonData = seasonStats[lastSeasonKey];
                        if (lastSeasonData) {
                            teamForCareer = teamMap.get(lastSeasonData.teamId);
                        }
                    }
                }

                const finalTeam = teamForCareer || {id: 0, name: 'Sem Clube', emoji: '?', logo: ''};

                preparedStats.push({
                    playerId: pStat.playerId,
                    playerName: pStat.playerName,
                    teamId: finalTeam.id,
                    teamName: finalTeam.name,
                    teamEmoji: finalTeam.emoji,
                    teamLogo: finalTeam.logo,
                    stats: pStat.career[competitionFilter]
                });
            } else {
                const seasonalData = pStat.statsBySeason[seasonFilter];
                if (seasonalData) {
                    preparedStats.push({
                        playerId: pStat.playerId,
                        playerName: pStat.playerName,
                        teamId: seasonalData.teamId,
                        teamName: seasonalData.teamName,
                        teamEmoji: seasonalData.teamEmoji,
                        teamLogo: seasonalData.teamLogo,
                        stats: seasonalData[competitionFilter]
                    });
                }
            }
        }
        
        // 2. Filter out players with no relevant stats
        preparedStats = preparedStats.filter(s => 
            s.stats && (s.stats.matchesPlayed > 0 || s.stats.goals > 0 || s.stats.assists > 0 || s.stats.ownGoals > 0)
        );

        // 3. Apply text and team filters
        if (teamFilter !== 'ALL') {
            preparedStats = preparedStats.filter(s => s.teamId === Number(teamFilter));
        }
        if (searchTerm) {
            preparedStats = preparedStats.filter(s => s.playerName.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // 4. Sort the results
        preparedStats.sort((a, b) => {
            const aValue = a.stats?.[sortConfig.key] || 0;
            const bValue = b.stats?.[sortConfig.key] || 0;

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            
            // Secondary sort
            const aGoals = a.stats?.goals || 0;
            const bGoals = b.stats?.goals || 0;

            if (aGoals < bGoals) return 1;
            if (aGoals > bGoals) return -1;
            
            return a.playerName.localeCompare(b.playerName);
        });

        return preparedStats;
    }, [playerStats, searchTerm, teamFilter, sortConfig, competitionFilter, seasonFilter, allTeams, season]);

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return ' ';
        return sortConfig.direction === 'desc' ? '▼' : '▲';
    };

    const Th = ({ sortKey, children, className, title }) => (
        React.createElement("th", { scope: "col", className: `px-4 py-3 cursor-pointer select-none ${className}`, onClick: () => requestSort(sortKey), title: title },
            React.createElement("span", { className: "flex items-center justify-center" },
                children,
                React.createElement("span", { className: "ml-1 w-4" }, getSortIndicator(sortKey))
            )
        )
    );

    const competitionFilterOptions = [
        { key: 'total', label: t('stats.all_competitions') },
        { key: 'MSSL', label: t('competition.MSSL') },
        { key: 'ISL', label: t('competition.ISL') },
        { key: 'LA', label: t('competition.LA') },
        { key: 'USL', label: t('competition.USL') },
        { key: 'ASL', label: t('competition.ASL') },
        { key: 'CSL', label: t('competition.CSL') },
        { key: 'CA', label: t('competition.CA') },
    ];

    const PlayerStatsView = () => (
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4" },
                React.createElement("input", {
                    type: "text",
                    placeholder: t('stats.search_placeholder'),
                    value: searchTerm,
                    onChange: (e) => setSearchTerm(e.target.value),
                    className: "w-full md:col-span-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                }),
                React.createElement("select", {
                    value: teamFilter,
                    onChange: (e) => setTeamFilter(e.target.value),
                    className: "w-full md:col-span-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                },
                    React.createElement("option", { value: "ALL" }, t('stats.all_teams')),
                    allTeams.sort((a,b) => a.name.localeCompare(b.name)).map(team => (
                        React.createElement("option", { key: team.id, value: team.id }, team.name)
                    ))
                ),
                React.createElement("select", {
                    value: seasonFilter,
                    onChange: (e) => setSeasonFilter(e.target.value === 'career' ? 'career' : Number(e.target.value)),
                    className: "w-full md:col-span-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                },
                    React.createElement("option", { value: "career" }, t('stats.career_total')),
                    React.createElement("option", { value: season }, t('stats.current_season', { season })),
                    seasonHistory.map(h => React.createElement("option", { key: h.year, value: h.year - 2024 + 1 }, t('stats.season_year', { year: h.year })))
                )
            ),
            
            React.createElement("div", { className: "flex justify-center p-1 space-x-1 bg-gray-800 rounded-lg max-w-3xl mx-auto flex-wrap" },
                competitionFilterOptions.map(opt => (
                     React.createElement("button",
                        {
                            key: opt.key,
                            onClick: () => setCompetitionFilter(opt.key),
                            className: `flex-grow px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
                                competitionFilter === opt.key ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`
                        },
                        opt.label
                    )
                ))
            ),

             React.createElement("div", { className: "bg-gray-800 rounded-lg shadow-lg overflow-hidden" },
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full text-sm text-left text-gray-300" },
                        React.createElement("thead", { className: "text-xs text-gray-400 uppercase bg-gray-700" },
                            React.createElement("tr", null,
                                React.createElement("th", { scope: "col", className: "px-2 py-3 text-center" }, "#"),
                                React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('stats.player')),
                                React.createElement(Th, { sortKey: "matchesPlayed", className: "text-center", title: t('stats.matches_played_long') }, t('stats.matches_played_abbr')),
                                React.createElement(Th, { sortKey: "goals", className: "text-center", title: t('stats.goals_long') }, t('stats.goals_abbr')),
                                React.createElement(Th, { sortKey: "assists", className: "text-center", title: t('stats.assists_long') }, t('stats.assists_abbr')),
                                React.createElement(Th, { sortKey: "ownGoals", className: "text-center", title: t('stats.own_goals_long') }, t('stats.own_goals_abbr'))
                            )
                        ),
                        React.createElement("tbody", null,
                             displayedStats.map((stat, index) => {
                                const isUserPlayer = stat.teamId === userTeamId;
                                return (
                                React.createElement("tr", { key: `${stat.playerId}-${stat.teamId || 'no-team'}-${index}`, className: `border-b border-gray-700 hover:bg-gray-700/50 ${isUserPlayer ? 'bg-blue-900/50' : ''}` },
                                    React.createElement("td", { className: "px-2 py-4 text-center text-gray-400" }, index + 1),
                                    React.createElement("td", { className: "px-6 py-4 font-semibold text-white" },
                                        React.createElement("div", { className: "flex flex-col" },
                                            React.createElement("span", null, stat.playerName),
                                            React.createElement("div", { className: "flex items-center space-x-2 text-xs text-gray-400" },
                                                React.createElement(LogoDisplay, { team: { logo: stat.teamLogo, emoji: stat.teamEmoji, name: stat.teamName }, style: "emoji", className: "text-base"}),
                                                React.createElement("span", null, stat.teamName)
                                            )
                                        )
                                    ),
                                    React.createElement("td", { className: "px-4 py-4 text-center" }, stat.stats?.matchesPlayed || 0),
                                    React.createElement("td", { className: "px-4 py-4 text-center font-bold text-lg" }, stat.stats?.goals || 0),
                                    React.createElement("td", { className: "px-4 py-4 text-center" }, stat.stats?.assists || 0),
                                    React.createElement("td", { className: "px-4 py-4 text-center text-red-400" }, stat.stats?.ownGoals || 0)
                                )
                             );
                            })
                        )
                    )
                ),
                 displayedStats.length === 0 && (
                    React.createElement("p", { className: "text-center text-gray-500 py-8" }, t('stats.no_stats_found'))
                )
            )
        )
    );


    return (
        React.createElement("div", null,
            React.createElement("div", { className: "mb-4 border-b border-gray-700" },
                React.createElement("nav", { className: "flex space-x-4", "aria-label": "Tabs" },
                    React.createElement("button", { onClick: () => setView('PLAYERS'), className: `px-3 py-2 font-medium text-sm rounded-t-lg ${view === 'PLAYERS' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}` },
                        t('stats.players')
                    ),
                    React.createElement("button", { onClick: () => setView('HALL_OF_FAME'), className: `px-3 py-2 font-medium text-sm rounded-t-lg ${view === 'HALL_OF_FAME' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}` },
                        t('stats.hall_of_fame')
                    )
                )
            ),
            view === 'PLAYERS' ? React.createElement(PlayerStatsView) : React.createElement(HallOfFameView, { seasonHistory: seasonHistory, userTeamId: userTeamId })
        )
    );
};

export default StatisticsHub;