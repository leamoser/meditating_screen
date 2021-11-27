/*Base-Variablen*/
const REGLER = document.querySelector('div#regler_content')
const TOGGLE_OPEN = document.querySelector('button#open')
const TOGGLE_CLOSE = document.querySelector('button#close')
const TOGGLE_SHUFFLE = document.querySelector('div#shuffle>button')
const TOGGLE_SCREENSHOT = document.querySelector('div#screenshot>button')
const MIX_BLEND_MODES = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity'
]
const COLORS_BY_DARKNESS = [
    '#EEE3AB',
    '#DBCBD8',
    '#BDE4A8',
    '#FBD1A2',
    '#FCFC62',
    '#E994AC',
    '#AFAEEE',
    '#F5D547',
    '#00F0B5',
    '#6290C3',
    '#92817A',
    '#E05D3A',
    '#2FBF71',
    '#FF3E41',
    '#F61067',
    '#7765E3',
    '#474044',
    '#1E2EDE',
    '#111D13',
]

/*Konsole*/
console.log('%cMeditation by Lea Moser', 'font-weight:bold; font-size:1.1rem; margin: 20px 0')
console.log(`
        _____                   /|
        |   \\      ____        / |
  __    |    \\    /\\   |      /  ;
 /\\  \\  |     \\  /  \\  |     /  ;
/,'\\  \\ |      \\/  : \\ |    /   ;
~  ;   \\|      /   :  \\|   /   ;
   |    \\     /   :'  |   /    ;
   |     \\   /    :   |  /    ;
   |      \\ /    :'   | /     ;
   |       /     :    |/     ;
   |      /     :'    |      ;
    \\    /      :     |     ;
     \\  /      :'     |     ;
      \\       :'      |    ;
       \\______:_______|___;
`)
console.log('%cContact', 'font-size:1.1rem; margin-top: 30px')
console.log('- privat@lea-moser.ch')
console.log('%c- github.com/leamoser', 'font-style: italic; margin-bottom: 100px')

/*Regelbare Parameter*/
let params = [
    {
        id: 1,
        name: 'Blobgrösse (50px <-> 1000px)',
        val_init: 400,
        val_min: 50,
        val_max: 1000,
        unit: 'px',
        variable_name: 'blobsize'
    }, /*Blobgrösse*/
    {
        id: 2,
        name: 'Tempo Grössenveränderung Blob (10s <-> 100s)',
        val_init: 20,
        val_min: 10,
        val_max: 100,
        unit: 's',
        variable_name: 'as-size-blob'
    }, /*Tempo Grösse Blob*/
    {
        id: 3,
        name: 'Tempo Farbänderung Blob (2s <-> 60s)',
        val_init: 30,
        val_min: 2,
        val_max: 60,
        unit: 's',
        variable_name: 'as-color-blob'
    }, /*Tempo Farbänderung Blob*/
    {
        id: 4,
        name: 'Blur (0px <-> 200px)',
        val_init: 0,
        val_min: 0,
        val_max: 200,
        unit: 'px',
        variable_name: 'blursize'
    }, /*Blur*/
    {
        id: 5,
        name: 'Mix Blend Mode (verschiedene)',
        val_init: 0,
        val_min: 0,
        val_max: MIX_BLEND_MODES.length - 1,
        unit: '',
        steps: true,
        step_values: MIX_BLEND_MODES,
        variable_name: 'mixblendmode'
    }, /*Mix-Blend-Modes*/
    {
        id: 6,
        name: 'Farbe 1 Blob (heller <-> dunkler)',
        val_init: 4,
        val_min: 0,
        val_max: COLORS_BY_DARKNESS.length - 1,
        unit: '',
        steps: true,
        step_values: COLORS_BY_DARKNESS,
        variable_name: 'color_1_blob'
    }, /*Farbe Blob 1*/
    {
        id: 7,
        name: 'Farbe 2 Blob (heller <-> dunkler)',
        val_init: 13,
        val_min: 0,
        val_max: COLORS_BY_DARKNESS.length - 1,
        unit: '',
        steps: true,
        step_values: COLORS_BY_DARKNESS,
        variable_name: 'color_2_blob'
    }, /*Farbe Blob 2*/
    {
        id: 8,
        name: 'Farbe 1 Hintergrund (heller <-> dunkler)',
        val_init: 2,
        val_min: 0,
        val_max: COLORS_BY_DARKNESS.length - 1,
        unit: '',
        steps: true,
        step_values: COLORS_BY_DARKNESS,
        variable_name: 'color_1_bg'
    }, /*Farbe BG 1*/
    {
        id: 9,
        name: 'Farbe 2 Hintergrund (heller <-> dunkler)',
        val_init: 5,
        val_min: 0,
        val_max: COLORS_BY_DARKNESS.length - 1,
        unit: '',
        steps: true,
        step_values: COLORS_BY_DARKNESS,
        variable_name: 'color_2_bg'
    }, /*Farbe BG 2*/
]

