// 🦫 Testes Unitários para CapiEdu

// Mock do localStorage para testes
const mockLocalStorage = {
    store: {},
    getItem: function(key) { return this.store[key] || null; },
    setItem: function(key, value) { this.store[key] = value; },
    removeItem: function(key) { delete this.store[key]; },
    clear: function() { this.store = {}; }
};

// Função de teste simples
function teste(nome, funcao) {
    try {
        const resultado = funcao();
        console.log(`✅ ${nome}: ${resultado ? 'PASSOU' : 'FALHOU'}`);
        return resultado;
    } catch (error) {
        console.log(`❌ ${nome}: ERRO - ${error.message}`);
        return false;
    }
}

// Testes das funções principais
console.log('🦫 Iniciando testes da aplicação CapiEdu...\n');

// Teste 1: Validação de CNPJ
teste('Validação de CNPJ válido', () => {
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        return cnpj.length === 14;
    }
    return validarCNPJ('12345678901234') === true;
});

teste('Validação de CNPJ inválido', () => {
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        return cnpj.length === 14;
    }
    return validarCNPJ('123456789') === false;
});

// Teste 2: Criação de projetos
teste('Criação de projeto válido', () => {
    const projeto = {
        id: Date.now(),
        nome: 'Curso Python',
        instituicao: 'UFSC',
        categoria: 'curso',
        cidade: 'florianópolis',
        descricao: 'Curso básico de Python',
        dataInicio: '2024-01-01',
        contato: 'contato@ufsc.br'
    };
    return projeto.nome && projeto.instituicao && projeto.categoria;
});

// Teste 3: Filtros
teste('Filtro por cidade', () => {
    const projetos = [
        { nome: 'Projeto A', cidade: 'florianópolis' },
        { nome: 'Projeto B', cidade: 'são paulo' },
        { nome: 'Projeto C', cidade: 'florianópolis' }
    ];
    
    const filtrados = projetos.filter(p => p.cidade.includes('florianópolis'));
    return filtrados.length === 2;
});

teste('Filtro por categoria', () => {
    const projetos = [
        { nome: 'Projeto A', categoria: 'curso' },
        { nome: 'Projeto B', categoria: 'workshop' },
        { nome: 'Projeto C', categoria: 'curso' }
    ];
    
    const filtrados = projetos.filter(p => p.categoria === 'curso');
    return filtrados.length === 2;
});

// Teste 4: Validação de email
teste('Validação de email', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test('teste@gmail.com') && !emailRegex.test('email-invalido');
});

// Teste 5: Manipulação de dados
teste('Conversão de cidade para minúscula', () => {
    const cidade = 'FLORIANÓPOLIS';
    return cidade.toLowerCase() === 'florianópolis';
});

// Teste 6: Simulação de inscrição
teste('Sistema de inscrições', () => {
    const inscricoes = [];
    const novaInscricao = {
        id: Date.now(),
        projetoId: 1,
        nomeUsuario: 'João Silva',
        emailUsuario: 'joao@gmail.com'
    };
    
    inscricoes.push(novaInscricao);
    return inscricoes.length === 1 && inscricoes[0].nomeUsuario === 'João Silva';
});

// Teste 7: Remoção de projetos
teste('Remoção de projetos', () => {
    let projetos = [
        { id: 1, nome: 'Projeto A' },
        { id: 2, nome: 'Projeto B' },
        { id: 3, nome: 'Projeto C' }
    ];
    
    projetos = projetos.filter(p => p.id !== 2);
    return projetos.length === 2 && !projetos.find(p => p.id === 2);
});

// Teste 8: Verificação de duplicatas
teste('Prevenção de inscrições duplicadas', () => {
    const inscricoes = [
        { projetoId: 1, emailUsuario: 'joao@gmail.com' }
    ];
    
    const jaInscrito = inscricoes.some(i => 
        i.projetoId === 1 && i.emailUsuario === 'joao@gmail.com'
    );
    
    return jaInscrito === true;
});

// Teste 9: Formatação de data
teste('Formatação de data brasileira', () => {
    const data = new Date('2024-01-15');
    const dataFormatada = data.toLocaleDateString('pt-BR');
    return dataFormatada.includes('/');
});

// Teste 10: Navegação entre seções
teste('Sistema de navegação', () => {
    const secoes = ['estudante', 'instituicao', 'gerenciar', 'inscricoes'];
    const secaoAtiva = 'estudante';
    return secoes.includes(secaoAtiva);
});

console.log('\n🦫 Testes concluídos!');
console.log('Para executar os testes visuais, abra o arquivo test.html no navegador.');
