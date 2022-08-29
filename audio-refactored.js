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

        convert() {
            this.convert_V()
            this.convert_W()
        }
    }

    const scope = workspace[0] // get the targeted part (scope) in the unit converter console
    const input = Array.from(scope.getElementsByTagName('input')) // get the inputs
    const output_area = scope.getElementsByClassName('output-area')[0] // get the message output area
    const radio_button = {}, number_input = {}
    const current_value_keeper = new value_keeper
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
            c.convert_W()
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

        // fire the corresponding event handlers and show an example of this unit converter utility
        number_input['voltage'].dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }))
        console.log(c)
    }
}
