# Guia de Implementação - Autenticação JWT

## Passo a Passo para Implementar no Repositório GitHub

### 1. Dependências Necessárias

Instale as seguintes dependências no seu projeto:

```bash
npm install jsonwebtoken @types/jsonwebtoken js-cookie @types/js-cookie
```

### 2. Estrutura de Arquivos a Criar

Crie os seguintes arquivos na estrutura do seu projeto:

```
src/
├── contexts/
│   └── AuthContext.tsx          # Novo arquivo
├── components/
│   └── ProtectedRoute.tsx       # Novo arquivo
└── pages/
    └── Login.tsx                # Novo arquivo
```

### 3. Arquivos a Modificar

Você precisará modificar os seguintes arquivos existentes:

1. **src/App.tsx** - Adicionar roteamento e contexto de autenticação
2. **src/components/Layout.tsx** - Adicionar menu de usuário e logout

### 4. Implementação Detalhada

#### 4.1. Criar AuthContext.tsx

Copie o conteúdo do arquivo `src/contexts/AuthContext.tsx` desta implementação.

**Principais funcionalidades:**
- Gerenciamento de estado de autenticação
- Login/logout com JWT
- Persistência de token em cookies
- Simulação de backend com usuários mock

**Usuários de teste:**
- Email: `admin@bia.com` | Senha: `admin123`
- Email: `trader@bia.com` | Senha: `trader123`

#### 4.2. Criar ProtectedRoute.tsx

Copie o conteúdo do arquivo `src/components/ProtectedRoute.tsx`.

**Funcionalidades:**
- Proteção de rotas privadas
- Redirecionamento para login se não autenticado
- Loading state durante verificação

#### 4.3. Criar Login.tsx

Copie o conteúdo do arquivo `src/pages/Login.tsx`.

**Funcionalidades:**
- Formulário de login e registro
- Validação de campos
- Interface responsiva
- Botão para credenciais demo

#### 4.4. Modificar App.tsx

Atualize o arquivo com as seguintes mudanças:

```tsx
// Novos imports
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";

// Estrutura de rotas atualizada
<AuthProvider>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
    <Route path="/bot" element={<ProtectedRoute><Bot /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</AuthProvider>
```

#### 4.5. Modificar Layout.tsx

Adicione os seguintes imports e funcionalidades:

```tsx
// Novos imports
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Adicionar no componente
const { user, logout } = useAuth();

// Substituir a área do cabeçalho com menu de usuário
```

### 5. Configuração de Produção

#### 5.1. Variáveis de Ambiente

Para produção, você deve:

1. Mover o JWT_SECRET para variáveis de ambiente:
```bash
JWT_SECRET=sua-chave-secreta-super-forte-aqui
```

2. Implementar backend real para autenticação
3. Configurar HTTPS para cookies seguros

#### 5.2. Backend Real (Recomendado)

Para um ambiente de produção real, implemente:

1. **API de Autenticação:**
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/refresh
   - POST /api/auth/logout

2. **Middleware de Verificação JWT**

3. **Database para Usuários**

### 6. Funcionalidades Implementadas

✅ **Login/Logout com JWT**
✅ **Registro de novos usuários**
✅ **Proteção de rotas**
✅ **Persistência de sessão**
✅ **Interface responsiva**
✅ **Menu de usuário no header**
✅ **Validação de formulários**
✅ **Loading states**
✅ **Credenciais de demonstração**

### 7. Fluxo de Uso

1. **Usuário não autenticado:** É redirecionado para `/login`
2. **Login bem-sucedido:** Token JWT salvo em cookie, redirecionado para dashboard
3. **Navegação:** Todas as rotas protegidas por ProtectedRoute
4. **Logout:** Remove token e redireciona para login
5. **Refresh página:** Token é verificado automaticamente

### 8. Segurança

- Token JWT com expiração de 24h
- Cookies httpOnly (recomendado para produção)
- Validação de token em todas as requisições protegidas
- Redirecionamento automático em caso de token inválido

### 9. Personalização

Para adaptar ao seu backend:

1. Modifique as URLs das APIs em `AuthContext.tsx`
2. Ajuste a estrutura de dados do usuário
3. Implemente refresh token se necessário
4. Configure cookies seguros para HTTPS

### 10. Teste da Implementação

1. Acesse a aplicação
2. Você será redirecionado para `/login`
3. Use as credenciais demo: `admin@bia.com` / `admin123`
4. Após login, acesse qualquer rota protegida
5. Teste o logout através do menu do usuário

---

## Notas Importantes

- Esta implementação usa um sistema de autenticação simulado para demonstração
- Para produção, implemente um backend real com database
- Considere usar bibliotecas como NextAuth.js para implementações mais robustas
- Sempre use HTTPS em produção para proteger tokens JWT