class global { // globals
    static Synonym = {}
    static SynonymID = {}

    static tag = []
}

// global process

{ // set synonyms
    let c = 0
    let synonym = [
        '力 力学',
        '热 热学',
        '电磁 电磁学 电与磁 电和磁',
        '光 光学',
        '近代物理 近代物理学 现代物理 现代物理学',

        '声 声学',
        '电声 电声学',
    ]
    synonym.forEach(g => {
        ++c
        global.Synonym[c] = g.split(' ')
    })
}
{ // process tags
    const converters = document.getElementsByClassName('converter')
    for (let converter in converters) {

    }
}

// concrete unit converters

{ // audio
    const fieldset = document.getElementById('audio') // get the targeted unit converter console

    // add event listeners
    const wave_form_select = fieldset.getElementsByTagName('select')[0]
    const inputs = fieldset.getElementsByTagName('input')
    for (let input of inputs) {
        switch (input.getAttribute('name')) {
            case 'peak-voltage':
                break
            case 'voltage':
                break
            case 'dBm':
                break
            case 'dBu':
                break
            case 'dBV':
                break
            case 'peak-current':
                break
            case 'current':
                break
            case 'impedance':
                break
            case 'power':
                break
        }
    }
}
