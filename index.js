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
        '功放 功率放大器'
    ]
    synonym.forEach(g => {
        ++c
        global.synonym[c] = new Set(g.split(' '))
    })
}
{ // process tags
    const converters = document.getElementsByClassName('converter')
    for (const converter in converters) {

    }
}

// concrete unit converters
import './audio.js'
