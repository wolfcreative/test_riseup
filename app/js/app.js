document.addEventListener('DOMContentLoaded', () => {
    // JS-сетка
    // Аналог UiKit3 Grid = https://getuikit.com/docs/grid
    // 
    // В чём фича: у нас есть сетка, у нас есть классы ширины которые зависимые от размера экрана.
    // Вручную задавать margin для отступа сверху не получится из-за классов ширины. А значит нужно проставлять в нужный момент нужному блоку отступ сверху.

    function grid(){
        let classes = [].slice.call(document.querySelectorAll('.grid-margin'))

        if (typeof classes !== undefined){
            classes.forEach((el) => {
                el.classList.remove('grid-margin');
            })
        }

        let grids = [].slice.call(document.querySelectorAll('[data-grid]'))
        
        grids.forEach((grid) => {
            let blocks = grid.children
            
            let blocksArray = [].slice.call(blocks)
            let arr = []

            blocksArray.forEach((block) => {
                let $this = block

                let y = $this.offsetTop
            
                let rowBlocks = []
                
                for (let i = indexInParent(block) + 1; i < blocks.length; i++) {
                    let element = blocks[i]
                        
                    if (element.offsetTop != y) {
                        if (element.offsetTop - y > 10 || element.offsetTop - y < -10){ // Допустимая погрешность на случай flex-middle
                            rowBlocks.push(element)
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }

                rowBlocks.forEach((el) => {
                    el.classList.add('grid-margin')
                })
                
                arr.push(rowBlocks)
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
                <div class="range-wrapper flex flex-middle" style="padding-top:7px">
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

    // Инициализация
    window.onload = () => {
        grid()
        initInputRange()
    }
    
    // Ресайз окна
    window.onresize = () => {
        grid()
    }
})