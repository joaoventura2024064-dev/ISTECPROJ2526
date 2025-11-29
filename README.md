# Projeto S.E.I.O.S <br> Simulador Epidémico Interativo de Observação Sistémica #

**Instituição:** ISTEC Porto<br>
**Curso:** Engenharia Informática<br>
**Cadeira:** Sistemas Multimédia I<br>

**Fase:** Sprint A (Análise e Desenho)<br>

## Sobre o Projeto

Este repositório contém o projeto académico **S.E.I.O.S - Simulador Epidémico Interativo de Observação Sistémica**, desenvolvido no âmbito da unidade curricular de Sistemas Multimédia I. O objetivo principal é o desenvolvimento de um sistema de simulação, conforme descrito nas User Stories e documentação de requisitos.

Atualmente, o projeto encontra-se na fase de levantamento de requisitos, modelação e estruturação inicial.

## Estrutura do Repositório

A organização do projeto é a seguinte:

- **`docs/`**: Contém toda a documentação do projeto.
    - `LEI-A2-S1-SMUL1-PI-UML.drawio`: Diagramas UML (Use Cases, Classes, etc.).
    - `DicionarioDados.xlsx`: Dicionário de Dados.
    - `FURPS.xlsx`: Levantamento de Requisitos Não Funcionais (FURPS+).
    - `Relatorio.docx`: Relatório de progresso e documentação geral.
    - `Sprint_A_Apresentacao_v0.pptx`: Apresentação da Sprint A.
- **`resources/`**: Recursos fornecidos pelo professor.
- **`frontend/`**: Diretoria reservada para o código da aplicação cliente (a ser implementado).
- **`backend/`**: Diretoria reservada para o código do servidor/API (a ser implementado).

## Funcionalidades Planeadas

Com base nas User Stories iniciais, o sistema irá incluir:

- **Execução de Simulações**: Funcionalidade central para correr cenários de simulação.
- **Gestão de Dados**: Estrutura relacional para suportar a informação do sistema.
- **Relatórios**: Geração de relatórios sobre o trabalho produzido e resultados das simulações.

## Planeamento

### Sprint A

| User Story | Descrição | Obrigatoriedade | Responsável | Conclusão | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US_A001** | *Como Gestor de Projeto, eu pretendo que a equipa faça o levantamento de requisitos funcionais e não funcionais, pelo método FURPS+.* | 1 | João | 100% | Completed |
| **US_A002** | *Como Analista de Software, eu pretendo perceber as funcionalidades do sistema através do diagrama de Use Cases, claro e completo.* | 1 | João | 100% | Completed |
| **US_A006** | *Como Programador, eu pretendo preparar, configurar e partilhar um repositório GitHub com a equipa de desenvolvimento e orientação.* | 2 | João | 100% | Completed |
| **US_A005** | *Como Analista de Software, eu pretendo detalhar o cenário de sucesso principal do UC “Executar Simulação” através da descrição estruturada de UC.* | 4 | João | 100% | Completed |
| **US_A008** | *Como Analista de Software, eu pretendo estruturar num fluxograma o processo detalhado do UC “Executar Simulação”.* | 4 | João | 100% | Completed |
| **US_A003** | *Como Gestor de Bases de Dados, eu pretendo perceber a estrutura e a relação da informação necessária ao sistema através do Modelo Relacional de Dados.* | 1 | Zé | 100% | Completed |
| **US_A004** | *Como Analista de Software, eu pretendo perceber o domínio do sistema, especificando os agregados, as entidades e os seus atributos, através do Modelo de Domínio.* | 1 | Zé | 100% | Completed |
| **US_A009** | *Como Gestor de Projeto, eu pretendo preparar a sprint review para apresentação (PPT ou outro) no dia de avaliação (deadline da sprint).* | 2 | Zé | 100% | Completed |
| **US_A010** | *Como Gestor de Projeto, eu pretendo compilar num relatório, todo o trabalho produzido.* | 3 | Zé | 100% | Completed |
| **US_A007** | *Como Analista de Software, eu pretendo detalhar informação específica do Modelo Relacional de Dados, num Dicionário de Dados (DD).* | 3 | Zé | 100% | Completed |


### Sprint B

