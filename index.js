const readline = require('readline');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const DATA_FILE = path.join(__dirname, 'inventario.json');


class GerenciadorInventario {
    constructor() {
        this.produtos = [];
        this.proximoId = 1;
        this.carregarDados();
    }


    carregarDados() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const dados = fs.readFileSync(DATA_FILE, 'utf8');
                const parsed = JSON.parse(dados);
                this.produtos = parsed.produtos || [];
                this.proximoId = parsed.proximoId || 1;
                console.log('✓ Dados carregados com sucesso!\n');
            }
        } catch (erro) {
            console.log('⚠ Erro ao carregar dados. Iniciando com inventário vazio.\n');
        }
    }


    salvarDados() {
        try {
            const dados = {
                produtos: this.produtos,
                proximoId: this.proximoId
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2), 'utf8');
            console.log('✓ Dados salvos automaticamente!\n');
        } catch (erro) {
            console.log('⚠ Erro ao salvar dados:', erro.message, '\n');
        }
    }


    adicionarProduto(nome, categoria, quantidade, preco) {
        const produto = {
            id: this.proximoId++,
            nome,
            categoria,
            quantidade: parseInt(quantidade),
            preco: parseFloat(preco)
        };

        this.produtos.push(produto);
        this.salvarDados();
        console.log(`\n✓ Produto "${nome}" adicionado com sucesso! ID: ${produto.id}\n`);
    }


    listarProdutos(filtroCategoria = null, ordenarPor = null) {
        let produtosFiltrados = [...this.produtos];

        // Aplica filtro de categoria se fornecido
        if (filtroCategoria) {
            produtosFiltrados = produtosFiltrados.filter(p =>
                p.categoria.toLowerCase() === filtroCategoria.toLowerCase()
            );
        }


        if (ordenarPor) {
            produtosFiltrados.sort((a, b) => {
                if (ordenarPor === 'nome') return a.nome.localeCompare(b.nome);
                if (ordenarPor === 'quantidade') return a.quantidade - b.quantidade;
                if (ordenarPor === 'preco') return a.preco - b.preco;
                return 0;
            });
        }

        if (produtosFiltrados.length === 0) {
            console.log('\n⚠ Nenhum produto encontrado.\n');
            return;
        }

        console.log('\n' + '='.repeat(100));
        console.log('| ID  | Nome                          | Categoria            | Quantidade | Preço      |');
        console.log('='.repeat(100));

        produtosFiltrados.forEach(p => {
            console.log(
                `| ${String(p.id).padEnd(3)} | ${p.nome.padEnd(29)} | ${p.categoria.padEnd(20)} | ${String(p.quantidade).padEnd(10)} | R$ ${p.preco.toFixed(2).padEnd(7)} |`
            );
        });

        console.log('='.repeat(100) + '\n');
    }


    buscarPorId(id) {
        return this.produtos.find(p => p.id === parseInt(id));
    }


    buscarPorNome(nome) {
        return this.produtos.filter(p =>
            p.nome.toLowerCase().includes(nome.toLowerCase())
        );
    }


    atualizarProduto(id, novoDados) {
        const produto = this.buscarPorId(id);

        if (!produto) {
            console.log(`\n⚠ Produto com ID ${id} não encontrado.\n`);
            return false;
        }

        if (novoDados.nome) produto.nome = novoDados.nome;
        if (novoDados.categoria) produto.categoria = novoDados.categoria;
        if (novoDados.quantidade !== undefined) produto.quantidade = parseInt(novoDados.quantidade);
        if (novoDados.preco !== undefined) produto.preco = parseFloat(novoDados.preco);

        this.salvarDados();
        console.log(`\n✓ Produto ID ${id} atualizado com sucesso!\n`);
        return true;
    }

    excluirProduto(id) {
        const index = this.produtos.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            console.log(`\n⚠ Produto com ID ${id} não encontrado.\n`);
            return false;
        }

        const produtoRemovido = this.produtos.splice(index, 1)[0];

        // Reorganizar IDs sequencialmente
        this.produtos.forEach((produto, idx) => {
            produto.id = idx + 1;
        });

        this.proximoId = this.produtos.length + 1;

        this.salvarDados();
        console.log(`\n✓ Produto "${produtoRemovido.nome}" removido com sucesso!`);
        console.log(`✓ IDs reorganizados automaticamente!\n`);
        return true;
    }


    exibirDetalhes(produto) {
        console.log('\n' + '-'.repeat(50));
        console.log('DETALHES DO PRODUTO');
        console.log('-'.repeat(50));
        console.log(`ID:         ${produto.id}`);
        console.log(`Nome:       ${produto.nome}`);
        console.log(`Categoria:  ${produto.categoria}`);
        console.log(`Quantidade: ${produto.quantidade} unidades`);
        console.log(`Preço:      R$ ${produto.preco.toFixed(2)}`);
        console.log('-'.repeat(50) + '\n');
    }
}


function pergunta(questao) {
    return new Promise((resolve) => {
        rl.question(questao, (resposta) => {
            resolve(resposta.trim());
        });
    });
}

async function menuPrincipal(gerenciador) {
    console.clear();
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║        AGILSTORE - GESTÃO DE INVENTÁRIO        ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log('1. Adicionar Produto');
    console.log('2. Listar Produtos');
    console.log('3. Atualizar Produto');
    console.log('4. Excluir Produto');
    console.log('5. Buscar Produto');
    console.log('0. Sair\n');

    const opcao = await pergunta('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            await adicionarProdutoMenu(gerenciador);
            break;
        case '2':
            await listarProdutosMenu(gerenciador);
            break;
        case '3':
            await atualizarProdutoMenu(gerenciador);
            break;
        case '4':
            await excluirProdutoMenu(gerenciador);
            break;
        case '5':
            await buscarProdutoMenu(gerenciador);
            break;
        case '0':
            console.log('\n✓ Encerrando aplicação. Até logo!\n');
            rl.close();
            return;
        default:
            console.log('\n⚠ Opção inválida!\n');
            await pergunta('Pressione ENTER para continuar...');
    }

    await menuPrincipal(gerenciador);
}


