document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = function() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    });
    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get all emails of specific mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    emails.forEach(email => {
      const element = document.createElement('div');
      const sender = document.createElement('strong');
      sender.className = 'sender';
      sender.innerHTML = `${email.sender}`;
      const subject = document.createElement('span');
      subject.className = 'subject';
      subject.innerHTML = `${email.subject}`;
      const time = document.createElement('span');
      time.className = 'time';
      time.innerHTML = `${email.timestamp}`;
      element.appendChild(sender);
      element.appendChild(subject);
      element.appendChild(time);
      element.className = 'mail-in-list';
      //element.innerHTML = `From: ${email.sender}    Subject: ${email.subject}     Recieved at: ${email.timestamp}`;
      if (email.read === true) {
        element.className = 'email-list-read';
      } else {
        element.className = 'email-list-unread';
      }
      element.setAttribute('id', `email_${email.id}`);
      element.addEventListener('click', function() {
        console.log('this been clicked yo')
      });
    document.querySelector('#emails-view').append(element);
    });

    
    console.log(emails);
  }); 
}