export const UPDATE_NOTES = {
    'pt-BR': {
        release_prefix: "Lançado em:",
        notes: [
             {
                version: "1.3.0",
                title: "Expansão de Ligas e Terminal de Comandos!",
                date: "21 de Março de 2026",
                sections: [
                    {
                        title: "✨ Novidades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Novas Ligas de Elite:</strong> Introduzidas as ligas USL (Ultimatte SoccerLeague), CSL (Copa SoccerLeague) e ASL (Alternatte SoccerLeague) com critérios de classificação dinâmicos baseados no desempenho das ligas principais.",
                            "<strong>Terminal de Comandos:</strong> Adicionado um terminal administrativo para execução de comandos especiais, códigos promocionais e acesso a funções de desenvolvedor.",
                            "<strong>Sistema de Empréstimos Corrigido:</strong> O módulo de finanças foi totalmente revisado e a opção de pegar empréstimos agora está 100% funcional."
                        ]
                    },
                    {
                        title: "🚀 Melhorias",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Progressão de Torneios:</strong> Melhorada a lógica de avanço de fases em competições de mata-mata, garantindo que os vencedores avancem corretamente até a final.",
                            "<strong>Códigos Promocionais:</strong> Novos códigos de eventos (Páscoa, Natal, Ano Novo) agora podem ser resgatados via terminal para bônus financeiros."
                        ]
                    }
                ]
            },
             {
                version: "1.2.1",
                title: "Correções de Fim de Temporada",
                date: "27 de Julho de 2024",
                sections: [
                    {
                        title: "🐛 Correções",
                        colorClass: "text-red-400",
                        notes: [
                            "Corrigido um bug crítico que fazia com que o salário e o valor dos jogadores se tornassem 'NaN' (inválido) após a primeira temporada devido a um erro no cálculo de progressão.",
                            "Resolvido um problema onde a habilidade ('over') atualizada dos jogadores no final da temporada não era exibida corretamente na visualização do campo na tela de Elenco, exigindo que o jogador fosse removido e adicionado novamente."
                        ]
                    }
                ]
            },
             {
                version: "1.2.0",
                title: "Expansão Global & Emoção em Campo!",
                date: "26 de Julho de 2024",
                sections: [
                    {
                        title: "✨ Novidades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Simulador de Partidas Interativo:</strong> Assista aos jogos do seu time em tempo real! A nova tela de simulação mostra os eventos da partida lance a lance, permite substituições no intervalo e termina com um relatório pós-jogo detalhado.",
                            "<strong>Suporte a Múltiplos Idiomas:</strong> O jogo agora está disponível em Português (Brasil e Portugal), Inglês (EUA e Reino Unido) e Espanhol (Espanha e América Latina)! Use o novo seletor de idiomas para escolher sua preferência."
                        ]
                    },
                    {
                        title: "🚀 Melhorias",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Animação de Gol:</strong> Comemore com estilo! Agora, cada gol é celebrado com uma animação visual vibrante na tela da partida.",
                            "<strong>Avanço Rápido para Fim de Temporada:</strong> Adicionado um botão para simular rapidamente todos os jogos restantes da temporada.",
                            "<strong>Simulação Otimizada:</strong> O tempo de espera para a simulação de partidas foi drasticamente reduzido para uma experiência mais ágil.",
                            "<strong>Mensagens de Carregamento Dinâmicas:</strong> Enquanto a partida é simulada, mensagens mais imersivas e variadas são exibidas."
                        ]
                    },
                    {
                        title: "🐛 Correções",
                        colorClass: "text-red-400",
                        notes: [
                            "<strong>Lógica de Transferências Corrigida:</strong> Resolvido um bug crítico onde as estatísticas (como gols) de um jogador transferido eram contadas para o time antigo e o novo. Agora, as estatísticas são atribuídas corretamente ao time atual do jogador.",
                            "<strong>Consistência dos Dados da Tabela:</strong> Corrigido um problema onde a tabela de classificação e a tela \"Inspecionar Times\" não refletiam as mudanças no elenco (composição do time e habilidade média) após uma compra ou venda, garantindo que os dados do jogo estejam sempre sincronizados."
                        ]
                    },
                    {
                        title: "📋 Conteúdo",
                        colorClass: "text-blue-400",
                        notes: [
                            "<strong>Grande Reestruturação das Ligas:</strong> Realizada uma grande atualização nos times e ligas, incluindo \"Celtic\" renomeado para \"Canamerica Villa\", \"Liontári\" para \"Atlas FC\", adição dos novos times \"Katze\" e \"União Redterno\", promoção da \"Chapecoense\" para a ISL e dezenas de movimentações de jogadores para atualizar os elencos."
                        ]
                    }
                ]
            },
            {
                version: "1.1.0",
                title: "A Reforma Financeira",
                date: "24 de Julho de 2024",
                sections: [
                    {
                        title: "✨ Novidades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Módulo de Finanças:</strong> Uma nova aba \"Finanças\" foi adicionada ao painel. Agora você pode gerenciar o orçamento do seu time de forma mais detalhada e até mesmo pegar empréstimos para salvar o clube de uma crise ou fazer aquela contratação dos sonhos!",
                            "<strong>Salários e Custos:</strong> Jogadores agora têm salários, que são deduzidos do seu orçamento a cada rodada de liga. Vencer partidas também gera receita para o clube."
                        ]
                    },
                    {
                        title: "🚀 Melhorias",
                        colorClass: "text-yellow-400",
                        notes: [
                            "A interface de gerenciamento de elenco foi redesenhada para ser mais intuitiva.",
                            "Ajustes na simulação de partidas para refletir melhor o impacto da habilidade dos jogadores e das táticas.",
                            "O modal de fim de temporada foi reestilizado para apresentar as informações de forma mais clara e empolgante."
                        ]
                    },
                    {
                        title: "🐛 Correções",
                        colorClass: "text-red-400",
                        notes: [
                            "Corrigido um bug onde o histórico da temporada não era exibido corretamente no Hall da Fama.",
                            "Melhorias de performance geral na navegação entre as telas do painel."
                        ]
                    }
                ]
            }
        ]
    },
    'pt-PT': {
        release_prefix: "Lançado em:",
        notes: [
            {
                version: "1.2.1",
                title: "Correções de Fim de Época",
                date: "27 de Julho de 2024",
                sections: [
                    {
                        title: "🐛 Correções",
                        colorClass: "text-red-400",
                        notes: [
                            "Corrigido um erro crítico que fazia com que o salário e o valor dos jogadores se tornassem 'NaN' (inválido) após a primeira época devido a um erro no cálculo de progressão.",
                            "Resolvido um problema onde a habilidade ('over') atualizada dos jogadores no final da época não era exibida corretamente na visualização do campo no ecrã do Plantel, exigindo que o jogador fosse removido e adicionado novamente."
                        ]
                    }
                ]
            },
            {
                version: "1.2.0",
                title: "Expansão Global & Emoção em Campo!",
                date: "26 de Julho de 2024",
                sections: [
                    {
                        title: "✨ Novidades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Simulador de Jogos Interativo:</strong> Assista aos jogos da sua equipa em tempo real! O novo ecrã de simulação mostra os eventos do jogo lance a lance, permite substituições ao intervalo e termina com um relatório detalhado pós-jogo.",
                            "<strong>Suporte a Múltiplos Idiomas:</strong> O jogo está agora disponível em Português (Portugal e Brasil), Inglês (Reino Unido e EUA) e Espanhol (Espanha e América Latina)! Use o novo seletor de idiomas para escolher a sua preferência."
                        ]
                    },
                    {
                        title: "🚀 Melhorias",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Animação de Golo:</strong> Comemore com estilo! Agora, cada golo é celebrado com uma animação visual vibrante no ecrã do jogo.",
                            "<strong>Avanço Rápido para Fim de Época:</strong> Adicionado um botão para simular rapidamente todos os jogos restantes da época.",
                            "<strong>Simulação Otimizada:</strong> O tempo de espera para a simulação de jogos foi drasticamente reduzido para uma experiência mais ágil.",
                            "<strong>Mensagens de Carregamento Dinâmicas:</strong> Enquanto o jogo é simulado, são exibidas mensagens mais imersivas e variadas."
                        ]
                    },
                    {
                        title: "🐛 Correções",
                        colorClass: "text-red-400",
                        notes: [
                            "<strong>Lógica de Transferências Corrigida:</strong> Resolvido um erro crítico onde as estatísticas (como golos) de um jogador transferido eram contadas para a equipa antiga e a nova. Agora, as estatísticas são atribuídas corretamente à equipa atual do jogador.",
                            "<strong>Consistência dos Dados da Tabela:</strong> Corrigido um problema onde a tabela classificativa e o ecrã \"Inspecionar Equipas\" não refletiam as mudanças no plantel (composição da equipa e habilidade média) após uma compra ou venda, garantindo que os dados do jogo estejam sempre sincronizados."
                        ]
                    },
                    {
                        title: "📋 Conteúdo",
                        colorClass: "text-blue-400",
                        notes: [
                            "<strong>Grande Reestruturação das Ligas:</strong> Realizada uma grande atualização nas equipas e ligas, incluindo a renomeação de \"Celtic\" para \"Canamerica Villa\" e \"Liontári\" para \"Atlas FC\", a adição das novas equipas \"Katze\" e \"União Redterno\", a promoção da \"Chapecoense\" para a ISL e dezenas de movimentações de jogadores para atualizar os planteis."
                        ]
                    }
                ]
            },
            {
                version: "1.1.0",
                title: "A Reforma Financeira",
                date: "24 de Julho de 2024",
                sections: [
                    {
                        title: "✨ Novidades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Módulo de Finanças:</strong> Um novo separador \"Finanças\" foi adicionado ao painel. Agora pode gerir o orçamento da sua equipa de forma mais detalhada e até mesmo pedir empréstimos para salvar o clube de uma crise ou fazer aquela contratação de sonho!",
                            "<strong>Salários e Custos:</strong> Os jogadores agora têm salários, que são deduzidos do seu orçamento a cada jornada da liga. Vencer jogos também gera receita para o clube."
                        ]
                    },
                    {
                        title: "🚀 Melhorias",
                        colorClass: "text-yellow-400",
                        notes: [
                            "A interface de gestão do plantel foi redesenhada para ser mais intuitiva.",
                            "Ajustes na simulação de jogos para refletir melhor o impacto da habilidade dos jogadores e das táticas.",
                            "O modal de fim de época foi reestilizado para apresentar as informações de forma mais clara e empolgante."
                        ]
                    },
                    {
                        title: "🐛 Correções",
                        colorClass: "text-red-400",
                        notes: [
                            "Corrigido um erro onde o histórico da época não era exibido corretamente na Galeria de Troféus.",
                            "Melhorias de desempenho geral na navegação entre os ecrãs do painel."
                        ]
                    }
                ]
            }
        ]
    },
    'en-US': {
        release_prefix: "Released on:",
        notes: [
            {
                version: "1.2.1",
                title: "End of Season Fixes",
                date: "July 27, 2024",
                sections: [
                    {
                        title: "🐛 Fixes",
                        colorClass: "text-red-400",
                        notes: [
                            "Fixed a critical bug that caused player salary and value to become 'NaN' (invalid) after the first season due to a progression calculation error.",
                            "Resolved an issue where players' updated skill ('over') at the end of the season was not correctly displayed in the field view on the Squad screen, requiring the player to be removed and re-added."
                        ]
                    }
                ]
            },
            {
                version: "1.2.0",
                title: "Global Expansion & On-Pitch Excitement!",
                date: "July 26, 2024",
                sections: [
                    {
                        title: "✨ New Features",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Interactive Match Simulator:</strong> Watch your team's games in real-time! The new simulation screen shows match events play-by-play, allows for halftime substitutions, and ends with a detailed post-match report.",
                            "<strong>Multi-Language Support:</strong> The game is now available in English (US & UK), Portuguese (Brazil & Portugal), and Spanish (Spain & Latin America)! Use the new language switcher to choose your preference."
                        ]
                    },
                    {
                        title: "🚀 Improvements",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Goal Animation:</strong> Celebrate in style! Every goal is now celebrated with a vibrant visual animation on the match screen.",
                            "<strong>Fast Forward to End of Season:</strong> Added a button to quickly simulate all remaining games in the season.",
                            "<strong>Optimized Simulation:</strong> The waiting time for match simulations has been drastically reduced for a more agile experience.",
                            "<strong>Dynamic Loading Messages:</strong> While the match is simulated, more immersive and varied messages are displayed."
                        ]
                    },
                    {
                        title: "🐛 Fixes",
                        colorClass: "text-red-400",
                        notes: [
                            "<strong>Transfer Logic Corrected:</strong> Fixed a critical bug where a transferred player's stats (like goals) were counted for both the old and new team. Stats are now correctly attributed to the player's current team.",
                            "<strong>Table Data Consistency:</strong> Fixed an issue where the league table and \"Inspect Teams\" screen did not reflect roster changes (team composition and average skill) after a purchase or sale, ensuring game data is always synchronized."
                        ]
                    },
                    {
                        title: "📋 Content",
                        colorClass: "text-blue-400",
                        notes: [
                            "<strong>Major League Overhaul:</strong> A major update to teams and leagues was performed, including renaming \"Celtic\" to \"Canamerica Villa\" and \"Liontári\" to \"Atlas FC\", adding new teams \"Katze\" and \"União Redterno\", promoting \"Chapecoense\" to the ISL, and dozens of player movements to update rosters."
                        ]
                    }
                ]
            },
            {
                version: "1.1.0",
                title: "The Financial Overhaul",
                date: "July 24, 2024",
                sections: [
                    {
                        title: "✨ New Features",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Finances Module:</strong> A new \"Finances\" tab has been added to the dashboard. You can now manage your team's budget in more detail and even take out loans to save the club from a crisis or make that dream signing!",
                            "<strong>Salaries and Costs:</strong> Players now have salaries, which are deducted from your budget each league round. Winning matches also generates revenue for the club."
                        ]
                    },
                    {
                        title: "🚀 Improvements",
                        colorClass: "text-yellow-400",
                        notes: [
                            "The squad management interface has been redesigned to be more intuitive.",
                            "Adjustments to the match simulation to better reflect the impact of player skill and tactics.",
                            "The end-of-season modal has been restyled to present information more clearly and excitingly."
                        ]
                    },
                    {
                        title: "🐛 Fixes",
                        colorClass: "text-red-400",
                        notes: [
                            "Fixed a bug where the season history was not displayed correctly in the Hall of Fame.",
                            "General performance improvements when navigating between dashboard screens."
                        ]
                    }
                ]
            }
        ]
    },
    'en-UK': {
        release_prefix: "Released on:",
        notes: [
            {
                version: "1.2.1",
                title: "End of Season Fixes",
                date: "27 July 2024",
                sections: [
                    {
                        title: "🐛 Fixes",
                        colorClass: "text-red-400",
                        notes: [
                            "Fixed a critical bug that caused player salary and value to become 'NaN' (invalid) after the first season due to a progression calculation error.",
                            "Resolved an issue where players' updated skill ('over') at the end of the season was not correctly displayed in the field view on the Squad screen, requiring the player to be removed and re-added."
                        ]
                    }
                ]
            },
            {
                version: "1.2.0",
                title: "Global Expansion & On-Pitch Excitement!",
                date: "26 July 2024",
                sections: [
                    {
                        title: "✨ New Features",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Interactive Match Simulator:</strong> Watch your team's matches in real-time! The new simulation screen shows match events play-by-play, allows for half-time substitutions, and ends with a detailed post-match report.",
                            "<strong>Multi-Language Support:</strong> The game is now available in English (UK & US), Portuguese (Portugal & Brazil), and Spanish (Spain & Latin America)! Use the new language switcher to choose your preference."
                        ]
                    },
                    {
                        title: "🚀 Improvements",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Goal Animation:</strong> Celebrate in style! Every goal is now celebrated with a vibrant visual animation on the match screen.",
                            "<strong>Fast Forward to End of Season:</strong> Added a button to quickly simulate all remaining games in the season.",
                            "<strong>Optimised Simulation:</strong> The waiting time for match simulations has been drastically reduced for a more agile experience.",
                            "<strong>Dynamic Loading Messages:</strong> Whilst the match is simulated, more immersive and varied messages are displayed."
                        ]
                    },
                    {
                        title: "🐛 Fixes",
                        colorClass: "text-red-400",
                        notes: [
                            "<strong>Transfer Logic Corrected:</strong> Fixed a critical bug where a transferred player's stats (like goals) were counted for both the old and new team. Stats are now correctly attributed to the player's current team.",
                            "<strong>Table Data Consistency:</strong> Fixed an issue where the league table and \"Inspect Teams\" screen did not reflect roster changes (team composition and average skill) after a purchase or sale, ensuring game data is always synchronised."
                        ]
                    },
                    {
                        title: "📋 Content",
                        colorClass: "text-blue-400",
                        notes: [
                            "<strong>Major League Overhaul:</strong> A major update to teams and leagues was performed, including renaming \"Celtic\" to \"Canamerica Villa\" and \"Liontári\" to \"Atlas FC\", adding new teams \"Katze\" and \"União Redterno\", promoting \"Chapecoense\" to the ISL, and dozens of player movements to update rosters."
                        ]
                    }
                ]
            },
            {
                version: "1.1.0",
                title: "The Financial Overhaul",
                date: "24 July 2024",
                sections: [
                    {
                        title: "✨ New Features",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Finances Module:</strong> A new \"Finances\" tab has been added to the dashboard. You can now manage your team's budget in more detail and even take out loans to save the club from a crisis or make that dream signing!",
                            "<strong>Salaries and Costs:</strong> Players now have salaries, which are deducted from your budget each league round. Winning matches also generates revenue for the club."
                        ]
                    },
                    {
                        title: "🚀 Improvements",
                        colorClass: "text-yellow-400",
                        notes: [
                            "The squad management interface has been redesigned to be more intuitive.",
                            "Adjustments to the match simulation to better reflect the impact of player skill and tactics.",
                            "The end-of-season modal has been restyled to present information more clearly and excitingly."
                        ]
                    },
                    {
                        title: "🐛 Fixes",
                        colorClass: "text-red-400",
                        notes: [
                            "Fixed a bug where the season history was not displayed correctly in the Hall of Fame.",
                            "General performance improvements when navigating between dashboard screens."
                        ]
                    }
                ]
            }
        ]
    },
    'es-ES': {
        release_prefix: "Publicado el:",
        notes: [
            {
                version: "1.2.1",
                title: "Correcciones de Fin de Temporada",
                date: "27 de Julio de 2024",
                sections: [
                    {
                        title: "🐛 Correcciones",
                        colorClass: "text-red-400",
                        notes: [
                            "Corregido un error crítico que provocaba que el salario y el valor de los jugadores se convirtieran en 'NaN' (no es un número) después de la primera temporada debido a un error en el cálculo de progresión.",
                            "Solucionado un problema por el que la habilidad ('media') actualizada de los jugadores al final de la temporada no se mostraba correctamente en la vista del campo en la pantalla de Plantilla, requiriendo que el jugador fuera eliminado y añadido de nuevo."
                        ]
                    }
                ]
            },
            {
                version: "1.2.0",
                title: "¡Expansión Global y Emoción en el Campo!",
                date: "26 de Julio de 2024",
                sections: [
                    {
                        title: "✨ Novedades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Simulador de Partidos Interactivo:</strong> ¡Mira los partidos de tu equipo en tiempo real! La nueva pantalla de simulación muestra los eventos del partido jugada a jugada, permite sustituciones en el descanso y finaliza con un informe detallado post-partido.",
                            "<strong>Soporte Multilingüe:</strong> ¡El juego ya está disponible en Español (España y Latinoamérica), Portugués (Portugal y Brasil) e Inglés (Reino Unido y EE.UU.)! Usa el nuevo selector de idioma para elegir tu preferencia."
                        ]
                    },
                    {
                        title: "🚀 Mejoras",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Animación de Gol:</strong> ¡Celébralo con estilo! Ahora, cada gol se celebra con una vibrante animación visual en la pantalla del partido.",
                            "<strong>Avance Rápido a Fin de Temporada:</strong> Añadido un botón para simular rápidamente todos los partidos restantes de la temporada.",
                            "<strong>Simulación Optimizada:</strong> El tiempo de espera para las simulaciones de partidos se ha reducido drásticamente para una experiencia más ágil.",
                            "<strong>Mensajes de Carga Dinámicos:</strong> Mientras se simula el partido, se muestran mensajes más inmersivos y variados."
                        ]
                    },
                    {
                        title: "🐛 Correcciones",
                        colorClass: "text-red-400",
                        notes: [
                            "<strong>Lógica de Fichajes Corregida:</strong> Solucionado un error crítico donde las estadísticas (como goles) de un jugador traspasado se contaban para el equipo antiguo y el nuevo. Ahora, las estadísticas se atribuyen correctamente al equipo actual del jugador.",
                            "<strong>Consistencia de Datos en la Tabla:</strong> Corregido un problema donde la tabla de clasificación y la pantalla \"Inspeccionar Equipos\" no reflejaban los cambios en la plantilla (composición del equipo y habilidad media) después de una compra o venta, garantizando que los datos del juego estén siempre sincronizados."
                        ]
                    },
                    {
                        title: "📋 Contenido",
                        colorClass: "text-blue-400",
                        notes: [
                            "<strong>Gran Reestructuración de Ligas:</strong> Realizada una gran actualización en los equipos y ligas, incluyendo el cambio de nombre de \"Celtic\" a \"Canamerica Villa\" y \"Liontári\" a \"Atlas FC\", la adición de los nuevos equipos \"Katze\" y \"União Redterno\", el ascenso de \"Chapecoense\" a la ISL y docenas de movimientos de jugadores para actualizar las plantillas."
                        ]
                    }
                ]
            },
            {
                version: "1.1.0",
                title: "La Reforma Financiera",
                date: "24 de Julio de 2024",
                sections: [
                    {
                        title: "✨ Novedades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Módulo de Finanzas:</strong> Se ha añadido una nueva pestaña de \"Finanzas\" al panel. ¡Ahora puedes gestionar el presupuesto de tu equipo con más detalle e incluso pedir préstamos para salvar al club de una crisis o hacer ese fichaje soñado!",
                            "<strong>Salarios y Costes:</strong> Los jugadores ahora tienen salarios, que se deducen de tu presupuesto en cada jornada de liga. Ganar partidos también genera ingresos para el club."
                        ]
                    },
                    {
                        title: "🚀 Mejoras",
                        colorClass: "text-yellow-400",
                        notes: [
                            "La interfaz de gestión de la plantilla ha sido rediseñada para ser más intuitiva.",
                            "Ajustes en la simulación de partidos para reflejar mejor el impacto de la habilidad de los jugadores y las tácticas.",
                            "El modal de fin de temporada ha sido rediseñado para presentar la información de forma más clara y emocionante."
                        ]
                    },
                    {
                        title: "🐛 Correcciones",
                        colorClass: "text-red-400",
                        notes: [
                            "Corregido un error por el que el historial de la temporada no se mostraba correctamente en el Salón de la Fama.",
                            "Mejoras generales de rendimiento al navegar entre las pantallas del panel."
                        ]
                    }
                ]
            }
        ]
    },
    'es-LA': {
        release_prefix: "Publicado el:",
        notes: [
            {
                version: "1.2.1",
                title: "Correcciones de Fin de Temporada",
                date: "27 de Julio de 2024",
                sections: [
                    {
                        title: "🐛 Correcciones",
                        colorClass: "text-red-400",
                        notes: [
                            "Corregido un bug crítico que provocaba que el salario y el valor de los jugadores se convirtieran en 'NaN' (inválido) después de la primera temporada debido a un error en el cálculo de progresión.",
                            "Resuelto un problema donde la habilidad ('overall') actualizada de los jugadores al final de la temporada no se mostraba correctamente en la vista de la cancha en la pantalla de Plantel, requiriendo que el jugador fuera removido y agregado nuevamente."
                        ]
                    }
                ]
            },
            {
                version: "1.2.0",
                title: "¡Expansión Global y Emoción en la Cancha!",
                date: "26 de Julio de 2024",
                sections: [
                    {
                        title: "✨ Novedades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Simulador de Partidos Interactivo:</strong> ¡Mirá los partidos de tu equipo en tiempo real! La nueva pantalla de simulación muestra los eventos del partido jugada a jugada, permite cambios en el entretiempo y finaliza con un reporte detallado post-partido.",
                            "<strong>Soporte Multilingüe:</strong> ¡El juego ahora está disponible en Español (Latinoamérica y España), Portugués (Brasil y Portugal) e Inglés (EE.UU. y Reino Unido)! Usá el nuevo selector de idioma para elegir tu preferencia."
                        ]
                    },
                    {
                        title: "🚀 Mejoras",
                        colorClass: "text-yellow-400",
                        notes: [
                            "<strong>Animación de Gol:</strong> ¡Celébralo con estilo! Ahora, cada gol se festeja con una vibrante animación visual en la pantalla del partido.",
                            "<strong>Avance Rápido a Fin de Temporada:</strong> Agregado un botón para simular rápidamente todos los partidos restantes de la temporada.",
                            "<strong>Simulación Optimizada:</strong> El tiempo de espera para las simulaciones de partidos se ha reducido drásticamente para una experiencia más ágil.",
                            "<strong>Mensajes de Carga Dinámicos:</strong> Mientras se simula el partido, se muestran mensajes más inmersivos y variados."
                        ]
                    },
                    {
                        title: "🐛 Correcciones",
                        colorClass: "text-red-400",
                        notes: [
                            "<strong>Lógica de Pases Corregida:</strong> Solucionado un error crítico donde las estadísticas (como goles) de un jugador transferido se contaban para el equipo antiguo y el nuevo. Ahora, las estadísticas se atribuyen correctamente al equipo actual del jugador.",
                            "<strong>Consistencia de Datos en la Tabla:</strong> Corregido un problema donde la tabla de posiciones y la pantalla \"Inspeccionar Equipos\" no reflejaban los cambios en el plantel (composición del equipo y habilidad promedio) después de una compra o venta, garantizando que los datos del juego estén siempre sincronizados."
                        ]
                    },
                    {
                        title: "📋 Contenido",
                        colorClass: "text-blue-400",
                        notes: [
                            "<strong>Gran Reestructuración de Ligas:</strong> Realizada una gran actualización en los equipos y ligas, incluyendo el cambio de nombre de \"Celtic\" a \"Canamerica Villa\" y \"Liontári\" a \"Atlas FC\", la adición de los nuevos equipos \"Katze\" y \"União Redterno\", el ascenso de \"Chapecoense\" a la ISL y docenas de movimientos de jugadores para actualizar los planteles."
                        ]
                    }
                ]
            },
            {
                version: "1.1.0",
                title: "La Reforma Financiera",
                date: "24 de Julio de 2024",
                sections: [
                    {
                        title: "✨ Novedades",
                        colorClass: "text-green-400",
                        notes: [
                            "<strong>Módulo de Finanzas:</strong> Se ha añadido una nueva pestaña de \"Finanzas\" al panel. ¡Ahora puedes gestionar el presupuesto de tu equipo con más detalle e incluso pedir préstamos para salvar al club de una crisis o hacer ese fichaje soñado!",
                            "<strong>Salarios y Costos:</strong> Los jugadores ahora tienen salarios, que se deducen de tu presupuesto en cada fecha de liga. Ganar partidos también genera ingresos para el club."
                        ]
                    },
                    {
                        title: "🚀 Mejoras",
                        colorClass: "text-yellow-400",
                        notes: [
                            "La interfaz de gestión del plantel ha sido rediseñada para ser más intuitiva.",
                            "Ajustes en la simulación de partidos para reflejar mejor el impacto de la habilidad de los jugadores y las tácticas.",
                            "El modal de fin de temporada ha sido rediseñado para presentar la información de forma más clara y emocionante."
                        ]
                    },
                    {
                        title: "🐛 Correcciones",
                        colorClass: "text-red-400",
                        notes: [
                            "Corregido un error por el que el historial de la temporada no se mostraba correctamente en el Salón de la Fama.",
                            "Mejoras generales de rendimiento al navegar entre las pantallas del panel."
                        ]
                    }
                ]
            }
        ]
    }
};