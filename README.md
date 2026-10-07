<div align="center">

# I Did It.

**Não basta dizer. Prove.**

Um registro pessoal de compromissos: objetivos travados desde o início, um valor em jogo em cada um,<br>
provas reais anexadas e um troféu só quando o trabalho está de fato concluído.

![Seis troféus em forma de pin esmaltado: Projeto Rondon, PUCRS Finance, SalvaTon, StoryWeaver, Case Closed e Meu Mundo Azul](docs/trophies.png)

</div>

---

## O que é

A maioria dos portfólios lista o que alguém *diz* ter feito. O **I Did It** transforma cada conquista em um pequeno contrato que qualquer pessoa pode conferir:

1. **Trave os objetivos.** Antes de começar, você define o que significa "concluído". Depois de travados, os objetivos não podem ser editados.
2. **Coloque algo em jogo.** Cada objetivo carrega uma parte do valor em jogo; o total do compromisso é a soma deles.
3. **Anexe a prova.** Fotos, PDFs, posts, repositórios e sites no ar ficam ao lado do registro.
4. **Conquiste o troféu.** Um pin esmaltado único é concedido só quando todos os objetivos são cumpridos. Tentativas que falharam continuam no registro, sem troféu.

Este repositório é o perfil em uso de Rodrigo da Rosa, com dez compromissos reais de 2021 até hoje, incluindo este próprio projeto.

<table>
  <tr>
    <td width="50%"><img src="docs/trophy-room.jpg" alt="Sala de Troféus com seis troféus em forma de pin esmaltado"><br><sub><b>Sala de Troféus</b>: cada compromisso verificado como um pin colecionável</sub></td>
    <td width="50%"><img src="docs/goal.jpg" alt="Aba Meta com O que significa para mim e a lista de objetivos"><br><sub><b>Meta</b>: o que é o projeto, por que ele importa e os objetivos travados</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/proof.jpg" alt="Aba Verificação com prévias ao vivo de detectivesql.com e de um post no LinkedIn"><br><sub><b>Verificação</b>: documentos de prova, incluindo prévias ao vivo de páginas reais</sub></td>
    <td width="50%"><img src="docs/stakes.jpg" alt="Aba Em jogo mostrando R$500 no total, R$200 garantidos e R$300 perdidos"><br><sub><b>Em jogo</b>: a parte de cada objetivo, garantida ou perdida</sub></td>
  </tr>
</table>

## Os registros

