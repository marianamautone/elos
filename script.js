/* =========================================================
   ELOS - SCRIPT PRINCIPAL CORRIGIDO
   ========================================================= */

const KEY = "elos_db_v3";

const seed = {
    users: [
        {
            role: "aluno",
            name: "Rodrigo Silva",
            email: "rodrigosilva@gmail.com",
            password: "123456",
            age: "17",
            turma: "3º EM",
            rm: "32654",
            phone: "(11) 99999-1111",
            points: 125
        },
        {
            role: "aluno",
            name: "Mariana Mautone",
            email: "marianamautone@gmail.com",
            password: "123456",
            age: "17",
            turma: "2º GT",
            rm: "35199",
            phone: "(11) 96371 3389",
            points: 125
        },
       {
            role: "aluno",
            name: "Luiza Costa",
            email: "luizacosta@gmail.com",
            password: "123456",
            age: "15",
            turma: "1º HT",
            rm: "32655",
            phone: "(11) 99999-1111",
            points: 125
        },
       {
            role: "aluno",
            name: "Felipe Almeida",
            email: "felipealmeida@gmail.com",
            password: "123456",
            age: "16",
            turma: "2º AT",
            rm: "32656",
            phone: "(11) 99999-1111",
            points: 125
        },
       {
            role: "aluno",
            name: "Julia Peres",
            email: "juliaperes@gmail.com",
            password: "123456",
            age: "16",
            turma: "1º BM",
            rm: "32657",
            phone: "(11) 99999-1111",
            points: 125
        },
        {
            role: "professor",
            name: "Carlos Rodrigues",
            email: "carlosrodrigues@gmail.com",
            password: "123456",
            age: "40",
            re: "98765",
            phone: "(11) 99999-2222",
            turmas: ["3º EM", "2º GT", "1º HT", "2º AT", "1º BM"]
        },
        {
            role: "instituicao",
            name: "ETEC Jorge Street",
            email: "e011.sec@etec.sp.gov.br",
            password: "123",
            cnpj: "62.823.257/0007-96",
            area: "Educação",
            responsavel: "Flávio Ferreira Bento",
            phone: "(11) 4238-3860"
        }
    ],
    campaigns: [
        {
            id: 1,
            title: "Reflorestar floresta",
            date: "2026-09-12",
            time: "08:00 - 12:00",
            location: "Parque Ecológico Estadual",
            points: 30,
            description: "Mutirão de plantio de mudas nativas para recuperar a área verde do parque. Serão fornecidas ferramentas, luvas e água.",
            institution: "Instituto Verde",
            img: "parque.jfif"
        },
        {
            id: 2,
            title: "Sopa Solidária",
            date: "2026-09-18",
            time: "09:00 - 13:00",
            location: "Banco de Alimentos Municipal",
            points: 25,
            description: "Ajude no preparo e na distribuição de sopa quente para famílias em situação de vulnerabilidade.",
            institution: "Banco de Alimentos",
            img: "sopa.jfif"
        },
        {
            id: 3,
            title: "Coleta de Agasalhos",
            date: "2026-09-25",
            time: "08:00 - 12:00",
            location: "ETEC Jorge Street",
            points: 15,
            description: "Organização e triagem das doações de roupas de frio recebidas na escola.",
            institution: "ETEC Jorge Street",
            img: "agasalho.jfif"
        }
    ],
    registrations: [
        {
            campaignId: 3,
            userEmail: "rodrigosilva@gmail.com",
            title: "Coleta de Agasalhos",
            date: "2026-09-25",
            time: "08:00 - 12:00",
            location: "ETEC Jorge Street",
            name: "Rodrigo Silva",
            turma: "3º EM",
            age: "17"
        }
       {
            campaignId: 3,
            userEmail: "luizacosta@gmail.com",
            title: "Coleta de Agasalhos",
            date: "2026-09-25",
            time: "08:00 - 12:00",
            location: "ETEC Jorge Street",
            name: "Luiza Costa",
            turma: "1º HT",
            age: "15"
        },
        {
            campaignId: 1,
            userEmail: "felipealmeida@gmail.com",
            title: "Reflorestar floresta",
            date: "2026-09-12",
            time: "08:00 - 12:00",
            location: "Parque Ecológico Estadual",
            name: "Felipe Almeida",
            turma: "2º AT",
            age: "16"
        },
        {
            campaignId: 2,
            userEmail: "juliaperes@gmail.com",
            title: "Sopa Solidária",
            date: "2026-09-18",
            time: "09:00 - 13:00",
            location: "Banco de Alimentos Municipal",
            name: "Julia Peres",
            turma: "1º BM",
            age: "16"
        }
    ],
    notifications: [
        { id: 1, title: "Bem-vindo ao Elos!", text: "Acompanhe as campanhas disponíveis na sua região." }
    ]
};

let db = JSON.parse(localStorage.getItem(KEY) || "null");

// Se o banco não existir ou a lista de usuários estiver vazia, carrega o seed
if (!db || !db.users || db.users.length === 0) {
    db = seed;
} else {
    // Garante que cada usuário do seed esteja dentro do banco
    seed.users.forEach(demoUser => {
        const existe = db.users.some(u => u.email === demoUser.email && u.role === demoUser.role);
        if (!existe) {
            db.users.push(demoUser);
        }
    });
}

