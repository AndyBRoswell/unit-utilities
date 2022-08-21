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
    // get the essential tags (elements / nodes)
    const fieldset = document.getElementById('audio') // get the targeted unit converter console
    const output_area = fieldset.getElementsByClassName('output-area')[0] // get the message output area

    // add event listeners
    const wave_form_select = fieldset.getElementsByTagName('select')[0]
    const input = fieldset.getElementsByTagName('input')
    // U: Voltage, I: Current, Z: Impedance, P: Power; [subscript] P: Peak, E: Effective
    const UP_input = input[0], UE_input = input[1], dBu_input = input[2], dBV_input = input[3]
    const IP_input = input[4], IE_input = input[5]
    const Z_input = input[6]
    const P_input = input[7], dBm_input = input[8], dBW_input = input[9]

    UE_input.value = 380 // set default values and fire the corresponding event handlers
    UE_input.addEventListener('input', (e) => {

    })

    // local functions
    function print(message) {
        output_area.innerHTML = message
    }
}
