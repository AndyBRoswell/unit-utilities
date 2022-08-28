const global_area = document.getElementById('audio') // get the targeted unit converter console
const partition = global_area.getElementsByClassName('workspace')
{
    class value_keeper { // instances of this class may be used for undo and redo functions in the future
        static WAVE_FORM = { sine: 0, triangular: 1, square: 2, }

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
            Object.freeze(this.WAVE_FORM)
        }

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
            const E_H_Map = new Map(), m = E_H_Map // Element-Handler Map: Add event listeners. Canonical units: V, A, Ω, W (i.e., VA)
            m.set(this.UE_input, () => { // Here we primarily make Z fixed when U has changed
                this.IE = this.UE / this.Z
                this.S = this.UE * this.IE
                this.convert()
            })
            m.set(this.IE_input, () => { // Here we primarily make Z fixed when I has changed
                this.UE = this.IE * this.Z
                this.S = this.UE * this.IE
                this.convert()
            })
            m.set(this.Z_input, () => { // Here we primarily make U fixed when Z has changed
                this.IE = this.UE / this.Z
                this.S = this.UE * this.IE
                this.convert_W()
            })
            m.set(this.S_input, () => { // Here we primarily make Z fixed and let U, I able to change when S has changed
                this.UE = Math.sqrt(this.S * this.Z)
                this.IE = this.UE / this.Z
                this.convert()
            })
            m.set(this.dBV_input, () => {
                this.UE = Math.pow(10, this.dBV / 20)
                this.IE = this.UE / this.Z
                this.S = this.UE * this.IE
                this.convert()
            })
            m.set(this.dBu_input, () => {
                this.UE = Math.pow(10, (this.dBu + 20 * Math.log10(Math.sqrt(0.001 * 600))) / 20)
                this.IE = this.UE / this.Z
                this.S = this.UE * this.IE
                this.convert()
            })
            m.set(this.dBW_input, () => {
                this.S = Math.pow(10, this.dBW / 10)
                this.UE = Math.sqrt(this.S * this.Z)
                this.IE = this.UE / this.Z
                this.convert()
            })
            m.set(this.dBm_input, () => {
                this.S = Math.pow(10, (this.dBm - 30) / 10)
                this.UE = Math.sqrt(this.S * this.Z)
                this.IE = this.UE / this.Z
                this.convert()
            })
            for (const [ e, h ] of m) {
                e.addEventListener('input', (event) => {
                    this.read()
                    h()
                    this.write(new Set([ event.target ]))
                })
            }
        }

        read() {
            {
                const W = value_keeper.WAVE_FORM
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
            const v = [ this.UP, this.UE, this.dBu, this.dBV, this.IP, this.IE, this.Z, this.S, this.mW, this.dBm, this.dBW, ]
            const n = this.number_input
            this.output_area.innerHTML = ''
            for (let i = 0; i < Object.keys(n).length / 2; ++i) { // here the quantity of string keys is equal to the quantity of number indices
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

        convert() {
            this.convert_V()
            this.convert_W()
        }
    }

    // get the essential tags (i.e., elements / HTML nodes)
    const scope = partition[0] // get the targeted part (scope) in the unit converter console
    const input = Array.from(scope.getElementsByTagName('input')) // get the inputs
    const output_area = scope.getElementsByClassName('output-area')[0] // get the message output area
    const radio_button = {}
    {
        const r = radio_button
        const radio_button_precursor = input.slice(0, 3), p = radio_button_precursor
        for (let i = 0; i < p.length; ++i) { r[i] = p[i], r[p[i].name] = {} } // index type 1 of 2: number; get ready for index type 2
        for (let i = 0; i < p.length; ++i) { r[p[i].name][p[i].value] = p[i] } // index type 2 of 2: input.name and input.value
    }
    const number_input = {}
    {
        const n = number_input
        const number_input_precursor = input.slice(3), p = number_input_precursor
        for (let i = 0; i < p.length; ++i) {
            n[i] = n[p[i].name] = p[i] // 2 types of indices: number and string
        }
    }

    const v = new value_keeper(number_input, radio_button, output_area)
    // fire the corresponding event handlers and show an example of this unit converter utility
    v.UE_input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
}
{
    class value_keeper {
        static SENSITIVITY_UNIT = { dB_W_1m: 0, dB_mW: 1 }

        // value storage
        sensitivity_unit
        sensitivity
        power
        SPL

        // I/O
        number_input
        radio_button

        sensitivity_input
        power_input
        SPL_input

        output_area

        static {
            Object.freeze(this.SENSITIVITY_UNIT)
        }

        constructor(number_input, radio_button, output_area) {
            // get inputs and outputs
            this.number_input = number_input, this.radio_button = radio_button, this.output_area = output_area
            const i = number_input
            this.sensitivity_input = i['sensitivity']
            this.power_input = i['power']
            this.SPL_input = i['SPL']

            // add event handlers
            const E_H_Map = new Map(), m = E_H_Map // Element-Handler Map: Add event listeners.
            m.set(this.sensitivity_input, () => {

            })
            m.set(this.power_input, () => {

            })
            m.set(this.SPL_input, () => {

            })
            const r = radio_button
            m.set(r['dB/W@1m'], () => {

            })
            m.set(r['dB/mW'], () => {

            })
            for (const [ e, h ] of m) {
                e.addEventListener('input', (event) => {
                    this.read()
                    h()
                    this.write(new Set([ event.target ]))
                })
            }
        }

        read() {

        }

        write() {

        }
    }

    const scope = partition[1] // get the targeted part (scope) in the unit converter console
    const input = Array.from(scope.getElementsByTagName('input')) // get the inputs
    const output_area = scope.getElementsByClassName('output-area')[0] // get the message output area
    const radio_button = {}, number_input = {}
    {
        const r = radio_button, n = number_input
        let lr = 0, ln = 0
        input.forEach(i => {
            switch (i.type) {
                case 'radio':
                    r[lr++] = i, r[i.name] = {} // index type 1 of 2: number; get ready for index type 2
                    break
                default:
                    n[ln++] = n[i.name] = i // 2 types of indices: number and string
                    break
            }
        })
        for (let i = 0; i < lr; ++i) { r[r[i].name][r[i].value] = r[i] } // index type 2 of 2: input.name and input.value
    }
}
