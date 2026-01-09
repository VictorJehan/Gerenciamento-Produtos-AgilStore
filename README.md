# Gerenciamento-Produtos-AgilStore
AgilStore é um sistema de gerenciamento de inventário para lojas de eletrônicos desenvolvido em Node.js com interface de terminal interativa.

Funcionalidades Principais:

- O sistema permite operações completas de CRUD (Criar, Ler, Atualizar, Deletar) para produtos:

1. Adicionar produtos com ID único gerado automaticamente;
2. Listar produtos em tabelas formatadas com opções de filtro por categoria e ordenação por nome, quantidade ou preço;
3. Atualizar informações de produtos existentes;
4. Excluir produtos com reorganização automática de IDs para manter a sequência;
5. Buscar produtos por ID ou nome (busca parcial);

- Características Técnicas

1. Persistência automática de dados em arquivo JSON (inventario.json);
2. Validações de dados antes de processar operações;
3. Interface intuitiva com menu interativo no terminal;
4. Confirmações antes de excluir produtos;
5. Desenvolvido com módulos nativos do Node.js (readline, fs, path);

- Requisitos

1. Node.js versão 12 ou superior;
2. Compatível com Windows, Linux e MacOS;