// Corrige datas antigas para Setembro
if (db && db.campaigns) {
    db.campaigns.forEach(c => {
        if (c.date) c.date = c.date.replace(/-01-/, "-09-");
    });
}

localStorage.setItem(KEY, JSON.stringify(db));

// Atualiza campanhas com imagens antigas ou datas antigas caso já estejam gravadas no LocalStorage
db.campaigns = db.campaigns.map(c => {
    if (c.date && c.date.startsWith("2026-01")) {
        c.date = c.date.replace("2026-01", "2026-09");
    }
    return c;
});

let current = null;
let currentRole = "aluno";
let regStep = 1;
let regData = {};

const $ = s => document.querySelector(s);
const save = () => localStorage.setItem(KEY, JSON.stringify(db));

/* ---------- DADOS DE RANKING ---------- */

const rankingAlunos = [
    { pos: 1, nome: "Mariana", horas: "520h", foto: "menina.jpg" },
    { pos: 2, nome: "Gabriel", horas: "450h", foto: "adolescente-popular.jpg" },
    { pos: 3, nome: "Lucas", horas: "410h", foto: "lucas.jfif" }
];

const destaquesAlunos = [
    { pos: 4, nome: "Rafael", escola: "3º AM", horas: "390h" },
    { pos: 5, nome: "Sabrina", escola: "2º GT", horas: "350h" }
];

const rankingSalas = [
    { pos: 1, nome: "3º EM", horas: "380h", foto: "turma1.jfif" },
    { pos: 2, nome: "2º FM", horas: "340h", foto: "turma2.jfif" },
    { pos: 3, nome: "1º CT", horas: "300h", foto: "turma3.jfif" }
];

const destaquesSalas = [
    { pos: 4, nome: "3º GT", escola: "ETEC Jorge Street", horas: "280h" },
    { pos: 5, nome: "2º FT", escola: "ETEC Jorge Street", horas: "240h" }
];

const conquistas = [
    { icone: "fa-tree", titulo: "Guardião Verde", descricao: "Participou de 3 mutirões de reflorestamento" },
    { icone: "fa-hand-holding-heart", titulo: "Coração Solidário", descricao: "Doou itens em 5 campanhas diferentes" },
    { icone: "fa-medal", titulo: "Top 3 do mês", descricao: "Ficou entre os alunos mais ativos em Setembro" }
];

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let mesAtual = 8; // Setembro (índice 8)
let anoAtual = 2026;

/* =========================================================
   SISTEMA DE AUTENTICAÇÃO E PERFIL
   ========================================================= */

function selectedUser() {
    return current ? db.users.find(u => u.email === current.email && u.role === current.role) : null;
}

function userRegs() {
    return current ? db.registrations.filter(r => r.userEmail === current.email) : db.registrations;
}

function roleName(r) {
    return r === "aluno" ? "Aluno" : r === "professor" ? "Professor" : "Instituição";
}

function showAuthPanel(id) {
    ["auth-choice", "login-panel", "register-panel"].forEach(x => {
        $("#" + x).classList.toggle("hidden", x !== id);
    });
}

function buildRegister() {
    const p = $("#register-step-1"), q = $("#register-step-2"), r = currentRole;
    $("#register-role-badge").textContent = `Cadastro de ${roleName(r)}`;
    $("#register-step").textContent = `${regStep} de 2`;

    p.classList.toggle("hidden", regStep !== 1);
    q.classList.toggle("hidden", regStep !== 2);

    if (regStep === 1) {
        let fields = r === "aluno" ? `
            <div class="form-title">Seus dados</div>
            <div class="form-grid">
                <div class="field full-field"><label>Nome completo</label><input id="f-name" required></div>
                <div class="field"><label>Idade</label><input id="f-age" type="number" min="10" required></div>
                <div class="field"><label>Turma</label><input id="f-turma" placeholder="Ex.: 2º EM" required></div>
                <div class="field full-field"><label>E-mail</label><input id="f-email" type="email" required></div>
                <div class="field"><label>RM</label><input id="f-rm" required></div>
                <div class="field"><label>Telefone</label><input id="f-phone" type="tel" required></div>
            </div>` :
            r === "professor" ? `
            <div class="form-title">Seus dados</div>
            <div class="form-grid">
                <div class="field full-field"><label>Nome completo</label><input id="f-name" required></div>
                <div class="field"><label>Idade</label><input id="f-age" type="number" min="18" required></div>
                <div class="field"><label>RE</label><input id="f-re" required></div>
                <div class="field full-field"><label>E-mail</label><input id="f-email" type="email" required></div>
                <div class="field full-field"><label>Telefone</label><input id="f-phone" type="tel" required></div>
            </div>` :
            `<div class="form-title">Dados da instituição</div>
            <div class="form-grid">
                <div class="field full-field"><label>Nome da instituição</label><input id="f-name" required></div>
                <div class="field"><label>CNPJ</label><input id="f-cnpj" required></div>
                <div class="field"><label>Área de atuação</label><input id="f-area" required></div>
                <div class="field full-field"><label>E-mail institucional</label><input id="f-email" type="email" required></div>
                <div class="field"><label>Telefone</label><input id="f-phone" type="tel" required></div>
                <div class="field"><label>Responsável</label><input id="f-responsavel" required></div>
            </div>`;
        p.innerHTML = fields;
    } else {
        p.innerHTML = "";
        q.innerHTML = `
            <div class="form-title">Segurança da conta</div>
            <div class="field"><label>Senha</label><input id="f-password" type="password" minlength="4"></div>
            <div class="field"><label>Confirmar senha</label><input id="f-confirm" type="password" minlength="4"></div>`;
    }
}

