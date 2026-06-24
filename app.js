import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { UI } from "./ui.js";
import { ChatLogic } from "./chat.js";
import { GameEngine } from "./coplay.js";

let userSessionProfile = null;
let targetChatPath = 'global';
let rawFileBuffer = null;

const generateID = () => `+777-${Math.floor(100000 + Math.random() * 900000)}`;
const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => res(reader.result); reader.onerror = e => rej(e);
});

// Switch chat channels (Global or Private Room IDs)
function routeChat(targetUid, name) {
    if (targetUid === 'global') {
        targetChatPath = 'global';
    } else {
        // Feature 1 & 2 structural path grouping setup
        targetChatPath = [userSessionProfile.uid, targetUid].sort().join('_');
    }
    document.getElementById('chat-title').innerText = name;
    ChatLogic.listenToChannelNode(targetChatPath, userSessionProfile);
    GameEngine.setSessionParameters(targetChatPath, userSessionProfile);
    GameEngine.attachGameEngineListener();
}

// Feature 7: Scheduled "Check-in" Automatic Ping Transmitter
async function fireNudgePing(uid, targetEmail) {
    const customPingText = "❤️ Automated Family Check-in Ping: Thinking of you! Hope your afternoon is peaceful.";
    await ChatLogic.transmitMessage(userSessionProfile, customPingText, null, null, [userSessionProfile.uid, uid].sort().join('_'));
    UI.showToast(`Check-in nudge sequence dispatched to: ${targetEmail}`, 'success');
}

// Feature 5: Superior voice dictation integration controller mapping layer
function initVoiceRecognition() {
    const btn = document.getElementById('btn-mic-dictate');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btn.classList.add('hidden');
        return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false; rec.interimResults = false;
    
    btn.onclick = () => {
        rec.start();
        UI.showToast("Listening to oral dictation stream channel input window...", "info");
    };
    rec.onresult = (e) => {
        document.getElementById('message-input').value = e.results[0][0].transcript;
        UI.showToast("Acoustic wave conversion sequence matching processed.", "success");
    };
}

// Handle onboarding registration pipeline setup routing matrix execution nodes
async function syncProfileNode(user, selectionMode) {
    const pointer = ref(db, `users/${user.uid}`);
    const snapshot = await get(pointer);
    if (!snapshot.exists()) {
        const generatedPhone = generateID();
        const initialPayload = {
            uid: user.uid, email: user.email, appPhone: generatedPhone,
            interfacePreference: selectionMode || 'standard', structuralRole: 'user'
        };
        await set(pointer, initialPayload);
        return initialPayload;
    }
    return snapshot.val();
}

// ==========================================
// RUNTIME ACTION INITIALIZATION LISTENERS   
// ==========================================

document.getElementById('btn-login').onclick = async () => {
    const e = document.getElementById('auth-email').value;
    const p = document.getElementById('auth-password').value;
    const m = document.getElementById('auth-age-profile').value;
    try {
        const credentials = await signInWithEmailAndPassword(auth, e, p);
        const synced = await syncProfileNode(credentials.user, m);
        UI.applyUIMode(synced.interfacePreference || m);
    } catch(err) { UI.showToast(err.message, 'error'); }
};

document.getElementById('btn-register').onclick = async () => {
    const e = document.getElementById('auth-email').value;
    const p = document.getElementById('auth-password').value;
    const m = document.getElementById('auth-age-profile').value;
    try {
        const credentials = await createUserWithEmailAndPassword(auth, e, p);
        const synced = await syncProfileNode(credentials.user, m);
        UI.applyUIMode(m);
    } catch(err) { UI.showToast(err.message, 'error'); }
};

document.getElementById('btn-logout').onclick = () => signOut(auth);

document.getElementById('media-input').onchange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 4 * 1024 * 1024) {
        UI.showToast("Database transfer payload sizes capped to 4MB max.", "error");
        return;
    }
    rawFileBuffer = file;
    UI.updateMediaPreview(rawFileBuffer);
};

document.getElementById('btn-clear-media').onclick = () => {
    rawFileBuffer = null; UI.updateMediaPreview(null);
};

// Tone Slider trigger interface adjustments execution paths
document.getElementById('btn-tone-trigger').onclick = () => UI.toggleToneModal(true);
document.getElementById('btn-apply-tone').onclick = () => {
    const sliderVal = parseInt(document.getElementById('tone-slider').value);
    const textNode = document.getElementById('message-input');
    textNode.value = ChatLogic.simulateToneTransform(textNode.value, sliderVal);
    UI.toggleToneModal(false);
    UI.showToast("Message syntax re-profiled via AI simulation mapping rules.", "success");
};

// Send message click handler execution channel paths pipeline processing
document.getElementById('btn-send').onclick = async () => {
    const node = document.getElementById('message-input');
    const txt = node.value; const attachment = rawFileBuffer;
    
    if (!txt.trim() && !attachment) return;

    node.value = ''; rawFileBuffer = null; UI.updateMediaPreview(null);
    
    let base64 = null; let type = null;
    if (attachment) {
        base64 = await fileToBase64(attachment); type = attachment.type;
    }

    await ChatLogic.transmitMessage(userSessionProfile, txt, base64, type, targetChatPath);
};

// Split screens navigation layouts panel rendering buttons toggles handlers
document.getElementById('btn-toggle-co-play').onclick = () => document.getElementById('co-play-panel').classList.toggle('hidden');
document.getElementById('btn-close-coplay').onclick = () => document.getElementById('co-play-panel').classList.add('hidden');

// Global mapping attachment handlers hooks
window.app = {
    routeChat, fireNudgePing,
    vocalize: (t) => UI.triggerVoiceSynth(t),
    handleTTTClick: (i) => GameEngine.executeTicTacToeMove(i),
    clearCanvasVector: () => GameEngine.initializeGame('canvas')
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userSessionProfile = await syncProfileNode(user, null);
        UI.toggleAuth(false);
        UI.setProfileID(userSessionProfile.appPhone);
        UI.applyUIMode(userSessionProfile.interfacePreference || 'standard');
        
        initVoiceRecognition();
        ChatLogic.listenToChannelNode('global', userSessionProfile);

        // Track and map users and check-ins directories
        onValue(ref(db, 'users'), (snapshot) => {
            const users = []; snapshot.forEach(c => { if(c.key !== user.uid) users.push(c.val()); });
            onValue(ref(db, 'checkins'), (checkinSnap) => {
                UI.renderContactDirectory(users, checkinSnap.val() || {}, (uid, name) => routeChat(uid, name));
            });
        });
    } else {
        UI.toggleAuth(true);
        userSessionProfile = null;
    }
});