# Gerenciamento-Produtos-AgilStore
AgilStore é um sistema de gerenciamento de inventário para lojas de eletrônicos desenvolvido em Node.js com interface de terminal interativa.

Funcionalidades Principais:

- O sistema permite operações completas de CRUD (Criar, Ler, Atualizar, Deletar) para produtos:

--Adicionar produtos com ID único gerado automaticamente;
--Listar produtos em tabelas formatadas com opções de filtro por categoria e ordenação por nome, quantidade ou preço;
--Atualizar informações de produtos existentes;
--Excluir produtos com reorganização automática de IDs para manter a sequência;
--Buscar produtos por ID ou nome (busca parcial);

- Características Técnicas

--Persistência automática de dados em arquivo JSON (inventario.json);
--Validações de dados antes de processar operações;
--Interface intuitiva com menu interativo no terminal;
--Confirmações antes de excluir produtos;
--Desenvolvido com módulos nativos do Node.js (readline, fs, path);

- Requisitos

--Node.js versão 12 ou superior;
--Compatível com Windows, Linux e MacOS;
