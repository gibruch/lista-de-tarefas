//@JS: objeto Main (principal) vai controlar todo a aplicacao
const Main = {

    tasks: [],

    //inicaliza as coisas - Cache dos selectors
    init: function() {
        this.cacheSelectors()  //seleciona todos -faz chache dos seletores
        this.bindEvents()  //adiciona os eventos
        this.getStoraged()
        this.buildTasks() //constroi as tasks
    },

    //Cirar as variáveis - selecionar os elementos do HTML e armazenar em uma variável
    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check') //variavel que armazena elemento html começa com $
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    // adicionar os eventos ex: click ou enter
    bindEvents: function() {
        const self = this

        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click
        })
        //chamada da funcao
        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this) // bind = ligar a funcao ao proprio this local

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self) // bind = para ligar o this que foi armazenado no self
        })
    },

    //pega os items do localstorage e armazena dentro da array local
    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')
        this.tasks = JSON.parse(tasks) // pegar os dados (strings) que ele pegou e transformar em objeto JASON
    },

    //funcao para gerar o html das tarefas (tasks)
    getTaskHtml: function(task) {
        return `
            <li>
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    // pegar as tarefas e montar na tela
    buildTasks: function() {
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        //fazer o cacheselector da list do localstore também
        this.cacheSelectors()
        this.bindEvents()
    },

    //funcoes relacionas somente a eventos
    Events: {
        checkButton_click: function(e) {
            const li =  e.target.parentElement //recupera o elemento li com class="done"
            //verifica se existe uma classe especifica dentro do classList
            const isDone = li.classList.contains('done')

            //boa pratica verificar primeiro sempre a negacao
            if (isDone) {
                li.classList.remove('done')
            } else {
                li.classList.add('done')
            }
        },

        //dentro de um evento vai se referenciar ao proprio elemento - 
        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value //recupera o valor do input

            //verifica se a tecla pressionada foi o Enter
            if (key === 'Enter') {
                this.$list.innerHTML += this.getTaskHtml(value)
                e.target.value = ''

                //deve ser adiconador os elementos/existentes no html novamentos qdo eu alterar a lista/arvore de uma li
                this.cacheSelectors() // () = executo / executar
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                //spreed operator [...]
                const objTasks = [
                    { task: value, done: false },
                    ...savedTasksObj, //insere/sava todas as tarefas anteriores
                ]
                //salvar objeto de tarefas em JSON
                localStorage.setItem('tasks', JSON.stringify(objTasks))

            }
        },

        removeButton_click: function(e) {
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTaskState = this.tasks.filter(item => item.task !== value)
            localStorage.setItem('tasks', JSON.stringify(newTaskState))
            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            },300)
        }
    }
}

Main.init()

