
import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, CommandLineIcon } from './icons/Icons.jsx';

const CommandTerminal = ({ isOpen, onClose, onExecuteCommand }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'system', text: 'Soccer League Simulator Terminal v1.0' },
        { type: 'system', text: 'Digite "help" para ver os comandos disponíveis.' }
    ]);
    const inputRef = useRef(null);
    const historyRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            if (!cmd) return;

            if (cmd.toLowerCase() === 'clear') {
                setHistory([]);
                setInput('');
                return;
            }

            setHistory(prev => [...prev, { type: 'user', text: `> ${cmd}` }]);
            
            const result = onExecuteCommand(cmd);
            if (result) {
                setHistory(prev => [...prev, { type: 'system', text: result }]);
            }

            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-mono" },
            React.createElement("div", { className: "bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col h-[500px]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-xl" },
                    React.createElement("div", { className: "flex items-center space-x-2" },
                        React.createElement(CommandLineIcon, { className: "w-5 h-5 text-green-500" }),
                        React.createElement("span", { className: "text-green-500 font-bold" }, "TERMINAL DE COMANDOS")
                    ),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                
                React.createElement("div", { 
                    ref: historyRef,
                    className: "flex-1 p-4 overflow-y-auto space-y-2 text-sm no-scrollbar" 
                },
                    history.map((item, i) => (
                        React.createElement("div", { key: i, className: item.type === 'user' ? 'text-white' : 'text-green-400' }, item.text)
                    ))
                ),

                React.createElement("div", { className: "p-4 border-t border-gray-700 bg-gray-800 rounded-b-xl" },
                    React.createElement("div", { className: "flex items-center space-x-2" },
                        React.createElement("span", { className: "text-green-500" }, ">"),
                        React.createElement("input", {
                            ref: inputRef,
                            type: "text",
                            value: input,
                            onChange: (e) => setInput(e.target.value),
                            onKeyDown: handleCommand,
                            className: "flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600",
                            placeholder: "Digite um comando..."
                        })
                    )
                )
            )
        )
    );
};

export default CommandTerminal;