| User Story | Descrição | Obrigatoriedade | Responsável | Conclusão | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US_B001** | *Como Designer UI/UX, eu pretendo criar um protótipo (wireframes/mockups de alta fidelidade) da plataforma web com os ecrãs-chave, incluindo as páginas de registo, login, perfil do utilizador, configuração de simulação, visualização de resultados e histórico, respeitando os princípios de usabilidade e responsividade.* | 1 | João | 0% | Pending |
| **US_B002** | *Como Designer UI/UX, eu pretendo definir e detalhar as personas dos utilizadores (mínimo duas, ex: investigador, profissional de saúde pública) e especificar os seus objetivos ao usar o simulador.* | 3 | João | 0% | Pending |
| **US_B003** | *Como Designer UI/UX, eu pretendo criar um guia de estilo web que especifique os elementos gráficos (paleta de cores, tipografia, iconografia, componentes de UI) para garantir a consistência visual da plataforma.* | 4 | João | 0% | Pending |
| **US_B004** | *Como Programador Frontend, eu pretendo configurar o ambiente de desenvolvimento React.js e criar a estrutura inicial da aplicação, incluindo os componentes básicos de layout (cabeçalho, rodapé, navegação).* | 1 | João | 0% | Pending |
| **US_B005** | *Como Programador Frontend, eu pretendo implementar a página de registo de utilizadores, permitindo que novos utilizadores criem uma conta.* | 1 | João | 0% | Pending |
| **US_B006** | *Como Programador Frontend, eu pretendo implementar a página de login para que os utilizadores registados possam aceder à plataforma.* | 1 | João | 0% | Pending |
| **US_B007** | *Como Programador Frontend, eu pretendo desenvolver a página de perfil do utilizador, onde este pode visualizar e atualizar os seus dados pessoais.* | 4 | João | 0% | Pending |
| **US_B008** | *Como Programador Backend, eu pretendo implementar o esquema da base de dados relacional (MySQL) incluindo chaves primárias e estrangeiras.* | 1 | Zé | 0% | Pending |
| **US_B009** | *Como Programador Backend, eu pretendo desenvolver os endpoints da API (Flask) para o registo de novos utilizadores, garantindo a validação dos dados e o armazenamento seguro da palavra-passe.* | 3 | Zé | 0% | Pending |
| **US_B010** | *Como Programador Backend, eu pretendo desenvolver os endpoints da API (Flask) para a autenticação de utilizadores (login), validando as credenciais e gerando tokens de sessão.* | 2 | Zé | 0% | Pending |
| **US_B011** | *Como Programador Backend, eu pretendo desenvolver os endpoints da API (Flask) para a consulta e atualização dos dados do perfil do utilizador.* | 4 | Zé | 0% | Pending |
| **US_B012** | *Como Programador Backend, eu pretendo criar uma query e respetivo endpoint na API (Flask) para obter o número total de utilizadores registados e ativos na plataforma.* | 3 | Zé | 0% | Pending |
| **US_B013** | *Como Programador Backend, eu pretendo criar uma query e respetivo endpoint na API (Flask) para obter o número total de simulações realizadas na plataforma até ao momento.* | 2 | Zé | 0% | Pending |
| **US_B014** | *Como Programador Backend, eu pretendo criar uma query e respetivo endpoint na API (Flask) para obter o número de simulações realizadas por um utilizador específico.* | 2 | Zé | 0% | Pending |
| **US_B015** | *Como Gestor de Bases de Dados, eu pretendo popular a base de dados com dados de exemplo (ex: um administrador, alguns utilizadores, algumas simulações fictícias) para facilitar o desenvolvimento e testes iniciais das funcionalidades e queries de dashboard.* | 4 | Zé | 0% | Pending |
| **US_B016** | *Como Gestor de Projeto, eu pretendo que a equipa atualize o plano de trabalho no Diagrama de Gantt para a Sprint B.* | 2 | João | 0% | Pending |
| **US_B017** | *Como Gestor de Projeto, eu pretendo que a equipa prepare a apresentação para Sprint review B, destacando os protótipos de UI/UX, a estrutura frontend e queries iniciais implementadas.* | 2 | João | 0% | Pending |
| **US_B018** | *Como Gestor de Projeto, eu pretendo compilar num relatório, todo o trabalho produzido.* | 3 | Zé | 0% | Pending | 

### Sprint C

| User Story | Descrição | Obrigatoriedade | Responsável | Conclusão | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | | | | | 
| | | | | | 


## Equipa

- **João Ventura** (2024064)
- **José Ferreira** (2024128)

---
*Este ficheiro será atualizado à medida que o desenvolvimento avança para as fases de implementação.*
