# Belleza Agenda

# PRD | Sistema de Agendamento para Profissionais de Beleza e Bem-Estar

## 1. Visão geral do projeto

Desenvolver uma aplicação web responsiva para agendamento de serviços de beleza e bem-estar, destinada a profissionais autônomos e pequenos negócios, como clínicas de estética, maquiadoras, designers de sobrancelhas, lash designers, manicures e profissionais de áreas semelhantes.

A aplicação permitirá que clientes consultem os serviços, escolham uma data e um horário disponíveis, realizem um agendamento demonstrativo e acompanhem seus compromissos.

Também deverá contar com um painel administrativo para que o responsável pelo negócio configure os dias e horários de atendimento, além de bloquear períodos específicos por folgas, férias, recessos ou outros compromissos.

**Nesta primeira etapa, o projeto será exclusivamente frontend**, com dados fictícios e estado temporário na interface. O objetivo é construir e testar a experiência visual e as interações antes de implementar banco de dados, integrações ou persistência.

## 2. Objetivos

- Criar uma experiência de agendamento simples, intuitiva e agradável.
- Facilitar a visualização dos serviços, datas e horários disponíveis.
- Permitir que o cliente consulte e cancele agendamentos demonstrativos.
- Permitir que o administrador configure sua disponibilidade semanal e bloqueie datas ou horários específicos.
- Atualizar o calendário do cliente conforme as configurações feitas no painel administrativo durante a utilização da aplicação.
- Criar uma interface profissional, responsiva e adequada ao segmento de beleza e bem-estar.

## 3. Público-alvo

- Clientes que desejam agendar serviços de beleza e bem-estar.
- Profissionais autônomos que precisam organizar seus horários.
- Pequenos negócios que atendem com hora marcada.

## 4. Escopo funcional

### Tela 1: Página inicial

Criar uma página de apresentação do negócio com:

- Logotipo e nome do estabelecimento.
- Mensagem de boas-vindas e breve descrição.
- Apresentação resumida dos serviços.
- Botão principal “Fazer meu agendamento”.
- Acesso à área “Meus agendamentos”.
- Acesso demonstrativo à área administrativa, para fins de apresentação do protótipo.

A página deve transmitir confiança, organização e profissionalismo, com navegação clara e sem excesso de informações.

### Tela 2: Cadastro do cliente

Criar uma tela de cadastro para o primeiro acesso, com os seguintes campos:

- Nome completo.
- E-mail.
- Telefone.
- CPF.

Requisitos:

- Indicar claramente os campos obrigatórios.
- Validar o preenchimento dos campos.
- Validar o formato do e-mail.
- Aplicar formatação adequada ao telefone e ao CPF.
- Exibir mensagens de erro compreensíveis.
- Permitir avançar somente após o preenchimento válido dos campos obrigatórios.

Como o projeto será apenas frontend, o cadastro será demonstrativo. Não haverá autenticação real, envio de dados a servidores ou armazenamento permanente.

### Tela 3: Novo agendamento

Criar uma tela para selecionar o serviço, a data e o horário desejados.

**Seleção do serviço**

- Exibir os serviços disponíveis em cards ou opções organizadas.
- Apresentar nome, descrição breve e duração estimada.
- Exibir preço demonstrativo, quando aplicável.
- Destacar visualmente o serviço selecionado.

**Seleção da data**

- Exibir um calendário mensal interativo.
- Permitir navegar entre os meses.
- Destacar a data selecionada.
- Diferenciar visualmente dias disponíveis, indisponíveis e selecionados.
- Desabilitar datas passadas.
- Respeitar os dias e horários configurados no painel administrativo.
- Não permitir a seleção de datas bloqueadas.

**Seleção do horário**

- Mostrar os horários disponíveis após a seleção da data.
- Exibir os horários em opções individuais e fáceis de selecionar.
- Permitir selecionar apenas um horário por agendamento.
- Desabilitar horários ocupados, fora do expediente ou bloqueados.
- Exibir uma mensagem informativa quando não houver horários disponíveis.

Utilizar horários fictícios para demonstração, como 09h, 09h30, 10h, 10h30, 14h e 14h30, sempre respeitando a disponibilidade configurada.

**Observações**

- Disponibilizar um campo opcional para o cliente informar observações sobre o agendamento.
- Incluir um botão para avançar à confirmação.
- Impedir o avanço quando faltarem informações obrigatórias.

### Tela 4: Confirmação do agendamento

Após o preenchimento das informações, apresentar um resumo com:

- Nome do cliente.
- Serviço selecionado.
- Data.
- Horário.
- Duração e preço demonstrativos, quando aplicáveis.
- Observações, se preenchidas.

Incluir os botões “Confirmar agendamento” e “Voltar para editar”.

Ao confirmar, exibir uma mensagem de sucesso e disponibilizar acesso à área “Meus agendamentos”.

