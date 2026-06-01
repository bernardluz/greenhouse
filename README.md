# 🌱 Greenhouse

Timer de foco baseado na técnica Pomodoro, **adaptado para o cérebro com TDAH**.
Aplicação 100% client-side: sem backend, sem cadastro e **sem nenhuma requisição
de rede em tempo de execução**. Todo o estado vive no `localStorage`.

> Construído em Nuxt 4 com **Domain-Driven Design** e os princípios **SOLID**.

**▶ Acesse:** [greenhouse.bernardluz.com](https://greenhouse.bernardluz.com)

---

## O problema

A técnica Pomodoro clássica assume um padrão de atenção neurotípico (blocos
fixos de 25 min). Para o TDAH predominantemente inatento, dois obstáculos ficam
sem resposta:

- **Paralisia de início** — o custo de começar uma tarefa é alto.
- **Captura impulsiva por distrações** — pensamentos intrusivos quebram o foco.

## A solução

- **Início em um toque**, usando a última configuração salva.
- **Parking lot**: capture a distração (atalho **`C`**) sem parar o timer.
- **Durações flexíveis** de foco, pausa curta, pausa longa e tamanho do ciclo.
- Transição automática de foco → pausa; pausa longa a cada N focos.
- Contador diário de blocos cultivados/interrompidos.

## Direção visual — *Condensation*

A interface tem **dois estados de matéria**, não vários temas. Em repouso o
"vidro da estufa" está limpo e o ornamento botânico aparece; quando o foco
começa, **o vidro embaça**: o ornamento recua, a saturação cai e só o relógio
permanece nítido. O design recua fisicamente durante o foco para **servir a
atenção em vez de disputá-la**. Respeita `prefers-reduced-motion`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Nuxt 4 (SPA, `ssr: false`) |
| Linguagem | TypeScript (strict) |
| Testes | Vitest + happy-dom |
| Fontes | Fraunces / Newsreader / Spline Sans Mono (self-hosted) |
| Build | Estático (`nuxt generate`) — publicável em qualquer host estático |

## Como rodar

```bash
npm install            # instala dependências
npm run dev            # servidor de desenvolvimento
npm run generate       # build estático em .output/public
npm run preview        # pré-visualiza o build

npm test               # roda os testes
npm run test:coverage  # testes + cobertura (mínimo 80%)
npm run typecheck      # verificação de tipos (vue-tsc)
```

---

## Arquitetura

Quatro camadas com dependências apontando **sempre para dentro**, em direção ao
domínio. O domínio não conhece Nuxt, navegador ou `localStorage`.

```
presentation  ──▶  application  ──▶  domain  ◀──  infrastructure
 (Vue/Nuxt)        (casos de uso)   (núcleo)      (localStorage, timer)
```

- **`domain/`** — entidades, value objects, eventos, serviços e contratos de
  repositório. Imutável e puro. Três *bounded contexts* + um *Shared Kernel*:
  - `focus-session` — ciclo de vida dos blocos e contagem regressiva
  - `parking-lot` — captura e triagem de distrações
  - `preferences` — durações e tamanho do ciclo
  - `shared` — `Duration`, contrato de `DomainEvent`
- **`application/`** — casos de uso (`StartFocusBlock`, `CaptureDistraction`,
  `CompleteBlock`, `AbandonBlock`, `UpdatePreferences`) e portas (`Clock`,
  `IdGenerator`, `TimerService`). Depende apenas de abstrações.
- **`infrastructure/`** — implementações concretas dos contratos:
  repositórios `localStorage`, `BrowserTimerService`, `BrowserClock`,
  `UuidGenerator`.
- **`presentation/`** — composables, componentes Vue declarativos e a página.
  O Nuxt só "enxerga" esta camada; as internas são importadas via alias `~/`.

### SOLID na prática

- **SRP** — `FocusBlock` sabe de duração/progresso; `BrowserTimerService` sabe de tempo real.
- **OCP** — novos tipos de bloco via `BlockType`/`BlockSchedulingService` sem alterar o agregado.
- **LSP** — qualquer `SessionRepository` (localStorage, em memória) é intercambiável.
- **ISP** — `TimerService` expõe apenas `start`/`stop`.
- **DIP** — a aplicação depende dos contratos do domínio; a infraestrutura é injetada na composition root.

```
src/
  domain/
    focus-session/   { entities, value-objects, events, services, repositories }
    parking-lot/     { entities, value-objects, events, repositories }
    preferences/     { entities, repositories }
    shared/          { value-objects, events }
  application/
    use-cases/       ports/  testing/
  infrastructure/
    persistence/  timer/  time/  id/
  presentation/
    composables/  components/  pages/
```

---

## Testes

Domínio, aplicação e infraestrutura cobertos por **testes unitários e de
integração** (Vitest). A camada de apresentação é validada por typecheck e
build. Cobertura acima de **80%** (statements ~95%, branches ~89%).

## Deploy

`npm run generate` produz um site **100% estático** em `.output/public`,
publicável em qualquer hospedagem estática — sem servidor.

Hospedado no **Render** (Static Site): [greenhouse.bernardluz.com](https://greenhouse.bernardluz.com)

- **Build Command:** `npm run generate`
- **Publish Directory:** `.output/public`
- Por ser SPA (`ssr: false`), configure um *Rewrite Rule* `/*` → `/index.html` para o fallback de rotas.

## Roadmap

- **Fase 1 (atual)** — núcleo completo: timer configurável, transição
  automática, parking lot com atalho, contador diário, persistência local.
- **Fase 2** — estatísticas de uso, sons de transição, revisão estruturada das
  distrações na pausa.
- **Fase 3** — temas, exportação do histórico e integração com sistemas de
  tarefas — mantendo o domínio intacto graças às fronteiras já estabelecidas.
