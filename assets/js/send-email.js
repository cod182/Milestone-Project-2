function sendEmail(contactForm) {
    emailjs.send('gmail','codie',{
        "from_name": contactForm.name.value,
        "from_email": contactForm.email.value,
        "reason": contactForm.reason.value,
        "message": contactForm.message.value
    })
    .then(
        function(response) {
            console.log('SUCSESS',response)
            document.getElementById('contact-submit').remove();
            document.getElementById('message-status').innerHTML =`<p class='blue bold'><em>Message Sent!</em></p>`;
        },
        function(error) {
            console.log('FAILED', error)
            document.getElementById('message-status').innerHTML =`<p class='red bold'>Error! Please try again.<p>`;

        });
    return false;
};