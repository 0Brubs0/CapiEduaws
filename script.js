// Variáveis de usuário logado
let usuarioLogado = null;

// Verificar se já está logado
function verificarLogin() {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
        usuarioLogado = JSON.parse(usuario);
        mostrarApp();
    }
}

// Validar CNPJ (formato básico)
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.length === 14;
}

// Login de estudante
document.getElementById('form-estudante').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-estudante').value;
    const email = document.getElementById('email-estudante').value;
    
    usuarioLogado = { tipo: 'estudante', nome, email };
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    mostrarApp();
};

// Login de instituição
document.getElementById('form-instituicao').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-instituicao').value;
    const cnpj = document.getElementById('cnpj-instituicao').value;
    const email = document.getElementById('email-instituicao').value;
    
    if (!validarCNPJ(cnpj)) {
        alert('🦫 CNPJ deve ter 14 dígitos');
        return;
    }
    
    usuarioLogado = { tipo: 'instituicao', nome, cnpj, email };
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    mostrarApp();
};

// Mostrar aplicação após login
function mostrarApp() {
    document.getElementById('login-section').style.display = 'none';
    document.querySelector('header').style.display = 'block';
    document.querySelector('nav').style.display = 'block';
    document.querySelector('main').style.display = 'block';
    
    // Configurar navegação baseada no tipo de usuário
    if (usuarioLogado.tipo === 'estudante') {
        document.getElementById('btn-gerenciar').style.display = 'none';
        document.getElementById('btn-instituicao').style.display = 'none';
    } else {
        document.getElementById('btn-inscricoes').style.display = 'none';
    }
    
    exibirProjetos();
}

// Logout
document.getElementById('btn-logout').onclick = () => {
    localStorage.removeItem('usuarioLogado');
    usuarioLogado = null;
    location.reload();
};

// Tabs de login
document.getElementById('tab-estudante').onclick = () => {
    document.getElementById('form-estudante').style.display = 'flex';
    document.getElementById('form-instituicao').style.display = 'none';
    document.getElementById('tab-estudante').classList.add('active');
    document.getElementById('tab-instituicao').classList.remove('active');
};

document.getElementById('tab-instituicao').onclick = () => {
    document.getElementById('form-estudante').style.display = 'none';
    document.getElementById('form-instituicao').style.display = 'flex';
    document.getElementById('tab-instituicao').classList.add('active');
    document.getElementById('tab-estudante').classList.remove('active');
};

// Criar bolhinhas animadas
function criarBolhinhas() {
    const container = document.querySelector('.bolhinhas');
    
    for (let i = 0; i < 20; i++) {
        const bolha = document.createElement('div');
        const tamanho = Math.random() * 30 + 20;
        const velocidade = Math.random() * 6 + 8;
        const delay = Math.random() * 10;
        const posicao = Math.random() * 100;
        
        bolha.style.cssText = `
            position: absolute;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: radial-gradient(circle at 30% 30%, rgba(255, 193, 7, 0.8), rgba(255, 152, 0, 0.4));
            border: 2px solid rgba(255, 193, 7, 0.8);
            box-shadow: 0 0 20px rgba(255, 152, 0, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            left: ${posicao}%;
            bottom: -50px;
            animation: subir ${velocidade}s infinite linear;
            animation-delay: ${delay}s;
        `;
        container.appendChild(bolha);
    }
}

let projetos = JSON.parse(localStorage.getItem('projetos')) || [];

document.getElementById('btn-inscricoes').onclick = () => {
    document.getElementById('estudante-section').style.display = 'none';
    document.getElementById('instituicao-section').style.display = 'none';
    document.getElementById('gerenciar-section').style.display = 'none';
    document.getElementById('inscricoes-section').style.display = 'block';
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-inscricoes').classList.add('active');
    exibirInscricoes();
};

document.getElementById('btn-gerenciar').onclick = () => {
    document.getElementById('estudante-section').style.display = 'none';
    document.getElementById('instituicao-section').style.display = 'none';
    document.getElementById('gerenciar-section').style.display = 'block';
    document.getElementById('inscricoes-section').style.display = 'none';
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-gerenciar').classList.add('active');
    exibirProjetosGerenciar();
};

// Navegação entre seções
document.getElementById('btn-estudante').onclick = () => {
    document.getElementById('estudante-section').style.display = 'block';
    document.getElementById('instituicao-section').style.display = 'none';
    document.getElementById('gerenciar-section').style.display = 'none';
    document.getElementById('inscricoes-section').style.display = 'none';
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-estudante').classList.add('active');
    exibirProjetos();
};

document.getElementById('btn-instituicao').onclick = () => {
    document.getElementById('estudante-section').style.display = 'none';
    document.getElementById('instituicao-section').style.display = 'block';
    document.getElementById('gerenciar-section').style.display = 'none';
    document.getElementById('inscricoes-section').style.display = 'none';
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-instituicao').classList.add('active');
};

// Cadastrar projeto
document.getElementById('projeto-form').onsubmit = (e) => {
    e.preventDefault();
    
    const projeto = {
        id: Date.now(),
        nome: document.getElementById('nome-projeto').value,
        instituicao: document.getElementById('instituicao').value,
        categoria: document.getElementById('categoria').value,
        cidade: document.getElementById('cidade').value.toLowerCase(),
        descricao: document.getElementById('descricao').value,
        dataInicio: document.getElementById('data-inicio').value,
        contato: document.getElementById('contato').value
    };
    
    projetos.push(projeto);
    localStorage.setItem('projetos', JSON.stringify(projetos));
    
    alert('🦫 Projeto cadastrado com sucesso! As capivaras estão felizes!');
    document.getElementById('projeto-form').reset();
};

