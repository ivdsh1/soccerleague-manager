

import React from 'react';
import LogoDisplay from './LogoDisplay.js';
import { useI18n } from '../lib/i18n.js';

const LeagueTable = ({ teams, userTeamId, division, title, onSelectTeam }) => {
    const { t } = useI18n();
    
    const legendItems = [];
    if (division === 'MSSL') {
        legendItems.push({ colorClass: 'border-yellow-400', text: 'Campeão' });
        legendItems.push({ colorClass: 'border-red-500', text: 'Rebaixamento para ISL' });
    } else if (division === 'ISL') {
        legendItems.push({ colorClass: 'border-green-500', text: 'Promoção para MSSL' });
        legendItems.push({ colorClass: 'border-red-500', text: 'Rebaixamento para LA' });
    } else if (division === 'LA') {
        legendItems.push({ colorClass: 'border-green-500', text: 'Promoção para ISL' });
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
                    teams.map((team, index) => {
                        let rowClass = 'border-b border-gray-700';
                        if (team.id === userTeamId) rowClass += ' bg-blue-900/50';
                        else rowClass += ' bg-gray-800';
                        
                        let posClass = 'px-4 py-4 text-center font-medium border-l-4';
                        
                        const isTopTwo = index < 2;
                        const isBottomTwo = index >= teams.length - 2;

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
                            React.createElement("tr", { key: team.id, className: rowClass },
                                React.createElement("td", { className: posClass }, index + 1),
                                React.createElement("td", { className: "px-6 py-4 font-semibold text-white" },
                                    React.createElement("button", { 
                                        onClick: () => onSelectTeam && onSelectTeam(team.id),
                                        className: "flex items-center space-x-3 hover:text-blue-400 transition-colors" 
                                    },
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
        legendItems.length > 0 && teams.length > 0 && (
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
};

export default LeagueTable;