| Troféu | Projeto | Período | Objetivos | Em jogo |
|---|---|---|:---:|---:|
| **Impact in Action** | Projeto Rondon: oficinas para mais de 120 jovens em Vitória do Jari, Amapá | nov 2021 – jul 2022 | 5 / 5 | R$ 500 |
| **Market Mind** | Liga Financeira PUCRS: conteúdo educativo e a primeira Semana do Mercado Financeiro | mar – ago 2023 | 4 / 4 | R$ 450 |
| **Built to Win** | ToninhaThon: SalvaTon, 1º lugar, incubado pelo SEBRAE | 2025 | 3 / 3 | R$ 500 |
| **Data for Millions** | Pratham Books: plataforma de analytics Airflow → PostgreSQL para a StoryWeaver (Develop For Good) | mai – ago 2023 | 3 / 3 | R$ 500 |
| **Case Closed** | detectiveSQL: um jogo de mistério em SQL para o navegador, no ar em [detectivesql.com](https://detectivesql.com/) | 2026 | 2 / 2 | R$ 300 |
| **From Problem to Product** | Meu Mundo Azul: um app para o diagnóstico precoce do autismo, construído com a AGES | ago 2021 – nov 2022 | 5 / 5 | R$ 500 |
| — | Tech Fellow · Fundação Estudar: inscrição feita e candidatura preparada, não aceito | 2022 | 2 / 3 | R$ 500 (R$ 300 perdidos) |
| — | ELAP 2022: pré-selecionado como suplente para a Concordia University, sem vaga | 2022 | 2 / 3 | R$ 500 (R$ 250 perdidos) |
| — | Behring Founders: em andamento | 2026 | 3 / 6 | R$ 500 |
| — | I Did It: este projeto, em andamento ([código-fonte](https://github.com/CMaRodrigo/pixel-perfect-capture-7666)) | out 2026 – | 3 / 6 | R$ 500 |

Quando um registro mostra *"Datas tiradas dos documentos anexados"*, as datas vêm da própria prova: planos de trabalho, posts no Instagram e no LinkedIn, metadados do Canva e do GitLab. Registros sem essa linha usam datas ilustrativas.

## O que é real e o que é simulado

Este é um protótipo funcional, e ele deixa claro onde estão os limites:

| | Situação |
|---|---|
| Projetos, objetivos, documentos de prova | **Reais.** Fornecidos pelo dono e empacotados com o app. |
| Valores em jogo | **Simulados.** Exibidos em BRL, mas nenhum dinheiro é retido ou movimentado. |
| AI Goal Architect e AI Judge | **Mocks locais** por trás de contratos estáveis em `src/lib/proof/ai.ts`. |
| Arte dos troféus | **Pins esmaltados desenhados à mão em SVG**, renderizados em PNG. Não foram gerados por IA. |
| Contas | **Nenhuma.** O protótipo abre direto no perfil do Rodrigo. |
| Arquivos enviados | Armazenados **só no navegador do visitante** (IndexedDB). As provas empacotadas ficam visíveis para todos. |

## Stack

- **[TanStack Start](https://tanstack.com/start)** com roteamento baseado em arquivos, sobre **React 19** e **Vite**
- **Tailwind CSS v4**, com primitivos Radix e ícones lucide
- **TypeScript** em modo strict, incluindo `exactOptionalPropertyTypes`
- **Vitest** com Testing Library
- Build para **Cloudflare** via Nitro, sincronizado com o **[Lovable](https://lovable.dev/projects/ce678b21-7673-4402-a639-fc041cc58292)**

## Como rodar

O projeto usa [Bun](https://bun.sh). O npm também funciona: troque `bun` por `npm`.

```sh
git clone https://github.com/CMaRodrigo/pixel-perfect-capture-7666.git
cd pixel-perfect-capture-7666
bun install
bun run dev
```

Depois, abra a URL exibida no terminal.

| Comando | O que faz |
|---|---|
| `bun run dev` | Inicia o servidor de desenvolvimento com hot reload |
| `bun run build` | Build de produção (também regenera `src/routeTree.gen.ts`) |
| `bun run preview` | Serve o build de produção localmente |
| `bun run test` | Roda a suíte de testes uma vez |
| `bun run lint` | Lint com ESLint e Prettier |
| `bun run format` | Formata tudo com Prettier |

## Estrutura do projeto

```
src/
├── routes/                    Rotas baseadas em arquivos (TanStack Start)
│   ├── app.tsx                Estrutura do app: barra lateral e barra de abas no celular
│   ├── app.index.tsx          Início
│   ├── app.commitments.*      Lista de compromissos e páginas de registro, prova e resultado
│   ├── app.trophies.*         Sala de Troféus e o registro de cada troféu
│   ├── app.activity.tsx       Linha do tempo de tudo o que aconteceu
│   ├── app.profile.tsx        Perfil público
│   └── app.new.tsx            Assistente de novo compromisso
├── components/proof/
│   ├── ContractRecord.tsx     As abas Meta / Verificação / Em jogo / Revisão
│   ├── TrophyRoom.tsx         Grade de troféus compartilhada pelo perfil e pela Sala de Troféus
│   └── Badge.tsx              Arte dos troféus
├── lib/proof/
│   ├── demo-data.ts           Os dez registros: objetivos, valores em jogo, datas, provas
│   ├── demo-trophies.ts       Nomes, subtítulos e arte dos troféus
│   ├── store.tsx              Estado do app, persistido no navegador
│   ├── ai.ts                  Contratos do Goal Architect e do AI Judge
│   ├── payments.ts            Contrato do StakeProvider (simulado)
│   ├── badges.ts              Contrato do gerador de troféus
│   └── documents.ts           Armazenamento no navegador para arquivos de prova enviados
└── assets/                    Pins esmaltados e arquivos de prova (imagens, PDFs, prévias)
```

## Arquitetura

Algumas fronteiras mantêm o protótipo honesto e facilitam trocar cada peça por um serviço real no futuro:

- **Estado** fica por trás de `useProof()` em `store.tsx`. As páginas nunca acessam o armazenamento diretamente, então a parte interna pode migrar para um backend sem mudar as páginas.
- **Papéis de IA** ficam por trás dos contratos em `ai.ts`. O Judge só avalia as evidências em relação aos objetivos travados e nunca os reescreve.
- **Dinheiro** só se movimenta pela interface `StakeProvider` em `payments.ts`. Hoje isso é uma simulação, e a interface deixa isso claro.
- **Troféus** só saem do `badgeGenerator`: um por compromisso cumprido, nunca para um que falhou.
- **Os registros fornecidos se atualizam sozinhos.** Quando um registro muda em `demo-data.ts`, navegadores que salvaram uma cópia antiga recebem o novo título, datas, objetivos, valores em jogo, significado e documentos, mantendo as edições e os envios do próprio dono.

O `AGENTS.md` reúne a lista completa de convenções para quem, humano ou IA, trabalha no código.

## Como adicionar provas a um registro

Os registros são definidos em `src/lib/proof/demo-data.ts`. As opções de um registro ficam assim:

```ts
challenge("detectivesql", "detectiveSQL", "Criar um projeto de SQL…",
  ["Criar algo…", "Publicar e compartilhar…"],      // objetivos
  [/* rótulos das evidências */], "Projeto público + evidência de lançamento",
  "2026-09-24",                                      // data de conclusão
  {
    start: "2026-02-14",
    stakes: [200, 100],                              // BRL por objetivo; o total é a soma
    meaning: "O que é o projeto e por que ele importa…",
    documents: [
      // Um arquivo empacotado com o app; PDFs ganham uma imagem `preview` da primeira página para o card
      { id: "…", name: "pitch.pdf", mimeType: "application/pdf", src: pitchPdf, preview: pitchCover, addedAt: "…" },
      // Uma página externa: card com captura de tela que abre o link
      { id: "…", name: "notion", mimeType: "text/html", src: screenshot, href: "https://…", addedAt: "…" },
      // Uma página que aceita iframe: prévia ao vivo, com a captura de tela exibida enquanto carrega
      { id: "…", name: "site", mimeType: "text/html", src: screenshot, href: "https://…",
        embed: "https://…", embedWidth: 1280, addedAt: "…" },
    ],
  });
```

Coloque os arquivos em `src/assets/` e importe-os no topo do arquivo. Mantenha cada arquivo bem abaixo do limite de 25 MiB por asset do Cloudflare; PDFs grandes exportados do Canva podem ser re-renderizados para poucos MB sem perda visível. Use `embed` só para páginas que permitem iframe. Notion, GitLab e a visualização comum do Canva bloqueiam isso, então use uma captura de tela com `href` no lugar. Posts do LinkedIn (`/embed/feed/update/…`) e links `?embed` do Canva podem ser incorporados.

## Trabalhando com o Lovable

Este repositório sincroniza nos dois sentidos com o editor do Lovable. Commits enviados para a `main` aparecem no Lovable, e as mudanças feitas no Lovable chegam aqui.

> [!IMPORTANT]
> Nunca faça force-push nem reescreva o histórico que já está na `main`, ou o histórico do projeto no Lovable será perdido. Mantenha a `main` sempre funcionando.

Para atualizar o site no ar depois de um push, abra o projeto no Lovable e clique em **Publish → Update**.

---

<div align="center"><sub>Criado por Rodrigo da Rosa · O troféu é o símbolo. A prova está por trás dele.</sub></div>
