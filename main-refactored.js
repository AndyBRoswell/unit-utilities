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
    class value_keeper { // instances of this class may be used for undo and redo functions in the future
        static supported_wave_form = { sine: 0, triangular: 1, square: 2, }
        // U: Voltage, I: Current, Z: Impedance, S: Apparent Power; [subscript] P: Peak, E: Effective
        wave_form
        UP
        UE
        dBu
        dBV
        IP
        IE
        Z
        S
        mW
        dBm
        dBW

        general_input
        radio_button

        UP_input
        UE_input
        dBu_input
        dBV_input
        IP_input
        IE_input
        Z_input
        S_input
        mW_input
        dBm_input
        dBW_input

        static {
            Object.freeze(this.supported_wave_form)
        }

        constructor() {}

        constructor(general_input, radio_button) {
            this.general_input = general_input, this.radio_button = radio_button
            const i = general_input
            this.UP_input = i['peak-voltage'], this.UE_input = i['voltage']
            this.dBu_input = i['dBu'], this.dBV_input = i['dBV']
            this.IP_input = i['peak-current'], this.IE_input = i['current']
            this.Z_input = i['impedance']
            this.S_input = i['power']
            this.mW_input = i['mW'], this.dBm_input = i['dBm'], this.dBW_input = i['dBW']
        }

        read() {
            {
                const W = value_keeper.supported_wave_form
                const w = radio_button['wave-form']
                this.wave_form = w['sine'].checked ? W.sine : w['triangular'].checked ? W.triangular : W.square
            }
            {
                this.UP = parseFloat(this.UP_input.value), this.UE = parseFloat(this.UE_input.value)
                this.dBu = parseFloat(this.dBu_input.value), this.dBV = parseFloat(this.dBV_input.value)
                this.IP = parseFloat(this.IP_input.value), this.IE = parseFloat(this.IE_input.value)
                this.Z = parseFloat(this.Z_input.value)
                this.S = parseFloat(this.S_input.value)
                this.mW = parseFloat(this.mW_input.value), this.dBm = parseFloat(this.dBm_input.value), this.dBW = parseFloat(this.dBW_input.value)
            }
        }

        write() {

        }

        convert_V() {
            const lgV = Math.log10(this.UE)
            this.dBV = 20 * lgV
            this.dBu = this.dBV - 20 * Math.log10(Math.sqrt(1e-3 * 600))
        }

        convert_W() {
            this.mW = this.S * 1e3
            this.dBW = 10 * Math.log10(this.S)
            this.dBm = this.dBW + 30
        }
    }

    // get the essential tags (i.e., elements / HTML nodes)
    const fieldset = document.getElementById('audio') // get the targeted unit converter console
    const output_area = fieldset.getElementsByClassName('output-area')[0] // get the message output area
    const input = Array.from(fieldset.getElementsByTagName('input')) // get the inputs
    const radio_button = {}
    {
        const r = radio_button
        const radio_button_precursor = input.slice(0, 3), p = radio_button_precursor
        for (let i = 0; i < p.length; ++i) { // index type 1 of 2: number
            r[i] = p[i], r[p[i].name] = {}
        }
        for (let i = 0; i < p.length; ++i) { // index type 2 of 2: input.name and input.value
            r[p[i].name][p[i].value] = p[i]
        }
    }
    const number_input = {}
    {
        const n = number_input
        const number_input_precursor = input.slice(3), p = number_input_precursor
        for (let i = 0; i < p.length; ++i) {
            n[i] = n[p[i].name] = p[i] // 2 types of indices: number and string
        }
    }

    // Element-Handler Map: Add event listeners. Canonical units: V, A, Ω, W (i.e., VA)
    const E_H_Map = new Map()
    E_H_Map.set(UE_input, () => {
        const v = value_keeper
        // Here we primarily make Z fixed when U has changed
        v.IE = v.UE / v.Z
        v.S = v.UE * v.IE
        v.convert_V()
        v.convert_W()
    })
    E_H_Map.set(IE_input, () => {
        const v = value_keeper
        // Here we primarily make Z fixed when I has changed
        v.UE = v.IE * v.Z
        v.S = v.UE * v.IE
        v.convert_V()
        v.convert_W()
    })
    E_H_Map.set(Z_input, () => {
        const v = value_keeper
        // Here we primarily make U fixed when Z has changed
        v.IE = v.UE / v.Z
        v.S = v.UE * v.IE
        v.convert_W()
    })
    E_H_Map.set(S_input, () => {
        const v = value_keeper
        // Here we primarily make Z fixed and let U, I able to change when S has changed
        v.UE = Math.sqrt(v.P * v.Z)
        v.IE = v.UE / v.Z
        v.convert_V()
        v.convert_W()
    })
    E_H_Map.set(dBV_input, () => {
        const v = value_keeper
        v.UE = Math.pow(10, v.dBV / 20)
        v.IE = v.UE / v.Z
        v.S = v.UE * v.IE
        v.convert_V()
        v.convert_W()
    })
    E_H_Map.set(dBu_input, () => {
        const v = value_keeper
        console.log("dBu: " + v.dBu)
        v.UE = Math.pow(10, (v.dBu + 20 * Math.log10(Math.sqrt(0.001 * 600))) / 20)
        console.log("V: " + v.UE)
        v.IE = v.UE / v.Z
        v.S = v.UE * v.IE
        v.convert_V()
        v.convert_W()
    })
    E_H_Map.set(dBW_input, () => {
        const v = value_keeper
        v.S = Math.pow(10, v.dBW / 10)
        v.UE = Math.sqrt(v.P * v.Z)
        v.IE = v.UE / v.Z
        v.convert_V()
        v.convert_W()
    })
    E_H_Map.set(dBm_input, () => {
        const v = value_keeper
        v.S = Math.pow(10, (v.dBm - 30) / 10)
        v.UE = Math.sqrt(v.P * v.Z)
        v.IE = v.UE / v.Z
        v.convert_V()
        v.convert_W()
    })
    add_input_EHs_with_auto_rw(E_H_Map)

    read() // read initial values
    fire_input_event() // fire the corresponding event handlers and show an example of this unit converter utility

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
        v.S = parseFloat(S_input.value)
        v.dBm = parseFloat(dBm_input.value), v.dBW = parseFloat(dBW_input.value)
    }

    function write(skipped_elements = new Set()) {
        const v = value_keeper
        const value_to_write = [ v.UP, v.UE, v.dBu, v.dBV, v.IP, v.IE, v.Z, v.P, v.dBm, v.dBW ]
        for (let i = 0; i < number_input.length; ++i) {
            if (!skipped_elements.has(number_input[i])) {
                if (!isNaN(value_to_write[i])) number_input[i].value = value_to_write[i]
                else print(`${number_input[i].name} is NaN.`)
            }
        }
    }

    function add_input_EH_with_auto_RW(element, handler) {
        element.addEventListener('input', (event) => {
            read()
            handler()
            write(new Set([ event.target ]))
        })
    }

    function add_input_EHs_with_auto_rw(E_H_map) {
        for (const [ e, h ] of E_H_map) {
            add_input_EH_with_auto_RW(e, h)
        }
    }

    function fire_input_event(element = UE_input) {
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
    }
}
