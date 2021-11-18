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
                    // Допустимая погрешность на случай flex-middle в виде 10px

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
    }
}

// Аналог jQuery.index()
const indexInParent = el => [...el.parentNode.children].indexOf(el)

// input[type=range]
function initInputRange(){
    let inputs = [...document.querySelectorAll('input[type=range]')]

    for (let input of inputs){
        input.classList.add('margin-remove')

        let caption = ''
        if (input.getAttribute('data-range-caption')){
            caption = input.getAttribute('data-range-caption')
        }

        let value = input.value

        let oldHTML = input.outerHTML
        let newHTML = `
            <div class="range-wrapper flex flex-middle" style="padding-top:9px">
                ${oldHTML}
                <div class="range-value margin-medium-left">${value}${caption}</div>
            </div>
        `;

        input.outerHTML = newHTML;
    }

    let inputs2 = [...document.querySelectorAll('input[type=range]')]
    for (let input of inputs2){
        commonInputRange(input)

        "input change".split(" ").forEach((evt) => 
            input.addEventListener(evt, () => {
                commonInputRange(input)
            })
        );
    }
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
    if((navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1)){
        let nav = document.querySelector('.position-sticky');
        let offset = nav.getBoundingClientRect();

        ['scroll', 'resize'].forEach(function(e){
            window.addEventListener(e, () => {
                if (window.innerWidth >= 960){
                    if (window.pageYOffset > offset.top - 34) {
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