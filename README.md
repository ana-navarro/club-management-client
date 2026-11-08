# club-management-client

Sistema do cliente: React, TypeScript, Material UI, SWR e Storybook. Chama só o `club-management-client-bff`, em `/api`.

## Páginas

| Rota | Página | Acesso |
|------|--------|--------|
| `/login` | Login com email e senha, Google, Facebook e o botão de cadastro | Só sem sessão |
| `/signup` | Cadastro e aviso para conferir o email | Só sem sessão |
| `/forgot-password` | Pedido de recuperação e, com `?token=`, a nova senha | Pública |
| `/verify-email?token=` | Confirmação do email do cadastro | Pública |
| `/confirm-social-link?token=` | Confirmação da primeira entrada com o Facebook | Pública |
| `/auth/callback#code=` | Retorno do Google e do Facebook, que troca o código pela sessão | Pública |
| `/` | Página inicial | Exige sessão |

Toda tela usa a paleta `#224248`, `#325E6A`, `#44A1A4` e `#FF9A00`, nos temas claro e escuro, em português e inglês. Os tokens e os contrastes estão em `src/shared/theme/theme.ts`.

## Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (o ambiente completo sobe com `npm run dev` na raiz do workspace) |
| `npm run lint` | ESLint, incluindo a proibição de `as`, `!`, `any`, `unknown` e `never` |
| `npm run test:coverage` | Jest e Testing Library, com mínimo de 90% das linhas |
| `npm run storybook` | Catálogo de componentes em http://localhost:6006 |
| `npm run test:storybook` | Acessibilidade de cada story, nos temas claro e escuro |

## Estrutura

- `src/pages/<Página>/`: componentes, serviços e hooks exclusivos de cada página.
- `src/shared/`: o que mais de uma página usa, como `PublicLayout`, `SocialLoginButtons`, `ResendVerification`, sessão, i18n e tema.
