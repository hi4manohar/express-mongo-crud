const { body } = require('express-validator');

exports.agencyvalidate = (method) => {
    switch (method) {
        case 'agency': {
            return [ 
                body('agency.agency_id', 'Invalid Agency Id').exists().trim().escape().isLength({max: 10}).isInt(),
                body('agency.name', 'userName doesnt exists').exists().trim().escape().isLength({min: 2, max: 100}),
                body('agency.address', 'Invalid Address').exists().trim().escape().isLength({min: 2,max:200}),
                body('agency.address_alt', 'Invalid Alternate Address').optional().trim().escape().isLength({max:200}),
                body('agency.state', 'Invalid State').exists().trim().escape().isLength({min: 2, max:200}),
                body('agency.phone', 'Invalid Phone').exists().trim().escape().isLength({min:10, max: 10}).isInt(),

                //client validations

                body('agency.clients.*.client_id', 'Invalid Client Id').exists().isLength({max: 10}).isInt(),
                body('agency.clients.*.cname', 'Invalid Client Name').exists().trim().escape().isLength({min: 2, max: 100}),
                body('agency.clients.*.email', 'Invalid Email').exists().isEmail(),
                body('agency.clients.*.phone', 'Invalid Phone').exists().trim().escape().isLength({min:10, max: 10}).isInt(),
                body('agency.clients.*.total_bill', 'Invalid Bill').exists().trim().escape().isLength({max: 50}).isInt(),
            ]
        }

        case 'client': {
            return [ 

                //client validations
                body('agency.clients.*.client_id', 'Invalid Client Id').exists().isLength({max: 10}).isInt(),
                body('agency.clients.*.cname', 'Invalid Client Name').exists().trim().escape().isLength({min: 2, max: 100}),
                body('agency.clients.*.email', 'Invalid Email').exists().isEmail(),
                body('agency.clients.*.phone', 'Invalid Phone').exists().trim().escape().isLength({min:10, max: 10}).isInt(),
                body('agency.clients.*.total_bill', 'Invalid Bill').exists().trim().escape().isLength({max: 50}).isInt(),
            ]
        }
    }
}