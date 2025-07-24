# Todo List App - Test Driven Development

Este é um aplicativo Todo List moderno construído com **React**, **TypeScript**, **Tailwind CSS** e seguindo a metodologia **Test Driven Development (TDD)**.

## 🚀 Características

- ✅ **Test Driven Development**: Testes escritos antes da implementação
- 🎨 **Design Moderno**: Interface elegante com tema dark e gradientes
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 💾 **Persistência**: Dados salvos no localStorage
- 🔍 **Filtros**: Visualize todos, ativos ou concluídos
- ⚡ **Performance**: Hooks otimizados com useMemo
- 🧪 **Cobertura de Testes**: Testes unitários e de integração

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para styling
- **Radix UI** para componentes acessíveis
- **Vitest** para testes
- **Testing Library** para testes de componentes
- **Lucide React** para ícones

## 🧪 Test Driven Development

Este projeto foi desenvolvido seguindo a metodologia TDD:

1. **Red**: Escrever testes que falham
2. **Green**: Implementar código mínimo para passar nos testes
3. **Refactor**: Melhorar o código mantendo os testes passando

### Estrutura de Testes

```
src/
├── components/
│   ├── TodoApp.test.tsx          # Testes de integração
│   ├── TodoItem.test.tsx         # Testes de componente
├── hooks/
│   ├── useTodos.test.ts          # Testes do hook customizado
└── test/
    └── setup.ts                  # Configuração dos testes
```

## 🎨 Design System

O aplicativo utiliza um design system customizado com:

- **Cores semânticas**: Definidas em CSS custom properties
- **Gradientes**: Para elementos visuais atraentes
- **Tokens de design**: Cores, espaçamentos e tipografia consistentes
- **Tema dark**: Interface moderna e agradável aos olhos

### Cores Principais

- **Primary**: Verde (#16a34a) - Para ações principais
- **Secondary**: Cinza escuro - Para elementos secundários
- **Surface**: Fundo dos cards e componentes
- **Completed**: Verde para todos concluídos
- **Pending**: Amarelo para todos pendentes

## 📦 Funcionalidades

### ✨ Adicionar Todos
- Digite uma tarefa e pressione Enter ou clique em "Add"
- Validação para evitar todos vazios
- Feedback visual com toast notifications

### ✅ Marcar como Concluído
- Clique no checkbox para alternar status
- Efeito visual de riscado para items concluídos
- Badge "Done" para todos concluídos

### 🗑️ Deletar Todos
- Botão de lixeira para remover todos
- Confirmação visual com toast

### 🔍 Filtrar Todos
- **All**: Mostra todos os todos
- **Active**: Apenas todos não concluídos
- **Completed**: Apenas todos concluídos

### 📊 Estatísticas
- Contador de items restantes
- Contador de items concluídos
- Botão para limpar todos concluídos

### 💾 Persistência
- Dados salvos automaticamente no localStorage
- Carregamento automático ao abrir a aplicação

## 🧪 Executando os Testes

```bash
# Rodar todos os testes
npm run test

# Rodar testes em modo watch
npm run test:watch

# Rodar testes com coverage
npm run test:coverage
```

## 🏗️ Arquitetura

### Hooks Customizados
- `useTodos`: Gerencia estado e lógica dos todos
- Separação de responsabilidades
- Reutilização de lógica

### Componentes
- `TodoApp`: Componente principal
- `TodoItem`: Componente individual do todo
- Componentes UI do shadcn/ui

### Tipos TypeScript
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

type TodoFilter = 'all' | 'active' | 'completed';
```

## 🎯 Próximos Passos

- [ ] Edição inline de todos
- [ ] Drag and drop para reordenar
- [ ] Categorias/tags
- [ ] Sync com backend
- [ ] PWA (Progressive Web App)
- [ ] Temas personalizáveis

## 🤝 Contribuindo

1. Escreva os testes primeiro (TDD)
2. Implemente a funcionalidade
3. Mantenha o design system
4. Garanta que todos os testes passem

---

**Desenvolvido com ❤️ seguindo Test Driven Development**