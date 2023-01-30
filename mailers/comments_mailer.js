const nodeMailer = require('../config/nodemailer');



// another way of exporting
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, "/comments/new_comment.ejs");
    console.log('inside newComment',comment);
    nodeMailer.transporter.sendMail({
        from: 'sachinvarma1458@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    },(err,info) => {
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log("Message sent",info);
        return;
    })
}