/*Toggle*/
TOGGLE_OPEN.addEventListener('click', function () {
    init()
    hide_element(this)
    show_element(REGLER)
    show_element(TOGGLE_CLOSE)
})
TOGGLE_CLOSE.addEventListener('click', function () {
    hide_element(this)
    hide_element(REGLER)
    show_element(TOGGLE_OPEN)
})
TOGGLE_SHUFFLE.addEventListener('click', function () {
    hide_element(REGLER)
    hide_element(TOGGLE_CLOSE)
    show_element(TOGGLE_OPEN)
    params.forEach(param => {
        shuffleAllParams(param)
    })
})
/*TOGGLE_SCREENSHOT.addEventListener('click', function () {
    console.log('do screenshot')
})*/

/*Funktionen*/
let hide_element = (element) => {
    if (!element.classList.contains('hidden')) {
        element.classList.add('hidden')
    }
}
let show_element = (element) => {
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden')
    }
}
let slugify = (string) => {
    return string.toLowerCase().replace(/\s+/g, '').replace(/[^\w\s]/gi, '')
}
let getRadomNumber = (min, max) => {
    return (Math.floor((Math.random() * ((max + 1) - min)) + min));
}
let createParamSlider = (param) => {
    let container = document.createElement('div')
    container.classList.add('regler_content_slider')
    let label = document.createElement('label')
    label.setAttribute('for', slugify(param.name))
    label.innerHTML = param.name
    let regler = document.createElement('input')
    regler.setAttribute('type', 'range')
    regler.setAttribute('id', slugify(param.name))
    regler.setAttribute('name', slugify(param.name))
    regler.setAttribute('min', param.val_min)
    regler.setAttribute('max', param.val_max)
    regler.setAttribute('value', param.val_init)
    if (param.steps) {
        regler.setAttribute('step', 1)
    }
    regler.addEventListener('input', function (e) {
        updateBlob(param, e)
    })
    container.appendChild(label)
    container.appendChild(regler)
    return container
}
let setParamVariable = (param, val_updated = null) => {
    let val
    val_updated ? val = val_updated : val = param.val_init
    if (!param.steps) {
        document.documentElement.style.setProperty(`--${param.variable_name}`, val + param.unit);
    } else {
        document.documentElement.style.setProperty(`--${param.variable_name}`, param.step_values[val]);
    }
}
let updateBlob = (param, event) => {
    setParamVariable(param, event.target.value)
}
let setUpParam = (param) => {
    REGLER.appendChild(createParamSlider(param))
    setParamVariable(param)
}
let shuffleAllParams = (param) => {
    if (param.id !== 4) {
        let random_val = getRadomNumber(param.val_min, param.val_max)
        setParamVariable(param, random_val)
        let found = params.find(el => {
            return el.id === param.id
        })
        found.val_init = random_val
    }
}

/*init*/
let init = () => {
    REGLER.innerHTML = ''
    params.forEach(param => {
        setUpParam(param)
    })
}

init();