---
id: sap-abap-designing-effective-object-oriented-code
tipo: estudo
status: rascunho
tecnologias: [ABAP, ABAP Cloud]
modulos: []
produtos: [BTP]
release: agnostico
nivel: avancado
autor: Hayron Piffer
criado: 2026-09-07
atualizado: 2026-09-07
fontes: [https://learning.sap.com/learning-journeys/acquiring-core-abap-skills]
tags: [sap, abap, abap-cloud, certificacao]
---

# ABAP - Designing Effective Object-Oriented Code

Este guia de estudos consolida as diretrizes, sintaxes e padrões de projeto de **Orientação a Objetos (ABAP OO)** em **ABAP Cloud**, com base nos 5 materiais selecionados do curso oficial. O conteúdo foi estruturado em um fluxo de aprendizagem sequencial e progressivo, abordando desde os conceitos de especialização, herança e polimorfismo, passando pela criação de acoplamento fraco com interfaces, até o controle rigoroso de instanciação com Factory Methods e o padrão Singleton.

---

## Fluxo de Aprendizagem Recomendado

```
[Módulo 1: Herança & Especialização] ➔ [Módulo 2: Métodos, Construtores & Controle]
                                                       │
[Módulo 5: Factory Method & Singleton] ◄─ [Módulo 4: Interfaces] ◄─ [Módulo 3: Up-Cast, Down-Cast & Polimorfismo]
```

---

## Módulo 1: Herança e Especialização em ABAP Cloud

### 1.1 O Conceito de Especialização (A Relação "Is A")

- **Especialização**: No desenvolvimento de software, a herança é empregada para modelar relacionamentos de especialização. Uma classe derivada (subclasse) herda características de uma classe existente (superclasse) [66].
- **Regra de Validação ("Is A")**: Um teste infalível para validar se a herança é adequada é aplicar a frase: _"a subclasse é uma superclasse"_ (ex: _"um avião cargueiro é um avião"_ ou _"um voo de passageiros é um voo"_) [66]. Se essa afirmação soar estranha ou incorreta, a herança não deve ser aplicada, pois gerará problemas de acoplamento rígido indevido no futuro [66].
- **Herança Única**: Em ABAP, uma subclasse pode ter apenas **uma única superclasse direta** (herança múltipla não é suportada) [68]. No entanto, uma superclasse pode ter um número ilimitado de subclasses diretas ou indiretas [68, 69]. A superclasse não tem conhecimento de suas subclasses, e uma subclasse não tem conhecimento de suas classes "irmãs" (outras subclasses derivadas da mesma superclasse) [68, 69].

### 1.2 Declaração de Herança

Para declarar que uma classe herda de outra, utiliza-se a adição `INHERITING FROM` na instrução de definição da classe [68]:

```abap
CLASS lcl_passenger_flight DEFINITION INHERITING FROM lcl_flight.
  PUBLIC SECTION.
    "...
ENDCLASS.
```

### 1.3 Visibilidade de Componentes e a Seção Protegida (`PROTECTED`)

- **Herança de Componentes**: A subclasse herda automaticamente todos os componentes da superclasse (públicos, protegidos e privados) [67].
- **Restrição da Seção Privada**: Componentes declarados na seção `PRIVATE` da superclasse **não** podem ser acessados diretamente pela subclasse [67, 72].
- **Seção Protegida (`PROTECTED SECTION`)**: É utilizada para declarar atributos, tipos e métodos que devem ser invisíveis para usuários externos (clientes da classe), mas acessíveis e utilizáveis dentro da própria superclasse e de todas as suas subclasses derivadas [72].
- **Sequência de Visibilidade**: Em ABAP, as seções de visibilidade de uma classe devem seguir estritamente a sequência [73]:
    1. `PUBLIC SECTION`
    2. `PROTECTED SECTION`
    3. `PRIVATE SECTION`
- **Compatibilidade de Alterações**:
    - Mover um componente privado para a seção protegida (`PROTECTED`) é uma alteração **compatível**, pois amplia a visibilidade [73].
    - Mover um componente público para a seção protegida é uma alteração **incompatível** e causará erros de compilação em programas que já consomem esse componente externamente [73].

### 1.4 Formas de Estender uma Subclasse

Uma subclasse estende a superclasse de três formas [69]:

1. **Adicionar novos componentes**: Declaração de novos atributos, tipos ou métodos específicos da subclasse (que não podem conflitar com os nomes da superclasse) [70].
2. **Redefinir métodos**: Substituir a implementação de métodos herdados para adaptá-los à natureza da subclasse [70].
3. **Adicionar um novo construtor**: Definir um construtor de instância específico para inicializar novos atributos da subclasse [71].

---

## Módulo 2: Especialização de Comportamentos e Ciclo de Vida

### 2.1 Redefinição de Métodos de Instância

Quando a implementação de um método herdado da superclasse não atende às necessidades específicas da subclasse, o desenvolvedor pode redefini-lo [74].

- **Sintaxe de Redefinição**: Declara-se o método na subclasse utilizando a adição `REDEFINITION` [74, 75]:
    
    ```abap
    CLASS lcl_passenger_plane DEFINITION INHERITING FROM lcl_plane.
      PUBLIC SECTION.
        METHODS get_attributes REDEFINITION.
    ENDCLASS.
    ```
    
- **Regras Estritas de Redefinição**:
    - O método deve manter **exatamente o mesmo nome** e a **mesma visibilidade** (seção pública ou protegida) que possuía na superclasse [75].
    - A **assinatura do método não pode ser alterada** (parâmetros de importação, exportação, retorno e exceções permanecem estritamente idênticos) [75].
    - **Não é possível redefinir métodos estáticos** (`CLASS-METHODS`) [75].
- **Acesso à Superclasse via `super`**: Na implementação do método redefinido, é comum reutilizar a lógica da superclasse e complementá-la. Isso é feito utilizando a variável de referência implícita **`super`** [75]:
    
    ```abap
    METHOD get_attributes.
      " Executa a lógica padrão da superclasse
      rt_attributes = super->get_attributes( ).
      " Adiciona dados específicos da subclasse
      rt_attributes = VALUE #( BASE rt_attributes
                               ( name = 'SEATS' value = me->seats ) ).
    ENDMETHOD.
    ```
    

### 2.2 Ciclo de Vida e o Construtor na Herança

Os construtores garantem a correta inicialização das instâncias [71]. Na herança, o ciclo de vida dos construtores segue regras rigorosas:

- **Diferença de Assinatura**: Ao contrário dos métodos redefinidos, o construtor da subclasse **pode ter uma assinatura totalmente diferente** do construtor da superclasse, geralmente contendo os parâmetros originais da superclasse mais os novos parâmetros da subclasse [76, 78].
- **Chamada Obrigatória a `super->constructor`**:
    - A primeira instrução executável dentro do construtor da subclasse **deve** ser a chamada explícita ao construtor da superclasse: `super->constructor( ... ).` [78, 89].
    - Essa regra garante que os atributos herdados sejam inicializados corretamente antes que a subclasse execute sua própria lógica [77, 78].
- **Restrições antes de `super->constructor`**:
    - **Proibição de Acesso**: É estritamente proibido acessar qualquer componente de instância (atributos ou métodos) da própria classe antes de chamar `super->constructor( )` [79, 89].
    - **Exceções Permitidas**: Antes da chamada do construtor da superclasse, é permitido apenas acessar componentes estáticos, ler ou validar os parâmetros de importação do próprio construtor e disparar exceções de tratamento caso os parâmetros sejam inválidos [79].
- **Sequência de Execução em Runtime (Instanciação)**:
    1. **Construtores Estáticos (`class_constructor`)**: São executados automaticamente em sequência, partindo do topo da hierarquia de herança (superclasse) até a subclasse, somente na primeira vez em que a classe é acessada [79, 80].
    2. **Construtores de Instância (`constructor`)**: O runtime chama o construtor da subclasse, que imediatamente delega a execução ao construtor da superclasse por meio de `super->constructor( )` [80]. A lógica da superclasse é concluída e, por fim, o restante da lógica do construtor da subclasse é executado [80].

### 2.3 Componentes Abstratos e Finais

- **Abstract Class (`ABSTRACT`)**: Uma classe declarada como `ABSTRACT` não pode ser instanciada diretamente [82]. Ela serve exclusivamente como base para reutilização de código e herança [82]. No entanto, seus componentes estáticos (métodos, atributos, tipos e constantes) podem ser acessados sem instanciação [83].
- **Abstract Method (`ABSTRACT`)**: Métodos abstratos podem ser definidos **apenas dentro de classes abstratas** [83]. Eles possuem uma definição na superclasse, mas **não contêm implementação** [83]. Suas subclasses são obrigadas a redefinir e implementar esses métodos antes que possam ser instanciadas [83].
- **Final Class (`FINAL`)**: Uma classe declarada com a adição `FINAL` não pode ter subclasses [84]. Isso encerra a árvore de herança.
- **Final Method (`FINAL`)**: Métodos de instância declarados como `FINAL` em classes não-finais não podem ser redefinidos por suas subclasses [84]. É uma prática recomendada para métodos críticos de segurança, como validações e verificações de autorização (`AUTHORITY-CHECK`), impedindo que subclasses burlem as regras [84].

---

## Módulo 3: Polimorfismo, Referências Genéricas e Casting

### 3.1 Referências à Superclasse e o Up-Cast

- **Declaração Genérica**: Uma variável de referência do tipo de uma superclasse pode armazenar e gerenciar instâncias de qualquer uma de suas subclasses [148].
    
    ```abap
    DATA plane TYPE REF TO lcl_plane.
    " LH 737 é uma subclasse de lcl_plane
    plane = NEW lcl_passenger_plane( ... ). 
    ```
    
- **Up-Cast**: É a atribuição de uma referência específica (subclasse) para uma referência mais genérica (superclasse) [149]. É um processo seguro, garantido pelo compilador em tempo de design (não requer operador especial) [149, 151].
- **Limitação do Up-Cast**: Quando uma instância de subclasse é gerenciada por uma referência de superclasse, **apenas os componentes definidos originalmente na superclasse ficam visíveis** [148, 149]. Métodos ou atributos específicos da subclasse tornam-se inacessíveis através dessa referência genérica [149].
- **Polimorfismo (Dynamic Bind)**: Embora apenas os métodos da superclasse estejam visíveis, se chamarmos um método redefinido na subclasse por meio da referência genérica, o runtime do ABAP identifica dinamicamente o tipo real do objeto e executa a implementação especializada da subclasse [150].

### 3.2 O Operador de Down-Cast (`CAST`)

- **Down-Cast**: É a atribuição de uma referência genérica (superclasse) para uma variável de referência específica (subclasse) [149, 152].
- **Aprovação do Compilador**: O compilador bloqueia atribuições diretas de superclasse para subclasse (ex: `passenger = plane` gera erro de sintaxe), pois não há garantia de que o objeto na memória realmente pertença àquela subclasse em tempo de execução [151, 152].
- **O Operador `CAST`**: Força o down-cast, instruindo o compilador a tratar a referência sob o tipo especializado [152].
    
    ```abap
    passenger = CAST #( plane ).
    ```
    
- **Segurança com `IS INSTANCE OF`**: Se o down-cast for executado sobre um objeto incompatível em runtime (ex: tentar converter uma referência de avião cargueiro para avião de passageiros), ocorrerá um erro fatal de runtime (dump) [152]. Para evitar isso, a atribuição deve ser sempre protegida por uma verificação condicional de instância [153]:
    
    ```abap
    IF plane IS INSTANCE OF lcl_passenger_plane.
      passenger = CAST #( plane ).
    ENDIF.
    ```
    

### 3.3 Uso Avançado de Herança e Casting em Tabelas Internas

Em tabelas internas contendo referências genéricas (ex: tabelas de objetos do tipo `REF TO lcl_flight` contendo tanto voos de carga quanto de passageiros), é possível realizar filtragens, loops seletivos e reduções de dados avançadas com Down-Cast [156, 160, 170]:

```abap
" Filtrando apenas subclasses específicas no loop
LOOP AT me->flights INTO DATA(flight)
  WHERE table_line IS INSTANCE OF lcl_passenger_flight.

  " Chamando um método específico da subclasse usando CAST em linha
  DATA(free_seats) = CAST lcl_passenger_flight( flight )->get_free_seats( ).
ENDLOOP.
```

---

## Módulo 4: Acoplamento Fraco com Interfaces em ABAP Cloud

### 4.1 O Papel das Interfaces

- **Definição**: Interfaces são componentes lógicos que descrevem como um programa irá interagir com um objeto, definindo as assinaturas de seus métodos, constantes, tipos e atributos, mas **sem fornecer qualquer implementação de código** [9].
- **Diferença de Classes Abstratas**: Classes abstratas modelam uma relação semântica rígida de herança (_"Is A"_) [12]. As interfaces são recomendadas quando diferentes classes (que não compartilham uma raiz comum de herança) precisam fornecer serviços comuns aos seus usuários (ex: agências de turismo que interagem com hotéis, companhias aéreas e aluguel de carros) [10, 12]. Elas criam um **acoplamento fraco** e fornecem uma visão simplificada e restrita de uma classe complexa [10, 11].
- **Sintaxe de Definição**:
    
    ```abap
    INTERFACE lif_output.
      TYPES t_output  TYPE string.
      TYPES tt_output TYPE STANDARD TABLE OF t_output WITH NON-UNIQUE DEFAULT KEY.
      
      METHODS get_output 
        RETURNING VALUE(r_result) TYPE tt_output.
    ENDINTERFACE.
    ```
    
    - **Sem seções de visibilidade**: Todos os componentes de uma interface são implicitamente **públicos** [11].
    - **Sem seção de implementação**: Interfaces contêm apenas definições de componentes [11, 12].

### 4.2 Implementando Interfaces em Classes

- **Instrução `INTERFACES`**: Para implementar uma interface, usa-se a instrução `INTERFACES` obrigatoriamente na `PUBLIC SECTION` da definição da classe [13].
- **Implementação dos Métodos**: A classe deve implementar **todos** os métodos declarados na interface [14]. Na seção de implementação da classe, os métodos são referenciados pelo seu nome totalmente qualificado, utilizando o caractere tilde (**`~`**) [14]:
    
    ```abap
    CLASS lcl_carrier DEFINITION.
      PUBLIC SECTION.
        INTERFACES lif_output.
    ENDCLASS.
    
    CLASS lcl_carrier IMPLEMENTATION.
      METHOD lif_output~get_output.
        APPEND |Carrier: { me->name }| TO r_result.
      ENDMETHOD.
    ENDCLASS.
    ```
    
- **O Papel dos Aliases (`ALIASES`)**: Para evitar o uso repetitivo do nome qualificado com tilde e tornar o consumo externo mais limpo, o desenvolvedor pode declarar apelidos (aliases) na seção pública da classe [21, 22]:
    
    ```abap
    CLASS lcl_carrier DEFINITION.
      PUBLIC SECTION.
        INTERFACES lif_output.
        ALIASES get_output FOR lif_output~get_output.
    ENDCLASS.
    ```
    

### 4.3 Referências e Casting de Interfaces

- **Declaração de Referência**: É possível declarar referências baseadas em interfaces para gerenciar instâncias de qualquer classe que implemente a respectiva interface [181, 182]:
    
    ```abap
    DATA partner TYPE REF TO lif_partner.
    ```
    
- **Up-Cast de Interface**: Atribuir uma instância de classe para a referência de interface é sempre permitido e verificado estritamente pelo compilador em tempo de design [183].
- **Consumo Restrito**: Ao gerenciar um objeto por meio de uma referência de interface, **apenas os componentes declarados na interface ficam visíveis** (métodos específicos da classe ficam ocultos) [182]. O nome da interface é omitido na chamada do método [183]:
    
    ```abap
    " Não precisa usar partner->lif_partner~get_partner_attributes( )
    partner->get_partner_attributes( ). 
    ```
    
- **Down-Cast de Interface**: Atribuir uma referência de interface de volta para uma referência de classe concreta exige o operador `CAST` protegido pela verificação `IS INSTANCE OF` [183, 184]:
    
    ```abap
    IF partner IS INSTANCE OF lcl_car_rental.
      car_rental = CAST #( partner ).
    ENDIF.
    ```
    

---

## Módulo 5: Controle de Instanciação e Padrões de Projeto (Factory & Singleton)

### 5.1 Restringindo a Instanciação Direta

Para manter o controle estrito sobre o número de instâncias na memória ou validar condições de negócios prévias, uma classe pode bloquear a sua instanciação direta de forma externa [32, 40].

- **A Adição `CREATE PRIVATE`**: É declarada na instrução de definição da classe [32]. Impede o uso do operador `NEW` por consumidores externos, resultando em erro de compilação [32]:
    
    ```abap
    CLASS lcl_connection DEFINITION CREATE PRIVATE.
      PUBLIC SECTION.
        "...
      PRIVATE SECTION.
        METHODS constructor IMPORTING i_conn_id TYPE string.
    ENDCLASS.
    ```
    
    - _Nota técnica_: Outras linguagens de programação controlam isso alterando a visibilidade do método construtor. O ABAP **não suporta** alterar a visibilidade do construtor (que geralmente é privado ou público para legibilidade); o controle é feito obrigatoriamente na adição da definição da classe [32, 48].

### 5.2 O Padrão Factory Method

Como a instanciação direta está bloqueada, a classe deve expor um método estático público (geralmente chamado de **Factory Method**) responsável por instanciar a classe internamente e retornar a referência ao consumidor [33].

- **Vantagens do Factory Method**: Permite executar buscas em banco de dados, validações de integridade e verificações de autorização (`AUTHORITY-CHECK`) **antes** de criar fisicamente o objeto na memória do servidor [40, 42].
- **Exemplo Prático de Factory Method com Validações**:
    
    ```abap
    CLASS lcl_carrier DEFINITION CREATE PRIVATE.
      PUBLIC SECTION.
        CLASS-METHODS get_instance
          IMPORTING
            i_carrier_id TYPE /dmo/carrier_id
          RETURNING
            VALUE(r_result) TYPE REF TO lcl_carrier
          RAISING
            cx_abap_invalid_value
            cx_abap_auth_check_exception.
    ENDCLASS.
    
    CLASS lcl_carrier IMPLEMENTATION.
      METHOD get_instance.
        " 1. Validação de existência no banco
        SELECT SINGLE FROM /lrn/carrier FIELDS carrier_id, currency_code
          WHERE carrier_id = @i_carrier_id INTO @DATA(details).
        IF sy-subrc <> 0.
          RAISE EXCEPTION TYPE cx_abap_invalid_value.
        ENDIF.
    
        " 2. Verificação de Autorização
        AUTHORITY-CHECK OBJECT '/LRN/CARR'
          ID '/LRN/CARR' FIELD i_carrier_id
          ID 'ACTVT'     FIELD '03'.
        IF sy-subrc <> 0.
          RAISE EXCEPTION TYPE cx_abap_auth_check_exception.
        ENDIF.
    
        " 3. Criação segura da instância
        r_result = NEW #( i_carrier_id = i_carrier_id ).
        r_result->currency_code = details-currency_code.
      ENDMETHOD.
    ENDCLASS.
    ```
    

### 5.3 O Padrão Singleton Multiton (Instance Pool)

O padrão Singleton garante que exista apenas **uma única instância de uma classe** em toda a sessão da aplicação [35]. No desenvolvimento corporativo SAP, é comum aplicar uma variante chamada **Multiton** (ou _Instance Pool_), que garante uma única instância **para cada combinação exclusiva de chaves técnicas** (ex: uma única instância na memória para cada Código de Companhia Aérea) [35, 36, 38].

- **Implementação Estruturada de Instance Pool**:
    1. Bloquear instanciação com `CREATE PRIVATE` [36].
    2. Declarar uma tabela hash interna estática privada para atuar como buffer de referências de objetos (`CLASS-DATA instances`) [36, 52].
    3. No Factory Method, verificar se a chave já existe no buffer [36, 53].
    4. Se existir, retornar a referência em cache. Se não existir, instanciar o objeto, registrá-lo na tabela hash de buffer e retorná-lo [36, 55].

```abap
CLASS lcl_connection DEFINITION CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-METHODS get_connection
      IMPORTING
        airlineId TYPE /dmo/carrier_id
        connectionNumber TYPE /dmo/connection_id
      RETURNING
        VALUE(ro_connection) TYPE REF TO lcl_connection.

  PRIVATE SECTION.
    TYPES: BEGIN OF ts_instance,
             airlineId        TYPE /dmo/carrier_id,
             connectionNumber TYPE /dmo/connection_id,
             object           TYPE REF TO lcl_connection,
           END OF ts_instance,
           " Tabela hash para acesso O(1) de alta performance
           tt_instances TYPE HASHED TABLE OF ts_instance
                             WITH UNIQUE KEY airlineId connectionNumber.

    CLASS-DATA connections TYPE tt_instances. " Cache estático de instâncias
ENDCLASS.

CLASS lcl_connection IMPLEMENTATION.
  METHOD get_connection.
    " Tenta ler a referência a partir do cache estático de memória
    TRY.
        ro_connection = connections[ airlineId = airlineId 
                                     connectionNumber = connectionNumber ]-object.
      CATCH cx_sy_itab_line_not_found.
        " Se não encontrado, realiza a leitura de dados secundários e instancia
        SELECT SINGLE FROM /dmo/connection FIELDS airport_from_id
          WHERE carrier_id = @airlineId AND connection_id = @connectionNumber
          INTO @DATA(from_airport).

        " Criação da nova instância
        ro_connection = NEW #( airlineid = airlineId 
                               connectionnumber = connectionNumber ).
        
        " Registro no cache para futuras chamadas
        INSERT VALUE ts_instance( airlineId = airlineId 
                                  connectionNumber = connectionNumber 
                                  object = ro_connection ) INTO TABLE connections.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
```