// JS-сетка
// Аналог UiKit3 Grid = https://getuikit.com/docs/grid
// 
// В чём фича: у нас есть сетка, у нас есть классы ширины которые зависимые от размера экрана.
// Вручную задавать margin для отступа сверху не получится из-за классов ширины. А значит нужно проставлять в нужный момент нужному блоку отступ сверху.

function grid(){
    // Определяем переменную с названием класса-отступа, а так же класс-хелпер для forEach
    let marginClass, marginClassAction
    marginClass = marginClassAction = 'grid-margin'

    // Ищем все дочерние блоки у сеток
    let classes = [].slice.call(
        document.querySelectorAll(`
            .grid > [class*=${marginClass}], 
            .grid > [class*=margin-]
        `)
    )

    // Удаляем у них классы-отступы
    if (typeof classes !== undefined){
        classes.forEach((el) => {
            el.classList.remove(marginClass);
            
            el.className = el.className.replace(/margin-.\S*/, '');
        })
    }

    // Ищем все сетки
    let grids = [].slice.call(document.querySelectorAll('[data-grid]'))
    
    grids.forEach((grid) => {
        marginClassAction = marginClass

        // Забираем параметры
        let params = grid.getAttribute('data-grid').split(';');

        if (params.length > 0){
            params.forEach((param) => {
                switch(param.split(':')[0]){
                    // Как видно - пока параметр только один. Это отсуп сверху
                    case 'margin':
                        marginClassAction = param.split(':')[1]
                    break;
                }
            })
        }

        // Получаем дочерние блоки
        let blocks = grid.children

        let blocksArray = [].slice.call(blocks)

        blocksArray.forEach((block) => {
            let $this = block

            let y = $this.offsetTop
        
            let rowBlocks = []
            
            for (let i = indexInParent(block) + 1; i < blocks.length; i++) {
                let element = blocks[i]
                    
                if (element.offsetTop != y && (element.offsetTop - y > 10 || element.offsetTop - y < -10)) {
                    // Допустимая погрешность на случай flex-middle в виде 10px

                    // Закидываем в общий массив
                    rowBlocks.push(element)
                } else {
                    break
                }
            }

            // Для всех подходящих элементов добавляем класс с отступом
            rowBlocks.forEach((el) => {
                el.classList.add(marginClassAction)
            })
        })
    })
}

// Аналог jQuery.index()
function indexInParent(node) {
    let children = node.parentNode.childNodes
    let num = 0

    for (let i=0; i<children.length; i++) {
        if (children[i]==node) return num
        if (children[i].nodeType==1) num++
    }
    
    return -1
}

// input[type=range]
function initInputRange(){
    let inputs = [].slice.call(document.querySelectorAll('input[type=range]'))

    inputs.forEach((item) => {
        item.classList.add('margin-remove')

        let caption = ''
        if (item.getAttribute('data-range-caption')){
            caption = item.getAttribute('data-range-caption')
        }

        let value = item.value

        let oldHTML = item.outerHTML
        let newHTML = `
            <div class="range-wrapper flex flex-middle" style="padding-top:9px">
                ${oldHTML}
                <div class="range-value margin-medium-left">${value}${caption}</div>
            </div>
        `;

        item.outerHTML = newHTML;
    })

    let inputs2 = [].slice.call(document.querySelectorAll('input[type=range]'))
    inputs2.forEach((item) => {
        commonInputRange(item)

        "input change".split(" ").forEach((evt) => 
            item.addEventListener(evt, () => {
                commonInputRange(item)
            })
        );
    })
}

// input[type=range] commons
function commonInputRange(item) {
    let value = item.value

    let caption = ''
    if (item.getAttribute('data-range-caption')){
        caption = item.getAttribute('data-range-caption')
    }

    item.nextElementSibling.innerHTML = value + caption
    
    // Для хромоподобных
    if(navigator.userAgent.indexOf('AppleWebKit') != -1){
        var percent = Number(((value - item.getAttribute('min')) * 100) / (item.getAttribute('max') - item.getAttribute('min'))) + '%'

        item.style.backgroundImage = `linear-gradient(to right, #2EB670 0%, #2EB670 ${percent}, #dbdcde ${percent}, #dbdcde 100%)`;
    }
}

// Поддержка position:sticky для IE
function stickyForLegacy(){
    if((navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > -1)){
        let nav = document.querySelector('.position-sticky');
        let offset = nav.getBoundingClientRect();

        ['scroll', 'resize'].forEach(function(e){
            window.addEventListener(e, () => {
                if (window.innerWidth >= 960){
                    if (window.pageYOffset > offset.top) {
                        nav.style.position = 'fixed';
                        nav.style.top = '24px';
                    } else {
                        nav.style.position = 'relative';
                        nav.style.top = '';
                    }
                } else {
                    nav.style.position = 'relative';
                    nav.style.top = '';
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(grid, 100);
    
    initInputRange()
    stickyForLegacy()
})

window.addEventListener('resize', () => {
    grid()
})