export const UI = {
    currentMode: 'standard',

    showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const element = document.createElement('div');
        let style = 'bg-gray-800 border-gray-700 text-white';
        if (type === 'error') style = 'bg-red-900 border-red-700 text-white';
        if (type === 'success') style = 'bg-green-900 border-green-700 text-white';
        
        element.className = `px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-bold msg-enter flex items-center gap-2 ${style}`;
        element.innerHTML = `<i class="fas ${type==='error'?'fa-exclamation-triangle':'fa-info-circle'}"></i> <span>${msg}</span>`;
        container.appendChild(element);
        setTimeout(() => { element.remove(); }, 3500);
    },

    // Feature 1: Adaptive "Age-Wise" Interface Runtime Compiler
    applyUIMode(mode) {
        this.currentMode = mode;
        const body = document.getElementById('app-body');
        body.className = body.className.replace(/(senior-mode|kids-mode|compact-mode)/g, '').trim();
        if (mode !== 'standard') body.classList.add(`${mode-mode}-mode`);
        this.showToast(`Adaptive layout re-profiled into execution status: ${mode.toUpperCase()}`, 'success');
    },

    toggleAuth(show) {
        document.getElementById('auth-modal').classList.toggle('hidden', !show);
        document.getElementById('app-container').classList.toggle('hidden', show);
    },

    setProfileID(id) {
        document.getElementById('user-display-id').innerText = id;
    },

    updateMediaPreview(file) {
        const doc = document.getElementById('media-preview');
        if (file) {
            document.getElementById('preview-filename').innerText = file.name;
            doc.classList.remove('hidden');
        } else {
            doc.classList.add('hidden');
            document.getElementById('media-input').value = '';
        }
    },

    toggleToneModal(show) {
        document.getElementById('tone-modal').classList.toggle('hidden', !show);
    },

    // Feature 2: Explain this emoji dictionary dataset parser configuration lookup logic
    parseEmojiGlossaryHTML(text) {
        const dictionary = {
            "💀": "I'm dying of laughter (Modern Slang)",
            "😭": "Loud crying or intense overwhelmed emotion",
            "🔥": "Excellent, highly impressive or exciting",
            "🧢": "Cap / That statement is a fabrication or lie",
            "👻": "Ghosting / Vanishing abruptly without notice"
        };
        let output = text;
        Object.keys(dictionary).forEach(emoji => {
            if (output.includes(emoji)) {
                const replacement = `<span class="emoji-explain-target" title="Dictionary Translation: ${dictionary[emoji]}">${emoji}</span>`;
                output = output.split(emoji).join(replacement);
            }
        });
        return output;
    },

    // Feature 5: Accessible Speech Synthesis "Read Aloud" Engine
    triggerVoiceSynth(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.currentMode === 'senior' ? 0.8 : 1.0; // Automatically adjusts speech speed for seniors
            window.speechSynthesis.speak(utterance);
            this.showToast("Synthesizing oral channel read-back layout...", "info");
        } else {
            this.showToast("Speech Engine missing inside host system frame.", "error");
        }
    },

    renderContactDirectory(users, checkins, onSelect) {
        const list = document.getElementById('contact-list');
        list.innerHTML = `
            <div class="p-3 bg-indigo-600/20 border-l-4 border-indigo-500 rounded cursor-pointer mb-2 font-bold text-xs" onclick="window.app.routeChat('global', 'Global Nexus Room')">
                <i class="fas fa-globe mr-2"></i> # GLOBAL CHAT ROOM
            </div>
        `;
        
        users.forEach(user => {
            const lastSeenTime = checkins[user.uid] || Date.now();
            const daysUnseen = Math.floor((Date.now() - lastSeenTime) / (1000 * 60 * 60 * 24));
            
            // Feature 7: Scheduled "Check-in" Nudge visual warning badges
            let statusMarkup = `<span class="text-[10px] text-green-400 font-bold">Active</span>`;
            if (daysUnseen >= 3) {
                statusMarkup = `<span class="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded animate-pulse font-black">🔥 Nudge Target (${daysUnseen}d)</span>`;
            }

            const div = document.createElement('div');
            div.className = "p-3 hover:bg-gray-700/60 border border-gray-700/40 rounded-xl cursor-pointer text-xs flex flex-col gap-1 transition shadow-sm";
            div.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-200 truncate max-w-[140px]">${user.email}</span>
                    ${statusMarkup}
                </div>
                <div class="text-[10px] text-gray-400 font-mono flex justify-between items-center">
                    <span>${user.appPhone}</span>
                    <button class="text-indigo-400 font-bold hover:underline tracking-tight text-[9px]" onclick="event.stopPropagation(); window.app.fireNudgePing('${user.uid}', '${user.email}')">Ping Check-in</button>
                </div>
            `;
            div.onclick = () => onSelect(user.uid, user.email);
            list.appendChild(div);
        });
    },

    renderMessage(msg, currentUserId) {
        const container = document.getElementById('messages-container');
        const isMe = msg.senderUid === currentUserId;
        const div = document.createElement('div');
        div.className = `flex flex-col max-w-[80%] msg-enter ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`;

        let processedText = this.parseEmojiGlossaryHTML(msg.text || '');

        // Feature 4: Intergenerational Image Safety Blur Guardrail
        let mediaSegment = '';
        if (msg.mediaUrl) {
            let blurClass = (msg.isSensitive && !isMe) ? 'blur-xl hover:blur-0 transition-all duration-300' : '';
            let alertLabel = (msg.isSensitive && !isMe) ? '<div class="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-bold text-red-400 pointer-events-none uppercase tracking-wider"><i class="fas fa-eye-slash mr-1"></i> Shield Blurred Preview</div>' : '';
            
            if (msg.mediaType.startsWith('image/')) {
                mediaSegment = `<div class="relative overflow-hidden rounded-xl border border-gray-700 max-w-sm">
                    <img src="${msg.mediaUrl}" class="w-full h-auto object-cover max-h-64 ${blurClass}">
                    ${alertLabel}
                </div>`;
            } else if (msg.mediaType.startsWith('video/')) {
                mediaSegment = `<video src="${msg.mediaUrl}" controls class="rounded-xl max-w-sm max-h-64 border border-gray-700 bg-black ${blurClass}"></video>`;
            }
        }

        // Feature 6: Context Card contextual action tags layout builder injection
        let contextualActionMarkup = '';
        if (!isMe && msg.text && (msg.text.toLowerCase().includes('where') || msg.text.toLowerCase().includes('location'))) {
            contextualActionMarkup = `<div class="mt-2 flex gap-1"><button onclick="UI.showToast('Location payload coordinate dispatched!', 'success')" class="text-[9px] bg-indigo-600 px-2 py-0.5 rounded font-bold uppercase">Send Location?</button></div>`;
        }
        if (!isMe && msg.text && (msg.text.toLowerCase().includes('call') || msg.text.toLowerCase().includes('phone'))) {
            contextualActionMarkup = `<div class="mt-2 flex gap-1"><button onclick="UI.showToast('Initiating emergency VOIP secure stream network dialer...', 'info')" class="text-[9px] bg-emerald-600 px-2 py-0.5 rounded font-bold uppercase"><i class="fas fa-phone"></i> Call Now?</button></div>`;
        }

        div.innerHTML = `
            <div class="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-gray-400">
                <span class="font-bold text-gray-300">${msg.senderEmail.split('@')[0]}</span>
                <span>•</span>
                <button onclick="window.app.vocalize('${msg.text ? msg.text.replace(/'/g, "\\'") : ''}')" class="hover:text-indigo-400 transition" title="Read Aloud"><i class="fas fa-volume-up text-[9px]"></i></button>
            </div>
            <div class="msg-bubble p-3 rounded-2xl ${isMe?'bg-indigo-600 text-white rounded-tr-sm':'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-sm'} shadow-md">
                ${mediaSegment}
                ${msg.text ? `<p class="text-sm whitespace-pre-wrap break-words leading-relaxed">${processedText}</p>` : ''}
                ${contextualActionMarkup}
            </div>
        `;
        
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
};