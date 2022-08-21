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
        static dBW
        static {
            Object.freeze(this.supported_wave_form)
        }
    }

    // get the essential tags (i.e., elements / HTML nodes)
    const fieldset = document.getElementById('audio') // get the targeted unit converter console
    const output_area = fieldset.getElementsByClassName('output-area')[0] // get the message output area
    const input = Array.from(fieldset.getElementsByTagName('input'))
    const radio_button = input.slice(0, 3)
    const sine_radio_button = radio_button[0], triangular_radio_button = radio_button[1], square_radio_button = radio_button[2]
    const number_input = input.slice(3)
    // U: Voltage, I: Current, Z: Impedance, S: Apparent Power; [subscript] P: Peak, E: Effective
    const UP_input = number_input[0], UE_input = number_input[1], dBu_input = number_input[2], dBV_input = number_input[3]
    const IP_input = number_input[4], IE_input = number_input[5]
    const Z_input = number_input[6]
    const S_input = number_input[7], dBm_input = number_input[8], dBW_input = number_input[9]

    // Add event listeners. Canonical units: V, A, Ω, W (i.e., VA)
    UE_input.addEventListener('input', (e) => {
        read() // DON'T FORGET THIS. Or undefined values will bring about some peculiar behaviors.
        const v = value_keeper
        // Here we primarily make Z fixed when U has changed
        v.dBV = 20 * Math.log10(v.UE)
        v.dBu = 20 * Math.log10(v.UE / Math.sqrt(1e-3 * 600))
        v.IE = v.UE / v.Z
        v.P = v.UE * v.IE
        v.dBW = 10 * Math.log10(v.P)
        v.dBm = v.dBW + 30
        write()
    })
    IE_input.addEventListener('input', (e) => {
        read()
        const v = value_keeper
        // Here we primarily make Z fixed when I has changed
        v.UE = v.IE * v.Z
        v.dBV = 20 * Math.log10(v.UE)
        v.dBu = 20 * Math.log10(v.UE / Math.sqrt(1e-3 * 600))
        v.P = v.UE * v.IE
        v.dBW = 10 * Math.log10(v.P)
        v.dBm = v.dBW + 30
        write()
    })
    Z_input.addEventListener('input', (e) => {
        read()
        const v = value_keeper
        // Here we primarily make U fixed when Z has changed
        v.IE = v.UE / v.Z
        v.P = v.UE * v.IE
        v.dBW = 10 * Math.log10(v.P)
        v.dBm = v.dBW + 30
        write()
    })
    S_input.addEventListener('input', (e) => {
        read()
        const v = value_keeper
        // Here we primarily make Z fixed and let U, I able to change when S has changed
        v.dBW = 10 * Math.log10(v.P)
        v.dBm = v.dBW + 30
        v.UE = Math.sqrt(v.P * v.Z)
        v.dBV = 20 * Math.log10(v.UE)
        v.dBu = 20 * Math.log10(v.UE / Math.sqrt(1e-3 * 600))
        v.IE = v.UE / v.Z
        write()
    })

    // fire the corresponding event handlers and show an example of this unit converter utility
    read() // read initial values
    UE_input.dispatchEvent(new Event('input', { bubbles: true }))

    // local functions
    function print(message) {
        output_area.innerHTML = message
    }

    function read() {
        const v = value_keeper
        v.wave_form = sine_radio_button.checked ? v.supported_wave_form.sine : triangular_radio_button.checked ? v.supported_wave_form.triangular : v.supported_wave_form.square
        v.UP = parseFloat(UP_input.value), v.UE = parseFloat(UE_input.value)
        v.dBu = parseFloat(dBu_input.value), v.dBV = parseFloat(dBV_input.value)
        v.IP = parseFloat(IP_input.value), v.IE = parseFloat(IE_input.value)
        v.Z = parseFloat(Z_input.value)
        v.P = parseFloat(S_input.value)
        v.dBm = parseFloat(dBm_input.value), v.dBW = parseFloat(dBW_input.value)
    }

    function write() {
        const v = value_keeper
        if (!isNaN(v.UP)) UP_input.value = v.UP
        if (!isNaN(v.UE)) UE_input.value = v.UE
        if (!isNaN(v.dBu)) dBu_input.value = v.dBu
        if (!isNaN(v.dBV)) dBV_input.value = v.dBV
        if (!isNaN(v.IP)) IP_input.value = v.IP
        if (!isNaN(v.IE)) IE_input.value = v.IE
        if (!isNaN(v.Z)) Z_input.value = v.Z
        if (!isNaN(v.P)) S_input.value = v.P
        if (!isNaN(v.dBm)) dBm_input.value = v.dBm
        if (!isNaN(v.dBW)) dBW_input.value = v.dBW
    }
}
