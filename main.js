class global { // globals
    static synonym = {}
    static synonym_ID = {}

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
        global.synonym[c] = g.split(' ')
    })
}
{ // process tags
    const converters = document.getElementsByClassName('converter')
    for (let converter in converters) {

    }
}

// concrete unit converters

{ // audio
    class value_keeper {
        static supported_wave_form = { sine: 0, triangular: 1, square: 2, }
        static wave_form
        static UP
        static UE
        static dBu
        static dBV
        static IP
        static IE
        static Z
        static P
        static dBm
        static dBw
        static {
            Object.freeze(this.supported_wave_form)
        }
    }

    // get the essential tags (elements / nodes)
    const fieldset = document.getElementById('audio') // get the targeted unit converter console
    const output_area = fieldset.getElementsByClassName('output-area')[0] // get the message output area
    const wave_form_select = fieldset.getElementsByTagName('select')[0]
    const input = fieldset.getElementsByTagName('input')
    // U: Voltage, I: Current, Z: Impedance, P: Power; [subscript] P: Peak, E: Effective
    const UP_input = input[0], UE_input = input[1], dBu_input = input[2], dBV_input = input[3]
    const IP_input = input[4], IE_input = input[5]
    const Z_input = input[6]
    const P_input = input[7], dBm_input = input[8], dBW_input = input[9]

    { // read initial values
        const v = value_keeper
        v.UP = parseFloat(UP_input.innerHTML), v.UE = parseFloat(UE_input.innerHTML)
        v.dBu = parseFloat(dBu_input.innerHTML), v.dBV = parseFloat(dBV_input.innerHTML)
        v.IP = parseFloat(IP_input.innerHTML), v.IE = parseFloat(IE_input.innerHTML)
        v.Z = parseFloat(Z_input.innerHTML)
        v.P = parseFloat(P_input.innerHTML)
        v.dBm = parseFloat(dBm_input.innerHTML), v.dBw = parseFloat(dBW_input.innerHTML)
    }
    console.log(value_keeper)

    // add event listeners
    UE_input.value = 380 // set default values and fire the corresponding event handlers
    UE_input.addEventListener('input', (e) => {

    })

    // local functions
    function print(message) {
        output_area.innerHTML = message
    }

    function refresh() {
        const v = value_keeper
        UP_input.innerHTML = v.UP, UE_input.innerHTML = v.UE, dBu_input.innerHTML = v.dBu, dBV_input.innerHTML = v.dBV
        IP_input.innerHTML = v.IP, IE_input.innerHTML = v.IE
        Z_input.innerHTML = v.Z
        P_input.innerHTML = v.P
        dBm_input.innerHTML = v.dBm, dBW_input.innerHTML = v.dBw
    }
}