function collectFirst() {
    const ids = ["name", "age", "email", "phone", "turma", "rm", "re", "cnpj", "area", "responsavel"];
    const out = {};
    ids.forEach(id => { const e = $("#f-" + id); if (e && e.value.trim()) out[id] = e.value.trim(); });
    const required = currentRole === "aluno" ? ["name", "age", "email", "phone", "turma", "rm"] :
                     currentRole === "professor" ? ["name", "age", "email", "phone", "re"] :
                     ["name", "cnpj", "area", "email", "phone", "responsavel"];
    if (required.some(k => !out[k])) throw new Error("Preencha todos os campos obrigatórios.");
    if (db.users.some(u => u.role === currentRole && u.email.toLowerCase() === out.email.toLowerCase()))
        throw new Error("Já existe uma conta com este e-mail.");
    return out;
}

function finishRegister() {
    const pass = $("#f-password").value.trim(), conf = $("#f-confirm").value.trim();
    if (pass.length < 4) throw new Error("A senha deve ter pelo menos 4 caracteres.");
    if (pass !== conf) throw new Error("As senhas não coincidem.");
    
    const u = { role: currentRole, ...regData, password: pass };
    if (currentRole === "aluno") u.points = 125;
    if (currentRole === "professor") u.turmas = [];
    
    db.users.push(u);
    save();
    
    current = { role: currentRole, email: u.email };
    startApp();
}

function login() {
    const name = $("#login-name").value.trim().toLowerCase(), pass = $("#login-password").value;
    const u = db.users.find(x => x.role === currentRole && (x.email.toLowerCase() === name || x.name.toLowerCase() === name) && x.password === pass);
    if (!u) {
        $("#login-error").textContent = "Dados incorretos. Confira seu nome/e-mail e senha.";
        return;
    }
    current = { role: u.role, email: u.email };
    startApp();
}

function startApp() {
    $("#auth").classList.add("hidden");
    $("#app").classList.remove("hidden");
    
    updateHeaderUser();
    buildNav();
    renderAll();

    // Redireciona para a tela inicial correta do perfil atual
    const initialScreen = currentRole === "aluno" ? "aluno-inicio" : 
                          currentRole === "professor" ? "professor-inicio" : 
                          "instituicao-inicio";
                          
    trocarTela(initialScreen);
}

function updateHeaderUser() {
    const u = selectedUser();
    const avatarWrap = $("#avatar-mini-container");
    if (!avatarWrap) return;
    avatarWrap.innerHTML = `<div class="profile-avatar-icon"><i class="fa-solid fa-chalkboard-user"></i></div>`;

    if (!u) return;
    document.querySelectorAll("[data-user-name]").forEach(e => e.textContent = u.name);
    document.querySelectorAll("[data-user-email]").forEach(e => e.textContent = u.email);
}

function buildNav() {
    const nav = $("#bottom-nav");
    const r = current ? current.role : "aluno";
    const configs = r === "aluno" ? [
        ["aluno-inicio", "fa-house", "Início"],
        ["aluno-calendario", "fa-calendar", "Calendário"],
        ["aluno-ranking", "fa-star", "Ranking"],
        ["aluno-perfil", "fa-user", "Perfil"]
    ] : r === "professor" ? [
        ["professor-inicio", "fa-house", "Início"],
        ["professor-grafico", "fa-chart-pie", "Salas"],
        ["professor-perfil", "fa-user", "Perfil"]
    ] : [
        ["instituicao-inicio", "fa-house", "Início"],
        ["instituicao-participantes", "fa-users", "Participantes"],
        ["instituicao-perfil", "fa-building", "Perfil"]
    ];

    nav.innerHTML = configs.map((x, i) => `
        <button class="nav-btn ${i === 0 ? "active" : ""}" data-screen="${x[0]}">
            <i class="fa-solid ${x[1]}"></i>
            ${x[2]}
        </button>
    `).join("");

    nav.querySelectorAll(".nav-btn").forEach(b => {
        b.onclick = () => trocarTela(b.dataset.screen);
    });
}

function trocarTela(telaId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById(telaId);
    if (el) el.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.screen === telaId);
    });

    $("#menu-dropdown").classList.remove("aberto");
}

function salvarEdicaoPerfil(prefixo) {
    const u = selectedUser();
    const novoNome = $(`#edit-${prefixo}-name`).value.trim();
    const novoEmail = $(`#edit-${prefixo}-email`).value.trim();

    if (!novoNome || !novoEmail) {
        alert("Por favor, preencha nome e e-mail.");
        return;
    }

    if (u) {
        u.name = novoNome;
        u.email = novoEmail;
        current.email = novoEmail;
    }
    save();
    updateHeaderUser();
    renderAll();
    alert("Perfil atualizado com sucesso!");
}

