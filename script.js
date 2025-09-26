/* CONFIGURAÇÕES */
const TOTAL = 900;
const PRE_DURATION = 500;
const FORMATION_DURATION = 4000;
const HEART_SCALE_DIVISOR = 38;
const PULSE_AMPLITUDE = 0.5;
const PULSE_SPEED = 0.002;
const JITTER_AMOUNT = 0.4;
const CHAR_POOL = "10";
const HACKER_BG_COLOR = '#000';
const Y2K_BG_COLOR = '#fce4ec';
const HACKER_TEXT_COLOR = '#FF007F'; // Nova cor: rosa choque

/* setup canvas e elementos */
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const heartContainer = document.getElementById('heartContainer');
const inviteContainer = document.getElementById('inviteContainer');
const finalMessageContainer = document.getElementById('finalMessageContainer');
const ctaButton = document.getElementById('ctaButton');
const invitePanel = inviteContainer.querySelector('.invite-panel');

// Redimensionamento do Canvas e Geração do Coração
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
ctx.font = "14px monospace";

let heartTargets = [];
function generateHeartTargets() {
    heartTargets = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 30;
    const scale = Math.min(canvas.width, canvas.height) / HEART_SCALE_DIVISOR;
    for (let i = 0; i < TOTAL; i++) {
        const t = (i / TOTAL) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        heartTargets.push({ x: cx + x * scale, y: cy - y * scale });
    }
}
generateHeartTargets();

const particles = [];
function createDispersedParticles() {
    particles.length = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < TOTAL; i++) {
        const startX = centerX + (Math.random() - 0.5) * canvas.width * 1.5;
        const startY = centerY + (Math.random() - 0.5) * canvas.height * 1.5;
        particles.push({
            char: CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
            x: startX,
            y: startY,
            ox: startX,
            oy: startY,
            tx: heartTargets[i].x,
            ty: heartTargets[i].y,
            flickerOffset: Math.random() * 2 * Math.PI,
            timeOffset: Math.random() * 0.5
        });
    }
}
createDispersedParticles();

// Lógica da Animação do Coração
let stage = 'pre';
let stageStart = performance.now();

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate(ts) {
    const elapsed = ts - stageStart;
    if (stage === 'pre' && elapsed >= PRE_DURATION) {
        stage = 'forming';
        stageStart = ts;
    } else if (stage === 'forming' && elapsed >= FORMATION_DURATION) {
        stage = 'done';
        stageStart = ts;
        ctaButton.parentElement.classList.remove('hidden');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSubtleGrid(ts);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = HACKER_TEXT_COLOR; // Alterado para rosa
    ctx.shadowBlur = 10;
    particles.forEach(p => {
        let drawX, drawY, alpha;
        if (stage === 'pre') {
            const jitterX = (Math.random() - 0.5) * JITTER_AMOUNT * 5;
            const jitterY = (Math.random() - 0.5) * JITTER_AMOUNT * 5;
            drawX = p.ox + jitterX;
            drawY = p.oy + jitterY;
            alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(ts / 180 + p.flickerOffset));
        } else if (stage === 'forming') {
            const prog = Math.min((ts - stageStart) / FORMATION_DURATION, 1);
            const localProg = Math.min(Math.max((prog - p.timeOffset) / (1 - p.timeOffset), 0), 1);
            const eased = easeInOutCubic(localProg);
            const curX = lerp(p.ox, p.tx, eased);
            const curY = lerp(p.oy, p.ty, eased);
            const jitterX = (Math.random() - 0.5) * (1 - eased) * 15;
            const jitterY = (Math.random() - 0.5) * (1 - eased) * 15;
            drawX = curX + jitterX;
            drawY = curY + jitterY;
            alpha = 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(ts / 220 + p.flickerOffset));
        } else { // done
            const pulse = 1 + PULSE_AMPLITUDE * Math.sin(ts * PULSE_SPEED + p.flickerOffset * 0.5);
            drawX = p.tx + Math.cos(p.flickerOffset) * pulse * 0.5;
            drawY = p.ty + Math.sin(p.flickerOffset) * pulse * 0.5;
            alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ts / 180 + p.flickerOffset));
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = HACKER_TEXT_COLOR; // Alterado para rosa
        ctx.fillText(p.char, drawX, drawY);
    });
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function drawSubtleGrid(ts) {
    const step = 20;
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.lineWidth = 1;
    ctx.strokeStyle = HACKER_TEXT_COLOR; // Alterado para rosa
    for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin((y / 80) + ts / 900) * 2);
        ctx.lineTo(canvas.width, y + Math.sin((y / 80) + ts / 900) * 2);
        ctx.stroke();
    }
    ctx.restore();
}

window.addEventListener('resize', () => {
    generateHeartTargets();
    createDispersedParticles();
});

// Lógica de Navegação entre Telas e História
function switchScreens(screenToHide, screenToShow, bgColor) {
    screenToHide.classList.remove('active');
    screenToHide.classList.add('hidden');
    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
    document.body.style.backgroundColor = bgColor;
}