async function adicionarProdutoMenu(gerenciador) {
    console.log('\n--- ADICIONAR PRODUTO ---\n');

    const nome = await pergunta('Nome do Produto: ');
    const categoria = await pergunta('Categoria: ');
    const quantidade = await pergunta('Quantidade em Estoque: ');
    const preco = await pergunta('Preço (R$): ');

    if (!nome || !categoria || !quantidade || !preco) {
        console.log('\n⚠ Todos os campos são obrigatórios!\n');
    } else if (isNaN(quantidade) || isNaN(preco)) {
        console.log('\n⚠ Quantidade e Preço devem ser números válidos!\n');
    } else {
        gerenciador.adicionarProduto(nome, categoria, quantidade, preco);
    }

    await pergunta('Pressione ENTER para continuar...');
}

// Menu: Listar Produtos
async function listarProdutosMenu(gerenciador) {
    console.log('\n--- LISTAR PRODUTOS ---\n');
    console.log('1. Listar todos');
    console.log('2. Filtrar por categoria');
    console.log('3. Ordenar produtos\n');

    const opcao = await pergunta('Escolha uma opção: ');

    let filtroCategoria = null;
    let ordenarPor = null;

    if (opcao === '2') {
        filtroCategoria = await pergunta('Digite a categoria: ');
    } else if (opcao === '3') {
        console.log('\n1. Ordenar por nome');
        console.log('2. Ordenar por quantidade');
        console.log('3. Ordenar por preço\n');
        const ordOpcao = await pergunta('Escolha: ');
        if (ordOpcao === '1') ordenarPor = 'nome';
        else if (ordOpcao === '2') ordenarPor = 'quantidade';
        else if (ordOpcao === '3') ordenarPor = 'preco';
    }

    gerenciador.listarProdutos(filtroCategoria, ordenarPor);
    await pergunta('Pressione ENTER para continuar...');
}

async function atualizarProdutoMenu(gerenciador) {
    console.log('\n--- ATUALIZAR PRODUTO ---\n');

    const id = await pergunta('Digite o ID do produto: ');
    const produto = gerenciador.buscarPorId(id);

    if (!produto) {
        console.log(`\n⚠ Produto com ID ${id} não encontrado.\n`);
        await pergunta('Pressione ENTER para continuar...');
        return;
    }

    gerenciador.exibirDetalhes(produto);

    console.log('Deixe em branco para manter o valor atual.\n');
    const nome = await pergunta(`Nome [${produto.nome}]: `);
    const categoria = await pergunta(`Categoria [${produto.categoria}]: `);
    const quantidade = await pergunta(`Quantidade [${produto.quantidade}]: `);
    const preco = await pergunta(`Preço [${produto.preco}]: `);

    const novoDados = {};
    if (nome) novoDados.nome = nome;
    if (categoria) novoDados.categoria = categoria;
    if (quantidade) novoDados.quantidade = quantidade;
    if (preco) novoDados.preco = preco;

    gerenciador.atualizarProduto(id, novoDados);
    await pergunta('Pressione ENTER para continuar...');
}

// Menu: Excluir Produto
async function excluirProdutoMenu(gerenciador) {
    console.log('\n--- EXCLUIR PRODUTO ---\n');

    const id = await pergunta('Digite o ID do produto: ');
    const produto = gerenciador.buscarPorId(id);

    if (!produto) {
        console.log(`\n⚠ Produto com ID ${id} não encontrado.\n`);
        await pergunta('Pressione ENTER para continuar...');
        return;
    }

    gerenciador.exibirDetalhes(produto);
    const confirma = await pergunta('Confirma a exclusão? (s/n): ');

    if (confirma.toLowerCase() === 's') {
        gerenciador.excluirProduto(id);
    } else {
        console.log('\n⚠ Exclusão cancelada.\n');
    }

    await pergunta('Pressione ENTER para continuar...');
}

// Menu: Buscar Produto
async function buscarProdutoMenu(gerenciador) {
    console.log('\n--- BUSCAR PRODUTO ---\n');
    console.log('1. Buscar por ID');
    console.log('2. Buscar por Nome\n');

    const opcao = await pergunta('Escolha uma opção: ');

    if (opcao === '1') {
        const id = await pergunta('Digite o ID: ');
        const produto = gerenciador.buscarPorId(id);

        if (produto) {
            gerenciador.exibirDetalhes(produto);
        } else {
            console.log(`\n⚠ Produto com ID ${id} não encontrado.\n`);
        }
    } else if (opcao === '2') {
        const nome = await pergunta('Digite o nome (ou parte): ');
        const produtos = gerenciador.buscarPorNome(nome);

        if (produtos.length > 0) {
            console.log(`\n✓ ${produtos.length} produto(s) encontrado(s):\n`);
            produtos.forEach(p => gerenciador.exibirDetalhes(p));
        } else {
            console.log('\n⚠ Nenhum produto encontrado.\n');
        }
    }

    await pergunta('Pressione ENTER para continuar...');
}

async function iniciar() {
    const gerenciador = new GerenciadorInventario();
    await menuPrincipal(gerenciador);
}

iniciar();