function excluirContaAtual() {
    if (confirm("Tem certeza de que deseja excluir sua conta? Esta ação não poderá ser desfeita.")) {
        const u = selectedUser();
        if (u) {
            db.users = db.users.filter(x => !(x.email === u.email && x.role === u.role));
            db.registrations = db.registrations.filter(r => r.userEmail !== u.email);
            save();
        }
        location.reload();
    }
}

/* =========================================================
   RENDERS DOS PAINÉIS
   ========================================================= */

function renderAll() {
    const r = current ? current.role : "aluno";
    if (r === "aluno") {
        renderHome();
        renderTodasOportunidades();
        renderCalendario();
        renderRanking();
        renderPerfil();
    } else if (r === "professor") {
        renderTeacher();
    } else if (r === "instituicao") {
        renderInstitution();
    }
}

/* ---------- ALUNO ---------- */

function renderHome() {
    const cardsEl = document.getElementById("cards-oportunidades");
    if (cardsEl) {
        cardsEl.innerHTML = db.campaigns.map(op => `
            <div class="card" data-campaign-id="${op.id}">
                <img src="${op.img}" alt="${op.title}">
                <div class="card-body">
                    <h4>${op.title}</h4>
                    <div class="meta"><i class="fa-regular fa-clock"></i> ${op.time}</div>
                    <div class="meta"><i class="fa-solid fa-location-dot"></i> ${op.location}</div>
                </div>
            </div>
        `).join("");
    }

    const destaqueEl = document.getElementById("campanha-destaque");
    if (destaqueEl && db.campaigns.length > 0) {
        const c = db.campaigns.find(item => item.id === 3) || db.campaigns[0];
        destaqueEl.setAttribute("data-campaign-id", c.id);
        destaqueEl.innerHTML = `
            <img src="agasalho.jfif" alt="${c.title}">
            <div>
                <span class="tag">DESTAQUE</span>
                <h4>${c.title}</h4>
                <p>${c.description}</p>
            </div>
        `;
    }
}

function renderTodasOportunidades() {
    const lista = document.getElementById("lista-oportunidades");
    if (!lista) return;
    lista.innerHTML = db.campaigns.map(op => `
        <div class="oportunidade-item" data-campaign-id="${op.id}">
            <img src="${op.img}" alt="${op.title}">
            <div>
                <h4>${op.title}</h4>
                <p><i class="fa-regular fa-clock"></i> ${op.time}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${op.location}</p>
                <p><i class="fa-solid fa-star"></i> ${op.points} pontos</p>
            </div>
        </div>
    `).join("");
}

function renderCalendario() {
    const mesAno = document.getElementById("mes-ano");
    const grade = document.getElementById("grade-calendario");
    const listaEl = document.getElementById("lista-eventos");
    if (!mesAno || !grade || !listaEl) return;

    mesAno.textContent = `${MESES[mesAtual]} ${anoAtual}`;
    const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const regs = userRegs();

    let html = "";
    for (let i = 0; i < primeiroDiaSemana; i++) html += `<div class="dia vazio"></div>`;
    for (let dia = 1; dia <= totalDias; dia++) {
        const temEvento = regs.some(r => {
            const d = new Date(r.date + "T00:00:00");
            return d.getDate() === dia && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        });
        html += `<div class="dia ${temEvento ? "tem-evento" : ""}">${dia}${temEvento ? '<span class="ponto"></span>' : ""}</div>`;
    }
    grade.innerHTML = html;

    const eventosMes = regs.filter(r => {
        const d = new Date(r.date + "T00:00:00");
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });

    if (eventosMes.length === 0) {
        listaEl.innerHTML = `<p class="onde" style="margin-top:10px;">Nenhuma inscrição neste mês.</p>`;
    } else {
        listaEl.innerHTML = eventosMes.map(r => `
            <div class="event" data-campaign-id="${r.campaignId}">
                <div class="icone"><i class="fa-solid fa-calendar-check"></i></div>
                <div>
                    <h4>${r.title}</h4>
                    <p class="quando">${r.date} às ${r.time}</p>
                    <p class="onde">${r.location}</p>
                </div>
            </div>
        `).join("");
    }
}

function renderRanking() {
    renderPodio("podio-alunos", rankingAlunos);
    renderDestaques("destaques-alunos", destaquesAlunos);
    renderPodio("podio-salas", rankingSalas);
    renderDestaques("destaques-salas", destaquesSalas);
}

function medalha(pos) { return pos === 1 ? "ouro" : pos === 2 ? "prata" : "bronze"; }

function renderPodio(id, lista) {
    const el = document.getElementById(id);
    if (!el) return;
    const ordem = [2, 1, 3];
    const porPos = Object.fromEntries(lista.map(p => [p.pos, p]));
    el.innerHTML = ordem.map(pos => {
        const p = porPos[pos];
        if (!p) return "";
        return `
            <div class="user ${pos === 1 ? "destaque" : ""}">
                <div class="foto-wrap">
                    <img src="${p.foto}" alt="${p.nome}">
                    <span class="badge ${medalha(pos)}">${pos}</span>
                </div>
                <h4>${p.nome}</h4>
                <span>${p.horas}</span>
            </div>
        `;
    }).join("");
}