function updatePanelContent(titleText, paragraphText, buttonsConfig, isForm = false) {
    const title = inviteContainer.querySelector('h2');
    const paragraph = inviteContainer.querySelector('p');
    const buttonsContainer = inviteContainer.querySelector('.invite-buttons');
    title.textContent = titleText;
    paragraph.textContent = paragraphText;
    buttonsContainer.innerHTML = '';
    if (isForm) {
        const form = document.createElement('form');
        buttonsConfig.forEach(placeholder => {
            let inputType = 'text';
            let max = '';
            if (placeholder.includes('Idade')) {
                inputType = 'number';
                max = '17'; // Alterado de 10 para 17
            } else if (placeholder.includes('Beleza')) {
                inputType = 'number';
                max = '10';
            }
            form.innerHTML += `<input type="${inputType}" placeholder="${placeholder}" min="0" max="${max}" required>`;
        });
        form.innerHTML += `<button type="submit">Enviar e abrir convite</button>`;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
        buttonsContainer.appendChild(form);
    } else {
        buttonsConfig.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.id = btn.id;
            if (btn.handler) {
                button.addEventListener('click', btn.handler);
            }
            buttonsContainer.appendChild(button);
        });
    }
}

let yesButtonClickCount = 0;
let isSwapped = false;

function swapButtons() {
    const buttons = invitePanel.querySelectorAll('button');
    if (buttons.length === 2) {
        const [btn1, btn2] = buttons;
        btn1.style.order = isSwapped ? '0' : '1';
        btn2.style.order = isSwapped ? '1' : '0';
        isSwapped = !isSwapped;
    }
}

const handleYesButtonClick = () => {
    if (yesButtonClickCount < 3) {
        yesButtonClickCount++;
        swapButtons();
    } else {
        updatePanelContent('Seu nome é Mauy?', '', [
            { text: 'Sim', id: 'yesButton', handler: handleMauyYes },
            { text: 'Não', id: 'noButton', handler: handleMauyNo }
        ]);
    }
};

const handleNoButtonClick = () => {
    updatePanelContent('Ops! Convite recusado.', 'Aguarde 3 segundos para retornar...', []);
    setTimeout(() => {
        switchScreens(inviteContainer, heartContainer, HACKER_BG_COLOR);
    }, 3000);
};

const handleMauyYes = () => {
    updatePanelContent('Que pena, a pessoa convidada se chama Maristella.', 'Mas vou abrir uma exceção porque você é gatinha.', []);
    setTimeout(() => {
        updatePanelContent('Preenche esse formulário aqui pra eu saber mais:', '', ['Nome da gatinha', 'Sobrenome', 'Idade', 'Beleza de 0 a 10'], true);
    }, 3000);
};

const handleMauyNo = () => {
    updatePanelContent('Que bom!', 'A pessoa convidada se chama Maristella.', []);
    setTimeout(() => {
        updatePanelContent('Se você realmente é a Maristella, preencha esse formulário de 1284 páginas abaixo:', '', ['Nome', 'Sobrenome', 'Idade', 'Beleza de 0 a 10'], true);
    }, 3000);
};

const handleFormSubmit = () => {
    updatePanelContent('SÓ ISSO DE BELEZA?', 'ISSO TA MUITO ERRADO MINHA LOIRINHA COVARDE, VOCE É MAIS 9999 SUA GOSTOSA', []);
    setTimeout(() => {
        updatePanelContent('Abrir convite?', '', [
            { text: 'Abrir', id: 'openButton', handler: handleOpenButton }
        ]);
    }, 3000);
};

const handleOpenButton = () => {
    updatePanelContent('Tem certeza?', '', [
        { text: 'Sim', id: 'yesButton', handler: handleAccept },
        { text: 'Não', id: 'noButton', handler: handleReject }
    ]);
};

const handleAccept = () => {
    updatePanelContent('kk calma, ce disse sim? pelo tanto de nao que ja levei seu, achei que ia receber mais um', '', []); 
    setTimeout(() => {
        switchScreens(inviteContainer, finalMessageContainer, Y2K_BG_COLOR);
    }, 3000);
};

const handleReject = () => {
    updatePanelContent('nao existe essa opçao amor, a UNICA é o sim', '', []);
    setTimeout(() => {
        updatePanelContent('Aceita sair comigo?', ' ', [
            { text: 'Aceitar', id: 'acceptButton', handler: handleAccept },
            { text: 'Recusar', id: 'rejectButton', handler: handleReject }
        ]);
    }, 2000);
};

// Eventos Iniciais
ctaButton.addEventListener('click', () => {
    switchScreens(heartContainer, inviteContainer, Y2K_BG_COLOR);
    updatePanelContent('Este é um convite confidencial.', 'Tem certeza que deseja abri-lo?', [
        { text: 'Sim', id: 'yesButton', handler: handleYesButtonClick },
        { text: 'Não', id: 'noButton', handler: handleNoButtonClick }
    ]);
});