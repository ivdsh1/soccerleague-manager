import React, { useState, useCallback, useMemo } from 'react';
import { TACTIC_STYLES, BENCH_LIMIT, getEloFromSkill } from '../constants.js';
import SellConfirmationModal from './SellConfirmationModal.js';
import PlayerStatsModal from './PlayerStatsModal.js';
import { useI18n } from '../lib/i18n.js';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    React.createElement("button",
      {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        onClick: onChange,
        disabled: disabled,
        className: `${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`
      },
      React.createElement("span",
        {
          "aria-hidden": "true",
          className: `${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`
        }
      )
    )
  );
};

const PlayerCard = ({ player, onClick }) => {
    const { t, POSITION_NAMES } = useI18n();
    const elo = getEloFromSkill(player.skill);
    return (
        React.createElement("div",
            {
                onClick: () => onClick(player),
                className: `w-28 h-28 flex flex-col items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 text-center shadow-md bg-gray-800 text-white hover:bg-gray-700 hover:scale-105`
            },
            React.createElement("div", { className: "font-bold text-sm w-full text-center break-words" }, player.name),
            React.createElement("div", { className: "text-xs text-gray-400" }, POSITION_NAMES[player.position]),
            React.createElement("div", { className: `font-mono font-bold text-lg my-1 flex items-center justify-center gap-1 ${elo.color}` }, 
                React.createElement("span", { title: t(elo.nameKey) }, elo.icon),
                React.createElement("span", null, player.skill)
            ),
            React.createElement("div", { className: "text-xs text-yellow-400 w-full truncate" }, formatCurrency(player.salary), `/${t('league.round.prefix').toLowerCase()}`)
        )
    );
};


const Field = ({ starters, onCardClick }) => {
    const { t, POSITION_NAMES_PLURAL } = useI18n();

    const FieldZone = ({ position }) => {
        const playersInZone = starters.filter(p => p.position === position);
        return (
            React.createElement("div",
                {
                    className: "w-full bg-black/20 p-2 rounded-lg border-2 border-dashed border-white/20 min-h-[120px]"
                },
                React.createElement("h4", { className: "text-center text-sm font-bold text-white/70 mb-2 uppercase" }, POSITION_NAMES_PLURAL[position]),
                React.createElement("div", { className: "flex flex-wrap justify-center gap-2 items-center" },
                    playersInZone.map((p, idx) => (
                        React.createElement(PlayerCard, {
                            key: `${p.id}-${idx}`,
                            player: p,
                            onClick: onCardClick
                        })
                    ))
                )
            )
        );
    };

    return (
        React.createElement("div",
            {
                className: "bg-cover bg-center bg-no-repeat p-4 space-y-2 rounded-lg",
                style: { backgroundImage: "linear-gradient(rgba(22, 105, 52, 0.8), rgba(22, 105, 52, 0.8)), url('https://www.transparenttextures.com/patterns/grass.png')" }
            },
            React.createElement(FieldZone, { position: "ATA" }),
            React.createElement(FieldZone, { position: "MC" }),
            React.createElement(FieldZone, { position: "DEF" })
        )
    );
};

