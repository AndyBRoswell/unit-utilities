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

    // get the essential tags (i.e., elements / HTML nodes)
    const fieldset = document.getElementById('audio') // get the targeted unit converter console
    const output_area = fieldset.getElementsByClassName('output-area')[0] // get the message output area
    const wave_form_select = fieldset.getElementsByTagName('select')[0]
    const input = fieldset.getElementsByTagName('input')
    // U: Voltage, I: Current, Z: Impedance, S: Apparent Power; [subscript] P: Peak, E: Effective
    const UP_input = input[3], UE_input = input[4], dBu_input = input[5], dBV_input = input[6]
    const IP_input = input[7], IE_input = input[8]
    const Z_input = input[9]
    const S_input = input[10], dBm_input = input[11], dBW_input = input[12]

    read() // read initial values

    // add event listeners
    UE_input.addEventListener('input', (e) => {
        read() // DON'T FORGET THIS. Or undefined values will bring about some peculiar behaviors.
        const v = value_keeper
        // Here we primarily make Z fixed when U has changed
        v.IE = v.UE / v.Z
        v.P = v.UE * v.IE
        write()
    })
    IE_input.addEventListener('input', (e) => {
        read()
        const v = value_keeper
        // Here we primarily make Z fixed when I has changed
        v.UE = v.IE * v.Z
        v.P = v.UE * v.IE
        write()
    })
    Z_input.addEventListener('input', (e) => {
        read()
        const v = value_keeper
        // Here we primarily make U fixed when Z has changed
        v.IE = v.UE / v.Z
        v.P = v.UE * v.IE
        write()
    })
    S_input.addEventListener('input', (e) => {
        read()
        const v = value_keeper
        // Here we primarily make Z fixed and let U, I able to change when S has changed
        v.UE = Math.sqrt(v.P * v.Z)
        v.IE = v.UE / v.Z
        write()
    })

    // fire the corresponding event handlers and show an example of this unit converter utility
    UE_input.dispatchEvent(new Event('input', { bubbles: true }))

    // local functions
    function print(message) {
        output_area.innerHTML = message
    }

    function read() {
        const v = value_keeper
        v.UP = parseFloat(UP_input.value), v.UE = parseFloat(UE_input.value)
        v.dBu = parseFloat(dBu_input.value), v.dBV = parseFloat(dBV_input.value)
        v.IP = parseFloat(IP_input.value), v.IE = parseFloat(IE_input.value)
        v.Z = parseFloat(Z_input.value)
        v.P = parseFloat(S_input.value)
        v.dBm = parseFloat(dBm_input.value), v.dBw = parseFloat(dBW_input.value)
    }

    function write() {
        const v = value_keeper
        UP_input.value = v.UP, UE_input.value = v.UE, dBu_input.value = v.dBu, dBV_input.value = v.dBV
        IP_input.value = v.IP, IE_input.value = v.IE
        Z_input.value = v.Z
        S_input.value = v.P
        dBm_input.value = v.dBm, dBW_input.value = v.dBw
    }
}
