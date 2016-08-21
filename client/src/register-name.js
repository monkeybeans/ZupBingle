'use strict';

import { doGet, doPost } from './requests';

class RegisterName {
  constructor() {
    if (!RegisterName.initialized) {
      this.checkSession();
      document.getElementById('register-submit').addEventListener('click', this.registerName.bind(this));
      //document.getElementById('register-submit').addEventListener('touch', this.registerName.bind(this));
      RegisterName.initialized = true;
    }
  }

  displayMessage(msg) {
    document.getElementById('register-message').innerHTML = msg;
  }

  registerName(e) {
    e.preventDefault();

    var name = document.getElementById('register-name').value;
    if (!name || !name.match(/^[A-Za-z0-9_ \-!?[\]()]{3,}$/)) {
      this.displayMessage('Think you hava a more describing name then that...');
    } else {
      document.getElementById('register-submit').setAttribute('disabled', 'true');
      doPost('/login', { name: name})
      .then(data => {
        document.location.reload(true);
      })
      .catch(data => {
        document.getElementById('register-submit').removeAttribute('disabled');
        this.displayMessage(data.error || 'Ooops...something is wrong...');
        console.log('Could not register:', data);
      });
    }
  }

  toggleRegistred(status) {
    var classList = document.getElementById('register').classList;
    (status ? classList.add('already-registered') : classList.remove('already-registered'));
  }

  checkSession() {
    doGet('/login', {})
    .catch(e => {
      this.toggleRegistred(false);
      console.log(e);
    });
  }

}

RegisterName.initialized = false;

export default RegisterName;
