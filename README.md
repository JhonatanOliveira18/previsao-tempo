# ☀️ Previsão do Tempo Fácil

## 📖 Visão Geral

O **Previsão do Tempo Fácil** é uma aplicação web desenvolvida com **HTML, CSS e JavaScript**, que permite consultar as condições climáticas atuais de qualquer cidade utilizando as APIs da Open-Meteo.

O usuário pode pesquisar uma cidade digitando seu nome ou utilizar sua localização atual para obter informações climáticas de forma rápida e intuitiva.

O projeto foi desenvolvido com foco em simplicidade, acessibilidade e experiência do usuário, oferecendo mensagens amigáveis, tratamento de erros e adaptação visual conforme as condições climáticas encontradas.

---

## 🚀 Funcionalidades

* Busca de clima por nome da cidade.
* Busca de clima utilizando geolocalização do navegador.
* Exibição da temperatura atual.
* Exibição da condição climática atual.
* Mensagens personalizadas de acordo com o clima.
* Alteração dinâmica do tema da página conforme as condições climáticas.
* Tratamento de erros para:

  * Campo vazio.
  * Cidade inválida.
  * Falhas de conexão.
  * Falhas nas APIs.
  * Geolocalização negada.
* Compatibilidade com dispositivos móveis e desktops.
* Recursos básicos de acessibilidade (WCAG).

---

## 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (ES6+)
* Fetch API
* Open-Meteo Geocoding API
* Open-Meteo Weather API

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/previsao-do-tempo-facil.git
```

### 2. Acesse a pasta do projeto

```bash
cd previsao-do-tempo-facil
```

### 3. Abra o projeto

Como o projeto utiliza apenas HTML, CSS e JavaScript puro, basta abrir o arquivo:

```bash
index.html
```

Ou utilizar uma extensão como **Live Server** no Visual Studio Code.

---

## ▶️ Como Utilizar

### Buscar pelo nome da cidade

1. Digite o nome de uma cidade.
2. Clique em **Buscar Clima** ou pressione **Enter**.
3. Aguarde o carregamento.
4. Visualize a temperatura e a condição climática.

### Utilizar localização atual

1. Clique em **Minha Localização**.
2. Autorize o acesso à localização quando solicitado pelo navegador.
3. Aguarde o carregamento.
4. Visualize as condições climáticas da sua região.

---

## 📋 Exemplo de Resultado

### Entrada

```text
São Paulo
```

### Saída

```text
São Paulo

24°C

Parcialmente nublado

Desejamos que você tenha um excelente dia.
```

---

## ⚠️ Tratamento de Erros

O sistema possui validações para diferentes situações:

| Situação              | Mensagem                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Campo vazio           | Por favor, digite o nome de uma cidade.                                                         |
| Cidade inválida       | Insira uma cidade válida.                                                                       |
| Falha de conexão      | Não foi possível conectar ao serviço. Tente novamente mais tarde.                               |
| Erro na previsão      | Não foi possível obter a previsão neste momento. Tente novamente.                               |
| Geolocalização negada | Você escolheu não compartilhar sua localização. Tudo bem! Basta digitar o nome da cidade acima. |

---

## ♿ Acessibilidade

O projeto inclui:

* Uso de `aria-live` para atualização dinâmica de conteúdo.
* Uso de `aria-labelledby`.
* Elementos ocultos para leitores de tela (`sr-only`).
* Destaque visual de foco para navegação por teclado.
* Compatibilidade com tecla Enter para iniciar pesquisas.

---

## 📱 Responsividade

A interface adapta-se automaticamente para:

* Smartphones
* Tablets
* Notebooks
* Monitores Desktop

---

## 🔮 Melhorias Futuras

* Exibir velocidade do vento.
* Exibir umidade do ar.
* Exibir sensação térmica.
* Exibir previsão para os próximos dias.
* Adicionar ícones climáticos.
* Salvar histórico de pesquisas.
* Implementar tema claro e escuro.
* Suporte a múltiplos idiomas.
* Testes automatizados com Jest.
* Transformar a aplicação em Progressive Web App (PWA).

---

## 👨‍💻 Autor

Desenvolvido por **Jhonatan Oliveira** como projeto de estudos em desenvolvimento web utilizando JavaScript e consumo de APIs.