const SquadHub = ({ squad, onSquadChange, tactic, onTacticChange, allPlayers, onPlayerSale, playerStats, season, seasonHistory }) => {
    const { t, POSITION_NAMES } = useI18n();
    const [playerToView, setPlayerToView] = useState(null);
    const [playerToSell, setPlayerToSell] = useState(null);

    const handleToggleStarter = (player) => {
        const isCurrentlyStarter = squad.starters.some(p => p.id === player.id);

        if (isCurrentlyStarter) {
            // Remove from starters
            const newStarters = squad.starters.filter(p => p.id !== player.id);
            const newBench = [...squad.bench];
            const newReserves = [...squad.reserves];

            if (newBench.length < BENCH_LIMIT) {
                newBench.push(player);
            } else {
                newReserves.push(player);
            }
            onSquadChange({ starters: newStarters, bench: newBench, reserves: newReserves });

        } else {
            // Add to starters
            if (squad.starters.length >= 4) {
                alert("Time titular cheio (4 jogadores). Remova um jogador para adicionar outro.");
                return;
            }
            const newStarters = [...squad.starters, player];
            const newBench = squad.bench.filter(p => p.id !== player.id);
            const newReserves = squad.reserves.filter(p => p.id !== player.id);
            onSquadChange({ starters: newStarters, bench: newBench, reserves: newReserves });
        }
    };

    const handleConfirmSale = () => {
        if (playerToSell) {
            onPlayerSale(playerToSell);
            setPlayerToSell(null);
        }
    };
    
    const sortedAllPlayers = useMemo(() => 
        [...allPlayers].sort((a,b) => {
            const posOrder = { GO: 0, DEF: 1, MC: 2, ATA: 3 };
            if (posOrder[a.position] !== posOrder[b.position]) {
                return posOrder[a.position] - posOrder[b.position];
            }
            return b.skill - a.skill;
        }), 
    [allPlayers]);
    
    const translatedTacticStyles = {
        'Equilibrado': t('tactic.balanced'),
        'Contra-Ataque': t('tactic.counter'),
        'Ofensivo': t('tactic.offensive'),
        'Defensivo': t('tactic.defensive')
    };

    return (
        React.createElement("div", { className: "space-y-8" },
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" },
                React.createElement("div", { className: "bg-gray-800 p-6 rounded-lg shadow-lg" },
                    React.createElement("h2", { className: "text-xl font-semibold mb-4" }, t('squad.game_style')),
                    React.createElement("select",
                        {
                            value: tactic.style,
                            onChange: e => onTacticChange({ style: e.target.value }),
                            className: "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        },
                        TACTIC_STYLES.map(s => React.createElement("option", { key: s, value: s }, translatedTacticStyles[s]))
                    )
                ),
                React.createElement("div", { className: "bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center" },
                    React.createElement("h2", { className: "text-xl font-semibold mb-2" }, t('squad.starters')),
                    React.createElement("div", { className: "flex justify-between items-center text-2xl font-bold" },
                        React.createElement("span", null, t('squad.total'), ":"),
                        React.createElement("span", { className: `${squad.starters.length === 4 ? 'text-green-400' : 'text-red-400'}` },
                            squad.starters.length, " / 4"
                        )
                    ),
                    squad.starters.length !== 4 && React.createElement("p", { className: "text-xs text-yellow-400 mt-2" }, t('squad.starters_warning'))
                )
            ),

            React.createElement("div", { className: "bg-gray-800 p-6 rounded-lg shadow-lg" },
                React.createElement("h2", { className: "text-xl font-semibold mb-4 text-center" }, t('squad.formation_view')),
                React.createElement(Field, {
                    starters: squad.starters,
                    onCardClick: setPlayerToView
                })
            ),

            React.createElement("div", { className: "bg-gray-800 p-6 rounded-lg shadow-lg" },
                React.createElement("h2", { className: "text-xl font-semibold mb-4" }, t('squad.manage_squad')),
                React.createElement("div", { className: "space-y-2 max-h-96 overflow-y-auto pr-2" },
                    sortedAllPlayers.map((player, idx) => {
                        const isStarter = squad.starters.some(p => p.id === player.id);
                        const isDisabled = !isStarter && squad.starters.length >= 4;
                        const elo = getEloFromSkill(player.skill);

                        return (
                            React.createElement("div", { key: `${player.id}-${idx}`, className: `flex items-center justify-between p-3 rounded-md transition-colors ${isStarter ? 'bg-blue-900/50' : 'bg-gray-900'}` },
                                React.createElement("div", { onClick: () => setPlayerToView(player), className: "flex-grow cursor-pointer pr-4 flex items-center space-x-3" },
                                    React.createElement("span", { className: `text-xl ${elo.color}`, title: t(elo.nameKey) }, elo.icon),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-bold" }, player.name),
                                        React.createElement("p", { className: "text-sm text-gray-400" }, POSITION_NAMES[player.position], " - ", t('setup.skill_abbr'), ". ", player.skill)
                                    )
                                ),
                                React.createElement("div", { className: "flex items-center space-x-3 flex-shrink-0" },
                                    React.createElement("label", { htmlFor: `starter-toggle-${player.id}`, className: `text-sm font-medium transition-colors ${isDisabled ? 'text-gray-500' : 'text-gray-300'}` },
                                        t('squad.is_starter')
                                    ),
                                    React.createElement(ToggleSwitch, {
                                        checked: isStarter,
                                        onChange: () => handleToggleStarter(player),
                                        disabled: isDisabled
                                    })
                                )
                            )
                        );
                    })
                )
            ),
            
            playerToView && (
                React.createElement(PlayerStatsModal, {
                    player: playerToView,
                    playerStats: playerStats.find(p => p.playerId === playerToView.id),
                    season: season,
                    seasonHistory: seasonHistory,
                    onClose: () => setPlayerToView(null),
                    currentSquadSize: allPlayers.length,
                    onSell: (playerForSale) => {
                        setPlayerToView(null);
                        setPlayerToSell(playerForSale);
                    }
                })
            ),

            playerToSell && (
                React.createElement(SellConfirmationModal, {
                    player: playerToSell,
                    onClose: () => setPlayerToSell(null),
                    onConfirm: handleConfirmSale
                })
            )
        )
    );
};

export default SquadHub;