A confirmação será apenas demonstrativa, sem envio de e-mails, mensagens ou notificações externas.

### Tela 5: Meus agendamentos

Criar uma área para que o cliente consulte os agendamentos realizados durante a sessão de uso do protótipo.

Cada agendamento deve apresentar:

- Nome do serviço.
- Data e horário.
- Status do agendamento.
- Opção de visualizar os detalhes.
- Opção de cancelar, quando aplicável.

Utilizar status demonstrativos, como “Confirmado” e “Cancelado”.

Ao cancelar um agendamento, solicitar confirmação antes de concluir a ação e atualizar sua apresentação na interface.

Os dados poderão ser reiniciados ao recarregar a aplicação. Não implementar persistência nesta etapa.

### Tela 6: Painel administrativo

Criar uma área destinada ao responsável pelo estabelecimento, permitindo configurar a disponibilidade dos atendimentos.

O painel deve apresentar navegação organizada para:

- Visão geral da agenda.
- Configuração da disponibilidade semanal.
- Bloqueios de datas e horários.
- Consulta dos agendamentos demonstrativos.

Incluir indicadores simples, como quantidade de agendamentos demonstrativos e próximos compromissos, quando houver dados para exibição.

O acesso administrativo será apenas demonstrativo. Não implementar autenticação real, controle de permissões no servidor ou cadastro de múltiplos usuários.

### Tela 7: Configuração da disponibilidade semanal

Permitir que o administrador defina os horários habituais de atendimento para cada dia da semana, de segunda-feira a domingo.

Para cada dia, disponibilizar:

- Opção para marcar o dia como disponível ou indisponível.
- Campo de horário inicial.
- Campo de horário final.
- Possibilidade de configurar mais de um período no mesmo dia.

Exemplo:

- Segunda-feira: 09h às 12h e 14h às 18h.
- Terça-feira: 09h às 12h e 14h às 18h.
- Quarta-feira: indisponível.
- Quinta-feira: 10h às 19h.
- Domingo: indisponível.

O administrador poderá editar essas configurações e aplicar as alterações por meio de um botão como “Salvar disponibilidade”.

**Regras de validação:**

- O horário final deve ser posterior ao inicial.
- Os períodos não devem apresentar sobreposições inválidas.
- Dias marcados como indisponíveis não devem oferecer horários para agendamento.
- Alterações devem atualizar a disponibilidade apresentada no calendário do cliente durante a sessão atual.
- A interface deve fornecer feedback visual após salvar as alterações.

### Tela 8: Bloqueios de datas e horários

Permitir que o administrador registre exceções à disponibilidade semanal, incluindo folgas, férias, recessos e compromissos pontuais.

O administrador poderá:

- Bloquear um dia inteiro.
- Bloquear um horário específico ou um intervalo de horários.
- Bloquear um período entre duas datas, como férias ou recesso.
- Informar o motivo do bloqueio, opcionalmente.
- Consultar os bloqueios cadastrados na sessão.
- Remover um bloqueio existente.

Exemplos:

- Bloquear uma sexta-feira inteira.
- Bloquear uma terça-feira das 14h às 16h.
- Bloquear todos os atendimentos entre 20 de dezembro e 5 de janeiro.

**Regras de prioridade:**

- A disponibilidade semanal representa o expediente habitual.
- Os bloqueios específicos prevalecem sobre a disponibilidade semanal.
- Um dia bloqueado integralmente não deve apresentar horários disponíveis.
- Um bloqueio parcial deve retirar apenas os horários afetados.
- Ao remover um bloqueio, a disponibilidade habitual deve voltar a ser considerada, desde que o período esteja dentro do expediente configurado.
- Alterações no painel administrativo devem refletir-se imediatamente no calendário do cliente durante a sessão atual.

## 5. Regras gerais de funcionamento

- O cliente deverá selecionar um serviço, uma data e um horário antes de confirmar o agendamento.
- Não será permitido selecionar datas passadas.
- Não será permitido agendar fora dos dias e horários disponíveis.
- Bloqueios administrativos devem ser respeitados pelo calendário do cliente.
- Horários indisponíveis devem permanecer visíveis quando isso ajudar na compreensão da agenda, mas não poderão ser selecionados.
- A seleção atual deve ser destacada visualmente.
- As ações de confirmar e cancelar devem atualizar a interface.
- As informações serão simuladas e mantidas somente no estado da aplicação durante a sessão.
- Não haverá integração com sistemas externos nesta etapa.

## 6. Identidade visual e experiência do usuário

A aplicação deve ter uma identidade visual sofisticada, delicada e contemporânea, inspirada no segmento de beleza e bem-estar.

**Paleta sugerida:**

- Rosa blush.
- Branco quente ou off-white.
- Bege champagne.
- Lavanda suave.
- Verde sálvia claro.
- Marrom acinzentado para textos.

