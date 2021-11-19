export function grid(){
    // Определяем переменную с названием класса-отступа, а так же класс-хелпер для forEach
    let marginClass, marginClassAction
    marginClass = marginClassAction = 'grid-margin'

    // Ищем все дочерние блоки у сеток
    let classes = [...document.querySelectorAll(`
            .grid > [class*=${marginClass}], 
            .grid > [class*=margin-]
    `)]

    // Удаляем у них классы-отступы
    if (typeof classes !== undefined){
        for (let el of classes){
            el.classList.remove(marginClass);
            
            el.className = el.className.replace(/margin-.\S*/, '');
        }
    }

    // Ищем все сетки
    let grids = [...document.querySelectorAll('[data-grid]')]
    
    for (let grid of grids){
        marginClassAction = marginClass

        let flexMiddle = false;

        if (grid.classList.contains('flex-middle')){
            grid.classList.remove('flex-middle')

            flexMiddle = true;
        }

        // Забираем параметры
        let params = grid.getAttribute('data-grid').split(';');

        if (params.length > 0){
            for (let param of params){
                switch(param.split(':')[0]){
                    // Как видно - пока параметр только один. Это отсуп сверху
                    case 'margin':
                        marginClassAction = param.split(':')[1]
                    break;
                }
            }
        }

        // Получаем дочерние блоки
        let blocks = [...grid.children]

        for (let block of blocks){
            let $this = block

            let y = $this.offsetTop
        
            let rowBlocks = []
            
            for (let i = indexInParent(block) + 1; i < blocks.length; i++) {
                let element = blocks[i]
                    
                if (element.offsetTop != y && (element.offsetTop - y > 10 || element.offsetTop - y < -10)) {
                    // Допустимая погрешность

                    // Закидываем в общий массив
                    rowBlocks.push(element)
                } else {
                    break
                }
            }

            // Для всех подходящих элементов добавляем класс с отступом
            for (let el of rowBlocks){
                el.classList.add(marginClassAction)
            }
        }

        if (flexMiddle === true){
            grid.classList.add('flex-middle')
        }
    }
}

const indexInParent = el => [...el.parentNode.children].indexOf(el)