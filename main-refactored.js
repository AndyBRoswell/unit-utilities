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

        // value storage. U: Voltage, I: Current, Z: Impedance, S: Apparent Power; [subscript] P: Peak, E: Effective
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

        // I/O
        number_input
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

        output_area

        static {
            Object.freeze(this.supported_wave_form)
        }

        constructor() {}

        constructor(number_input, radio_button, output_area) {
            // get inputs and outputs
            this.number_input = number_input, this.radio_button = radio_button, this.output_area = output_area
            const i = number_input
            this.UP_input = i['peak-voltage'], this.UE_input = i['voltage']
            this.dBu_input = i['dBu'], this.dBV_input = i['dBV']
            this.IP_input = i['peak-current'], this.IE_input = i['current']
            this.Z_input = i['impedance']
            this.S_input = i['power']
            this.mW_input = i['mW'], this.dBm_input = i['dBm'], this.dBW_input = i['dBW']

            // add event handlers
            const E_H_Map = new Map() // Element-Handler Map: Add event listeners. Canonical units: V, A, Ω, W (i.e., VA)
            E_H_Map.set(this.UE_input, () => {
                // Here we primarily make Z fixed when U has changed
                this.IE = this.UE / this.Z
                this.P = this.UE * this.IE
                this.convert_V()
                this.convert_W()
            })
            E_H_Map.set(this.IE_input, () => {
                // Here we primarily make Z fixed when I has changed
                this.UE = this.IE * this.Z
                this.P = this.UE * this.IE
                this.convert_V()
                this.convert_W()
            })
            E_H_Map.set(this.Z_input, () => {
                // Here we primarily make U fixed when Z has changed
                this.IE = this.UE / this.Z
                this.P = this.UE * this.IE
                this.convert_W()
            })
            E_H_Map.set(this.S_input, () => {
                // Here we primarily make Z fixed and let U, I able to change when S has changed
                this.UE = Math.sqrt(this.P * this.Z)
                this.IE = this.UE / this.Z
                this.convert_V()
                this.convert_W()
            })
            E_H_Map.set(this.dBV_input, () => {
                this.UE = Math.pow(10, this.dBV / 20)
                this.IE = this.UE / this.Z
                this.P = this.UE * this.IE
                this.convert_V()
                this.convert_W()
            })
            E_H_Map.set(this.dBu_input, () => {
                this.UE = Math.pow(10, (this.dBu + 20 * Math.log10(Math.sqrt(0.001 * 600))) / 20)
                this.IE = this.UE / this.Z
                this.P = this.UE * this.IE
                this.convert_V()
                this.convert_W()
            })
            E_H_Map.set(this.dBW_input, () => {
                this.P = Math.pow(10, this.dBW / 10)
                this.UE = Math.sqrt(this.P * this.Z)
                this.IE = this.UE / this.Z
                this.convert_V()
                this.convert_W()
            })
            E_H_Map.set(this.dBm_input, () => {
                this.P = Math.pow(10, (this.dBm - 30) / 10)
                this.UE = Math.sqrt(this.P * this.Z)
                this.IE = this.UE / this.Z
                this.convert_V()
                this.convert_W()
            })
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

        write(skipped_inputs = new Set()) {
            const v = [ this.UP, this.UE, this.dBu, this.dBV, this.IP, this.IE, this.Z, this.S, this.mW, this.dBm, this.dBW ]
            const n = this.number_input
            this.output_area.innerHTML = ''
            for (let i = 0; i < n.length / 2; ++i) { // here the quantity of string keys is equal to the quantity of number indices
                if (!skipped_inputs.has(n[i])) {
                    if (!isNaN(v[i])) n[i].value = v[i]
                    else this.output_area.innerHTML += `${n[i].name} is NaN.<br>`
                }
            }
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

    read() // read initial values
    fire_input_event() // fire the corresponding event handlers and show an example of this unit converter utility

    // local functions

    function fire_input_event(element = UE_input) {
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
    }
}
