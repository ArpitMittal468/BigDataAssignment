let txa = 0;
function AddNewFile() {
    txa++;
    document.getElementById('files').innerHTML += `<input id="txa${txa}" rows="10" placeholder="Place your content of document ${txa}"></input>`
}

let termFreqMat = {};
let clustor = {}
let Query = {}
let ranking = []

function createTearmFrequency() {
    termFreqMat = {};
    clustor = {};
    Query = {};
    ranking = []

    let currentDoc;

    let x = document.getElementById('TermFreq')
    x.innerHTML = '<h1>Term Frequency Matrix:</h1>'
    for (let i = 1; i <= txa; i++) {
        currentDoc = document.getElementById('txa' + i).value.toLowerCase();
        console.log(currentDoc)
        currentDoc = currentDoc.trim().split(' ')
        termFreqMat[i] = {};
        for (let word of currentDoc) {
            if (word) {
                termFreqMat[i][word] = termFreqMat[i][word] ? termFreqMat[i][word] + 1 : 1;
                clustor[word] = ""
            }
        }
    }
    let table = "<table><thead><tr><td>Documents</td>"
    for (let word in clustor) table += `<td>${word}</td>`
    table += "</tr></thead>"
    for (let i = 1; i <= txa; i++) {
        table += `<tr><td>Document ${i}</td>`
        for (let word in clustor) {
            let z = termFreqMat[i][word] ? termFreqMat[i][word] : 0;
            table += `<td>${z}</td>`
        }
        table += '</tr>'
    }
    table += '</table>'
    x.innerHTML += table


    currentDoc = document.getElementById('Query').value.toLowerCase();
    currentDoc = currentDoc.trim().split(' ')
    for (let word of currentDoc) {
        if (word && clustor[word] == '') {
            Query[word] = Query[word] ? Query[word] + 1 : 1;
        }
    }

}

function calculateIDF() {
    let x = document.getElementById('IDF')
    x.innerHTML = '<h1>Inverse Document Frequency:</h1>'
    let table = '<table><thead><tr>'
    for (let word in clustor) table += `<td>${word}</td>`
    table += '</thead></tr><tr>'
    for (let word in clustor) {
        let cnt = 0;
        for (let doc in termFreqMat) {
            cnt += termFreqMat[doc][word] ? 1 : 0;
        }
        clustor[word] = Math.log10(txa / cnt);
        table += `<td>${parseInt(clustor[word] * 1000) / 1000}</td>`
    }
    table += '</tr></table>'
    x.innerHTML += table
}

function documentVecotrs() {
    let x = document.getElementById('DocVec')
    x.innerHTML = '<h1>Document Vectors:</h1>'
    let table = "<table><thead><tr><td>DocId</td>"
    for (let word in clustor) table += `<td>${word}</td>`
    table += "</tr></thead>"
    for (let i = 1; i <= txa; i++) {
        table += `<tr><td>Doc ${i}</td>`
        for (let word in clustor) {
            let z = termFreqMat[i][word] ? termFreqMat[i][word] : 0;
            termFreqMat[i][word] = parseInt(clustor[word] * 1000 * z) / 1000
            table += `<td>${termFreqMat[i][word]}</td>`
        }
        table += '</tr>'
    }
    table += `<tr><td>Query</td>`

    for (let word in clustor) {
        let z = Query[word] ? Query[word] : 0;
        Query[word] = parseInt(clustor[word] * 1000 * z) / 1000;
        table += `<td>${Query[word]}</td>`
    }
    table += '</tr>'

    table += '</table>'
    x.innerHTML += table

}
function calculateSimlarity() {
    let x = document.getElementById('Simlarity')
    x.innerHTML = '<h1>Simlarity: </h1> <div id="Result"></div>'
    x = document.getElementById('Result')

    for (let doc in termFreqMat) {
        let y = []
        let total = 0;
        for (let word in clustor) {
            if (Query[word] + termFreqMat[doc][word] > 0) {
                total += Query[word] * termFreqMat[doc][word]
                y.push(`<span>(${Query[word]})(${termFreqMat[doc][word]})</span>`)
            }
        }
        total = parseInt(total * 1000) / 1000
        x.innerHTML += `<div>` + `<span class="bold">Sim(D${doc},Q) = </span>` + y.join(' + ') + `<span class="bold"> = ${total}</span>` + "</div>"
        ranking.push({
            total, doc
        })
    }
    ranking.sort((a, b) => b.total - a.total)
    x.innerHTML += '<h4>Ranking:</h4>'
    let z = '<div>'
    for (let orr in ranking) {
        z += `<span>${parseInt(orr) + 1}. Doc ${ranking[orr].doc} [${ranking[orr].total}]</span><br>`
    }
    z += '</div>'
    x.innerHTML += z
}

function Start() {
    createTearmFrequency();
    calculateIDF();
    documentVecotrs();
    calculateSimlarity();
}

function startUp() {
    AddNewFile();
    AddNewFile();
    AddNewFile();
}
startUp()

document.getElementById('AddNewFile').addEventListener('click', AddNewFile)
document.getElementById('Start').addEventListener('click', Start)

document.getElementById('txa1').value = "Shipment of gold damaged in a fire"
document.getElementById('txa2').value = "Delivery of silver arrived in a silver truck"
document.getElementById('txa3').value = "Shipment of gold arrived in a truck"
document.getElementById('Query').value = "gold silver truck"