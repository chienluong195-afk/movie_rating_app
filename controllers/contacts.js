const ContactSchema = require("../models/Contact")

module.exports.controller = (app) => {

    

    // fetch all contact
    app.get('/contacts', (req, res) => {
        ContactSchema.find({}, 'name email comment', (error, contacts) => {
            if (error) { console.log(error); }
            res.send({
                contacts,
            });
        });
    });

    // add a new movie
    app.post('/contacts', (req, res) => {
        const newContact = new ContactSchema({
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment,
        });

        newContact.save((error, contact) => {
            if (error) { console.log(error); }
            res.send(contact);
        });
    });
    // fetch a single contact
    app.get('/api/contacts/:id', (req, res) => {
        ContactSchema.findById(req.params.id, 'name email comment', (error, contact) => {
            if (error) { console.error(error); }
            res.send(contact);
        });
    });

    // delete a contact
    app.delete('/api/contacts/delete/:id', (req, res) => {
        ContactSchema.remove({
            _id: req.params.id
        }, function (error, contacts) {
            if (error) {
                console.error(error);
            }
            res.send(contacts)
        })
    });
}