function renderDestaques(id, lista) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = lista.map(item => `
        <div class="destaque-item">
            <span class="posicao">${item.pos}</span>
            <div class="info">
                <h4>${item.nome}</h4>
                <p>${item.escola}</p>
            </div>
            <span class="horas">${item.horas}</span>
        </div>
    `).join("");
}

function renderPerfil() {
    const lista = document.getElementById("lista-conquistas");
    if (lista) {
        lista.innerHTML = conquistas.map(c => `
            <div class="conquista">
                <div class="icone"><i class="fa-solid ${c.icone}"></i></div>
                <div>
                    <h4>${c.titulo}</h4>
                    <p>${c.descricao}</p>
                </div>
            </div>
        `).join("");
    }
    const regs = userRegs();
    $("#profile-campaigns").textContent = regs.length;

    const u = selectedUser();
    if (u) {
        $("#edit-aluno-name").value = u.name || "";
        $("#edit-aluno-email").value = u.email || "";
    }
}

/* ---------- PROFESSOR ---------- */

function getAvailableClasses() {
    const classes = [...new Set(db.users.filter(u => u.role === "aluno" && u.turma).map(u => u.turma.trim()))];
    return classes.length ? classes : ["1º EM", "2º EM", "3º EM", "1º CT"];
}

function renderTeacher() {
    const u = selectedUser();
    if (!u) return;
    if (!Array.isArray(u.turmas)) u.turmas = [];
    const classes = getAvailableClasses();

    $("#teacher-class-selector").innerHTML = classes.map(c => `
        <label class="class-check">
            <input type="checkbox" data-teacher-class="${c}" ${u.turmas.includes(c) ? "checked" : ""}>
            <span>${c}</span>
        </label>
    `).join("");

    $("#teacher-classes").innerHTML = u.turmas.length ? u.turmas.map(c => `
        <div class="class-card">
            <div>
                <strong>${c}</strong>
                <span>${db.users.filter(x => x.role === "aluno" && x.turma === c).length} aluno(s) cadastrado(s)</span>
            </div>
            <i class="fa-solid fa-users"></i>
        </div>
    `).join("") : "<p class='muted'>Selecione pelo menos uma turma para acompanhar.</p>";

    $("#teacher-cards").innerHTML = db.campaigns.map(c => `
        <div class="card" data-campaign-id="${c.id}">
            <img src="${c.img}" alt="${c.title}">
            <div class="card-body">
                <h4>${c.title}</h4>
                <div class="meta"><i class="fa-regular fa-clock"></i> ${c.time}</div>
                <div class="meta"><i class="fa-solid fa-location-dot"></i> ${c.location}</div>
            </div>
        </div>
    `).join("");

    $("#teacher-campaigns-list").innerHTML = db.campaigns.map(c => `
        <div class="event" data-campaign-id="${c.id}">
            <div class="icone"><i class="fa-solid fa-seedling"></i></div>
            <div>
                <h4>${c.title}</h4>
                <p class="quando">${c.date} — ${c.points} pontos</p>
                <p class="onde">${c.location}</p>
            </div>
        </div>
    `).join("");

    renderTeacherChart();
    $("#teacher-info").innerHTML = `
        <div class="info-line"><strong>RE</strong>${u.re || "—"}</div>
        <div class="info-line"><strong>Telefone</strong>${u.phone || "—"}</div>
        <div class="info-line"><strong>Idade</strong>${u.age || "—"}</div>
    `;

    $("#edit-prof-name").value = u.name || "";
    $("#edit-prof-email").value = u.email || "";
}

function renderTeacherChart() {
    const classes = getAvailableClasses();
    const counts = classes.map(c => db.registrations.filter(r => r.turma === c).length);
    const total = counts.reduce((a, b) => a + b, 0);
    const colors = ["#4e9c41", "#82bd76", "#b5d9ae", "#dcefd8"];

    let start = 0, parts = [];
    classes.forEach((c, i) => {
        const pct = total ? Math.round(counts[i] * 100 / total) : Math.round(100 / classes.length);
        const next = i === classes.length - 1 ? 100 : start + pct;
        parts.push(`${colors[i % colors.length]} ${start}% ${next}%`);
        start = next;
    });

    $("#teacher-pie").style.background = `conic-gradient(${parts.join(",")})`;
    $("#teacher-legend").innerHTML = classes.map((c, i) => `
        <div class="legend-row">
            <span class="legend-dot" style="background:${colors[i % colors.length]}"></span>
            ${c}
        </div>
    `).join("");
}

/* ---------- INSTITUIÇÃO ---------- */

