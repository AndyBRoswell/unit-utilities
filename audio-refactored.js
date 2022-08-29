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
            if (v != null) {

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
        const r = radio_button, n = number_input

        // The purpose of dual indices (compared with just number index): Lessen the modification of code when more inputs are inserted
        let p = input.slice(0, 3) // radio button precursor
        for (let i = 0; i < p.length; ++i) { r[i] = p[i], r[p[i].name] = {} } // index type 1 of 2: number; get ready for index type 2
        for (let i = 0; i < p.length; ++i) { r[p[i].name][p[i].value] = p[i] } // index type 2 of 2: input.name and input.value
        p = input.slice(3) // number input precursor
        for (let i = 0; i < p.length; ++i) { n[i] = n[p[i].name] = p[i] }  // 2 types of indices: number and string

        // add event handlers
        const v = current_value_keeper
        const m = new Map // Element-Handler Map: Add event listeners. Canonical units: V, A, Ω, W (i.e., VA)
        m.set(n['voltage'], () => { // Here we primarily make Z fixed when U has changed
            v.IE = v.UE / v.Z
            v.S = v.UE * v.IE
            v.convert()
        })
        m.set(n['current'], () => { // Here we primarily make Z fixed when I has changed
            v.UE = v.IE * v.Z
            v.S = v.UE * v.IE
            v.convert()
        })
        m.set(n['impedance'], () => { // Here we primarily make U fixed when Z has changed
            v.IE = v.UE / v.Z
            v.S = v.UE * v.IE
            v.convert_W()
        })
        m.set(n['power'], () => { // Here we primarily make Z fixed and let U, I able to change when S has changed
            v.UE = Math.sqrt(v.S * v.Z)
            v.IE = v.UE / v.Z
            v.convert()
        })
        m.set(n['dBV'], () => {
            v.UE = Math.pow(10, v.dBV / 20)
            v.IE = v.UE / v.Z
            v.S = v.UE * v.IE
            v.convert()
        })
        m.set(n['dBu'], () => {
            v.UE = Math.pow(10, (v.dBu + 20 * Math.log10(Math.sqrt(0.001 * 600))) / 20)
            v.IE = v.UE / v.Z
            v.S = v.UE * v.IE
            v.convert()
        })
        m.set(n['dBW'], () => {
            v.S = Math.pow(10, v.dBW / 10)
            v.UE = Math.sqrt(v.S * v.Z)
            v.IE = v.UE / v.Z
            v.convert()
        })
        m.set(n['dBm'], () => {
            v.S = Math.pow(10, (v.dBm - 30) / 10)
            v.UE = Math.sqrt(v.S * v.Z)
            v.IE = v.UE / v.Z
            v.convert()
        })
        const read = () => {

        }
        const write = (skipped_inputs = new Set) => {

        }
        for (const [ e, h ] of m) {
            e.addEventListener('input', (event) => {
                read()
                h()
                write(new Set([ event.target ]))
            })
        }
    }
}
