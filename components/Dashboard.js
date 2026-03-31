import React, { useState } from 'react';
import { DashboardView } from '../types.js';
import SquadHub from './SquadHub.js';
import LeagueTable from './LeagueTable.js';
import Fixtures from './Fixtures.js';
import TransferHub from './TransferHub.js';
import StatisticsHub from './StatisticsHub.js';
import FinancesHub from './FinancesHub.js';
import TeamInspector from './TeamInspector.js';
import JobMarket from './JobMarket.js';
import CommandTerminal from './CommandTerminal.js';
import { UsersIcon, TableCellsIcon, CalendarDaysIcon, PlayIcon, ArrowsRightLeftIcon, ChartBarIcon, BanknotesIcon, NewspaperIcon, MagnifyingGlassIcon, BriefcaseIcon, TrophyIcon, CommandLineIcon, LanguageIcon, ForwardIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const Dashboard = (props) => {
    const { 
        managerName, userTeam, season, msslTable, islTable, laTable, 
        msslFixtures, islFixtures, laFixtures,
        uslFixtures, aslFixtures, cslFixtures, caFixtures,
        currentRound, squad, tactic, onTacticChange, onSquadChange,
        onPlayerPurchase, onPlayerSale, squadSizeLimit, playerStats, aiNews,
        setMatchToPlay, seasonHistory,
        selectedTeamForInspector, setSelectedTeamForInspector,
        onSwitchTeam, onAdvanceSeason, onSimulateRemaining, gamePhase,
        onTakeLoan, isAdmin, isTerminalOpen, onOpenTerminal, onCloseTerminal, onExecuteCommand
    } = props;
    const { t, locale, setLocale } = useI18n();
    const [activeView, setActiveView] = useState(DashboardView.SEASON);
    const [statsTab, setStatsTab] = useState('PLAYERS');
    const [selectedDivision, setSelectedDivision] = useState(userTeam.division);

    const allFixtures = [...msslFixtures, ...islFixtures, ...laFixtures, ...uslFixtures, ...aslFixtures, ...cslFixtures, ...caFixtures];
    const nextMatch = allFixtures.find(m => m.status === 'SCHEDULED' && (m.homeTeam.id === userTeam.id || m.awayTeam.id === userTeam.id));

    const navItems = [
        { id: DashboardView.SEASON, label: t('dashboard.nav.season'), icon: TableCellsIcon },
        { id: DashboardView.MATCHES, label: t('dashboard.nav.matches'), icon: CalendarDaysIcon },
        { id: DashboardView.SQUAD, label: t('dashboard.nav.squad'), icon: UsersIcon },
        { id: DashboardView.TRANSFER_MARKET, label: t('dashboard.nav.market'), icon: ArrowsRightLeftIcon },
        { id: DashboardView.FINANCES, label: t('dashboard.nav.finances'), icon: BanknotesIcon },
        { id: DashboardView.STATISTICS, label: t('dashboard.nav.stats'), icon: ChartBarIcon },
        { id: 'HALL_OF_FAME', label: t('stats.hall_of_fame'), icon: TrophyIcon },
        { id: DashboardView.TEAM_INSPECTOR, label: t('dashboard.nav.inspector'), icon: MagnifyingGlassIcon },
        { id: DashboardView.JOB_MARKET, label: t('dashboard.nav.jobs'), icon: BriefcaseIcon },
    ];

    const handleNavClick = (id) => {
        if (id === 'HALL_OF_FAME') {
            setActiveView(DashboardView.STATISTICS);
            setStatsTab('HALL_OF_FAME');
        } else {
            setActiveView(id);
            if (id === DashboardView.STATISTICS) setStatsTab('PLAYERS');
        }
    };

    const handleSelectTeam = (teamId) => {
        setSelectedTeamForInspector(teamId);
        setActiveView(DashboardView.TEAM_INSPECTOR);
    };

    return React.createElement("div", { className: "flex flex-col md:flex-row min-h-screen bg-gray-900 text-white" },
        React.createElement("aside", { className: "w-full md:w-64 bg-gray-800 p-6 flex-shrink-0 border-r border-gray-700" },
            React.createElement("div", { className: "text-center mb-8" },
                React.createElement("div", { className: "mx-auto w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-3 shadow-inner border-2 border-gray-600" }, userTeam.emoji),
                React.createElement("h2", { className: "font-bold text-xl truncate" }, managerName),
                React.createElement("p", { className: "text-blue-400 text-sm font-semibold" }, userTeam.name)
            ),
            React.createElement("nav", { className: "space-y-1" },
                navItems.map(item => React.createElement("button", {
                    key: item.id,
                    onClick: () => handleNavClick(item.id),
                    className: `w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeView === item.id || (item.id === 'HALL_OF_FAME' && activeView === DashboardView.STATISTICS && statsTab === 'HALL_OF_FAME') ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`
                }, React.createElement(item.icon, { className: "w-5 h-5" }), React.createElement("span", { className: "font-medium" }, item.label)))
            ),
            React.createElement("div", { className: "mt-8 pt-6 border-t border-gray-700" },
                React.createElement("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center" },
                    React.createElement(NewspaperIcon, { className: "w-4 h-4 mr-2" }), " Notícias da Liga"
                ),
                React.createElement("div", { className: "space-y-3 max-h-[300px] overflow-y-auto no-scrollbar" },
                    aiNews && aiNews.length > 0 ? aiNews.map((news, i) => 
                        React.createElement("div", { key: i, className: "text-[10px] leading-snug p-2.5 bg-gray-900/50 rounded-lg text-gray-300 border-l-2 border-blue-500 relative" }, 
                            React.createElement("div", { className: "flex justify-between items-start mb-1" },
                                React.createElement("span", { className: "text-[8px] font-bold uppercase text-blue-400" }, typeof news === 'string' ? 'INFO' : news.type),
                                React.createElement("span", { className: "text-[8px] text-gray-500" }, typeof news === 'string' ? '' : news.time)
                            ),
                            React.createElement("p", null, typeof news === 'string' ? news : news.text)
                        )
                    ) : React.createElement("p", { className: "text-[10px] text-gray-600 italic text-center py-4" }, "Nenhuma novidade global ainda...")
                )
            )
        ),
        React.createElement("main", { className: "flex-1 p-4 md:p-8 overflow-y-auto" },
            React.createElement("div", { className: "max-w-5xl mx-auto" },
                React.createElement("header", { className: "flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" },
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("div", null,
                            React.createElement("h1", { className: "text-3xl font-bold" }, `Temporada ${season + 2024}`),
                            React.createElement("p", { className: "text-gray-400" }, `Rodada ${currentRound} - ${userTeam.division}`)
                        ),
                        React.createElement("button", {
                            onClick: () => {
                                const locales = ['pt-BR', 'en-US', 'es-ES', 'pt-PT', 'es-LA'];
                                const currentIndex = locales.indexOf(locale);
                                const nextIndex = (currentIndex + 1) % locales.length;
                                setLocale(locales[nextIndex]);
                            },
                            className: "p-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors",
                            title: "Mudar Idioma / Change Language"
                        }, React.createElement(LanguageIcon, { className: "w-5 h-5 text-blue-400" }))
                    ),
                    React.createElement("div", { className: "flex items-center space-x-3" },
                        gamePhase === 'SEASON_END' ? (
                            React.createElement("button", {
                                onClick: onAdvanceSeason,
                                className: "bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center"
                            }, React.createElement(TrophyIcon, { className: "w-5 h-5 mr-2" }), t('dashboard.action.advance_season'))
                        ) : (
                            React.createElement(React.Fragment, null,
                                React.createElement("button", {
                                    onClick: onOpenTerminal,
                                    className: "bg-gray-700 hover:bg-gray-600 text-white font-bold p-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center"
                                }, React.createElement(CommandLineIcon, { className: "w-6 h-6" })),
                                nextMatch ? (
                                    React.createElement("button", {
                                        onClick: () => setMatchToPlay(nextMatch),
                                        className: "bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center"
                                    }, React.createElement(PlayIcon, { className: "w-5 h-5 mr-2" }), t('dashboard.action.play_next'))
                                ) : (
                                    React.createElement("button", {
                                        onClick: onSimulateRemaining,
                                        className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center"
                                    }, React.createElement(ForwardIcon, { className: "w-5 h-5 mr-2" }), t('dashboard.action.simulate_remaining'))
                                )
                            )
                        )
                    )
                ),
                activeView === DashboardView.SEASON && React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", { className: "flex bg-gray-800 p-1 rounded-xl w-fit border border-gray-700" },
                        ['MSSL', 'ISL', 'LA'].map(div => React.createElement("button", {
                            key: div,
                            onClick: () => setSelectedDivision(div),
                            className: `px-6 py-2 rounded-lg font-bold transition-all text-sm ${selectedDivision === div ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`
                        }, div))
                    ),
                    React.createElement(LeagueTable, { 
                        teams: selectedDivision === 'MSSL' ? msslTable : selectedDivision === 'ISL' ? islTable : laTable, 
                        userTeamId: userTeam.id, 
                        division: selectedDivision, 
                        title: `Classificação - ${selectedDivision}`, 
                        onSelectTeam: handleSelectTeam 
                    })
                ),
                activeView === DashboardView.SQUAD && React.createElement(SquadHub, { squad: squad, onSquadChange: onSquadChange, tactic: tactic, onTacticChange: onTacticChange, allPlayers: userTeam.players, onPlayerSale: onPlayerSale, playerStats: playerStats, season: season, seasonHistory: seasonHistory }),
                activeView === DashboardView.TRANSFER_MARKET && React.createElement(TransferHub, { userTeam: userTeam, allTeams: [...msslTable, ...islTable, ...laTable], onPurchasePlayer: onPlayerPurchase, squadSizeLimit: squadSizeLimit }),
                activeView === DashboardView.FINANCES && React.createElement(FinancesHub, { userTeam: userTeam, onTakeLoan: onTakeLoan }),
                activeView === DashboardView.STATISTICS && React.createElement(StatisticsHub, { playerStats: playerStats, allTeams: [...msslTable, ...islTable, ...laTable], userTeamId: userTeam.id, seasonHistory: seasonHistory, season: season, initialTab: statsTab }),
                activeView === DashboardView.MATCHES && React.createElement(Fixtures, { allFixtures: allFixtures, userTeam: userTeam, onSelectMatch: setMatchToPlay }),
                activeView === DashboardView.TEAM_INSPECTOR && React.createElement(TeamInspector, { allTeams: [...msslTable, ...islTable, ...laTable], initialTeamId: selectedTeamForInspector }),
                activeView === DashboardView.JOB_MARKET && React.createElement(JobMarket, { userTeam: userTeam, userTeamId: userTeam.id, allTeams: [...msslTable, ...islTable, ...laTable], onSwitchTeam: onSwitchTeam })
            ),
            React.createElement(CommandTerminal, { isOpen: isTerminalOpen, onClose: onCloseTerminal, onExecuteCommand: onExecuteCommand })
        )
    );
};

export default Dashboard;