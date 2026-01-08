# Simulador - Backend

Este projeto utiliza **Python (Flask)** e **SQLite**.
---------------------------------------------------------

## Configuração Inicial

|| Passos para configurar o ambiente de desenvolvimento pela primeira vez (ou após clonar o repositório): 


### 1. Pré-requisitos
**Python 3.8+** instalado.

### 2. Instalar Dependências
Abrir o terminal na pasta `backend` e executar:

```bash
pip install -r requirements.txt
```

### 3. Configurar a Base de Dados
A base de dados (`.db`) **não** está incluída no repositório. Tem de ser criada localmente.
O seguinte script para criar as tabelas e insere os dados essenciais (tipos de utilizador, géneros, admin, etc.):

```bash
python seed.py
```
> **Nota:** este script cria o ficheiro `projecto_integrador.db` na raiz da pasta backend.

### 4. Iniciar o Servidor
Para arrancar a API:

```bash
python app.py
```
O servidor fica online em: `http://127.0.0.1:5000`

---
## Autenticação (JWT)
O sistema utiliza **JSON Web Tokens (JWT)** para autenticação.
- O login retorna um `access_token`.
- Futuramente este token deve ser enviado no header `Authorization: Bearer <token>` para rotas protegidas.

## Uploads
As imagens de perfil são guardadas na pasta `backend/static/uploads`.
Necessário garantir que esta pasta tem permissões de escrita (o script cria-a automaticamente).

## Documentação API
Consultar o ficheiro [API_DOCS.md] para ver a lista de endpoints disponíveis para o Frontend, incluindo exemplos de payloads.

## Testes
Para verificar se tudo está a funcionar corretamente (Registo, Login, Uploads, Validação), podemos correr o script de testes:

```bash
python test_api.py
```

