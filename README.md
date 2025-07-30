# Todo List App - Local Storage

Uma aplicação de lista de tarefas moderna construída com React, TypeScript e Tailwind CSS, utilizando localStorage para persistência de dados.

## 🚀 Funcionalidades

- ✅ Adicionar novas tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Filtrar tarefas (Todas, Ativas, Concluídas)
- ✅ Excluir tarefas individuais
- ✅ Limpar todas as tarefas concluídas
- ✅ Persistência local com localStorage
- ✅ Interface responsiva e moderna
- ✅ Notificações com toast
- ✅ Testes unitários

## 🛠️ Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI
- **Lucide React** - Ícones
- **Vitest** - Framework de testes
- **React Testing Library** - Utilitários para testes

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd todo-ninja-crafted
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

4. Acesse o aplicativo em `http://localhost:8080`

## 🧪 Testes

Execute os testes unitários:

```bash
npm run test
```

Execute os testes com interface gráfica:

```bash
npm run test:ui
```

## 📱 Como Usar

1. **Adicionar Tarefa**: Digite sua tarefa no campo de entrada e pressione Enter ou clique no botão "Add"
2. **Marcar como Concluída**: Clique na checkbox ao lado da tarefa
3. **Filtrar Tarefas**: Use os botões "All", "Active" ou "Completed" para filtrar
4. **Excluir Tarefa**: Clique no ícone de lixeira ao lado da tarefa
5. **Limpar Concluídas**: Clique em "Clear completed" para remover todas as tarefas concluídas

## 💾 Armazenamento

Os dados são armazenados localmente no navegador usando `localStorage`. Isso significa que:

- ✅ Suas tarefas persistem entre sessões do navegador
- ✅ Não é necessário conexão com internet
- ✅ Os dados ficam apenas no seu computador
- ⚠️ Limpar dados do navegador apagará as tarefas
- ⚠️ As tarefas não são sincronizadas entre dispositivos

## 🏗️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run test:ui` - Executa os testes com interface gráfica

## 🎨 Personalização

O projeto usa Tailwind CSS com um tema customizado. As cores principais podem ser modificadas no arquivo `src/index.css` nas variáveis CSS personalizadas:

```css
:root {
  --primary: 142 76% 36%;
  --todo-gradient-start: 142 76% 36%;
  --todo-gradient-end: 158 64% 52%;
  /* ... outras variáveis */
}
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI (shadcn)
│   ├── TodoApp.tsx     # Componente principal
│   └── TodoItem.tsx    # Item individual da lista
├── hooks/              # Hooks customizados
│   ├── useTodos.ts     # Hook para gerenciar todos
│   └── use-toast.ts    # Hook para notificações
├── types/              # Definições de tipos TypeScript
├── lib/                # Utilitários
└── pages/              # Páginas da aplicação
```

## 🔧 Principais Mudanças

Este projeto foi modificado para usar armazenamento local ao invés do Supabase:

1. **Removido**: Dependências do Supabase (`@supabase/supabase-js`)
2. **Removido**: Sistema de autenticação
3. **Removido**: Componentes de Auth
4. **Modificado**: Hook `useTodos` para usar localStorage
5. **Simplificado**: Página Index sem autenticação
6. **Atualizado**: Testes para funcionar com localStorage

## 📝 Licença

Este projeto está sob a licença MIT.