**Diretrizes de design:**

- Utilizar títulos elegantes e tipografia sem serifa para textos e informações funcionais.
- Priorizar boa legibilidade, contraste e hierarquia visual.
- Usar espaçamentos generosos e alinhamentos consistentes.
- Criar cards com bordas sutis e cantos levemente arredondados.
- Utilizar sombras discretas apenas quando contribuírem para a hierarquia.
- Evitar gradientes excessivos, efeitos exagerados e aparência infantil.
- Destacar os botões principais sem comprometer a harmonia da interface.
- Criar estados visuais claros para elementos selecionados, desabilitados, indisponíveis e concluídos.
- Manter o calendário organizado e fácil de compreender.

A identidade visual deve transmitir cuidado, tranquilidade e profissionalismo, sem prejudicar a funcionalidade.

## 7. Responsividade e acessibilidade

- Desenvolver a aplicação priorizando dispositivos móveis, mantendo boa experiência também em tablets e computadores.
- Adaptar formulários, cards, calendário e painel administrativo a diferentes tamanhos de tela.
- Garantir que os botões tenham áreas de toque adequadas.
- Utilizar rótulos claros nos campos de formulário.
- Exibir mensagens de validação próximas aos campos correspondentes.
- Não utilizar apenas cores para comunicar estados: combinar cores com textos ou outros indicadores visuais.
- Manter navegação consistente entre as telas.

## 8. Requisitos técnicos desta etapa

- Desenvolver o frontend utilizando a estrutura e as tecnologias já adotadas pelo Lovable.
- Implementar navegação funcional entre as telas.
- Utilizar dados fictícios para serviços, clientes, horários e agendamentos.
- Utilizar estado temporário no frontend para simular as interações.
- Manter a disponibilidade administrativa sincronizada com o calendário do cliente dentro da sessão atual.
- Organizar os componentes para facilitar futuras alterações e a evolução do projeto.
- Implementar validações básicas e mensagens de feedback na interface.

**Não implementar nesta etapa:**

- Banco de dados.
- Supabase ou outros serviços de backend.
- n8n.
- Google Sheets.
- APIs ou integrações externas.
- Autenticação real.
- Envio de e-mails, SMS ou mensagens pelo WhatsApp.
- Pagamentos online.
- Armazenamento persistente de dados.
- Funcionalidades que dependam de serviços externos.

Não adicionar essas integrações automaticamente. Elas poderão ser avaliadas em etapas futuras, quando fizerem parte do conteúdo da aula e forem solicitadas explicitamente.

## 9. Critérios de aceitação

O protótipo será considerado adequado quando:

1. Todas as oito telas estiverem implementadas e navegáveis.
2. O cliente conseguir preencher o cadastro demonstrativo.
3. O cliente conseguir selecionar um serviço, uma data e um horário válido.
4. O sistema impedir a seleção de datas passadas e horários indisponíveis.
5. O cliente conseguir visualizar a confirmação e consultar seus agendamentos demonstrativos.
6. O cancelamento atualizar corretamente a interface.
7. O administrador conseguir configurar a disponibilidade de cada dia da semana.
8. O administrador conseguir cadastrar bloqueios de dias inteiros, horários específicos e períodos entre datas.
9. As alterações administrativas forem refletidas no calendário do cliente durante a sessão atual.
10. Os horários bloqueados não puderem ser selecionados pelo cliente.
11. A aplicação funcionar adequadamente em dispositivos móveis e computadores.
12. Nenhuma integração externa ou persistência de dados for implementada nesta etapa.

## 10. Possíveis evoluções futuras

Após a conclusão e validação do frontend, poderão ser consideradas, em etapas separadas:

- Persistência dos dados em banco de dados.
- Cadastro e autenticação reais de clientes e administradores.
- Integração com n8n e Google Sheets, caso sejam adequados aos objetivos do projeto.
- Notificações de confirmação e lembretes.
- Integração com calendários externos.
- Cadastro de múltiplos profissionais, cada um com sua própria disponibilidade.
- Gestão mais completa de serviços, preços, duração e agenda.
- Confirmação e gerenciamento de agendamentos reais.

Essas evoluções não fazem parte do escopo atual.

## 11. Orientação final para o desenvolvimento

Desenvolva primeiro uma experiência frontend completa, consistente e visualmente refinada. Priorize a navegação, os formulários, o calendário interativo, a configuração de disponibilidade e a comunicação entre o painel administrativo e a agenda do cliente.

Utilize dados fictícios e estado temporário para simular o funcionamento. Não implemente banco de dados, persistência ou integrações externas sem uma solicitação posterior.

O resultado deve ser um protótipo funcional, responsivo e bem organizado, preparado para evoluir gradualmente conforme o aprendizado e as próximas etapas do projeto.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7be970fe-7560-4d33-8788-4571e02ff36f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
