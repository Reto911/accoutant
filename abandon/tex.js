let latex = require('node-latex');
let fs = require('fs');
let app = require('express')();
let ftp = require('ftp')

// let output = fs.createWriteStream('out.pdf');


app.get('/', (req, res, next) => {
    let input = fs.createReadStream('1.tex');
    const pdf = latex(input, {
        cmd: 'xelatex'
    })
    res.type("application/pdf")
    pdf.pipe(res)
});

// pdf.pipe(output);

// pdf.on('error', err => console.error(err))
// pdf.on('finish', () => console.log('PDF generated!'))

app.listen(80);