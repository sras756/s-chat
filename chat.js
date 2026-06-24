import { db } from "./firebase-config.js";
import { ref, push, onChildAdded, serverTimestamp, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { UI } from "./ui.js";

export const ChatLogic = {
    historicalTrack: [],

    // Feature 2: "Tone Changer" Slider Execution Array Logic Engine Simulator
    simulateToneTransform(text, toneIdx) {
        if (!text) return "";
        if (toneIdx === 2) return `Respected Partner, I am checking in regarding our core communications layout. ${text}`;
        if (toneIdx === 3) return `Hello dear family, hope you are having a wonderful peaceful afternoon! Just wanted to say: ${text}`;
        if (toneIdx === 4) return `Yo! Absolute fire statement right here no cap, check this out: ${text} 💀🔥`;
        return text; 
    },

    // Feature 4: Safety Shield "Guardrails" NLP Analysis Verification Module
    evaluateSafetyHeuristics(text) {
        const forbiddenPatterns = /(scam|password|wire money|fool|idiot|hate you|give me card)/gi;
        return forbiddenPatterns.test(text);
    },

    async transmitMessage(user, text, base64Str, mimeType, currentPath) {
        // Run verification checks
        if (text && this.evaluateSafetyHeuristics(text)) {
            UI.showToast("AI Guardrail triggered: Communication paused due to aggressive language or potential scam indicators. Please rewrite respectfully.", "error");
            return false;
        }

        try {
            // Feature 4: Handle automated flag testing validation for image strings
            let contentFlagged = false;
            if (base64Str && mimeType.startsWith('image/')) {
                contentFlagged = true; // Auto-blur for demonstration purposes
            }

            const payload = {
                senderUid: user.uid,
                senderEmail: user.email,
                text: text,
                mediaUrl: base64Str,
                mediaType: mimeType,
                isSensitive: contentFlagged,
                timestamp: serverTimestamp()
            };

            await push(ref(db, `messages/${currentPath}`), payload);
            
            // Record internal checkpoint matrix track configuration values
            await set(ref(db, `checkins/${user.uid}`), serverTimestamp());
            return true;
        } catch (e) {
            UI.showToast(`Database write rejected: ${e.message}`, "error");
            return false;
        }
    },

    listenToChannelNode(path, userContext) {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        this.historicalTrack = [];
        
        const pointer = ref(db, `messages/${path}`);
        onChildAdded(pointer, (snapshot) => {
            const data = snapshot.val();
            this.historicalTrack.push(data);
            
            // Limit tracing cache array matrices size logs
            if (this.historicalTrack.length > 5) this.historicalTrack.shift();
            
            // Feature 6: Render historical summaries inside Context Cards for older adults
            this.updateMemoryBreadcrumbUI();
            
            UI.renderMessage(data, userContext.uid);
        });
    },

    // Feature 6: "Context Cards" summary assembly compiler
    updateMemoryBreadcrumbUI() {
        const panel = document.getElementById('context-card-popup');
        const body = document.getElementById('context-card-body');
        
        if (this.historicalTrack.length >= 3) {
            panel.classList.remove('hidden');
            body.innerHTML = this.historicalTrack.map(m => `
                <div class="truncate max-w-full"><strong>${m.senderEmail.split('@')[0]}:</strong> ${m.text || '[Media Attachment File Structure File Data]'}</div>
            `).join('');
        } else {
            panel.classList.add('hidden');
        }
    }
};