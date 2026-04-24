# PhysicsQuest

PhysicsQuest é um app web de aprendizado de física que se posiciona como um "Duolingo de física", mas com uma camada que o Duolingo não possui: **leitura de matérial real de física**.

## Diferencial

Enquanto apps como Duolingo focam em exercícios e repetição, o PhysicsQuest oferece uma experiência completa de aprendizado com:

- **Leitura de conteúdo real** extraído das Lectures de Física de Richard Feynman
- **Sistema de níveis** (Beginner, Intermediate, Advanced)
- **Quizzes** para testar conhecimento
- **Progress tracking** para acompanhar o aprendizado

## Tecnologias

- HTML5 / CSS3 / Vanilla JavaScript
- Dados extraídos de The Feynman Lectures on Physics

## Como usar

1. Clone o repositório:
```bash
git clone https://github.com/Patrick-fed/PhysicsQwest.git
cd PhysicsQwest
```

2. Abra o app:
```bash
# Abra physics-reading/index.html no navegador
# ou use um servidor local
npx serve physics-reading
```

## Estrutura do Projeto

```
physics-reading/
├── index.html      # Página principal
├── css/
│   └── styles.css  # Estilos
├── js/
│   └── app.js     # Lógica JavaScript
├── data/
│   └── excerpts.json  # Conteúdo de física (Feynman Lectures)
└── .gitignore
```

## Conteúdo

O app inclui excertos das Lectures de Feynman:

- **Atoms in Motion** (Beginner)
- **Basic Physics** (Beginner)
- **The Relation of Physics to Other Sciences** (Intermediate)
- **Conservation of Energy** (Intermediate)

## Funcionalidades

- Select de nível para filtrar conteúdo
- Lista de leituras disponíveis
- Leitura detalhada com fonte e capítulo
- Quiz comthreshold de 60% para passar
- Progresso salvo localmente
