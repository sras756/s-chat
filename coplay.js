import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { UI } from "./ui.js";

export const GameEngine = {
    activePath: null,
    listenerRef: null,
    userProfile: null,

    setSessionParameters(path, user) {
        this.activePath = `games/${path}`;
        this.userProfile = user;
    },

    initializeGame(type) {
        if (!this.activePath) return UI.showToast("Please enter a specific target user chat room thread directory route node first.", "error");
        
        if (type === 'tic-tac-toe') {
            const initialPayload = {
                type: 'tic-tac-toe',
                board: ["", "", "", "", "", "", "", "", ""],
                currentTurn: this.userProfile.uid,
                winner: ""
            };
            set(ref(db, this.activePath), initialPayload);
        } else if (type === 'canvas') {
            const initialPayload = {
                type: 'canvas',
                drawingVector: ""
            };
            set(ref(db, this.activePath), initialPayload);
        }
    },

    attachGameEngineListener() {
        const viewport = document.getElementById('game-workspace-render');
        if (this.listenerRef) return;

        onValue(ref(db, this.activePath), (snapshot) => {
            const state = snapshot.val();
            if (!state) {
                viewport.innerHTML = `<div class="text-xs text-gray-500 text-center">No active real-time gaming thread initiated inside this room node layer. Launch one above!</div>`;
                return;
            }

            if (state.type === 'tic-tac-toe') {
                this.renderTicTacToeBoard(state, viewport);
            } else if (state.type === 'canvas') {
                this.renderCoDrawCanvas(state, viewport);
            }
        });
    },

    // Feature 3: Embedded Shared Co-Play Activity Board Renderer
    renderTicTacToeBoard(state, viewport) {
        viewport.innerHTML = `
            <div class="flex flex-col items-center gap-3 animate-fade-in">
                <div class="text-xs font-bold uppercase text-indigo-400 tracking-wider">Tic-Tac-Toe Session</div>
                <div class="grid grid-cols-3 gap-1 bg-gray-800 p-2 rounded-xl">
                    ${state.board.map((cell, idx) => `<div class="ttt-cell" onclick="window.app.handleTTTClick(${idx})">${cell}</div>`).join('')}
                </div>
                <div class="text-[10px] text-gray-400 font-mono">${state.winner ? `Winner resolved: ${state.winner}` : `Awaiting move stream vector...`}</div>
            </div>
        `;
    },

    // Feature 3: Collaborative canvas vector draw frame board logic handler
    renderCoDrawCanvas(state, viewport) {
        viewport.innerHTML = `
            <div class="flex flex-col items-center gap-2 w-full animate-fade-in">
                <div class="text-xs font-bold text-purple-400 uppercase tracking-widest">Co-Draw Synchronized Canvas</div>
                <canvas id="shared-canvas-matrix" width="260" height="200" class="bg-white border-2 border-gray-700 rounded-lg cursor-crosshair"></canvas>
                <button onclick="window.app.clearCanvasVector()" class="text-[10px] uppercase font-bold bg-gray-800 border px-3 py-1 rounded text-red-400 hover:bg-red-900/20">Wipe Coordinate Grid</button>
            </div>
        `;
        
        const canvas = document.getElementById('shared-canvas-matrix');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Repaint state vector values
        if (state.drawingVector) {
            const img = new Image();
            img.src = state.drawingVector;
            img.onload = () => ctx.drawImage(img, 0, 0);
        }

        let dynamicDrawing = false;
        canvas.onmousedown = () => { dynamicDrawing = true; };
        canvas.onmouseup = () => {
            dynamicDrawing = false;
            set(ref(db, `${this.activePath}/drawingVector`), canvas.toDataURL());
        };
        
        canvas.onmousemove = (e) => {
            if (!dynamicDrawing) return;
            const bounds = canvas.getBoundingClientRect();
            ctx.fillStyle = "#4f46e5";
            ctx.beginPath();
            ctx.arc(e.clientX - bounds.left, e.clientY - bounds.top, 3, 0, Math.PI * 2);
            ctx.fill();
        };
    },

    executeTicTacToeMove(index) {
        onValue(ref(db, this.activePath), (snapshot) => {
            const state = snapshot.val();
            if (!state || state.winner || state.board[index] !== "") return;
            
            state.board[index] = state.currentTurn === this.userProfile.uid ? "X" : "O";
            state.currentTurn = "opposite_stub_placeholder"; // Simplify rotation limits logic for structural demo
            
            // Assess standard winning evaluation matrix layout blocks
            const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for (let combination of wins) {
                if (state.board[combination[0]] && state.board[combination[0]] === state.board[combination[1]] && state.board[combination[0]] === state.board[combination[2]]) {
                    state.winner = this.userProfile.email.split('@')[0];
                }
            }
            set(ref(db, this.activePath), state);
        }, { onlyOnce: true });
    }
};