function renderInstitution() {
    const u = selectedUser();
    if (!u) return;

    // Apenas a doação de agasalhos na área da Instituição
    const myCampaigns = db.campaigns.filter(c => c.id === 3 || c.title.toLowerCase().includes("agasalho"));

    $("#institution-campaigns").innerHTML = myCampaigns.length ? myCampaigns.map(c => `
        <div class="event" data-campaign-id="${c.id}">
            <div class="icone"><i class="fa-solid fa-bullhorn"></i></div>
            <div>
                <h4>${c.title}</h4>
                <p class="quando">${c.date} às ${c.time}</p>
                <p class="onde">${c.location}</p>
            </div>
        </div>
    `).join("") : "<p class='muted'>Nenhuma campanha de doação de agasalhos encontrada.</p>";

    const participants = db.registrations;
    $("#participants-body").innerHTML = participants.length ? participants.map(r => `
        <tr>
            <td>${r.name || "Aluno"}</td>
            <td>${r.turma || "—"}</td>
            <td>${r.title || "Doação de Agasalhos"}</td>
            <td>
                <button class="action-btn-edit" onclick="editarInscricao(${r.campaignId}, '${r.userEmail}')"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn-delete" onclick="cancelarInscricao(${r.campaignId}, '${r.userEmail}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join("") : `<tr><td colspan="4" style="text-align:center;">Nenhum participante inscrito.</td></tr>`;

    $("#institution-info").innerHTML = `
        <div class="info-line"><strong>CNPJ</strong>${u.cnpj || "—"}</div>
        <div class="info-line"><strong>Área de atuação</strong>${u.area || "—"}</div>
        <div class="info-line"><strong>Responsável</strong>${u.responsavel || "—"}</div>
        <div class="info-line"><strong>Telefone</strong>${u.phone || "—"}</div>
    `;

    $("#edit-inst-name").value = u.name || "";
    $("#edit-inst-email").value = u.email || "";
}

function cancelarInscricao(campaignId, userEmail) {
    if (confirm("Deseja cancelar esta inscrição?")) {
        db.registrations = db.registrations.filter(r => !(r.campaignId === campaignId && r.userEmail === userEmail));
        save();
        renderAll();
    }
}

function editarInscricao(campaignId, userEmail) {
    const reg = db.registrations.find(r => r.campaignId === campaignId && r.userEmail === userEmail);
    if (!reg) return;
    const novoNome = prompt("Editar nome do participante:", reg.name);
    if (novoNome !== null && novoNome.trim() !== "") {
        reg.name = novoNome.trim();
        save();
        renderAll();
    }
}

/* =========================================================
   MODAL PRINCIPAL DE CAMPANHAS
   ========================================================= */

function abrirModalDetalhes(c) {
    const jaInscrito = userRegs().some(r => r.campaignId === c.id);
    const isInst = current && current.role === "instituicao";

    if (isInst) {
        $("#modal-content").innerHTML = `
            <div class="modal-body">
                <h3 style="margin-bottom:14px;">Editar Campanha</h3>
                <div class="field"><label>Título</label><input id="edit-title" value="${c.title}"></div>
                <div class="form-grid">
                    <div class="field"><label>Data</label><input id="edit-date" type="date" value="${c.date}"></div>
                    <div class="field"><label>Horário</label><input id="edit-time" value="${c.time}"></div>
                </div>
                <div class="field"><label>Local</label><input id="edit-location" value="${c.location}"></div>
                <div class="field"><label>Pontos</label><input id="edit-points" type="number" value="${c.points}"></div>
                <div class="field"><label>Descrição</label><textarea id="edit-desc" style="height:70px;">${c.description}</textarea></div>
                <button class="primary full" id="btn-salvar-edicao">Salvar Alterações</button>
                <button class="danger-btn full" id="btn-excluir-campanha" style="margin-top:8px;">Excluir Campanha</button>
            </div>
        `;

        $("#btn-salvar-edicao").onclick = () => {
            c.title = $("#edit-title").value;
            c.date = $("#edit-date").value;
            c.time = $("#edit-time").value;
            c.location = $("#edit-location").value;
            c.points = Number($("#edit-points").value);
            c.description = $("#edit-desc").value;
            save();
            fecharModal();
            renderAll();
        };

        $("#btn-excluir-campanha").onclick = () => {
            db.campaigns = db.campaigns.filter(x => x.id !== c.id);
            save();
            fecharModal();
            renderAll();
        };
    } else {
        $("#modal-content").innerHTML = `
            <img id="modal-img" src="${c.img || 'agasalho.jfif'}" alt="">
            <div class="modal-body">
                <span class="modal-tag visivel">OPORTUNIDADE</span>
                <h3 id="modal-titulo">${c.title}</h3>
                <div class="modal-meta">
                    <div><i class="fa-regular fa-clock"></i> <span>${c.time}</span></div>
                    <div><i class="fa-solid fa-location-dot"></i> <span>${c.location}</span></div>
                    <div><i class="fa-solid fa-star"></i> <span>${c.points} pontos</span></div>
                </div>
                <p id="modal-descricao">${c.description}</p>
                <button class="modal-cta" id="modal-cta" ${jaInscrito ? "disabled" : ""}>
                    ${jaInscrito ? "Inscrito ✓" : "Quero participar"}
                </button>
                ${jaInscrito ? `<button class="danger-btn full" id="btn-cancelar-inscricao" style="margin-top:10px;">Cancelar Inscrição</button>` : ""}
            </div>
        `;

        const btnCta = $("#modal-cta");
        if (btnCta && !jaInscrito) {
            btnCta.onclick = () => {
                const userObj = selectedUser();
                
                // 1. Registra a inscrição
                db.registrations.push({
                    campaignId: c.id,
                    userEmail: current ? current.email : "rodrigo@email.com",
                    title: c.title,
                    date: c.date,
                    time: c.time,
                    location: c.location,
                    name: userObj ? userObj.name : "Rodrigo Silva",
                    turma: userObj ? userObj.turma : "3º EM",
                    age: userObj ? userObj.age : "17"
                });

                // 2. ADICIONA A NOTIFICAÇÃO AUTOMÁTICA
                db.notifications.unshift({
                    id: Date.now(),
                    title: "Inscrição confirmada!",
                    text: `Você se inscreveu na campanha "${c.title}" para o dia ${c.date}.`
                });

                save();
                fecharModal();
                renderAll();
                trocarTela("aluno-calendario");
            };
        }

        const btnCancelar = $("#btn-cancelar-inscricao");
        if (btnCancelar) {
            btnCancelar.onclick = () => {
                cancelarInscricao(c.id, current ? current.email : "rodrigo@email.com");
                
                // Notificação ao cancelar inscrição
                db.notifications.unshift({
                    id: Date.now(),
                    title: "Inscrição cancelada",
                    text: `Você cancelou sua participação em "${c.title}".`
                });
                
                save();
                fecharModal();
            };
        }
    }

    $("#modal-overlay").classList.add("aberto");
}

function abrirModalNovaCampanha() {
    const u = selectedUser();
    $("#modal-content").innerHTML = `
        <div class="modal-body">
            <h3 style="margin-bottom:14px;">Nova Campanha</h3>
            <div class="field"><label>Título da Campanha</label><input id="new-title" placeholder="Ex.: Feira de Doação"></div>
            <div class="form-grid">
                <div class="field"><label>Data</label><input id="new-date" type="date"></div>
                <div class="field"><label>Horário</label><input id="new-time" placeholder="08:00 - 12:00"></div>
            </div>
            <div class="field"><label>Local</label><input id="new-location" placeholder="Endereço ou local"></div>
            <div class="field"><label>Pontos</label><input id="new-points" type="number" value="20"></div>
            <div class="field"><label>Descrição</label><textarea id="new-desc" style="height:70px;" placeholder="Breve explicação..."></textarea></div>
            <button class="primary full" id="btn-criar-campanha">Criar Campanha</button>
        </div>
    `;

    $("#btn-criar-campanha").onclick = () => {
        const title = $("#new-title").value.trim();
        const date = $("#new-date").value;
        const time = $("#new-time").value.trim();
        const loc = $("#new-location").value.trim();
        const pts = Number($("#new-points").value);
        const desc = $("#new-desc").value.trim();

        if (!title || !date) {
            alert("Preencha ao menos o título e a data.");
            return;
        }

        db.campaigns.unshift({
            id: Date.now(),
            title: title,
            date: date,
            time: time || "08:00 - 12:00",
            location: loc || "A definir",
            points: pts || 20,
            description: desc || "Nova ação comunitária.",
            institution: u ? u.name : "Instituição",
            img: "agasalho.jfif"
        });

        save();
        fecharModal();
        renderAll();
    };

    $("#modal-overlay").classList.add("aberto");
}

function fecharModal() {
    $("#modal-overlay").classList.remove("aberto");
}

function renderNotifications() {
    const container = $("#notifications-list");
    if (!container) return;
    container.innerHTML = db.notifications.length ?
        db.notifications.map(n => `<div class="notification"><strong>${n.title}</strong><span>${n.text}</span></div>`).join("") :
        "<p class='muted'>Nenhuma notificação no momento.</p>";
}

/* =========================================================
   INICIALIZAÇÃO DE EVENTOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- FADE OUT CARREGAMENTO ---------- */
    setTimeout(() => {
        const loader = document.getElementById("carregando");
        if (loader) {
            loader.classList.add("fade-out");
            setTimeout(() => loader.classList.add("hidden"), 600);
        }
        $("#auth").classList.remove("hidden");
    }, 1800);

    /* ---------- AUTENTICAÇÃO ---------- */
    $("#go-login").onclick = () => {
        currentRole = $("#choice-role").value;
        if (!currentRole) { alert("Selecione o tipo de usuário."); return; }
        $("#login-subtitle").textContent = `Entre como ${roleName(currentRole)}.`;
        showAuthPanel("login-panel");
    };

    $("#go-register").onclick = () => {
        currentRole = $("#choice-role").value;
        if (!currentRole) { alert("Selecione o tipo de usuário."); return; }
        regStep = 1;
        regData = {};
        buildRegister();
        showAuthPanel("register-panel");
    };

    document.querySelectorAll("[data-auth-back]").forEach(b => {
        b.onclick = () => showAuthPanel("auth-choice");
    });

    $("#login-submit").onclick = login;

    $("#register-next").onclick = () => {
        try {
            if (regStep === 1) {
                regData = collectFirst();
                regStep = 2;
                buildRegister();
            } else {
                finishRegister();
            }
            $("#register-error").textContent = "";
        } catch (err) {
            $("#register-error").textContent = err.message;
        }
    };

    /* ---------- BUSCA ---------- */
    const btnBuscar = $("#btn-buscar");
    const buscaContainer = $("#busca-container");
    const campoBusca = $("#campo-busca");
    const fecharBusca = $("#fechar-busca");
    const resultadosBusca = $("#resultados-busca");

    if (btnBuscar) {
        btnBuscar.onclick = () => {
            buscaContainer.classList.toggle("aberto");
            if (buscaContainer.classList.contains("aberto")) {
                campoBusca.focus();
            }
        };
    }

    if (fecharBusca) {
        fecharBusca.onclick = () => {
            buscaContainer.classList.remove("aberto");
            campoBusca.value = "";
            resultadosBusca.innerHTML = "";
        };
    }

    if (campoBusca) {
        campoBusca.oninput = () => {
            const termo = campoBusca.value.toLowerCase().trim();
            if (!termo) {
                resultadosBusca.innerHTML = "";
                return;
            }
            const filtrados = db.campaigns.filter(c => c.title.toLowerCase().includes(termo) || c.location.toLowerCase().includes(termo));
            resultadosBusca.innerHTML = filtrados.map(c => `
                <div class="busca-item-resultado" data-campaign-id="${c.id}">
                    <img src="${c.img}" alt="">
                    <div>
                        <h4>${c.title}</h4>
                        <p>${c.location}</p>
                    </div>
                </div>
            `).join("");
        };
    }

    /* ---------- MENU DROPDOWN ---------- */
    const btnMenu = $("#btn-menu");
    const menuDropdown = $("#menu-dropdown");

    if (btnMenu) {
        btnMenu.onclick = (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle("aberto");
        };
    }

    document.addEventListener("click", (e) => {
        if (menuDropdown && !menuDropdown.contains(e.target) && e.target !== btnMenu) {
            menuDropdown.classList.remove("aberto");
        }
    });

    menuDropdown?.querySelectorAll("[data-menu-tela]").forEach(b => {
        b.onclick = () => {
            trocarTela(b.dataset.menuTela);
        };
    });

    $("#btn-logout")?.addEventListener("click", () => {
        location.reload();
    });

    /* ---------- EDITAR E EXCLUIR PERFIL ---------- */
    $("#btn-save-aluno-profile")?.addEventListener("click", () => salvarEdicaoPerfil("aluno"));
    $("#btn-delete-aluno-account")?.addEventListener("click", excluirContaAtual);

    $("#btn-save-prof-profile")?.addEventListener("click", () => salvarEdicaoPerfil("prof"));
    $("#btn-delete-prof-account")?.addEventListener("click", excluirContaAtual);

    $("#btn-save-inst-profile")?.addEventListener("click", () => salvarEdicaoPerfil("inst"));
    $("#btn-delete-inst-account")?.addEventListener("click", excluirContaAtual);

    /* ---------- CLIQUE EM CAMPANHAS (MODAL) ---------- */
    document.addEventListener("click", e => {
        const item = e.target.closest("[data-campaign-id]");
        if (item) {
            const id = Number(item.dataset.campaignId);
            const c = db.campaigns.find(x => x.id === id);
            if (c) abrirModalDetalhes(c);
        }
    });

    /* ---------- CRIAR CAMPANHA (INSTITUIÇÃO) ---------- */
    $("#btn-nova-campanha")?.addEventListener("click", () => {
        abrirModalNovaCampanha();
    });

    $("#modal-close").onclick = fecharModal;

    /* ---------- NAVEGAÇÃO DE CONTEÚDO ---------- */
    $("#ver-todas")?.addEventListener("click", e => {
        e.preventDefault();
        renderTodasOportunidades();
        trocarTela("aluno-todas");
    });

    $("#ver-todas-professor")?.addEventListener("click", e => {
        e.preventDefault();
        renderTodasOportunidades();
        trocarTela("aluno-todas");
    });

    $("#voltar-inicio")?.addEventListener("click", () => {
        const r = current ? current.role : "aluno";
        trocarTela(r === "professor" ? "professor-inicio" : "aluno-inicio");
    });

    /* Calendário Navegação */
    $("#mes-anterior")?.addEventListener("click", () => {
        mesAtual--;
        if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
        renderCalendario();
    });

    $("#mes-seguinte")?.addEventListener("click", () => {
        mesAtual++;
        if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
        renderCalendario();
    });

    /* Ranking Abas */
    document.querySelectorAll(".tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            const p = document.getElementById(`ranking-${btn.dataset.tab}`);
            if (p) p.classList.add("active");
        });
    });

    /* Notificações Overlay */
    $("#btn-notifications")?.addEventListener("click", () => {
        renderNotifications();
        $("#notification-overlay").classList.add("aberto");
    });

    $("#notification-close")?.addEventListener("click", () => {
        $("#notification-overlay").classList.remove("aberto");
    });

    $("#btn-clear-notifications")?.addEventListener("click", () => {
        db.notifications = [];
        save();
        renderNotifications();
    });

    /* Turmas Professor */
    document.addEventListener("change", e => {
        if (e.target.matches("[data-teacher-class]")) {
            const u = selectedUser();
            if (!u) return;
            const checked = [...document.querySelectorAll('[data-teacher-class]:checked')].map(x => x.dataset.teacherClass);
            u.turmas = checked;
            save();
            renderTeacher();
        }
    });
});
