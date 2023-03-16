const app = require('express')();
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {

        cb(null, Date.now() + file.originalname)

    },
    destination: (req, file, cb) => {
        cb(null, './uploads')
    }

})
let uploadFile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        return cb(null, true)
    }
})
app.get('/files/:name', (req, res) => {

    try {

        res.download(`./uploads/${req.params.name}`, (err) => {
            console.log(err)
        })
    } catch (err) { return res.status(200).json({ status: false, message: "There is some error" }) }
})


app.post('/upload', uploadFile.single('file'), (req, res) => {


    try {
        if (req.file !== undefined) return res.status(200).json({ status: true, message: "Uploaded successfully" })
        else {
            return res.status(200).json({ status: false, message: "Cant'read file" })
        }

    } catch (err) {
        return res.status(200).json({ status: false, message: "There is some error" })

    }



})

app.get('/files', (req, res) => {

    try {


        const arr = [];
        fs.readdir(__dirname + "/uploads/", (err, data) => {
            if (err) console.log("Error")
            else {

                data.forEach((e) => {
                    arr.push({
                        name: e,
                        dir: __dirname + e


                    })
                })


                return res.send(arr)

            }
        })
    } catch (err) {
        return res.status(200).json({ status: false, message: "There is some error" })
    }

})
app.delete('/files/:name', (req, res) => {

    try {

        fs.readdir(__dirname + '/uploads', (err, data) => {
            if (err) return res.status(200).json({ status: false, message: "Error here" })
            else {

                if (data.filter((e) => e === req.params.name).length == 0) return res.status(200).json({ status: false, message: "file NOt found" })

            }


        })



        fs.unlink(__dirname + `/uploads/${req.params.name}`, (err) => {
            if (err) res.status(200).json({ status: false, message: "Deletion failed" })
            else res.status(200).json({ status: true, message: "Deleted succesfully" })
        })

    } catch (err) {
        return res.status(200).json({ status: false, message: "There is some error" })
    }


})



app.listen(5000, () => {
    console.log("app is listening at port 5000")
})