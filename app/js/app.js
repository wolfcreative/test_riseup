document.addEventListener('DOMContentLoaded', () => {
    // JS-сетка
    // Аналог UiKit3 Grid = https://getuikit.com/docs/grid
    // 
    // В чём фича: у нас есть сетка, у нас есть классы ширины которые зависимые от размера экрана.
    // Вручную задавать margin для отступа сверху не получится из-за классов ширины. А значит нужно проставлять в нужный момент нужному блоку отступ сверху.

    function grid(){
        let classes = document.querySelectorAll('.grid-margin')
        if (typeof classes !== undefined){
            let classesArray = Object.keys(classes).map(e => classes[e])
    
            classesArray.forEach((el) => {
                el.classList.remove('grid-margin');
            })
        }

        let grids = document.querySelectorAll('[data-grid]')
        let gridsArray = Object.keys(grids).map(e => grids[e])

        gridsArray.forEach((grid) => {
            let blocks = grid.children
            
            let blocksArray = Object.keys(blocks).map(e => blocks[e])
            let arr = []

            blocksArray.forEach((block) => {
                let $this = block

                let y = $this.offsetTop
            
                let rowBlocks = []
                
                for (let i = indexInParent(block) + 1; i < blocks.length; i++) {
                    let element = blocks[i]
                        
                    if (element.offsetTop != y) {
                        if (element.offsetTop - y > 10 || element.offsetTop - y < -10){ // Допустимая погрешность случай flex-middle
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

    // Инициализация
    window.onload = () => {
        grid()
    }
    
    // Ресайз окна
    window.onresize = () => {
        grid()
    }
})