// Filtrar projetos
function filtrarProjetos() {
    const cidade = document.getElementById('cidade-filtro').value.toLowerCase();
    const categoria = document.getElementById('categoria-filtro').value;
    
    const projetosFiltrados = projetos.filter(projeto => {
        const cidadeMatch = !cidade || projeto.cidade.includes(cidade);
        const categoriaMatch = !categoria || projeto.categoria === categoria;
        return cidadeMatch && categoriaMatch;
    });
    
    exibirProjetos(projetosFiltrados);
}

// Exibir projetos
function exibirProjetos(lista = projetos) {
    const container = document.getElementById('projetos-lista');
    
    if (lista.length === 0) {
        container.innerHTML = '<p>🦫 Nenhum projeto encontrado. As capivaras estão procurando...</p>';
        return;
    }
    
    container.innerHTML = lista.map(projeto => `
        <div class="projeto-card">
            <h3>${projeto.nome}</h3>
            <div class="instituicao">${projeto.instituicao}</div>
            <span class="categoria">${projeto.categoria}</span>
            <div class="cidade">📍 ${projeto.cidade}</div>
            <p>${projeto.descricao}</p>
            <p><strong>Início:</strong> ${new Date(projeto.dataInicio).toLocaleDateString('pt-BR')}</p>
            <p><strong>Contato:</strong> ${projeto.contato}</p>
            <button class="btn-inscrever" onclick="inscreverProjeto(${projeto.id})">✉️ Inscrever-se</button>
        </div>
    `).join('');
}

// Exibir projetos para gerenciar
function exibirProjetosGerenciar() {
    const container = document.getElementById('projetos-gerenciar');
    
    if (projetos.length === 0) {
        container.innerHTML = '<p>🦫 Nenhum projeto cadastrado.</p>';
        return;
    }
    
    container.innerHTML = projetos.map(projeto => `
        <div class="projeto-card">
            <h3>${projeto.nome}</h3>
            <div class="instituicao">${projeto.instituicao}</div>
            <span class="categoria">${projeto.categoria}</span>
            <div class="cidade">📍 ${projeto.cidade}</div>
            <p>${projeto.descricao}</p>
            <p><strong>Início:</strong> ${new Date(projeto.dataInicio).toLocaleDateString('pt-BR')}</p>
            <p><strong>Contato:</strong> ${projeto.contato}</p>
            <button class="btn-remover" onclick="removerProjeto(${projeto.id})">🗑️ Remover</button>
        </div>
    `).join('');
}

// Remover projeto
function removerProjeto(id) {
    if (confirm('🦫 Tem certeza que deseja remover este projeto?')) {
        projetos = projetos.filter(projeto => projeto.id !== id);
        localStorage.setItem('projetos', JSON.stringify(projetos));
        exibirProjetosGerenciar();
        alert('🦫 Projeto removido com sucesso!');
    }
}

// Inscrever em projeto
function inscreverProjeto(id) {
    if (!usuarioLogado || usuarioLogado.tipo !== 'estudante') {
        alert('🦫 Apenas estudantes podem se inscrever em projetos!');
        return;
    }
    
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    const projeto = projetos.find(p => p.id === id);
    
    // Verificar se já está inscrito
    if (inscricoes.some(i => i.projetoId === id && i.emailUsuario === usuarioLogado.email)) {
        alert('🦫 Você já está inscrito neste projeto!');
        return;
    }
    
    const inscricao = {
        id: Date.now(),
        projetoId: id,
        nomeProjeto: projeto.nome,
        instituicao: projeto.instituicao,
        nomeUsuario: usuarioLogado.nome,
        emailUsuario: usuarioLogado.email,
        dataInscricao: new Date().toLocaleDateString('pt-BR')
    };
    
    inscricoes.push(inscricao);
    localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
    
    alert(`🦫 Inscrição realizada com sucesso!\n\nProjeto: ${projeto.nome}\nA instituição entrará em contato em breve!`);
}

// Exibir inscrições do usuário
function exibirInscricoes() {
    const inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    const container = document.getElementById('inscricoes-lista');
    
    if (inscricoes.length === 0) {
        container.innerHTML = '<p>🦫 Você ainda não se inscreveu em nenhum projeto.</p>';
        return;
    }
    
    container.innerHTML = inscricoes.map(inscricao => `
        <div class="projeto-card">
            <h3>${inscricao.nomeProjeto}</h3>
            <div class="instituicao">${inscricao.instituicao}</div>
            <p><strong>Seu nome:</strong> ${inscricao.nomeUsuario}</p>
            <p><strong>Seu email:</strong> ${inscricao.emailUsuario}</p>
            <p><strong>Data da inscrição:</strong> ${inscricao.dataInscricao}</p>
            <button class="btn-cancelar" onclick="cancelarInscricao(${inscricao.id})">❌ Cancelar Inscrição</button>
        </div>
    `).join('');
}

// Cancelar inscrição
function cancelarInscricao(id) {
    if (confirm('🦫 Tem certeza que deseja cancelar esta inscrição?')) {
        let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
        inscricoes = inscricoes.filter(inscricao => inscricao.id !== id);
        localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
        exibirInscricoes();
        alert('🦫 Inscrição cancelada com sucesso!');
    }
}

// Inicializar
verificarLogin();
criarBolhinhas();
exibirProjetos();
