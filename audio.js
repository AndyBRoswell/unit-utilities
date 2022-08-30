const global_area = document.getElementById('audio') // get the targeted unit converter console
const workspace = global_area.getElementsByClassName('workspace')
{
    class value_keeper { // instances of this class may be used for undo and redo functions in the future
        static WAVE_FORM = { sine: 0, triangular: 1, square: 2, }

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

        static {
            Object.freeze(this.WAVE_FORM)
        }

        constructor(v) {
            if (v !== undefined) { // then clone from v

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

        calc_peak() {
            const w = value_keeper.WAVE_FORM
            switch (this.wave_form) {
                default: // case w.sine:
                    this.UP = this.UE * Math.sqrt(2)
                    this.IP = this.IE * Math.sqrt(2)
                    break
                case w.triangular:
                    this.UP = this.UE * Math.sqrt(3)
                    this.IP = this.IE * Math.sqrt(3)
                    break
                case w.square:
                    this.UP = this.UE
                    this.IP = this.IE
                    break
            }
        }

        convert() {
            this.convert_V()
            this.convert_W()
            this.calc_peak()
        }
    }

    const current_value_keeper = new value_keeper
    const scope = workspace[0] // get the targeted part (scope) in the unit converter console
    const input = Array.from(scope.getElementsByTagName('input')) // get the inputs
    const output_area = scope.getElementsByClassName('output-area')[0] // get the message output area
    const radio_button = {}, number_input = {}
    {
        // The purpose of dual indices (compared with just number index): Lessen the modification of code when more inputs are inserted
        const r = radio_button, n = number_input
        let p = input.slice(0, 3) // radio button precursor
        for (let i = 0; i < p.length; ++i) { r[i] = p[i], r[p[i].name] = {} } // index type 1 of 2: number; get ready for index type 2
        for (let i = 0; i < p.length; ++i) { r[p[i].name][p[i].value] = p[i] } // index type 2 of 2: input.name and input.value
        p = input.slice(3) // number input precursor
        for (let i = 0; i < p.length; ++i) { n[i] = n[p[i].name] = p[i] }  // 2 types of indices: number and string

        // add event handlers for the current value keeper
        const c = current_value_keeper
        const m = new Map // Element-Handler Map: Add event listeners. Canonical units: V, A, Ω, W (i.e., VA)
        m.set(n['voltage'], () => { // Here we primarily make Z fixed when U has changed
            c.IE = c.UE / c.Z
            c.S = c.UE * c.IE
            c.convert()
        })
        m.set(n['current'], () => { // Here we primarily make Z fixed when I has changed
            c.UE = c.IE * c.Z
            c.S = c.UE * c.IE
            c.convert()
        })
        m.set(n['impedance'], () => { // Here we primarily make U fixed when Z has changed
            c.IE = c.UE / c.Z
            c.S = c.UE * c.IE
            c.convert()
        })
        m.set(n['power'], () => { // Here we primarily make Z fixed and let U, I able to change when S has changed
            c.UE = Math.sqrt(c.S * c.Z)
            c.IE = c.UE / c.Z
            c.convert()
        })
        m.set(n['dBV'], () => {
            c.UE = Math.pow(10, c.dBV / 20)
            c.IE = c.UE / c.Z
            c.S = c.UE * c.IE
            c.convert()
        })
        m.set(n['dBu'], () => {
            c.UE = Math.pow(10, (c.dBu + 20 * Math.log10(Math.sqrt(0.001 * 600))) / 20)
            c.IE = c.UE / c.Z
            c.S = c.UE * c.IE
            c.convert()
        })
        m.set(n['dBW'], () => {
            c.S = Math.pow(10, c.dBW / 10)
            c.UE = Math.sqrt(c.S * c.Z)
            c.IE = c.UE / c.Z
            c.convert()
        })
        m.set(n['dBm'], () => {
            c.S = Math.pow(10, (c.dBm - 30) / 10)
            c.UE = Math.sqrt(c.S * c.Z)
            c.IE = c.UE / c.Z
            c.convert()
        })
        m.set(n['mW'], () => {
            c.S = c.mW / 1e3
            c.UE = Math.sqrt(c.S * c.Z)
            c.IE = c.UE / c.Z
            c.convert()
        })
        m.set(n['peak-voltage'], () => {
            const w = value_keeper.WAVE_FORM
            switch (c.wave_form) {
                default: // case w.sine:
                    c.UE = c.UP / Math.sqrt(2)
                    break
                case w.triangular:
                    c.UE = c.UP / Math.sqrt(3)
                    break
                case w.square:
                    c.UE = c.UP
                    break
            }
            c.IE = c.UE / c.Z
            c.IP = c.UP / c.Z
            c.S = c.UE * c.IE
            c.convert_V()
            c.convert_W()
        })
        m.set(n['peak-current'], () => {
            const w = value_keeper.WAVE_FORM
            switch (c.wave_form) {
                default: // case w.sine:
                    c.IE = c.IP / Math.sqrt(2)
                    break
                case w.triangular:
                    c.IE = c.IP / Math.sqrt(3)
                    break
                case w.square:
                    c.IE = c.IP
                    break
            }
            c.UE = c.IE * c.Z
            c.UP = c.IP * c.Z
            c.S = c.UE * c.IE
            c.convert_V()
            c.convert_W()
        })
        const read = () => {
            const W = value_keeper.WAVE_FORM
            const w = radio_button['wave-form']
            c.wave_form = w['sine'].checked ? W.sine : w['triangular'].checked ? W.triangular : W.square
            c.UP = parseFloat(n['peak-voltage'].value), c.UE = parseFloat(n['voltage'].value)
            c.dBu = parseFloat(n['dBu'].value), c.dBV = parseFloat(n['dBV'].value)
            c.IP = parseFloat(n['peak-current'].value), c.IE = parseFloat(n['current'].value)
            c.Z = parseFloat(n['impedance'].value)
            c.S = parseFloat(n['power'].value)
            c.mW = parseFloat(n['mW'].value), c.dBm = parseFloat(n['dBm'].value), c.dBW = parseFloat(n['dBW'].value)
        }
        const write = (skipped_inputs = new Set) => {
            const v = [ c.UP, c.UE, c.dBu, c.dBV, c.IP, c.IE, c.Z, c.S, c.mW, c.dBm, c.dBW, ]
            output_area.innerHTML = ''
            for (let i = 0; i < Object.keys(n).length / 2; ++i) {
                if (!skipped_inputs.has(n[i])) {
                    if (!isNaN(v[i])) n[i].value = v[i]
                    else output_area.innerHTML += `${n[i].name} is NaN.<br>`
                }
            }
        }
        for (const [ e, h ] of m) {
            e.addEventListener('input', (event) => {
                read()
                h()
                write(new Set([ event.target ]))
            })
        }
        m.clear()
        m.set(r['wave-form']['sine'], () => {
            c.wave_form = value_keeper.WAVE_FORM.sine
            n['peak-voltage'].value = c.UP = c.UE * Math.sqrt(2)
            n['peak-current'].value = c.IP = c.IE * Math.sqrt(2)
        })
        m.set(r['wave-form']['triangular'], () => {
            c.wave_form = value_keeper.WAVE_FORM.triangular
            n['peak-voltage'].value = c.UP = c.UE * Math.sqrt(3)
            n['peak-current'].value = c.IP = c.IE * Math.sqrt(3)
        })
        m.set(r['wave-form']['square'], () => {
            c.wave_form = value_keeper.WAVE_FORM.square
            n['peak-voltage'].value = c.UP = c.UE
            n['peak-current'].value = c.IP = c.IE
        })
        for (const [ e, h ] of m) {
            e.addEventListener('click', (event) => { h() })
        }

        // fire the corresponding event handlers and show an example of this unit converter utility
        n['voltage'].dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
    }
}
{
    class value_keeper { // instances of this class may be used for undo and redo functions in the future
        sensitivity
        power
        SPL

        constructor(v) {
            if (v !== undefined) { // then clone from v

            }
        }
    }

    const current_value_keeper = new value_keeper
    const scope = workspace[1] // get the targeted part (scope) in the unit converter console
    const input = Array.from(scope.getElementsByTagName('input')) // get the inputs
    const output_area = scope.getElementsByClassName('output-area')[0] // get the message output area
    const radio_button = {}, number_input = {}, associated_unit_label = {}
    {
        // The purpose of dual indices (compared with just number index): Lessen the modification of code when more inputs are inserted
        const r = radio_button, n = number_input, a = associated_unit_label
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
        a[0] = a['power'] = n['power'].parentNode.nextElementSibling.getElementsByTagName('label')[0]
        a[1] = a['SPL'] = n['SPL'].parentNode.nextElementSibling.getElementsByTagName('label')[0]

        // add event handlers for the current value keeper
        const c = current_value_keeper
        const m = new Map // Element-Handler Map: Add event listeners.
        m.set(n['sensitivity'], () => { // Here we primarily make Power fixed when Sensitivity has changed
            c.SPL = c.sensitivity + 10 * Math.log10(c.power)
        })
        m.set(n['power'], () => { // Here we primarily make Sensitivity fixed when Power has changed
            c.SPL = c.sensitivity + 10 * Math.log10(c.power)
        })
        m.set(n['SPL'], () => { // Here we primarily make Sensitivity fixed when SPL has changed
            c.power = Math.pow(10, (c.SPL - c.sensitivity) / 10)
        })
        const read = () => {
            c.sensitivity = parseFloat(n['sensitivity'].value)
            c.power = parseFloat(n['power'].value)
            c.SPL = parseFloat(n['SPL'].value)
        }
        const write = (skipped_inputs = new Set) => {
            const v = [ c.sensitivity, c.power, c.SPL ]
            output_area.innerHTML = ''
            for (let i = 0; i < Object.keys(n).length / 2; ++i) {
                if (!skipped_inputs.has(n[i])) {
                    if (!isNaN(v[i])) n[i].value = v[i]
                    else output_area.innerHTML += `${n[i].name} is NaN.<br>`
                }
            }
        }
        for (const [ e, h ] of m) {
            e.addEventListener('input', (event) => {
                read()
                h()
                write(new Set([ event.target ]))
            })
        }
        m.clear()
        m.set(r['unit']['dB/W@1m'], () => {
            a['power'].innerHTML = 'W'
            a['SPL'].innerHTML = 'dB@1m'
        })
        m.set(r['unit']['dB/mW'], () => {
            a['power'].innerHTML = 'mW'
            a['SPL'].innerHTML = 'dB'
        })
        for (const [ e, h ] of m) {
            e.addEventListener('click', (event) => { h() })
        }

        // fire the corresponding event handlers and show an example of this unit converter utility
        n['power'].dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
    }
}
{
    class value_keeper { // instances of this class may be used for undo and redo functions in the future
        sound_intensity
        sound_pressure
        SPL

        constructor(v) {
            if (v !== undefined) { // then clone from v

            }
        }
    }

    const current_value_keeper = new value_keeper
    const scope = workspace[2] // get the targeted part (scope) in the unit converter console
    const input = Array.from(scope.getElementsByTagName('input')) // get the inputs
    const output_area = scope.getElementsByClassName('output-area')[0] // get the message output area
    const number_input = {}
    {
        // The purpose of dual indices (compared with just number index): Lessen the modification of code when more inputs are inserted
        const n = number_input
        for (let i = 0; i < input.length; ++i) n[i] = n[input[i].name] = input[i]

        // add event handlers for the current value keeper
        const c = current_value_keeper
        const m = new Map // Element-Handler Map: Add event listeners.
        const Ir = 1e-12
        const Pr = 20e-6
        m.set(n['sound-intensity'], () => {
            c.SPL = 10 * Math.log10(c.sound_intensity / Ir)
            c.sound_pressure = Pr * Math.pow(10, c.SPL / 20)
        })
        m.set(n['sound-pressure'], () => {
            c.SPL = 20 * Math.log10(c.sound_pressure / Pr)
            c.sound_intensity = Ir * Math.pow(10, c.SPL / 10)
        })
        m.set(n['SPL'], () => {
            c.sound_intensity = Ir * Math.pow(10, c.SPL / 10)
            c.sound_pressure = Pr * Math.pow(10, c.SPL / 20)
        })
        const read = () => {
            c.sound_intensity = parseFloat(n['sound-intensity'].value)
            c.sound_pressure = parseFloat(n['sound-pressure'].value)
            c.SPL = parseFloat(n['SPL'].value)
        }
        const write = (skipped_inputs = new Set) => {
            const v = [ c.sound_intensity, c.sound_pressure, c.SPL ]
            output_area.innerHTML = ''
            for (let i = 0; i < Object.keys(n).length / 2; ++i) {
                if (!skipped_inputs.has(n[i])) {
                    if (!isNaN(v[i])) n[i].value = v[i]
                    else output_area.innerHTML += `${n[i].name} is NaN.<br>`
                }
            }
        }
        for (const [ e, h ] of m) {
            e.addEventListener('input', (event) => {
                read()
                h()
                write(new Set([ event.target ]))
            })
        }

        // fire the corresponding event handlers and show an example of this unit converter utility
        n['SPL'].dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
    }
}
